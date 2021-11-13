import Phaser from "phaser";
import GameResultScene from "../scenes/GameResult";

export interface TotalResultObjectCreateParam {
    scene: Phaser.Scene;
    totalImageKey: string;
    underLineKey: string;
    totalResult: number;
    dispPercentage?: boolean;
    depth?: number;
    posX: number;
    posY: number;
    animsDelay: number;
}

export default class TotalResultObject {
    private _totalImage: Phaser.GameObjects.Image;
    private _totalResutlText: Phaser.GameObjects.Text;
    private _underLineImage: Phaser.GameObjects.Image;

    constructor() {
        this.init();
    }

    init(): void {
        this._totalImage = null;
        this._totalResutlText = null;
        this._underLineImage = null;
    }

    create(param: TotalResultObjectCreateParam): void {
        this._totalImage = param.scene.add.image(
            param.posX,
            param.posY,
            param.totalImageKey
        );
        this._totalImage
            .setDepth(param.depth ? param.depth : 0)
            .setOrigin(0, 0.5);

        this._totalResutlText = param.scene.add.text(
            param.posX + 300,
            param.posY,
            param.dispPercentage
                ? `${(param.totalResult * 100).toFixed(2)}%`
                : param.totalResult.toString(),
            GameResultScene.SCORE_TEXT_STYLE
        );
        this._totalResutlText
            .setDepth(1 + (param.depth ? param.depth : 0))
            .setOrigin(1, 0.5)
            .setAlpha(0);

        param.scene.tweens.add({
            targets: this._totalResutlText,
            alpha: 1,
            duration: 1000,
            ease: "Power0",
            repeat: 0,
            delay: param.animsDelay,
        });

        this._underLineImage = param.scene.add.image(
            param.posX,
            param.posY + this._totalResutlText.height / 2 + 10,
            param.underLineKey
        );
        this._underLineImage
            .setDepth(param.depth ? param.depth : 0)
            .setOrigin(0, 0.5);
    }
}
