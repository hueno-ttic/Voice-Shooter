import Phaser from "phaser";
import DepthDefine from "../object/DepthDefine";
import { MusicInfo } from "../interface/MusicInfo";
import { buildMusicInfo } from "../factory/MusicFactory";
import ResultScoreObject from "../object/ResultScoreObject";
import TotalResultObject from "../object/TotalResultObject";
import ScoreCounter from "../object/ScoreCounter";
import SceneManager from "./SceneManager";

import imageResult from "../assets/result/*.png";
import music from "../assets/sound/music/*.wav";
import sounds from "../assets/sound/se/*.wav";
import no_image from "../assets/thumbnail/no_image_thumbnail.png";
import thumbnailImage from "../assets/thumbnail/*.png";

export default class GameResultScene extends Phaser.Scene {
    // 選曲情報
    private _musicInfo: MusicInfo;

    // 背景
    private _backgroundImage: Phaser.GameObjects.Image;

    // キャプチャ
    private _resultImage: Phaser.GameObjects.Image;

    // サムネイル
    private _thumbnailImage: Phaser.GameObjects.Image;

    // スコア
    private _scoreBackgroundImage: Phaser.GameObjects.Image;
    private _scoreImage: Phaser.GameObjects.Image;
    private _resultScores: ResultScoreObject[];
    private _total: TotalResultObject;
    private _excellentRate: TotalResultObject;

    // 楽曲情報テキスト
    private _selectSongText: Phaser.GameObjects.Text;

    // リザルト
    private _playResultImage: Phaser.GameObjects.Image;

    // ボタン
    private _moveSelectMusicButtonBgImage: Phaser.GameObjects.Image;
    private _moveSelectMusicButtonImage: Phaser.GameObjects.Image;

    // サウンド
    private _bgm: Phaser.Sound.BaseSound;

    private _isFading: Boolean = false;

    static readonly SCORE_TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle =
        {
            font: "18px Aldrich",
        };

    constructor() {
        super({
            key: "GameResult",
        });
    }

    init() {
        SceneManager.setCurrentScene(this);

        this._isFading = false;

        // 選曲情報
        this._musicInfo = buildMusicInfo()
            .filter((music) => music.id === this.registry.get("selectedMusic"))
            .pop();

        // 背景
        this._backgroundImage = null;

        // キャプチャ
        this._resultImage = null;

        // サムネイル
        this._thumbnailImage = null;

        // スコア
        this._scoreBackgroundImage = null;
        this._scoreImage = null;
        this._resultScores = new Array<ResultScoreObject>(2);
        for (let i = 0; i < this._resultScores.length; i++) {
            this._resultScores[i] = new ResultScoreObject();
        }
        this._total = new TotalResultObject();
        this._excellentRate = new TotalResultObject();

        // 楽曲情報テキスト
        this._selectSongText = null;

        // リザルト
        this._playResultImage = null;

        // ボタン
        this._moveSelectMusicButtonBgImage = null;
        this._moveSelectMusicButtonImage = null;

        // サウンド
        this._bgm = null;
    }

    preload(): void {
        // 背景
        this.load.image("bg_image", imageResult.result_background);

        // キャプチャ
        this.load.image("result_image", imageResult.result_result);

        // サムネイル
        this.load.image(
            `${this._musicInfo.label}_thumbnail`,
            thumbnailImage[`${this._musicInfo.image}`]
        );
        this.load.image("no_image", no_image);

        // スコア
        this.load.image("score_bg", imageResult.result_score_background);
        this.load.image("score_image", imageResult.result_score);
        this.load.image("score_excellent", imageResult.result_score_excellent);
        this.load.image("score_bad", imageResult.result_score_bad);
        this.load.image("score_score", imageResult.result_score_score);
        this.load.image(
            "score_excellent_rate",
            imageResult.result_score_excellent_rate
        );
        this.load.image("line", imageResult.result_line);
        this.load.image("lane_1", imageResult.result_lane_1);
        this.load.image("lane_2", imageResult.result_lane_2);
        this.load.image("lane_3", imageResult.result_lane_3);
        this.load.image("count", imageResult.result_count);

        // リザルト
        this.load.image("result_cleared", imageResult.result_cleared);
        this.load.image("result_failed", imageResult.result_failed);

        // ボタン
        this.load.image(
            "button_select_music_bg",
            imageResult.result_button_background
        );
        this.load.image(
            "button_select_music_image",
            imageResult.result_move_musicselect
        );

        // サウンド
        this.load.audio("result_music", music.result);
        this.load.audio("decide_sound", sounds.confirm);
    }

