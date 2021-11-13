import Phaser from "phaser";
import GameMain from "../scenes/GameMain";
import artistImage from "../assets/live_artist/*.png";

export default class AudienceObject {
    public gameMain: GameMain;
    public artist: Phaser.GameObjects.Sprite;
    // アーティスト名
    public artistName: string;
    // アーティストのY座標
    public artistY = 0;
    // かなしみ度
    private sadCounter: number = 0;
    // 高揚しているか
    private isUplifting: boolean = false;
    // 表情切り替え用感情値
    private emotion: string = "default";

    // かなしみ状態になったときの初期値
    static readonly SAD_INITIALIZE_COUNT: number = 30;

    constructor(gameMain: GameMain) {
        this.init(gameMain);
    }

    init(gameMain: GameMain) {
        this.gameMain = gameMain;
    }

    preload() {
        this.gameMain.load.spritesheet(
            "miku",
            artistImage["live-artist_miku_sd_182p_sprite"],
            { frameWidth: 182, frameHeight: 154 }
        );
        this.gameMain.load.spritesheet(
            "luka",
            artistImage["live-artist_luka_sd_182p_sprite"],
            { frameWidth: 182, frameHeight: 154 }
        );
    }

    create(selectedMusic) {
        this.artistY = this.gameMain.firstLane;

        // 曲の種類によって出し分ける
        if (selectedMusic.id === 4) {
            this.artistName = "luka";
        } else {
            this.artistName = "miku";
        }

        // 選択アーティストの通常顔を初期設定する
        this.artist = this.gameMain.add.sprite(
            1130,
            this.artistY,
            this.artistName
        );
        // 通常顔(切り出した後の0フレーム目)
        this.artist.anims.create({
            key: "default",
            frames: this.gameMain.anims.generateFrameNumbers(this.artistName, {
                frames: [0],
            }),
            frameRate: 2,
            repeat: -1,
        });
        // かなしみ顔(切り出した後の1フレーム目)
        this.artist.anims.create({
            key: "sad",
            frames: this.gameMain.anims.generateFrameNumbers(this.artistName, {
                frames: [1],
            }),
            frameRate: 2,
            repeat: -1,
        });
        // よろこび顔(切り出した後の2フレーム目)
        this.artist.anims.create({
            key: "happy",
            frames: this.gameMain.anims.generateFrameNumbers(this.artistName, {
                frames: [2],
            }),
            frameRate: 2,
            repeat: -1,
        });

        this.artist.setScale(1);
        this.artist.setDepth(10);
        this.artist.anims.play(this.emotion);
    }

    setIsUplifting(isUplifting: boolean) {
        this.isUplifting = isUplifting;
    }

    setArtistY(artistY: number) {
        this.artistY = artistY;
    }

    setEmotion(emotion: string) {
        if (emotion == "sad") {
            // 悲しみパラメータ設定
            this.sadCounter = AudienceObject.SAD_INITIALIZE_COUNT;
        } else if (emotion == "default") {
            // 歌詞選択が成功したときには悲しんでいても悲しみパラメータを0にもどす
            this.sadCounter = 0;
        }
    }

    update() {
        // ライブアーティストの場所の更新
        this.gameMain.tweens.add({
            //tweenを適応させる対象
            targets: this.artist,
            //tweenさせる値
            y: this.artistY,
            //tweenにかかる時間
            duration: 100,
            //tween開始までのディレイ
            delay: 0,
            //tweenのリピート回数（-1で無限）
            repeat: 0,
            //easingの指定
            ease: "Linear",
        });

        // 時間経過で悲しみ度が下がっていき、一定時間経ったら悲しみから立ち直る
        this.sadCounter = Math.max(this.sadCounter - 1, 0);
        if (this.sadCounter > 0) {
            this.emotion = "sad";
        } else {
            // 高揚しているときかどうかで遷移先を変える
            if (this.isUplifting) {
                this.emotion = "happy";
            } else {
                this.emotion = "default";
            }
        }

        // emotionによって表情を切り替える
        if (this.emotion == "sad") {
            this.artist.anims.play("sad");
        } else if (this.emotion == "happy") {
            this.artist.anims.play("happy");
        } else {
            this.artist.anims.play("default");
        }
    }
}
