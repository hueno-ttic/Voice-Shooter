import Phaser from "phaser";

export interface TouchEffectCreateParam {
    scene: Phaser.Scene;
    particleKey: string;
    circleKey: string;
    depth?: number;
}

export default class TouchEffect {
    private _hitEmmiter: Phaser.GameObjects.Particles.ParticleEmitter;
    private _circleEmmiter: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor() {
        this.init();
    }

    public init(): void {
        this._hitEmmiter = null;
        this._circleEmmiter = null;
    }

    public create(param: TouchEffectCreateParam): void {
        const hitEmitterManager = param.scene.add.particles(param.particleKey);
        hitEmitterManager.setDepth(param.depth ? param.depth : 0);
        this._hitEmmiter = hitEmitterManager.createEmitter({
            //パーティクルのスケール（2から0へ遷移）
            scale: {
                start: 0.5,
                end: 0,
            },

            //パーティクルの速度（minからmaxの範囲）
            speed: { min: 500, max: 50 },

            blendMode: "SCREEN",

            frequency: -1,

            //パーティクルの放出数（エミット時に指定するので0を入れておく）
            quantity: 0,

            //パーティクルの寿命
            lifespan: 400,
        });

        const circleEmmiterManager = param.scene.add.particles(param.circleKey);
        this._circleEmmiter = circleEmmiterManager.createEmitter({
            alpha: { start: 1.0, end: 0.5 },
            scale: { start: 0.0, end: 0.5 },
            blendMode: Phaser.BlendModes.NORMAL,
            quantity: 0,
            lifespan: 400,
        });
    }

    public explodeStar(count: number, x: number, y: number): void {
        if (!this._hitEmmiter) {
            return;
        }

        this._hitEmmiter.explode(count, x, y);
    }

    public explodeCircle(count: number, x: number, y: number): void {
        if (!this._circleEmmiter) {
            return;
        }

        this._circleEmmiter.explode(1, x, y);
    }
}
