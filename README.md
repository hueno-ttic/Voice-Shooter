# 『Voice Shooter』
## Voice Shooterについて
### 概要
Voice Shooterはレーンの色と歌詞の色が一致するようにステージ上のミクやルカを移動させて観客に歌詞を届けてスコアを伸ばしていくゲームです。

### 遊び方の流れ
1. アプリ起動後に注意事項が出ますので確認する
1. タイトル画面から楽曲選択画面に進み、遊びたい曲を選択する
1. チュートリアル画面の中身を確認し、画面をタップする
1. 楽曲が流れるので、下部に流れる歌詞の色を確認し、発話直前の歌詞と同じ色のレーンをタップするとキャラクターが移動する
    1. 移動したいレーン（ステージ上も含む）にマウスではクリック、スマホではタッチ、キーボードで操作する際には「w」キーで上に、「s」キーで下に移動する 
1. キャラクターが発話した歌詞の色とレーンの色が同じになるとExcellentになりより多くの点数がもらえる
1. Excellentが全体の60%を超えるとゲームクリアになる

![チュートリアル](voice-shooter/src/assets/TutorialDescription.png)

### 説明動画
todo 用意してYoutubeに上げたものを参照する

### アプリの特徴
- TextAliveAppAPIから取得した楽曲データを使用
  - 歌詞情報を取得して単語ごとに発話を表現
  - サビ情報を取得してライブアーティストの表情変化を実現
- ゲームエンジンであるPhaserを使用
- マルチデバイス(PC,スマートフォン)対応
- 歌詞の発話タイミングなどに合わせて盛り上がる観客の表示
- 楽曲に合わせたビジュアライザーを表示
- 採用作品6曲に対応（対応楽曲は以下で表記）

### 対応楽曲
- First Note
- 嘘も本当も君だから
- その心に灯る色は
- 夏をなぞって
- 密かなる交信曲
- Freedom!

### 対応環境
- Chrome 95以降

### 注意事項
こちらのアプリで遊ぶ際には以下の点に注意してください。
- スマートフォンで遊ぶ場合は本体を横向きにする
- iOS環境のSafariで遊ぶ際には「設定」→「Safari」→「タブバーを表示」をオフにする
- スマートフォンのブラウザではURLバーが出てしまう場合は、画面をタッチしながら少し上に移動させることで調整する
- 動作が不安定になった際にはページの再読み込みをする

## 開発者向けドキュメント
以下のコマンドをpacakge.jsonのある階層で実行する
### パッケージのインストール
> npm install

### 開発環境の起動
> npm run dev
### 開発環境の起動( visualizerのキャッシュ更新をスキップする )
> npm run dev:nocache
### 本番リリースビルド
> npm run build

### デバッグ
config.jsonのなかのdebug_modeをtrueにすることでTextAliveAPIで取得できている情報を可視化することが可能になる
```
{
    "degug_mode": true,
    "textalive_token": "token_string"
}
```

### コミット前にやること
voice-shooterディレクトリで `npm run lint:write` を実行してください。
差分があればコミットしてください。

### PRマージ前にやること
Github Actionsでlintが成功していることを確認してください。


## 使用パッケージのライセンス
- @types/node</br>
Copyrights are respective of each contributor listed at the beginning of each definition file.</br>
https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/LICENSE</br>

- axios</br>
Copyright (c) 2014-present Matt Zabriskie</br>
https://github.com/axios/axios/blob/HEAD/LICENSE</br>

- phaser</br>
Copyright © 2021 Richard Davey, Photon Storm Ltd.</br>
https://phaser.io/download/license</br>

- textalive-app-api</br>
https://github.com/TextAliveJp/textalive-app-api/blob/master/LICENSE.md</br>

- ts-node</br>
Copyright (c) 2014 Blake Embrey (hello@blakeembrey.com)</br>
https://github.com/TypeStrong/ts-node/blob/main/LICENSE</br>

- del-cli</br>
Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)</br>
https://github.com/sindresorhus/del-cli/blob/main/license</br>

- husky</br>
Copyright (c) 2021 typicode</br>
https://github.com/typicode/husky/blob/main/LICENSE</br>

- lint-staged</br>
Copyright (c) 2016 Andrey Okonetchnikov</br>
https://github.com/okonet/lint-staged/blob/master/LICENSE</br>

- parcel-buncler</br>
Copyright (c) 2017-present Devon Govett</br>
https://github.com/parcel-bundler/parcel/blob/v2/LICENSE</br>


- prettier</br>
Copyright © James Long and contributors</br>
https://github.com/prettier/prettier/blob/main/LICENSE</br>

- typescript</br>
本アプリではApach License 2.0 のライセンスで配布されているパッケージがインストールされます</br>
Apache License 2.0 http://www.apache.org/licenses/LICENSE-2.0</br>
https://github.com/microsoft/TypeScript/blob/main/LICENSE.txt</br>


## 開発メンバー
- sakuramodki
- すぱりだ
- ななしお
- HiroyukiIsoe
- ya2ha4
- りおんぬ

    (五十音順敬称略)
