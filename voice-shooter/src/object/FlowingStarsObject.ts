import Phaser from "phaser";

export interface FlowingStarsManagerCreateParam {
    scene: Phaser.Scene;
    starImageKey: string;
    imageDepth?: number;
}

export default class FlowingStarsManager {
    private _scene: Phaser.Scene;
    private _stars: FlowingStarObject[];

    static readonly IMAGE_DEPTH_VALUE_MIN: number = 0;
    static readonly IMAGE_DEPTH_VALUE_MAX: number = 0;

    private static readonly STARS_NUM: number = 40;

    constructor() {
        this.init();
    }

    init(): void {
        this._scene = null;
        this._stars = null;
    }

    create(param: FlowingStarsManagerCreateParam): void {
        this._scene = param.scene;

        this._stars = new Array<FlowingStarObject>();
        // 星の軌道の角度に合わせて leight * Math.tan(rad) 掛ける必要があるが、rad = PI / 4 だと 1 になるので簡略化
        const startWidth =
            this._scene.game.scale.gameSize.width +
            this._scene.game.scale.gameSize.height;
        const distance = startWidth / FlowingStarsManager.STARS_NUM;
        for (let i = 0; i < FlowingStarsManager.STARS_NUM; i++) {
            const x_offset = distance * Phaser.Math.FloatBetween(0, 1);
            const star = new FlowingStarObject();
            star.create({
                parentParam: param,
                posX: distance * (i + 1) + x_offset,
                posY: -Phaser.Math.Between(
                    0,
                    this._scene.game.scale.gameSize.height
                ),
            });
            const scale = Phaser.Math.FloatBetween(0.1, 1);
            star.image.setScale(scale, scale);
            this._stars.push(star);
        }
        this.setVisible(false);
    }

    update(): void {
        this._stars.forEach((star) => {
            star.update();
        });
    }

    setVisible(value: boolean): void {
        this._stars.forEach((star) => {
            star.image.setVisible(value);
        });
    }
}

interface FlowingStarObjectCreateParam {
    parentParam: FlowingStarsManagerCreateParam;
    posX: number;
    posY: number;
}

class FlowingStarObject {
    private _image: Phaser.GameObjects.Image;
    private _scene: Phaser.Scene;

    constructor() {
        this.init();
    }

    init(): void {
        this._image = null;
    }

    create(param: FlowingStarObjectCreateParam): void {
        this._image = param.parentParam.scene.add.image(
            param.posX,
            param.posY,
            param.parentParam.starImageKey
        );
        this._image.setDepth(
            FlowingStarsManager.IMAGE_DEPTH_VALUE_MAX +
                (param.parentParam.imageDepth
                    ? param.parentParam.imageDepth
                    : 0)
        );

        this._scene = param.parentParam.scene;
    }

    update(): void {
        if (!this._image.visible) {
            return;
        }

        const speed = 15 * (1.2 - this._image.scale);
        // 星の軌道の角度に合わせて三角関数を掛ける必要があるが、rad = PI / 4 だと x:y = 1:1 になるので簡略化
        this._image.x -= speed;
        this._image.y += speed;
        this._image.rotation -=
            (Math.PI / 180) * (1 - this._image.scale) * speed * 2;

        const width = this._image.width;
        if (this._image.x < -width) {
            this._image.x += this._scene.game.scale.gameSize.width + 2 * width;
        }

        const height = this._image.height;
        if (this._image.y > this._scene.game.scale.gameSize.height + height) {
            this._image.y -=
                this._scene.game.scale.gameSize.height + 2 * height;
        }
    }

    setVisible(value: boolean): void {
        this._image.setVisible(value);
    }

    get image(): Phaser.GameObjects.Image {
        return this._image;
    }
}
