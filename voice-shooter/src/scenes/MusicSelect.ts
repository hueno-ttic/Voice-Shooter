import Phaser from "phaser";
import images from "../assets/music_select/*.png";
import no_image from "../assets/thumbnail/no_image_thumbnail.png";
import thumbnailImage from "../assets/thumbnail/*.png";
import { buildMusicInfo } from "../factory/MusicFactory";
import GameMain from "./GameMain";
import music from "../assets/sound/music/*.wav";
import sounds from "../assets/sound/se/*.wav";
import SceneManager from "./SceneManager";

interface displayPosition {
    displayX: number;
    displayY: number;
}
export default class MusicSelectScene extends Phaser.Scene {
    constructor() {
        super({
            key: "MusicSelect",
        });
    }

    private musicInfoText: Phaser.GameObjects.Text;
    private musics = buildMusicInfo();
    private thumbnail: Phaser.GameObjects.Image;
    private selectedFrame: Phaser.GameObjects.Image;

    // メニューの音楽
    private menuMusic: Phaser.Sound.BaseSound;

    private isFading: Boolean = false;

    private readonly musicBoxScale: number = 0.5;

    init(): void {
        SceneManager.setCurrentScene(this);
    }

    preload(): void {
        this.load.image("music_frame", images["music_frame"]);
        this.load.image("music_select_box", images["music_select_box"]);
        this.load.image("first_note", images["first_note"]);
        this.load.image("usomo", images["usomo"]);
        this.load.image("sonokokoro", images["sonokokoro"]);
        this.load.image("natsu", images["natsu"]);
        this.load.image("hisoka", images["hisoka"]);
        this.load.image("freedom", images["freedom"]);
        this.load.image("back_ground", images["back_ground"]);
        this.load.image("title", images["music_select_title"]);
        this.load.image("decide", images["decide"]);
        this.load.audio("menu_music", music.menu);
        this.load.image("no_image", no_image);

        this.load.image("selected_frame", images["selected_frame"]);
        this.musics.forEach((music) => {
            this.load.image(
                `${music.label}_thumbnail`,
                thumbnailImage[`${music.image}`]
            );
        });
        this.load.audio("select_sound", sounds["decide"]);
        this.load.audio("decide_sound", sounds["confirm"]);
    }

    create(): void {
        this.isFading = false;
        const selectSound = this.sound.add("select_sound", { volume: 0.5 });
        const decideSound = this.sound.add("decide_sound", { volume: 0.5 });

        this.add.image(640, 360, "back_ground").setDisplaySize(1280, 720);
        this.add.image(45, 70, "title").setOrigin(0.0, 0.5);

        // 円を描画する
        const circle = this.add.graphics();
        circle.lineStyle(3, 0x000000, 0.6).strokeCircle(1350, 350, 350);

        // 2周目以降で前回選択した曲を取得する
        const defaultMusicId = this.registry.get("selectedMusic")
            ? this.registry.get("selectedMusic")
            : 1;

        const defaultMusic = this.musics
            .filter((music) => music.id === defaultMusicId)
            .pop();
        this.registry.set("selectedMusic", defaultMusic.id);
        this.musicInfoText = this.add
            .text(45, 600, `${defaultMusic.title}/${defaultMusic.author}`, {
                fontFamily: "GenEiLateGoN",
            })
            .setStroke("#000000", 2)
            .setFontSize(40);

        this.thumbnail = this.add.image(
            45,
            350,
            `${defaultMusic.label}_thumbnail`
        );
        this.thumbnail.setOrigin(0.0, 0.5);
        // サムネイルのアスペクト比を保つために一度addした後にスケールをかける
        this.thumbnail.setDisplaySize(
            this.thumbnail.width * 0.6,
            this.thumbnail.height * 0.6
        );

        this.menuMusic = this.sound.add("menu_music", {
            loop: true,
            volume: 0.5,
        });
        if (this.menuMusic) {
            this.menuMusic.play();
        }

        const defaultSelectedFramePosition = this.calcMusicPosition(
            defaultMusic.id - 1
        );

        this.selectedFrame = this.add
            .image(
                defaultSelectedFramePosition.displayX,
                defaultSelectedFramePosition.displayY,
                "selected_frame"
            )
            .setScale(0.9);
        this.tweens.add({
            targets: this.selectedFrame,
            alpha: 0,
            duration: 1000,
            ease: "Power0",
            repeat: -1,
        });

        // 楽曲選択用のボックスを配置する
        this.musics.forEach((music, index) => {
            const musicPosition = this.calcMusicPosition(index);
            const image = this.add.image(
                musicPosition.displayX,
                musicPosition.displayY,
                music.label
            );
            image.setScale(this.musicBoxScale);
            image.setInteractive();

            image.on("pointerdown", () => {
                this.registry.set("selectedMusic", music.id);
                this.musicInfoText.setText(`${music.title}/${music.author}`);
                this.thumbnail.setTexture(
                    this.textures.get(`${music.label}_thumbnail`) ===
                        this.textures.get("__MISSING")
                        ? "no_image"
                        : `${music.label}_thumbnail`
                );
                this.thumbnail.setDisplaySize(
                    this.thumbnail.width * 0.6,
                    this.thumbnail.height * 0.6
                );
                this.selectedFrame.setPosition(
                    musicPosition.displayX,
                    musicPosition.displayY
                );
                if (selectSound) {
                    selectSound.play();
                }
            });
        });

        const decideButton = this.add
            .image(1140, this.musicInfoText.y + 40, "decide")
            .setInteractive();
        decideButton.on("pointerdown", () => {
            if (!this.isFading) {
                if (decideSound) {
                    decideSound.play();
                }
                this.moveGameMain();
            }
        });
    }

    private moveGameMain() {
        if (this.game.scene.getScene("GameMain")) {
            this.scene.remove("GameMain");
        }
        this.menuMusic.stop();
        this.scene.add("GameMain", GameMain);
        this.cameras.main.fadeOut(1000, 255, 255, 255);
        this.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {
                this.scene.start("GameMain");
            }
        );
        this.isFading = true;
    }

    private calcMusicPosition(index: number): displayPosition {
        let dispBoxX = 1000;
        let additionalBoxX = 0;
        let dispBoxY =
            this.thumbnail.y -
            this.thumbnail.displayHeight / 2 -
            (129 * this.musicBoxScale) / 2 -
            10;
        let additionalBoxY =
            (this.thumbnail.displayHeight - 129 * this.musicBoxScale) /
            (this.musics.length - 1);
        switch (index) {
            case 0:
            case 5:
                additionalBoxX = 75;
                break;
            case 1:
            case 4:
                additionalBoxX = 25;
                break;
            default:
                additionalBoxX = 0;
                break;
        }
        return {
            displayX: dispBoxX + additionalBoxX,
            displayY: dispBoxY + additionalBoxY * (index + 1),
        };
    }
}
