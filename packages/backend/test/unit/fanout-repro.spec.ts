import { jest } from '@jest/globals';
import { FanoutTimelineEndpointService } from '../../src/core/FanoutTimelineEndpointService.js';
import { genAidx } from '../../src/misc/id/aidx.js';
import { FanoutTimelineService } from '../../src/core/FanoutTimelineService.js';
import { NotesRepository } from '../../src/models/_.js';
import { MiMeta } from '../../src/models/Meta.js';
import { NoteEntityService } from '../../src/core/entities/NoteEntityService.js';
import { CacheService } from '../../src/core/CacheService.js';
import { UtilityService } from '../../src/core/UtilityService.js';
import { ChannelMutingService } from '../../src/core/ChannelMutingService.js';
import { FanoutTimelineName } from '../../src/core/FanoutTimelineService.js';

describe('FanoutTimelineEndpointService', () => {
	let service: FanoutTimelineEndpointService;
	let mockFanoutTimelineService: jest.Mocked<FanoutTimelineService>;
	let mockNotesRepository: jest.Mocked<NotesRepository>;
	let mockNoteEntityService: jest.Mocked<NoteEntityService>;
	let mockCacheService: jest.Mocked<CacheService>;
	let mockUtilityService: jest.Mocked<UtilityService>;
	let mockChannelMutingService: jest.Mocked<ChannelMutingService>;
	let mockMeta: MiMeta;

	beforeEach(() => {
		mockFanoutTimelineService = {
			getMulti: jest.fn(),
		} as any;

		const mockQueryBuilder = {
			where: jest.fn().mockReturnThis(),
			innerJoinAndSelect: jest.fn().mockReturnThis(),
			leftJoinAndSelect: jest.fn().mockReturnThis(),
			getMany: jest.fn().mockResolvedValue([]),
		};

		mockNotesRepository = {
			createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
		} as any;

		mockNoteEntityService = {} as typeof mockNoteEntityService;
		mockCacheService = {} as typeof mockCacheService;
		mockUtilityService = {} as typeof mockUtilityService;
		mockChannelMutingService = {} as typeof mockChannelMutingService;
		mockMeta = {} as typeof mockMeta;

		service = new FanoutTimelineEndpointService(
			mockNotesRepository,
			mockMeta,
			mockNoteEntityService,
			mockCacheService,
			mockFanoutTimelineService,
			mockUtilityService,
			mockChannelMutingService,
		);
	});

	test('should use correctly calculated threshold (Max of Oldest) when merging disjoint timelines', async () => {
		const now = Date.now();
		// HTL: Recent (T-2m to T-4m)
		const htlIds = [
			genAidx(now - 1000 * 60 * 2),
			genAidx(now - 1000 * 60 * 3),
			genAidx(now - 1000 * 60 * 4),
		];

		// LTL: Old (T-60m to T-62m)
		const ltlIds = [
			genAidx(now - 1000 * 60 * 60),
			genAidx(now - 1000 * 60 * 61),
			genAidx(now - 1000 * 60 * 62),
		];

		mockFanoutTimelineService.getMulti.mockResolvedValue([htlIds, ltlIds]);

		const dbFallback = jest.fn().mockResolvedValue([]);

		// Mock repository filtering: strictly return nothing to force fallback logic
		(mockNotesRepository.createQueryBuilder() as any).getMany.mockResolvedValue([]);

		const ps = {
			redisTimelines: ['homeTimeline', 'localTimeline'] as FanoutTimelineName[],
			useDbFallback: true,
			limit: 10,
			allowPartial: false,
			excludePureRenotes: false,
			dbFallback,
			noteFilter: () => false, // Simulate strict filtering (e.g. onlyLocal removing HTL, and maybe LTL also filtered for this test to force empty)
		};

		// We simulate a case where Redis returns items, but they are all filtered out (or just disjoint).
		// If we filter out everything, `redisTimeline` will be empty.
		// It consumes all `redisResultIds`.
		// Then calls `dbFallback` with `untilId` = LAST examined ID.

		// With BROKEN logic (Min(Newest)):
		// Threshold = Newest(LTL) = ltlIds[0] (T-60m).
		// redisResultIds = [htlIds..., ltlIds...]. (All >= T-60m). Note: HTL are > T-60m.
		// Sorted: HTL (newer), LTL (older).
		// Last examined ID = ltlIds[last] (T-62m) ?
		// Wait, if Threshold is T-60m.
		// ltlIds[1] (T-61m) < T-60m. Is it?
		// genAidx(T-61m) < genAidx(T-60m). Yes.
		// So `filter(>= Threshold)` removes T-61m, T-62m.
		// It keeps ltlIds[0] (T-60m).
		// So redisResultIds has [HTL..., ltlIds[0]].
		// Last ID is ltlIds[0] (T-60m).
		// dbFallback called with untilId = T-60m.
		// GAP: T-4m to T-60m is MISSING from DB check (assuming DB had notes there).

		// With FIXED logic (Max(Oldest)):
		// Oldest(HTL)=T-4m. Oldest(LTL)=T-62m.
		// Max = T-4m.
		// Threshold = T-4m.
		// redisResultIds keeps IDs >= T-4m.
		// HTL kept. LTL (all < T-4m) dropped (T-60m < T-4m).
		// redisResultIds = [HTL...].
		// Last ID = htlIds[last] (T-4m).
		// dbFallback called with untilId = T-4m.
		// NO GAP. DB checks < T-4m, finding T-60m etc.

		await service.getMiNotes(ps);

		expect(dbFallback).toHaveBeenCalled();
		const callArgs = dbFallback.mock.calls[0];
		const untilId = callArgs[0] as string;

		// We expect untilId to be the HTL oldest (T-4m), NOT the LTL newest (T-60m).
		// htlIds[2] is T-4m.
		expect(untilId).toBe(htlIds[2]);
		expect(untilId > ltlIds[0]).toBe(true);
	});
});
