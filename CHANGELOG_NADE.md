オリジナルのMisskeyの変更履歴は[CHANGELOG](CHANGELOG.md)をご覧ください。

<!--
## Unlereased
### General

### Client

### Server
-->
## nade 1.8.5
### General
- Fix: 2025.6.0追従の際にメインタイムラインでローカルのみが使えなくなっていた問題の修正

## nade 1.8.4
### Client
- Fix: 2025.5.0追従の際にListenbrainzウィジェットの表示が乱れていた問題の修正

## nade 1.8.3
### Client
- Fix: 2025.4.1追従の際にTLでローカルのみが効かなくなる不具合の修正

## nade 1.8.2
### Client
- Fix: セミパブリック投稿を削除して編集した際に公開範囲が引き継がれない問題

## nade 1.8.1
### Client 
- Enhance: listenbrainzウィジェットをMFM表示に対応

### Server
- Fix: GTLにてTL条件が壊れている問題の修正
- Fix: ノート通知が重複することがある問題の修正
- Fix: セミパブリック投稿がノート通知の対象でない問題の修正

## nade 1.8.0
### Client
- Feature: listenbrainzウィジェットの追加

### Server
- 1.7.2の暫定対応をRevert
- cw_and_textのきちんとした対応を先行導入
	- Enhance: pgroongaを用いた検索でcwと本文を合わせて, またAND検索、OR検索が可能になります
	
#### Note
- 新しい設定項目"pgroonga.target"が追加されました.
	- すでにnoteのtextのみのindexを貼っていてそのまま利用したい場合、設定は不要です.
	- cwとtextのマルチカラムに対応する場合、**"pgroonga.target"を"cw_and_text"**に設定する必要があります.
  - index	に関する詳細は #14730 を、configに関しては`.config/example.yml` または `.config/docker_example.yml`の'pgroonga'の節を参照願います

## nade 1.7.2
### Server
- cw_textのマルチ検索のため、暫定的に一部の変更を削除

