// 必要なimport
import * as Phaser from "phaser";
import SplashScene from "./scenes/SplashScene";
import TitleScene from "./scenes/TitleScene";
import GameMain from "./scenes/GameMain";
import GameResult from "./scenes/GameResult";
import MusicSelectScene from "./scenes/MusicSelect";
import CriticalError from "./scenes/CriticalError";
import SceneManager from "./scenes/SceneManager";
import whitListError from "./whitListError.json";

// ゲームの基本設定
const config: Phaser.Types.Core.GameConfig = {
    title: "VoiceShooter", // タイトル
    version: "0.0.1", // バージョン
    width: 1280, // 画面幅
    height: 720, // 画面高さ
    parent: "game", // DOM上の親
    type: Phaser.AUTO, // canvasかwebGLかを自動選択
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    },
    scene: [
        SplashScene,
        TitleScene,
        GameMain,
        MusicSelectScene,
        GameResult,
        CriticalError,
    ],
};

// ゲームメインのクラス
export class Game extends Phaser.Game {
    constructor() {
        super(config);
    }
}

class Main {
    private game: Game;

    constructor() {}
    initialize() {
        // windowイベントで、ロードされたらゲーム開始
        window.addEventListener("load", () => {
            this.game = new Game();
        });

        window.onerror = (e) => {
            console.log("ハンドリングされていないエラーが起きました", e);
            this.game.sound.stopAll();
            SceneManager.getCurrentScene().scene.start("error");
        };

        window.onunhandledrejection = (e) => {
            if (
                whitListError.white_list_error.indexOf(e.reason.message) === -1
            ) {
                console.log(
                    "ハンドリングされていないリジェクトが起きました",
                    e
                );
                this.game.sound.stopAll();
                SceneManager.getCurrentScene().scene.start("error");
            }
        };
    }
}

new Main().initialize();
