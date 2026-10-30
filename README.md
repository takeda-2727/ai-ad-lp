# AI COMMERCIAL+ LP

AIを使って広告動画を制作する新規事業のトップページ。売りは従来の広告制作より安いことと、公開までが速いこと。今はデザインの原型で、ビルドなしの素の HTML で書いている。

## 構成

項目ごとにページを分けている。デザインは 京進デジタルアカデミー（https://digital-academy.kyoshin.co.jp/）・rosso（https://rosso-tokyo.co.jp/）・cominvi（https://www.cominvi.com.mx/）を参考にした、暗い画面に映像を映えさせるシネマティックな構成。ヘッダーは中央のカプセル型バーで、メニューは全画面に開く。

- `index.html` … トップ（動画のヒーロー・私たちについて・数字・サービス・従来との比較・制作例・料金・YouTube・FAQ）。初回だけオープニングが出る
- `about.html` … 私たちについて（チームの紹介・YouTube・概要）
- `flow.html` … しくみ
- `service.html` … サービス
- `strengths.html` … 強み（安くて速い理由）
- `price.html` … 料金
- `faq.html` … よくある質問
- `assets/site.css` / `assets/site.js` … 全ページ共通のスタイルと動き
- `assets/hero-3.mp4` … ヒーローの1本目の動画。ヒーローの背景で自動再生される
- `assets/hero.mp4` … ヒーローの2本目の動画（任意）。置くと hero-3.mp4 → hero.mp4 → hero-3.mp4… と交互に流れる。無ければ hero-3.mp4 をくり返す。Works の REEL 01 でも使う
- `assets/hero-2.mp4` … About・Works（REEL 02）・YouTube枠・サービス「04」のプレビューで使う動画
- `assets/service-video.mp4` / `service-banner.mp4` / `service-plan.mp4` … サービスの行にマウスを乗せたときのプレビュー、ヒーロー右下のカード、制作例（Works）で使う動画
- `assets/service-ad.mp4` … サービス「01 動画広告」の行にマウスを乗せたときのプレビュー動画（30秒のCM）

ヘッダー・メニュー・お問い合わせ欄・フッターは各ページに同じものを書いている。どれかを変えるときは全ページそろえる。

## 見かた

`index.html` をブラウザで開けばそのまま見られる。

## まだ埋めていないところ

ページ内の `[ ]` で囲んだ部分はプレースホルダー。決まったら差し替える。

- [運営者名] / [年]
- デモの [店舗名] と [コピー案A〜C]
- FAQの回答（AIツールの商用利用規約、写真・ロゴの扱い、再生成の条件）
- お問い合わせ・LINEボタンのリンク先
- YouTube の [チャンネル名]・チャンネルの URL（いまは `href="#"`）・[チャンネルで発信している内容]
- 私たちについての [チームの写真]

## メモ

- アクセントカラーはライム `#C6F432`。背景の黒は `#06070A`。どちらも `assets/site.css` の先頭の色の変数で変える。
- アニメーションは `assets/site.css` と `assets/site.js` にまとまっている。端末で「視差効果を減らす」を設定している人には動きを出さない。
