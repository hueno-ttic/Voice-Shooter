import Phaser from "phaser";

export interface HeartEffectCreateParam {
    scene: Phaser.Scene;
    particleKey: string;
    circleKey: string;
    depth?: number;
    posX: number;
    posY: number;
}

export default class HeartEffect {
    private _hitEmmiter: Phaser.GameObjects.Particles.ParticleEmitter;
    private _circleEmmiter: Phaser.GameObjects.Particles.ParticleEmitter;
    private _emmitPos: Phaser.Math.Vector2;

    constructor() {
        this.init();
    }

    public init(): void {
        this._hitEmmiter = null;
        this._circleEmmiter = null;
        this._emmitPos = null;
    }

    public create(param: HeartEffectCreateParam): void {
        const hitEmitterManager = param.scene.add.particles(param.particleKey);
        hitEmitterManager.setDepth(param.depth ? param.depth : 0);
        this._hitEmmiter = hitEmitterManager.createEmitter({
            alpha: { start: 1.0, end: 0.0 },
            scale: { min: 0.1, max: 0.4 },
            speed: { min: 100, max: 150 },
            rotate: { min: 0, max: 0 },
            delay: { min: 0, max: 50 },
            blendMode: Phaser.BlendModes.NORMAL,
            quantity: 0,
            lifespan: 500,
        });

        const circleEmmiterManager = param.scene.add.particles(param.circleKey);
        this._circleEmmiter = circleEmmiterManager.createEmitter({
            alpha: { start: 1.0, end: 0.0 },
            scale: { start: 0.0, end: 0.5 },
            blendMode: Phaser.BlendModes.NORMAL,
            quantity: 0,
            lifespan: 500,
        });

        this._emmitPos = new Phaser.Math.Vector2(param.posX, param.posY);
    }

    public explode(): void {
        if (!this._hitEmmiter || !this._circleEmmiter) {
            return;
        }

        const rotOffset = Phaser.Math.Between(0, 360);
        const particleCount = 16;
        for (let i = 0; i < particleCount; i++) {
            const rad = (360 / particleCount) * i + rotOffset;
            this._hitEmmiter.rotate.start = rad + 90;
            this._hitEmmiter.rotate.end = rad + 90;
            this._hitEmmiter.setAngle({ min: rad, max: rad });
            this._hitEmmiter.explode(1, this._emmitPos.x, this._emmitPos.y);
        }

        this._circleEmmiter.explode(1, this._emmitPos.x, this._emmitPos.y);
    }
}