## nade 1.7.1
### Server
- セミパブリック投稿で投票を作れない問題の修正
- pgroongaでand/or検索とcw_textのマルチ検索に対応
  (https://github.com/misskey-dev/misskey/pull/15315)

## nade 1.7.0
- misskey 2024.11.1-alpha.0 (2025/01/06 08:35 JST時点でのdevelop、79b851fe562c3e6be601b5b25a744d86798d4747)に追従
- https://github.com/misskey-dev/misskey/pull/15233

## nade 1.6.7
### Server
- リアクションミュートにおけるクエリを一部修正 (thanks of @lqvp)

## nade 1.6.6
### i18n
- (ja-KS) 一部表現を変更

## nade 1.6.5
### General
- パブリックおよびセミパブリックノートに対するリプライの投稿範囲がおかしいのを修正

## nade 1.6.4
### General
- 軽微なバグの修正
  - （純粋な）リノートのヘッダーにセミパブリックが表示されない問題の解消

## nade 1.6.3
### General
- 公開範囲: パブリック（非LTL） をセミパブリックに改称
- Stream経由でLTLに掲載されてしまうバグの修正
- ホバー時のツールチップで「パブリック」と表示されてしまう現象の修正

## nade 1.6.2
### General
- 公開範囲: パブリック（非LTL） をセミパブリックに改称
- サードパーティクライアントとの互換性改善

## nade 1.6.1
### Client
- enhance: パブリック（非LTL）投稿のヘッダー/詳細に不足してる部分を追加

## nade 1.6.0
### General
- 公開範囲: パブリック（非LTL）の追加
### Client
- ワードミュートで引っかかったワードを表示可能にする機能
- リアクションした人一覧でブロック・ミュートを考慮するように

## nade 1.5.7
### Server
- https://github.com/misskey-dev/misskey/pull/13495 の変更を取り込み
### Development
- E2Eテストが落ちる問題を一時的に回避（ Cherry-picked from https://github.com/niri-la/misskey.niri.la/pull/217/commits/92a55ade4300aecc2a4d49e8f82f75893b0534c6 ）

## nade 1.5.6
### Client
- Fix: マージミスによる存在しない変数が呼ばれる問題を修正
- 2024.7.0マージに伴うコーディングスタイルの調整

## nade 1.5.5
### Server
- Fix: DBフォールバックが大量に遡ると取得漏れを起こしてしまう問題を修正した際、sinceIdによる取得を壊してしまったので修正

## nade 1.5.4
そんなものはなかった

## nade 1.5.3
### Client
- Fix: ローカルのみをデッキから選択した時に反映されない問題の修正

## nade 1.5.2
### Server
- Fix: そもそもDBフォールバックが大量に遡ると取得漏れを起こしてしまう問題を修正

## nade 1.5.1
### Server
- Fix: ローカルのみに絞り込んだ際、DBにフォールバックすると正しい結果とならないのを修正

## nade 1.5.0
### General
- ローカルタイムラインにローカルのフォロー中ユーザーの投稿範囲がホーム以下のノートも表示するオプションを廃止
- ホーム、ソーシャルtlにてローカルのみに絞り込める機能を追加

## nade 1.4.7
### General
- 2024.2.0の適用に伴いフォークに関するコードも微修正しました
- [メンションの最大数をロールごとに設定可能にする misskey-dev/misskey#13343](https://github.com/misskey-dev/misskey/pull/13343) を導入

### Client
### Server

## nade 1.4.7
### General
- 2023.12.2の適用に伴いフォークに関するコードも微修正しました

### Client
### Server

## nade 1.4.6
### General

### Client
- CWを開閉するボタンのサイズを小さくしました
  - CWは閲覧注意を意味し、コンテンツを見えなくするもので画面の占有率を下げるため。
### Server
- fix: localHomeTimeline（ローカルのフォロー中ユーザーの投稿範囲がホーム以下のノートも表示するオプション、以降ローカルホームと呼称します）にて自分の投稿が反映されない問題を修正

## nade 1.4.4 & 1.4.5
2023/10/25日時点でMisskey 2023.11.0-betaに含まれるTL系の修正、並びにアバターデコレーションをチェリーピックしました

## nade 1.4.3
### Server
- リストTLもDBへのフォールバックに対応させました

## nade 1.4.2
### Server
- DBフォールバックの方法を本家Misskeyに揃えました

## nade 1.4.0 & 1.4.1
### Server
- タイムラインがRedisにキャッシュされていない際にDBから取得します。

## nade 1.3.5 & nade 1.3.6
### NOTE
nade 1.3.5 is not working
### General
- Misskey 2023.9.1対応のための軽微な修正

## nade 1.3.3 & nade 1.3.4
### General
- Misskey 2023.9.0対応のための軽微な修正

## nade 1.3.1 & nade 1.3.2
### General
- 新着ノート通知機能
  - 取り込みが不足していたので色々追加

## nade 1.3.1
### General
- 新着ノート通知機能
	- 設定→通知にある「ノート通知」から、自分が新着ノート通知を有効にしているユーザー一覧を見ることができます。

-> 導入し忘れていたので導入
## nade 1.3.0
### General
[隠れ家様の実装を一部輸入させて頂きました(ちゃんとcherry-pick)](https://github.com/hideki0403/misskey.yukineko.me)
- feat: ファイル名をランダム化できるように
  - 設定の「ドライブ」または「プライバシー」からONにできます。
  - ONにすると、ファイルのアップロード時にファイル名がランダムな文字列になります。
- 新着ノート通知機能
  - ユーザーがノートを投稿した際に通知を受け取れる機能
	- ユーザーのプロフィールページのメニュー（･･･）にある「ノート通知を有効にする」から有効にできます。


## nade 1.2.4
### General
### Client

### Server
- Fix: ローカルタイムラインにローカルのフォロー中ユーザーの投稿範囲がホーム以下のノートも表示するオプションを有効にした際にページネーションが働かない

### General

### Client
### Server

## nade 1.2.4
### General
### Client

### Server
- Fix: ローカルタイムラインにローカルのフォロー中ユーザーの投稿範囲がホーム以下のノートも表示するオプションを有効にした際にページネーションが働かない
## nade 1.2.2
### General
- ローカルタイムラインにローカルのフォロー中ユーザーの投稿範囲がホーム以下のノートも表示するオプションを追加
### Client

### Server
- Fix: ローカルタイムラインにローカルのフォロー中ユーザーの投稿範囲がホーム以下のノートも表示するオプションを有効にした際にローカルでないユーザーも表示されてしまう （再Fix）

## nade 1.2.1
### General
- ローカルタイムラインにローカルのフォロー中ユーザーの投稿範囲がホーム以下のノートも表示するオプションを追加
### Client

### Server
- Fix: ローカルタイムラインにローカルのフォロー中ユーザーの投稿範囲がホーム以下のノートも表示するオプションを有効にした際にローカルでないユーザーも表示されてしまう

## nade 1.2.0
### General
- ローカルタイムラインにローカルのフォロー中ユーザーの投稿範囲がホーム以下のノートも表示するオプションを追加
### Client

### Server

## nade 1.1.1
### General
- Dockerイメージにてjemallocを利用するように変更
- バージョン表記をmisskey-nade1.1.1のようにハイフン形式を使うように変更

## nade 1.1.0
### General

### Client
- Enhance: ノート検索にローカルのみ検索可能なオプションの追加

### Server
- Fix: ノート検索 `notes/search` にてhostを指定した際に検索結果に反映されるように

## nade 1.0.0
- Just fork
