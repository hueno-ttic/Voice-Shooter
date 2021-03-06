import Phaser from "phaser";
import TextaliveApiManager from "../TextaliveApiManager";
import DepthDefine from "./DepthDefine";

export interface DebugInfoCreateParam {
    scene: Phaser.Scene;
    textaliveAppApi?: TextaliveApiManager;
}

export default class DebugInfo {
    private _scene: Phaser.Scene;
    private _dispText: Phaser.GameObjects.Text;
    private _textaliveAppApi: TextaliveApiManager;
    private _isVisible: boolean;

    constructor() {
        this.init();
    }

    public init(): void {
        this._scene = null;
        this._dispText = null;
        this._textaliveAppApi = null;
        this._isVisible = false;
    }

    public create(param: DebugInfoCreateParam): void {
        this._scene = param.scene;

        this._dispText = this._scene.add.text(0, 0, "", { font: "20px" });
        this._dispText.setColor("white").setStroke("#000000", 6);
        this._dispText.setDepth(DepthDefine.SYSTEM + 1);

        this.setVisible(this._isVisible);

        if (param.textaliveAppApi) {
            this._textaliveAppApi = param.textaliveAppApi;
        }
    }

    public update(): void {
        if (!this._isVisible) {
            return;
        }

        let dispInfoList = [];
        dispInfoList.push(
            `fps: ${this.getFormatted(this._scene.game.loop.actualFps, 5)}`
        );

        if (this.isAvailableTextaliveAppApi()) {
            const songInfo = this.makeSongInfo(
                this._textaliveAppApi.getPositionTime()
            );
            for (let i = 0; i < songInfo.length; i++) {
                dispInfoList.push(songInfo[i]);
            }
        }

        this._dispText.setText(dispInfoList);
    }

    private makeSongInfo(position: number): string[] {
        if (!this.isAvailableTextaliveAppApi()) {
            return [];
        }

        let songInfoList: string[] = [];

        const player = this._textaliveAppApi.player;
        const video = player.video;

        try {
            const beat = player.findBeat(position);
            songInfoList.push(
                `???????????????[ms]: ${beat ? beat.duration : "----"}`
            );
            songInfoList.push(`????????????: ${beat ? beat.length : "----"}`);
            songInfoList.push(
                `1??????[ms]: ${beat ? beat.duration * beat.length : "----"}`
            );
            songInfoList.push(
                `BPM: ${
                    beat ? ((60 * 1000) / beat.duration).toFixed(2) : "----"
                }`
            );

            songInfoList.push(
                `??????: ${player.findChorus(position) ? "True" : "False"}`
            );

            const chord = player.findChord(position);
            songInfoList.push(`???????????? ${chord ? chord.name : "----"}`);

            const word = video.findWord(position);
            songInfoList.push(
                `??????(time): ${this.getFormatted(
                    player.getVocalAmplitude(position)
                )}`
            );
            let wordAmplitude = 0;
            if (word) {
                wordAmplitude =
                    (player.getVocalAmplitude(word.startTime) +
                        player.getVocalAmplitude(word.endTime) +
                        player.getVocalAmplitude(
                            (word.startTime + word.endTime) / 2
                        )) /
                    3;
            }
            songInfoList.push(
                `??????(word): ${this.getFormatted(wordAmplitude)}`
            );

            // Uncaught TypeError: Cannot read properties of undefined ????????????????????????
            if (position < video.lastChar.endTime) {
                const va = player.getValenceArousal(position);
                songInfoList.push(
                    `V/A(time): ????????? ${this.getFormatted(
                        va.v,
                        4
                    )}, ????????? ${this.getFormatted(va.a, 4)}`
                );
            }
        } catch (error) {
            // pass ?????????????????????????????????
        }

        return songInfoList;
    }

    private getFormatted(val: number, len?: number, fix?: number): string {
        if (!len) {
            len = 8;
        }
        if (!fix) {
            fix = 2;
        }
        return val.toFixed(fix).padStart(len, " ");
    }

    public dispConsoleSongInfo(): void {
        if (!this._isVisible) {
            return;
        }
        if (!this.isAvailableTextaliveAppApi()) {
            console.log("TextAlive App API ???????????????????????????????????????????????????");
            return;
        }

        console.log("[DebugInfo] ????????????");

        const player = this._textaliveAppApi.player;
        const video = player.video;
        console.log(
            `?????????\n  char: ${video.charCount}\n  word: ${video.wordCount}\n  phrase: ${video.phraseCount}`
        );
        console.log(`????????????: ${player.getMaxVocalAmplitude()}`);
        console.log(
            `V/A(?????????): ????????? ${
                player.data.getMedianValenceArousal().v
            }, ????????? ${player.data.getMedianValenceArousal().a}`
        );
    }

    public setVisible(value: boolean): void {
        this._isVisible = value;
        this._dispText.setVisible(value);
    }

    private isAvailableTextaliveAppApi(): boolean {
        return this._textaliveAppApi && !this._textaliveAppApi.player.isLoading;
    }
}
