class SceneManager {
    private scene: Phaser.Scene;

    public setCurrentScene(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public getCurrentScene(): Phaser.Scene {
        return this.scene;
    }
}

export default new SceneManager();
