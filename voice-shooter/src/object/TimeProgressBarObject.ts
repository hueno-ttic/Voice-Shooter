import Phaser from "phaser";
import TextaliveApiManager from "../TextaliveApiManager";

import image from "../assets/*.png";

export interface TimeProgressBarObjectCreateParam {
    scene: Phaser.Scene;
    posX: number;
    posY: number;
    textalivePlayer: TextaliveApiManager;
}

export default class TimeProgressBarObject {
    private _maxValue: number;
    private _nowValue: number;
    private _backgroundImage: Phaser.GameObjects.Image;
    private _progressImage: Phaser.GameObjects.Image;
    private _textaliveApiManager: TextaliveApiManager;

    static readonly BAR_SIZE: Phaser.Math.Vector2 = new Phaser.Math.Vector2(
        780,
        10
    );
    private static readonly IMAGE_DEPTH_VALUE_MIN: number = 0;
    private static readonly IMAGE_DEPTH_VALUE_MAX: number = 1;

    constructor() {
        this.init();
    }

    init(): void {
        this._maxValue = 0;
        this._nowValue = 0;
        this._backgroundImage = null;
        this._progressImage = null;
        this._textaliveApiManager = null;
    }

    static preload(loader: Phaser.Loader.LoaderPlugin): void {
        loader.image("progress_bg", image.bar_bg);
        loader.image("progress_progress", image.bar_gauge);
    }

    create(param: TimeProgressBarObjectCreateParam): void {
        this._backgroundImage = param.scene.add.image(
            param.posX,
            param.posY,
            "progress_bg"
        );
        this._backgroundImage.setDepth(
            TimeProgressBarObject.IMAGE_DEPTH_VALUE_MIN
        );
        this._backgroundImage.setDisplaySize(
            TimeProgressBarObject.BAR_SIZE.x,
            TimeProgressBarObject.BAR_SIZE.y
        );

        this._progressImage = param.scene.add.image(
            param.posX,
            param.posY,
            "progress_progress"
        );
        this._progressImage.setDepth(
            TimeProgressBarObject.IMAGE_DEPTH_VALUE_MAX
        );
        this._progressImage.setDisplaySize(0, TimeProgressBarObject.BAR_SIZE.y);

        this.setVisible(false);

        this._textaliveApiManager = param.textalivePlayer;
    }

    update(): void {
        this.nowValue = this._textaliveApiManager.player.timer.position;
    }

    private updateImage(): void {
        // 進捗度に合わせバーの長さを更新
        this._progressImage.setDisplaySize(
            this.getProgressValue() * TimeProgressBarObject.BAR_SIZE.x,
            TimeProgressBarObject.BAR_SIZE.y
        );

        // 進捗度バーの表示位置更新
        // Imageの座標起点をLeftCenterにする方法があれば不要になるかもしれない
        const bgPos = this._backgroundImage.getCenter();
        const x =
            bgPos.x +
            (this.getProgressValue() - 1) *
                (0.5 * TimeProgressBarObject.BAR_SIZE.x);
        this._progressImage.setPosition(Math.round(x), bgPos.y);
    }

    getProgressValue(): number {
        return this.nowValue / this.maxValue;
    }

    setVisible(value: boolean): void {
        this._backgroundImage.setVisible(value);
        this._progressImage.setVisible(value);
    }

    get maxValue(): number {
        return this._maxValue;
    }

    set maxValue(value: number) {
        this._maxValue = Math.max(value, 0);
        this.updateImage();
    }

    get nowValue(): number {
        return this._nowValue;
    }

    set nowValue(value: number) {
        value = Math.max(value, 0);

        // textalive-app-api Player.requestPlay() を実行すると一瞬、Player.timer.position の値が不正になる為、表示不具合回避のための処理
        if (this.maxValue < value) {
            return;
        }

        this._nowValue = Math.min(value, this.maxValue);
        this.updateImage();
    }
}
