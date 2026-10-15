# GAS 予約API デプロイ
1. 予約用スプレッドシートを作成 → 拡張機能 > Apps Script に `Code.gs` と `appsscript.json` を貼り付け（マニフェスト表示を有効化）。
2. 「プロジェクトの設定 > スクリプト プロパティ」に設定：`RESERVATION_OPEN=true` / `SLOT_CAPACITY`（枠定員・人数ベース）/ `MAX_COMPANIONS` / `LAST_SLOT`（例 18:30）/ `ADMIN_KEY`（推測困難な文字列）。任意：`SHEET_ID`, `CLOSED_DATES`。
3. `setup` を1回実行して権限を承認（シート `reservations` が作成されます）。
4. デプロイ > 新しいデプロイ > ウェブアプリ（実行：自分／アクセス：全員）→ URLを `../config.js` の `GAS_WEB_APP_URL` へ。
5. チェックイン：`POST {action:"checkin", token, admin_key}`、マグ引換：`{action:"redeem", token, admin_key}`（QRの中身＝token）。`admin_key` は公開JSに置かないこと。
注意: QR画像のメール添付は api.qrserver.com にtokenのみ送信します（個人情報なし）。不可なら `mail_` を変更してください。
