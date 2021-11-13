import Lyric from "./Lyric";
import CharText from "./CharText";
import config from "./config.json";

import {
    Ease,
    Player,
    IVideo,
    NullGraphicsDriver,
    PlayerEventListener,
    PlayerVideoOptions,
} from "textalive-app-api";

export default class TextaliveApiManager {
    private musicUrl: string;
    private options: PlayerVideoOptions;

    player: Player;
    playerEventListener: PlayerEventListener;

    private lyrics: Lyric[] = [];
    private charText: CharText[] = [];

    private positionTime: number = 0;

    videoEnd: boolean = false;

    private isChorus: boolean = false;

    private excludeLyricList = [];

    constructor(url: string, options?: PlayerVideoOptions) {
        this.musicUrl = url;
        this.options = options ? options : null;
    }

    public bpm = 0;

    init(): void {
        this.player = new Player({
            app: {
                appAuthor: "TTIC",
                appName: "VoiceShooter",
                token: config.textalive_token,
            },
            mediaElement: document.querySelector<HTMLElement>("#media"),
            valenceArousalEnabled: true, // 覚醒度と感情価の取得
            vocalAmplitudeEnabled: true, // 声量情報の取得
        });
        document.querySelector<HTMLElement>("#media").hidden = true;

        // バッググラウンドで実行する機能をListenerに登録
        this.player.addListener({
            onAppReady: (app) => this.onAppReady(app),
            onTimerReady: () => this.onTimerReady(),
            onTimeUpdate: (pos) => this.onTimeUpdate(pos),
            onVideoReady: (v) => this.onVideoReady(v),
            onThrottledTimeUpdate: (pos) => this.onThrottledTimeUpdate(pos),
        });
        this.excludeLyricList = [
            " ",
            "　",
            "?",
            "!",
            "？",
            "！",
            ")",
            "(",
            "）",
            "（",
            "」",
            "「",
        ];
    }

    // APIへのアクセス準備
    private onAppReady(app): void {
        if (!app.songUrl) {
            // 再生対象となる楽曲URLをセット
            this.player.createFromSongUrl(this.musicUrl, this.options);
        }
    }

    // 動画の再生位置が変更されたときに呼ばれる
    onThrottledTimeUpdate(position) {
        this.positionTime = position;
    }

    // APIアクセス時に最初に呼ばれて動画情報をすべてとってきて設定する
    onVideoReady(v): void {
        let lyricIndex = 0;
        // 歌詞のセットアップ
        // 歌詞一文字ごと
        if (v.firstChar) {
            let c = v.firstChar;
            while (c) {
                this.charText.push(new CharText(c, lyricIndex));
                c = c.next;
                lyricIndex++;
            }
        }
        let bpmCalc = 0;
        // 歌詞の区切りごと
        let w = this.player.video.firstWord;
        let wordIndex = 0;
        while (w) {
            // 歌詞の除外条件
            if (this.excludeLyricList.includes(w.text)) {
                w = w.next;
                continue;
            }

            // 歌詞ごとの覚醒度と感情価を設定
            const valenceArousal = this.player.getValenceArousal(w.startTime);
            // 歌詞に紐づくビートを取得
            const beat = this.player.findBeat(w.startTime);
            if (beat !== null) {
                bpmCalc += beat.duration;
            }

            // 単語情報を格納
            this.lyrics.push(new Lyric(w, wordIndex, valenceArousal, beat));
            // 次の単語へ
            w = w.next;
            wordIndex++;
        }
        let avgBeatDuration = bpmCalc / this.lyrics.length;
        this.bpm = 60000 / avgBeatDuration;
    }

    // APIアクセス後に動画情報設定
    onTimerReady(): void {
        // pass
    }

    // 再生中に呼び出され続けて画面の状態をupdateする
    onTimeUpdate(position): void {
        // 現在再生されている時のBeat情報を取得
        const beat = this.player.findBeat(position);
        if (!beat) {
            return;
        }

        // サビかどうかを取得(サビならtrue)
        this.isChorus = this.player.findChorus(position) != null;
    }

    getLyrics() {
        return this.lyrics;
    }

    getCurrentLyric(positoinTime: number): Lyric {
        for (let i = 0; i < this.lyrics.length; i++) {
            if (
                positoinTime > this.lyrics[i].startTime &&
                positoinTime < this.lyrics[i].endTime
            ) {
                return this.lyrics[i];
            }
        }

        // 見つからない場合は空文字
        return null;
    }

    getCurrentLyricText(positoinTime: number): string {
        for (let i = 0; i < this.lyrics.length; i++) {
            if (
                positoinTime > this.lyrics[i].startTime &&
                positoinTime < this.lyrics[i].endTime
            ) {
                // 画面表示用設定
                const currentText = this.lyrics[i].text;
                return currentText;
            }
        }

        // 見つからない場合は空文字
        return "";
    }

    getCurrentLyricIndex(positoinTime: number): number {
        for (let i = 0; i < this.lyrics.length; i++) {
            if (
                positoinTime > this.lyrics[i].startTime &&
                positoinTime < this.lyrics[i].endTime
            ) {
                // 画面表示用設定
                const currentIndex = this.lyrics[i].index;
                return currentIndex;
            }
        }

        // 見つからない場合は空文字
        return null;
    }

    getPositionTime(): number {
        return this.positionTime;
    }

    getLyricsLength(): number {
        return this.lyrics.length;
    }

    /**
     * 楽曲ががしていたポジションならTrueを返す
     */
    getIsChorus(): boolean {
        return this.isChorus;
    }
}
