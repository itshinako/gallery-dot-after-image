# GAS予約APIとGoogle Sheetsの設定

予約確定データはGoogle Sheetsの `reservations` シートに保存されます。予約枠の確認、重複予約防止、キャンセル、チェックインにもこのシートを使用します。

1. 予約管理用のGoogleスプレッドシートを作成します。URLの `/d/` と `/edit` の間にある文字列がスプレッドシートIDです。
2. スプレッドシートから「拡張機能 > Apps Script」を開き、`Code.gs` と `appsscript.json` を反映します（マニフェスト表示を有効にしてください）。
3. Apps Scriptの「プロジェクトの設定 > スクリプト プロパティ」に設定します。
	- `SHEET_ID`: 手順1のスプレッドシートID
	- `RESERVATION_OPEN`: 最初は `false`。受付開始時に `true`
	- `SLOT_CAPACITY`: 1枠あたりの人数上限
	- `MAX_COMPANIONS`: `2`（予約者を含めて最大3名）
	- `LAST_SLOT`: 最終受付の開始時刻（例: `18:30`）
	- `ADMIN_KEY`: 推測困難な管理キー
	- `CLOSED_DATES`: 任意。休廊日を `YYYY-MM-DD` でカンマ区切り
4. Apps Scriptで `setup` を1回実行し、求められる権限を承認します。指定したスプレッドシートに `reservations` シートと項目行が作成されます。
5. 「デプロイ > 新しいデプロイ > ウェブアプリ」で、実行ユーザーを自分、アクセスできるユーザーを全員にしてデプロイします。表示されたURLを `config.js` の `GAS_WEB_APP_URL` に設定します。
6. `config.js` の `LINE_URL` も設定します。予約完了画面でLINE公式アカウントへの友だち追加を案内します。
7. テスト用スプレッドシートとテストデプロイで予約・メール・キャンセルを確認してから、本番の `RESERVATION_OPEN` を `true` にします。

予約シートには氏名、メールアドレス、電話番号、来場日時、同意状態、チェックイン状態などが記録されます。シートの共有先を必要な運営担当者だけに制限し、個人情報の取り扱い方針に沿って保管・削除してください。

チェックインは `POST {action:"checkin", token, admin_key}`、マグ引換は `POST {action:"redeem", token, admin_key}`（QRの中身は `token`）です。`ADMIN_KEY` は公開JSに置かないでください。

注意: QR画像のメール添付では `api.qrserver.com` にtokenのみを送信します（個人情報は含みません）。利用しない場合は `mail_` を変更してください。
