import Phaser from "phaser";

import errorImage from "../assets/error/*.png";
import SceneManager from "./SceneManager";

export default class CriticalError extends Phaser.Scene {
    constructor() {
        super({
            key: "error",
        });
    }

    init(): void {
        SceneManager.setCurrentScene(this);
    }

    preload(): void {
        // imageの読み込み
        this.load.image("error", errorImage.error);
    }

    create(): void {
        const gameTitle = this.add.image(640, 360, "error");
    }

    update() {}
}
