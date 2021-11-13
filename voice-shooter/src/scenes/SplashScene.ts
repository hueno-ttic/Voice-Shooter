import Phaser from "phaser";
import image from "../assets/*.png";
import SceneManager from "./SceneManager";
export default class SplashScene extends Phaser.Scene {
    private isFading = false;

    constructor() {
        super({
            key: "SplashScene",
        });
    }

    init(): void {
        SceneManager.setCurrentScene(this);
    }

    preload(): void {
        this.load.image("splash01", image["splash01"]);
        this.load.image("splash02", image["splash02"]);
    }

    create(): void {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.add.image(640, 360, "splash01");
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE,
            () => {
                this.cameras.main.fadeOut(1000, 0, 0, 0);
                this.cameras.main.once(
                    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                    () => {
                        this.cameras.main.fadeIn(1000, 0, 0, 0);
                        this.add.image(640, 360, "splash02");
                        this.cameras.main.once(
                            Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE,
                            () => {
                                this.input.on("pointerdown", () => {
                                    if (!this.isFading) {
                                        this.cameras.main.fadeOut(
                                            1000,
                                            0,
                                            0,
                                            0
                                        );
                                        this.cameras.main.once(
                                            Phaser.Cameras.Scene2D.Events
                                                .FADE_OUT_COMPLETE,
                                            () => {
                                                this.scene.start("TitleScene");
                                            }
                                        );
                                        this.isFading = true;
                                    }
                                });
                            }
                        );
                    }
                );
            }
        );
        let linkText = this.add
            .text(50, 670, "本アプリは TextAlive App API を利用しています ")
            .setDepth(500);
        let link = this.add
            .text(450, 670, "https://developer.textalive.jp/")
            .setInteractive()
            .setDepth(500);
        link.on("pointerup", this.openLink, this);
        this;
    }
    openLink(): void {
        let url = "https://developer.textalive.jp/";
        var s = window.open(url, "_blank");

        if (s && s.focus) {
            s.focus();
        } else if (!s) {
            window.location.href = url;
        }
    }
}
