import visualizerService from "../../domain/service/visualizerService";
import * as Phaser from "phaser";
import { POINT_SIZE } from "../constants/constants";
import { MusicInfo } from "../../../../interface/MusicInfo";

class Position {
    x: number;
    y: number;
    width: number;
    height: number;
    color: number;
}

const FLOOR_POSITION = { x: 1240, y: 38 }; // 右上端の座標
const FLOOR_SIZE = { width: 200, height: 570 }; // 描画サイズ

const SCREEN_POSITION = { x: 1245, y: 38 }; // 左上端の座標
const SCREEN_SIZE = { width: 22, height: 570 }; // 描画サイズ

export default class Visualizer {
    private readonly scene: Phaser.Scene;
    private readonly service: visualizerService;
    private floor: Phaser.GameObjects.Graphics[];
    private readonly screen: Phaser.GameObjects.Rectangle[];

    constructor(scene: Phaser.Scene, musicInfo: MusicInfo) {
        this.scene = scene;
        this.service = new visualizerService(POINT_SIZE, musicInfo);
        this.screen = [];
        this.floor = [];
    }

    create() {
        const gains = this.service.getGain(0);

        // フロア上に反射するオーディオスペクトラム
        this.getFloorPos(gains).forEach((v) => {
            this.drawFloor(v);
        });

        // モニター上に表示されるオーディオスペクトラム
        this.getScreenPos(gains).forEach((v, index) =>
            this.screen.push(
                this.scene.add
                    .rectangle(v.x, v.y, v.width, v.height, v.color, 0.9)
                    .setDisplayOrigin(0, 0)
                    .setRotation(
                        (0.29 * Math.PI * (index - POINT_SIZE / 2)) /
                            (POINT_SIZE - 1)
                    )
            )
        );
    }

    update(position: number) {
        const gains = this.service.getGain(position);

        // 床の描画
        this.floor.forEach((attenation) => attenation.destroy(true));
        this.floor = [];
        const floor = this.getFloorPos(gains);
        floor.forEach((v) => this.drawFloor(v));

        // モニターの描画
        this.updatePosition(this.screen, this.getScreenPos(gains));
    }

    /**
     * 表示要素を指定したPositionで更新する
     * @param target
     * @param positions
     */
    private updatePosition(
        target: Phaser.GameObjects.Rectangle[],
        positions: Position[]
    ) {
        positions.forEach((value, index) => {
            target[index]?.setPosition(value.x, value.y);
            target[index]?.displayWidth = value.width;
            target[index]?.displayHeight = value.height;
            target[index]?.fillColor = value.color;
        });
    }

    public isLoading(): boolean {
        return this.service.isLoading();
    }

    /**
     * 床の要素を描画する
     * @param v
     */
    private drawFloor(v: Position) {
        const graphics = this.scene.add.graphics();
        const alpha = 0.15;
        graphics
            .fillGradientStyle(
                v.color,
                v.color,
                v.color,
                v.color,
                0,
                alpha,
                0,
                alpha
            )
            .setDepth(0)
            .setBlendMode(Phaser.BlendModes.ADD)
            .fillRect(FLOOR_POSITION.x - v.width, v.y, v.width, v.height);
        this.floor.push(graphics);
    }

    private getScreenPos(gains: number[]): Position[] {
        return this.getPos(gains, SCREEN_POSITION, SCREEN_SIZE);
    }

    private getFloorPos(gains: number[]): Position[] {
        const pos = this.getPos(gains, FLOOR_POSITION, FLOOR_SIZE);
        return pos;
    }

    /**
     * 周波数分布からPositionを作成する
     * @param gains
     * @param pos
     * @param size
     */
    private getPos(
        gains: number[],
        pos: { x: number; y: number },
        size: { width: number; height: number }
    ): Position[] {
        const height = size.height / POINT_SIZE;
        const gainAverage = gains.reduce(
            (prev, current) => prev + current / gains.length
        );
        const brightness = Math.min(1.0, 0.5 + 8 * gainAverage);

        return gains.map((gain, index) => {
            // そのままの値だとメリハリが足りないので、tanhを掛けて補正する
            const tuned_gain = Math.tanh(gain) / Math.tanh(1.0);
            const width = Math.min(
                1 + size.width * tuned_gain * 1.5,
                size.width
            );

            return {
                x: pos.x,
                y: pos.y + height * index,
                width,
                height,
                color: this.getColor(index, brightness),
            };
        });
    }

    /**
     * 指定した位置の色(16進数)を取得する
     * @param index
     * @param brightness
     */
    private getColor(index: number, brightness: number) {
        const red = [255, 109, 30];
        const yellow = [246, 205, 11];
        const green = [41, 255, 12];
        const blue = [4, 180, 254];
        const colors = [red, yellow, green];

        const grad = index / POINT_SIZE;
        const percent1 = Math.max(1 - grad * 3, 0); // 33.3% まで緩やかに下り残りは0
        const percent3 = Math.max(grad * 3 - 2, 0); // 66.6% までは0で緩やかに1に近づく
        const percent2 = 1 - percent1 - percent3; // のこり
        const percents = [percent1, percent2, percent3];

        return [0, 1, 2]
            .map((colorId) => {
                return percents
                    .map(
                        (percent, index) =>
                            colors[index][colorId] * percent * brightness
                    )
                    .map((val) => Math.floor(val))
                    .reduce((prev, val) => prev + val, 0);
            })
            .reduce((prev, val, index) => prev + (val << (8 * (2 - index))), 0);
    }
}
