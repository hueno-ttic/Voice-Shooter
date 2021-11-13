import Phaser from "phaser";
import TextaliveApiManager from "../TextaliveApiManager";

export interface TimeInfoObjectCreateParam {
    scene: Phaser.Scene;
    posX: number;
    posY: number;
    textalivePlayer: TextaliveApiManager;
}

export default class TimeInfoObject {
    private _objectRoot: Phaser.GameObjects.Group;
    private _songLength: number;
    private _songLengthText: Phaser.GameObjects.Text;
    private _nowTimeText: Phaser.GameObjects.Text;
    private _splitText: Phaser.GameObjects.Text;
    private _textaliveApiManager: TextaliveApiManager;
    private _dispTime: boolean;

    private static readonly IMAGE_DEPTH_VALUE_MIN: number = 0;
    private static readonly IMAGE_DEPTH_VALUE_MAX: number = 1;
    private static readonly TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle =
        { font: "15px Aldrich" };

    constructor() {
        this.init();
    }

    init(): void {
        this._objectRoot = null;
        this._songLength = 0;
        this._songLength = null;
        this._songLengthText = null;
        this._nowTimeText = null;
        this._textaliveApiManager = null;
        this._dispTime = false;
    }

    create(param: TimeInfoObjectCreateParam): void {
        // 座標は _objectRoot で起点移動後に設定する為、暫定値で作成
        const strokeThickness = 4;
        this._songLengthText = param.scene.add.text(
            0,
            0,
            "00:00",
            TimeInfoObject.TEXT_STYLE
        );
        this._songLengthText.setStroke("#161616", strokeThickness);
        this._songLengthText.setDepth(TimeInfoObject.IMAGE_DEPTH_VALUE_MAX);
        this._songLengthText.setOrigin(0.5, 0.5);

        this._nowTimeText = param.scene.add.text(
            0,
            0,
            "00:00",
            TimeInfoObject.TEXT_STYLE
        );
        this._nowTimeText.setStroke("#161616", strokeThickness);
        this._nowTimeText.setDepth(TimeInfoObject.IMAGE_DEPTH_VALUE_MAX);
        this._nowTimeText.setOrigin(0.5, 0.5);

        this._splitText = param.scene.add.text(
            0,
            0,
            "/",
            TimeInfoObject.TEXT_STYLE
        );
        this._splitText.setStroke("#161616", strokeThickness);
        this._splitText.setDepth(TimeInfoObject.IMAGE_DEPTH_VALUE_MAX);
        this._splitText.setOrigin(0.5, 0.5);

        this._objectRoot = param.scene.add.group();
        this._objectRoot.addMultiple([
            this._songLengthText,
            this._nowTimeText,
            this._splitText,
        ]);
        this._objectRoot.setXY(param.posX, param.posY);

        const offset = 30;
        this._songLengthText.x += offset;
        this._nowTimeText.x -= offset;

        this.setVisible(false);

        this._textaliveApiManager = param.textalivePlayer;

        this.dispTime = false;
    }

    update(): void {
        if (this._dispTime) {
            this.updateText();
        }
    }

    private updateText(): void {
        // textalive-app-api Player.requestPlay() を実行すると一瞬、Player.timer.position の値が不正になる為、表示不具合回避のための処理
        if (
            !(
                this._songLength <
                this._textaliveApiManager.player.timer.position
            )
        ) {
            this._nowTimeText.setText(
                this.makeTimeString(
                    this._textaliveApiManager.player.timer.position
                )
            );
        }
        this._songLengthText.setText(this.makeTimeString(this._songLength));
    }

    private makeTimeString(time_ms: number): string {
        if (!this._dispTime) {
            return "00:00";
        }

        const time_sec = Math.trunc(time_ms / 1000);

        const min = Math.trunc(time_sec / 60);
        const sec = time_sec % 60;
        return `${min.toString().padStart(2, "0")}:${sec
            .toString()
            .padStart(2, "0")}`;
    }

    setVisible(value: boolean): void {
        this._songLengthText.setVisible(value);
        this._nowTimeText.setVisible(value);
        this._splitText.setVisible(value);
    }

    set songLength(time_ms: number) {
        this._songLength = time_ms;
        this._songLengthText.setText(this.makeTimeString(this._songLength));
    }

    set dispTime(value: boolean) {
        this._dispTime = value;
        this.updateText();
    }
}
