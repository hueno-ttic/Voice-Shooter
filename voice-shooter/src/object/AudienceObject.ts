import GameMain from "../scenes/GameMain";
import image from "../assets/audience/*.png";
import DepthDefine from "../object/DepthDefine";

const AUDIENCE_SET_SIZE_X = 25;
const AUDIENCE_SET_SIZE_Y = 5;
const RANDOM_RANGE = 10;

export default class AudienceObject {
    private gameMain: GameMain;
    private firstLane: Phaser.GameObjects.Image[][];
    private secondLane: Phaser.GameObjects.Image[][];
    private thirdLane: Phaser.GameObjects.Image[][];
    private firstLaneCounter;
    private secondLaneCounter;
    private thirdLaneCounter;

    constructor(gameMain: GameMain) {
        this.gameMain = gameMain;

        this.firstLane = Array.from(new Array(AUDIENCE_SET_SIZE_Y), () => {
            return Array.from(new Array(AUDIENCE_SET_SIZE_Y), () => null);
        });
        this.secondLane = Array.from(new Array(AUDIENCE_SET_SIZE_Y), () => {
            return Array.from(new Array(AUDIENCE_SET_SIZE_Y), () => null);
        });
        this.thirdLane = Array.from(new Array(AUDIENCE_SET_SIZE_Y), () => {
            return Array.from(new Array(AUDIENCE_SET_SIZE_Y), () => null);
        });
        this.firstLaneCounter = 0;
        this.secondLaneCounter = 0;
        this.thirdLaneCounter = 0;
    }
    preload() {
        this.gameMain.load.image("audience_a", image["audience_a_39p"]);
        this.gameMain.load.image("audience_b", image["audience_b_39p"]);
        this.gameMain.load.image("audience_c", image["audience_c_39p"]);
        this.gameMain.load.image("audience_d", image["audience_d_39p"]);
    }

    create() {
        this.addAudience(this.firstLane, 1000, 70);
        this.addAudience(this.secondLane, 1000, 270);
        this.addAudience(this.thirdLane, 1000, 470);
    }

    addAudience(laneAudience, baseX, baseY) {
        let diffY = 25 - RANDOM_RANGE / AUDIENCE_SET_SIZE_Y; // 下に突き抜けないように補正
        let diffX = 30;
        for (let i = 0; i < AUDIENCE_SET_SIZE_Y; i++) {
            for (let j = 0; j < AUDIENCE_SET_SIZE_X; j++) {
                let audience = this.getAudienceType();

                // 基準の位置からのズレ
                const rand_x = Math.random() * RANDOM_RANGE; // 左方向へのズレ
                const rand_y = Math.random() * RANDOM_RANGE; // 下方向へのズレ

                laneAudience[i][j] = this.gameMain.add
                    .image(
                        baseX - j * diffX - rand_x,
                        baseY + i * diffY + rand_y,
                        audience
                    )
                    .setDepth(DepthDefine.OBJECT + i);
                laneAudience[i][j].alpha = 0.0;
            }
        }
    }

    getAudienceType(): string {
        let audience;
        const num = Math.floor(Math.random() * 4);
        switch (num) {
            case 0:
                audience = "audience_a";
                break;
            case 1:
                audience = "audience_b";
                break;
            case 2:
                audience = "audience_c";
                break;
            case 3:
                audience = "audience_d";
                break;
        }
        return audience;
    }

    update(lane: string) {
        let maxAudience = AUDIENCE_SET_SIZE_X * AUDIENCE_SET_SIZE_Y;
        if (lane === "first" && this.firstLaneCounter < maxAudience) {
            this.updateAudience(this.firstLane, this.firstLaneCounter);
            this.firstLaneCounter++;
        } else if (lane === "second" && this.secondLaneCounter < maxAudience) {
            this.updateAudience(this.secondLane, this.secondLaneCounter);
            this.secondLaneCounter++;
        } else if (lane === "third" && this.thirdLaneCounter < maxAudience) {
            this.updateAudience(this.thirdLane, this.thirdLaneCounter);
            this.thirdLaneCounter++;
        }
    }

    updateAudience(laneAudience: Phaser.GameObjects.Image[][], counter) {
        let numX = 0;
        // 前から詰めるように修正
        let counterX = counter / 5;
        if (counterX < AUDIENCE_SET_SIZE_X / 5) {
            numX = Math.floor((Math.random() * AUDIENCE_SET_SIZE_X) / 5);
        } else if (
            counterX >= AUDIENCE_SET_SIZE_X / 5 &&
            counterX < (AUDIENCE_SET_SIZE_X * 2) / 5
        ) {
            numX =
                AUDIENCE_SET_SIZE_X / 5 +
                Math.floor((Math.random() * AUDIENCE_SET_SIZE_X) / 5);
        } else if (
            counterX >= (AUDIENCE_SET_SIZE_X * 2) / 5 &&
            counterX < (AUDIENCE_SET_SIZE_X * 3) / 5
        ) {
            numX =
                (AUDIENCE_SET_SIZE_X * 2) / 5 +
                Math.floor((Math.random() * AUDIENCE_SET_SIZE_X) / 5);
        } else if (
            counterX >= (AUDIENCE_SET_SIZE_X * 3) / 5 &&
            counterX < (AUDIENCE_SET_SIZE_X * 4) / 5
        ) {
            numX =
                (AUDIENCE_SET_SIZE_X * 3) / 5 +
                Math.floor((Math.random() * AUDIENCE_SET_SIZE_X) / 5);
        } else if (
            counterX >= (AUDIENCE_SET_SIZE_X * 4) / 5 &&
            counterX < AUDIENCE_SET_SIZE_X
        ) {
            numX =
                (AUDIENCE_SET_SIZE_X * 4) / 5 +
                Math.floor((Math.random() * AUDIENCE_SET_SIZE_X) / 5);
        }

        let numY = Math.floor(Math.random() * AUDIENCE_SET_SIZE_Y);
        if (laneAudience[numY][numX].alpha === 0) {
            laneAudience[numY][numX].alpha = 0.8;
            return;
        }
        this.updateAudience(laneAudience, counter);
    }

    jump() {
        // 表示されている観客
        const activeAudience: Phaser.GameObjects.Image[] = this.firstLane
            .concat(this.secondLane)
            .concat(this.thirdLane)
            .reduce((prev, current) => prev.concat(current), [])
            .reduce((prev, current) => prev.concat(current), [])
            .filter((v) => v.alpha > 0.5);

        if (activeAudience.length <= 0) {
            return;
        }

        const index = Math.floor(activeAudience.length * Math.random());
        const target = activeAudience[index];
        const y = target.y;

        // ジャンプさせるtweenを登録
        this.gameMain.tweens.add({
            targets: target,
            duration: 100,
            y: y - 25,
        });
        this.gameMain.tweens.add({
            targets: target,
            delay: 105,
            duration: 100,
            y: y,
        });
    }
}