    create(): void {
        // 背景
        this._backgroundImage = this.add.image(
            this.game.scale.gameSize.width / 2,
            this.game.scale.gameSize.height / 2,
            "bg_image"
        );
        this._backgroundImage.setDepth(DepthDefine.BACK_GROUND);

        // キャプチャ
        this._resultImage = this.add.image(45, 70, "result_image");
        this._resultImage.setOrigin(0.0, 0.5).setDepth(DepthDefine.OBJECT);

        // サムネイル
        const isNoImage =
            this.textures.get(`${this._musicInfo.label}_thumbnail`) ==
            this.textures.get("__MISSING");
        this._thumbnailImage = this.add
            .image(45, 350, `${this._musicInfo.label}_thumbnail`)
            .setOrigin(0.0, 0.5)
            .setDepth(DepthDefine.OBJECT);
        this._thumbnailImage.setDisplaySize(
            this._thumbnailImage.width * 0.6,
            this._thumbnailImage.height * 0.6
        );

        // スコア画像と背景
        const scoreDepth = DepthDefine.OBJECT;
        this._scoreBackgroundImage = this.add.image(
            1040,
            this._thumbnailImage.y -
                (720 * this._thumbnailImage.scaleY) / 2 -
                10,
            "score_bg"
        );
        this._scoreBackgroundImage
            .setDepth(scoreDepth - 1)
            .setOrigin(0.5, 0)
            .setDisplaySize(394, 460);

        this._scoreImage = this.add.image(
            this._scoreBackgroundImage.x,
            this._scoreBackgroundImage.y + 25,
            "score_image"
        );

        // レーンごとのリザルト
        const result = this.registry.get("gameResult") as GameScore;
        const laneScores = [
            result.laneScore.map((score) => score.success),
            [
                result.laneScore.reduce((sum, value) => {
                    return sum + value.failed;
                }, 0),
            ],
        ];
        const resultNameKeys = ["score_excellent", "score_bad"];
        const laneKeys = [["lane_1", "lane_2", "lane_3"], ["count"]];
        let scoreDelay = 1000;
        for (let i = 0; i < this._resultScores.length; i++) {
            scoreDelay += 1500 * i;
            this._resultScores[i].create({
                scene: this,
                resultNameKey: resultNameKeys[i],
                underlineKey: "line",
                laneKeys: laneKeys[i],
                laneScores: laneScores[i],
                depth: scoreDepth,
                posX: this._scoreBackgroundImage.x - 180,
                posY:
                    this._scoreBackgroundImage.y +
                    this._scoreImage.height +
                    30 +
                    200 * i,
                animsDelay: scoreDelay,
            });
        }
        scoreDelay += 500;

        // スコア
        this._total.create({
            scene: this,
            totalImageKey: "score_score",
            underLineKey: "line",
            totalResult: result.totalScore,
            depth: scoreDepth,
            posX: this._scoreBackgroundImage.x - 180,
            posY:
                this._scoreBackgroundImage.y +
                this._scoreImage.height +
                30 +
                200 * this._resultScores.length +
                -100,
            animsDelay: scoreDelay,
        });
        scoreDelay += 1500;

        // Excellent率
        const excellentCount = result.laneScore.reduce((sum, value) => {
            return sum + value.success;
        }, 0);
        const noteCount = result.laneScore.reduce((sum, value) => {
            return sum + value.total;
        }, 0);
        this._excellentRate.create({
            scene: this,
            totalImageKey: "score_excellent_rate",
            underLineKey: "line",
            totalResult: 0 < noteCount ? excellentCount / noteCount : 0,
            dispPercentage: true,
            depth: scoreDepth,
            posX: this._scoreBackgroundImage.x - 180,
            posY:
                this._scoreBackgroundImage.y +
                this._scoreImage.height +
                30 +
                200 * this._resultScores.length +
                -40,
            animsDelay: scoreDelay,
        });

        // 楽曲情報
        this._selectSongText = this.add.text(
            45,
            600,
            `${this._musicInfo.title}/${this._musicInfo.author}`,
            { fontFamily: "GenEiLateGoN" }
        );
        this._selectSongText
            .setDepth(DepthDefine.OBJECT)
            .setStroke("#000000", 2)
            .setFontSize(40);

        // リザルト
        this._playResultImage = this.add.image(
            this._scoreBackgroundImage.x,
            this._scoreBackgroundImage.y - 40,
            this.isClear() ? "result_cleared" : "result_failed"
        );
        this._playResultImage.setDepth(DepthDefine.OBJECT + 1);
        this._playResultImage.setAlpha(0);
        this.tweens.add({
            targets: this._playResultImage,
            alpha: 1,
            duration: 800,
            ease: "Power0",
            repeat: 0,
            delay: scoreDelay,
        });

        // ボタン
        const buttonDepth = DepthDefine.UI_OBJECT;
        this._moveSelectMusicButtonBgImage = this.add.image(
            this._scoreBackgroundImage.x,
            this._selectSongText.y + this._selectSongText.height / 2 + 20,
            "button_select_music_bg"
        );
        this._moveSelectMusicButtonBgImage.setDepth(buttonDepth - 1);
        this._moveSelectMusicButtonBgImage.setInteractive();
        const decideSound = this.sound.add("decide_sound", { volume: 0.5 });
        this._moveSelectMusicButtonBgImage.on("pointerdown", () => {
            if (decideSound) {
                decideSound.play();
            }
            this.cameras.main.fadeOut(1000, 255, 255, 255);
            this.cameras.main.once(
                Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
                () => {
                    this._bgm.stop();
                    this.scene.start("MusicSelect");
                }
            );
            this._isFading = true;
        });
        this._moveSelectMusicButtonBgImage.setAlpha(0);

        this._moveSelectMusicButtonImage = this.add.image(
            this._moveSelectMusicButtonBgImage.x,
            this._moveSelectMusicButtonBgImage.y,
            "button_select_music_image"
        );
        this._moveSelectMusicButtonImage.setDepth(buttonDepth);
        this._moveSelectMusicButtonImage.setAlpha(0);
        this.tweens.add({
            targets: [
                this._moveSelectMusicButtonImage,
                this._moveSelectMusicButtonBgImage,
            ],
            alpha: 1,
            duration: 800,
            ease: "Power0",
            repeat: 0,
            delay: scoreDelay,
        });

        // サウンド
        this._bgm = this.sound.add("result_music", {
            loop: true,
            volume: 0.5,
        });
        this._bgm.play();
    }

    private isClear(): boolean {
        const result = this.registry.get("gameResult") as GameScore;
        const successCount = result.laneScore.reduce((sum, value) => {
            return sum + value.success;
        }, 0);
        const totalCount = result.laneScore.reduce((sum, value) => {
            return sum + value.total;
        }, 0);

        const successRate = 0 < totalCount ? successCount / totalCount : 1.0;
        // 60%以上成功していたらクリア
        return !(successRate < 0.6);
    }
}

interface GameScore {
    laneScore: ScoreCounter[];
    totalScore: number;
}
