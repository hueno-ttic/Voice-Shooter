import Phaser from "phaser";
import GameMain from "../scenes/GameMain";

export default class TutorialObject {
    // チュートリアル関連
    private tutorialDescription: Phaser.GameObjects.Image;
    private tutorialFrame: Phaser.GameObjects.Image;
    private tapstart: Phaser.GameObjects.Image;
    tutorialFlag: Boolean;
    tutorialCounter: number; // 次の画面から移動してきた瞬間チュートリアルが終わらないようにするカウンター
    gameStartCounter: number; // チュートリアルが終わった瞬間にゲームがいきなり始まらないようにするカウンター
    private r;

    constructor() {
        this.r = 0;
        this.tutorialCounter = 0;
        this.tutorialFlag = false;
        this.gameStartCounter = 0;
    }

    createImage(
        tutorialDescription: Phaser.GameObjects.Image,
        tutorialFrame: Phaser.GameObjects.Image,
        tapstart: Phaser.GameObjects.Image
    ) {
        this.tutorialDescription = tutorialDescription;
        this.tutorialFrame = tutorialFrame;
        this.tapstart = tapstart;
    }

    // 点滅処理
    flashing() {
        this.tapstart.alpha = Math.abs(Math.sin(this.r));
        if (this.r >= 360) {
            this.r = 0;
        } else {
            this.r += 0.05;
        }
        this.tutorialCounter++;
    }

    // チュートリアルの終了処理
    end() {
        this.tutorialDescription.setVisible(false);
        this.tutorialFrame.setVisible(false);
        this.tapstart.setVisible(false);
        this.tutorialFlag = true;
    }
}
