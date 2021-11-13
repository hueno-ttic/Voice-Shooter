import TextaliveApiManager from "../TextaliveApiManager";
import UIImageButtonObject from "./UIImageButtonObject";

export interface UIPauseButtonObjectCreateParam {
    scene: Phaser.Scene;
    pauseImageKey: string;
    playImageKey: string;
    startImageKey: string;
    attentionStartImageKey: string;
    imageDepth?: number;
    posX: number;
    posY: number;
    attentionPosX: number;
    attentionPosY: number;
    textaliveManager: TextaliveApiManager;
}

export default class UIPauseButtonObject {
    // ボタン
    private _button: UIImageButtonObject;

    // "start" の場合の説明
    private _attentionStartImage: Phaser.GameObjects.Image;

    private _textaliveManager: TextaliveApiManager;

    constructor() {
        this.init();
    }

    public init(): void {
        this._button = null;
        this._attentionStartImage = null;
        this._textaliveManager = null;
    }

    public create(param: UIPauseButtonObjectCreateParam): void {
        const imageKeyMap = new Map<string, string>([
            ["pause", param.pauseImageKey],
            ["play", param.playImageKey],
            ["start", param.startImageKey],
        ]);

        // ボタン
        this._button = new UIImageButtonObject();
        this._button.create({
            scene: param.scene,
            imageKeyMap: imageKeyMap,
            imageDepth: param.imageDepth,
            posX: param.posX,
            posY: param.posY,
            firstStatusName: "pause",
        });
        this._button.responseObject.on("pointerdown", () => {
            this.pointerdown();
        });

        // "start" の場合の説明
        this._attentionStartImage = param.scene.add.image(
            param.attentionPosX,
            param.attentionPosY,
            param.attentionStartImageKey
        );
        param.scene.tweens.add({
            targets: this._attentionStartImage,
            alpha: 0,
            duration: 2000,
            ease: "Sine.easeIn",
            repeat: -1,
        });
        this._attentionStartImage.setVisible(this._button.status == "start");
        this._attentionStartImage.setDepth(
            param.imageDepth ? param.imageDepth : 0
        );

        this._textaliveManager = param.textaliveManager;
    }

    private pointerdown(): void {
        if (
            !this._textaliveManager ||
            this._textaliveManager.player.isLoading
        ) {
            return;
        }

        if (this._textaliveManager.player.isPlaying) {
            this._setStatus("play");
        } else {
            this._setStatus("pause");
        }
    }

    public setStatus(status: string): void {
        this._setStatus(status);
    }

    private _setStatus(status: string): void {
        this._button.status = status;
        switch (status) {
            case "play":
                this._textaliveManager.player.requestPause();
                break;
            case "pause":
                this._textaliveManager.player.requestPlay();
                break;
        }

        // status == "start" の場合、説明用の素材を表示
        this._attentionStartImage.setVisible(this.status == "start");
    }

    public setVisible(value: boolean): void {
        this._button.setVisible(value);
        // status == "start" の場合、説明用の素材を表示
        this._attentionStartImage.setVisible(value && this.status == "start");
    }

    get status(): string {
        return this._button.status;
    }
}
