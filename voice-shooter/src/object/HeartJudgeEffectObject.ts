import GameMain from "../scenes/GameMain";
import DepthDefine from "./DepthDefine";

export default class HeartJudgeEffectObject {
    private gameMain: GameMain;

    constructor(gameMain) {
        this.gameMain = gameMain;
    }

    explode(x, y, judge): void {
        let effect = "excellent_red";
        if (judge) {
            if (this.gameMain.firstLane - 20 === y) {
                effect = "excellent_red";
            } else if (this.gameMain.secondLane - 20 === y) {
                effect = "excellent_yellow";
            } else if (this.gameMain.thirdLane - 20 === y) {
                effect = "excellent_green";
            }
        } else {
            effect = "bad";
        }

        let effectImage = this.gameMain.add
            .image(x, y, effect)
            .setDepth(DepthDefine.OBJECT + 50);

        effectImage.scale *= 0.8;
        this.gameMain.tweens.add({
            //tweenを適応させる対象
            targets: effectImage,
            //tweenさせる値
            y: effectImage.y - 50,
            alpha: 0,
            //tweenにかかる時間
            duration: 500,
            //tween開始までのディレイ
            delay: 0,
            //tweenのリピート回数（-1で無限）
            repeat: 0,
            //easingの指定
            ease: "Linear",
        });
    }
}
