export default class LyricLogicObject {
    public textAliveAPI;
    public targetTime = 1000; // ms
    public targetTime2 = 500; // ms

    constructor(textAliveAPI) {
        this.textAliveAPI = textAliveAPI;
    }

    // 単語の色つけロジック
    public setLyricColor() {
        let nextChangeColorTime = 0; // 色切り替え時の最低限の待たないといけない時間
        let preCheckTime = 0; // 色切り替え時の発話スタートタイム
        let lyricColor = this.getRandomColor(0);
        for (let i = 0; i < this.textAliveAPI.lyrics.length; i++) {
            if (
                i < this.textAliveAPI.lyrics.length - 1 && // 最後の文字の次が取得できないため
                nextChangeColorTime < this.textAliveAPI.lyrics[i].startTime && // 色を変える際の最低限の間隔の担保
                this.textAliveAPI.lyrics[i + 1].startTime - preCheckTime >=
                    this.targetTime2 // 最低限の発話幅の担保
            ) {
                nextChangeColorTime =
                    this.textAliveAPI.lyrics[i].startTime + this.targetTime;
                preCheckTime = this.textAliveAPI.lyrics[i].startTime;
                lyricColor = this.getRandomColor(i);
            }
            this.textAliveAPI.lyrics[i].color = lyricColor;
        }
    }

    // 前回と同じ色にはならないようにランダムに色を返す
    private getRandomColor(index): string {
        let color;
        // 初手だけは完全ランダム
        if (index == 0) {
            let num = Math.floor(Math.random() * 3);
            switch (num) {
                case 0:
                    color = "#ff8e1e"; // 橙
                    break;
                case 1:
                    color = "#47ff47"; // 緑
                    break;
                case 2:
                    color = "#ffdc00"; // 黄
                    break;
                default:
                    color = "#ff8e1e"; // 青
                    break;
            }
            return color;
        }

        // 一つ前が橙
        if (this.textAliveAPI.lyrics[index - 1].color == "#ff8e1e") {
            let num = Math.floor(Math.random() * 2);
            switch (num) {
                case 0:
                    color = "#47ff47"; // 緑
                    break;
                case 1:
                    color = "#ffdc00"; // 黄
                    break;
                default:
                    color = "#ff8e1e"; // 青
                    break;
            }
            return color;
        }

        // 一つ前が緑
        if (this.textAliveAPI.lyrics[index - 1].color == "#47ff47") {
            let num = Math.floor(Math.random() * 2);
            switch (num) {
                case 0:
                    color = "#ff8e1e"; // 橙
                    break;
                case 1:
                    color = "#ffdc00"; // 黄
                    break;
                default:
                    color = "#ff8e1e"; // 青
                    break;
            }
            return color;
        }

        // 一つ前が緑
        if (this.textAliveAPI.lyrics[index - 1].color == "#ffdc00") {
            let num = Math.floor(Math.random() * 2);
            switch (num) {
                case 0:
                    color = "#ff8e1e"; // 橙
                    break;
                case 1:
                    color = "#47ff47"; // 緑
                    break;
                default:
                    color = "#ff8e1e"; // 青
                    break;
            }
            return color;
        }
    }
}
