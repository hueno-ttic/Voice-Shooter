export default class Lyric {
    index;

    // 歌詞情報
    text;
    startTime;
    endTime;
    duration;
    valence;
    arousal;
    color;
    beat;

    constructor(data, index, valenceArousal, beat) {
        this.text = data.text; // 歌詞文字
        this.startTime = data.startTime; // 開始タイム [ms]
        this.endTime = data.endTime; // 終了タイム [ms]
        this.duration = data.duration; // 開始から終了迄の時間 [ms]
        this.index = index;
        this.valence = valenceArousal.v; // 覚醒度
        this.arousal = valenceArousal.a; // 感情価
        this.beat = beat; // ビート
    }

    setIndex(index) {
        this.index = index;
    }

    getIndex() {
        return this.index;
    }

    getText(): string {
        return this.text;
    }
}
