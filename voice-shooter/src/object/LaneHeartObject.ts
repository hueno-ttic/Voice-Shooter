import Phaser from "phaser";

export interface LaneHeartObjectCreateParam {
    image: Phaser.GameObjects.Image;
    scale: number;
}

export default class LaneHeartObject {
    private _image: Phaser.GameObjects.Image;
    private _animationFrameCount: number;
    private _playAnimationFlag: boolean;

    static readonly STRETCH_ANIMATION_FRAME: number = 15;

    constructor() {
        this.init();
    }

    init(): void {
        this._image = null;
        this._animationFrameCount = 0;
        this._playAnimationFlag = false;
    }

    update(): void {
        this.stretchHeart();
    }

    create(param: LaneHeartObjectCreateParam): void {
        this.image = param.image;
        this.image.scaleX *= param.scale;
        this.image.scaleY *= param.scale;
    }

    // 伸縮アニメーションを開始
    playStretchHeart(): void {
        this._playAnimationFlag = true;
    }

    // 伸縮アニメーションを初期化
    resetStretchHeart(): void {
        this._playAnimationFlag = false;
        this._animationFrameCount = 0;
    }

    // 伸縮アニメーション処理
    private stretchHeart(): void {
        // ハートの伸縮判定
        if (this._playAnimationFlag) {
            this._animationFrameCount++;
            if (
                this._animationFrameCount >
                LaneHeartObject.STRETCH_ANIMATION_FRAME
            ) {
                this.resetStretchHeart();
            }
        }
    }

    get image(): Phaser.GameObjects.Image {
        return this._image;
    }

    set image(image: Phaser.GameObjects.Image) {
        if (this._image) {
            this._image.destroy(true);
        }
        this._image = image;
    }

    get playAnimationFlag(): boolean {
        return this._playAnimationFlag;
    }
}
