import Phaser from "phaser";

export interface UIImageButtonObjectCreateParam {
    scene: Phaser.Scene;
    imageKeyMap: Map<string, string>; // key: ボタンのステータス名, value: ロードしたImageのkey
    imageDepth?: number;
    posX: number;
    posY: number;
    width?: number;
    height?: number;
    firstStatusName: string;
}

export default class UIImageButtonObject {
    private _isVisible;
    private _images: Map<string, Phaser.GameObjects.Image>; // key: ボタンのステータス名, value: keyのステータス時に表示するImage
    private _responseObject: Phaser.GameObjects.Image;
    private _status: string;

    private static readonly IMAGE_DEPTH_VALUE_MIN: number = 0;
    private static readonly IMAGE_DEPTH_VALUE_MAX: number = 1;

    constructor() {
        this.init();
    }

    public init(): void {
        this._isVisible = false;
        this._images = null;
        this._responseObject = null;
        this._status = null;
    }

    public create(param: UIImageButtonObjectCreateParam): void {
        this._images = new Map<string, Phaser.GameObjects.Image>();
        param.imageKeyMap.forEach((imageKey, statusName) => {
            const image = param.scene.add.image(
                param.posX,
                param.posY,
                imageKey
            );
            image.setVisible(this._isVisible);
            if (param.width && param.height) {
                image.setDisplaySize(param.width, param.height);
            }
            image.setDepth(
                UIImageButtonObject.IMAGE_DEPTH_VALUE_MAX +
                    (param.imageDepth ? param.imageDepth : 0)
            );
            this._images.set(statusName, image);
        });

        let responsImageKey = "";
        param.imageKeyMap.forEach((value, key) => {
            if (key == param.firstStatusName) {
                responsImageKey = value;
            }
        });
        this._responseObject = param.scene.add.image(
            param.posX,
            param.posY,
            responsImageKey
        );
        if (param.width && param.height) {
            this._responseObject.setDisplaySize(param.width, param.height);
        }
        this._responseObject.setInteractive();
        this._responseObject.setVisible(this._isVisible);
        this._responseObject.setDepth(
            UIImageButtonObject.IMAGE_DEPTH_VALUE_MIN +
                (param.imageDepth ? param.imageDepth : 0)
        );

        this._status = param.firstStatusName;
    }

    public setVisible(value: boolean): void {
        this._isVisible = value;
        this._images.forEach((image, statusName) => {
            image.setVisible(statusName == this._status && this._isVisible);
        });

        this._responseObject.setVisible(this._isVisible);
    }

    public setPosition(x: number, y: number): void {
        this._images.forEach((image, _) => {
            image.setPosition(x, y);
        });
        this._responseObject.setPosition(x, y);
    }

    get status(): string {
        return this._status;
    }

    set status(statusName: string) {
        this._status = statusName;
        this.setVisible(this._isVisible);
    }

    get responseObject() {
        return this._responseObject;
    }
}
