/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { describe, jest, test, expect, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { GlobalModule } from '@/GlobalModule.js';
import { CoreModule } from '@/core/CoreModule.js';
import { FanoutTimelineEndpointService } from '@/core/FanoutTimelineEndpointService.js';
import { FanoutTimelineService, FanoutTimelineName } from '@/core/FanoutTimelineService.js';
import { IdService } from '@/core/IdService.js';
import { NotesRepository, UsersRepository, UserProfilesRepository, MiUser, MiNote } from '@/models/_.js';
import { DI } from '@/di-symbols.js';

describe('FanoutTimelineEndpointService', () => {
	let app: TestingModule;
	let service: FanoutTimelineEndpointService;
	let fanoutTimelineService: jest.Mocked<FanoutTimelineService>;
	let notesRepository: NotesRepository;
	let usersRepository: UsersRepository;
	let userProfilesRepository: UserProfilesRepository;
	let idService: IdService;

	let alice: MiUser;

	async function createUser(data: Partial<MiUser> = {}) {
		const user = await usersRepository
			.insert({
				id: idService.gen(),
				username: 'username',
				usernameLower: 'username',
				...data,
			})
			.then(x => usersRepository.findOneByOrFail(x.identifiers[0]));

		await userProfilesRepository.insert({
			userId: user.id,
		});

		return user;
	}

	async function createNote(data: Partial<MiNote> = {}) {
		return await notesRepository
			.insert({
				id: idService.gen(),
				userId: alice.id,
				text: 'test',
				visibility: 'public',
				localOnly: false,
				...data,
			})
			.then(x => notesRepository.findOneByOrFail(x.identifiers[0]));
	}

	beforeAll(async () => {
		app = await Test.createTestingModule({
			imports: [
				GlobalModule,
				CoreModule,
			],
			providers: [
				FanoutTimelineEndpointService,
			],
		})
			.overrideProvider(FanoutTimelineService)
			.useValue({
				getMulti: jest.fn(),
			})
			.compile();

		app.enableShutdownHooks();

		service = app.get<FanoutTimelineEndpointService>(FanoutTimelineEndpointService);
		fanoutTimelineService = app.get(FanoutTimelineService) as jest.Mocked<FanoutTimelineService>;
		notesRepository = app.get<NotesRepository>(DI.notesRepository);
		usersRepository = app.get<UsersRepository>(DI.usersRepository);
		userProfilesRepository = app.get<UserProfilesRepository>(DI.userProfilesRepository);
		idService = app.get<IdService>(IdService);
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(async () => {
		alice = await createUser({ username: 'alice', usernameLower: 'alice' });
	});

	afterEach(async () => {
		jest.clearAllMocks();
		await notesRepository.deleteAll();
		await userProfilesRepository.deleteAll();
		await usersRepository.deleteAll();
	});

	test('should use correctly calculated threshold (Max of Oldest) when merging disjoint timelines', async () => {
		const now = Date.now();
		// HTL: Recent (T-2m to T-4m)
		const htlNote1 = await createNote({ id: idService.gen(now - 1000 * 60 * 2) });
		const htlNote2 = await createNote({ id: idService.gen(now - 1000 * 60 * 3) });
		const htlNote3 = await createNote({ id: idService.gen(now - 1000 * 60 * 4) }); // End of HTL (T-4m)

		const htlIds = [htlNote1.id, htlNote2.id, htlNote3.id];

		// LTL: Old (T-60m to T-62m)
		const ltlNote1 = await createNote({ id: idService.gen(now - 1000 * 60 * 60) });
		const ltlNote2 = await createNote({ id: idService.gen(now - 1000 * 60 * 61) });
		const ltlNote3 = await createNote({ id: idService.gen(now - 1000 * 60 * 62) });

		const ltlIds = [ltlNote1.id, ltlNote2.id, ltlNote3.id];

		// Mock FanoutTimelineService to return these IDs
		fanoutTimelineService.getMulti.mockResolvedValue([htlIds, ltlIds]);

		// dbFallback spy
		const dbFallback = jest.fn(() => Promise.resolve([]));

		const ps = {
			redisTimelines: ['homeTimeline', 'localTimeline'] as FanoutTimelineName[],
			useDbFallback: true,
			limit: 10,
			allowPartial: false,
			excludePureRenotes: false,
			dbFallback,
			noteFilter: () => false, // Simulate strict filtering (force fallback)
			untilId: null,
			sinceId: null,
		};

		// See comments in original file for logic explanation.
		// Essentially, we expect the fallback to start from the end of the most recent reliable timeline (HTL).

		await service.getMiNotes(ps);

		expect(dbFallback).toHaveBeenCalled();
		const callArgs = dbFallback.mock.calls[0];
		const untilId = callArgs[0] as string;

		// We expect untilId to be the HTL oldest (htlNote3.id), NOT the LTL newest (ltlNote1.id).
		expect(untilId).toBe(htlNote3.id);
		expect(untilId > ltlNote1.id).toBe(true);
	});
});
