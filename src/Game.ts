import Phaser from 'phaser';
import { ZScene, ZTimeline, ZUpdatables } from 'zimporter-phaser';

export class Game extends Phaser.Scene {

    private zScene!: ZScene;

    private _frameCount: number = 0;
    private _lastTime: number = 0;
    private _fpsText!: Phaser.GameObjects.Text;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Preload assets here if needed
    }

    create() {
        ZUpdatables.init(24);

        this._frameCount = 0;
        this._lastTime = performance.now();
        this._fpsText = this.add.text(10, 10, 'FPS: --', {
            fontSize: '16px',
            color: '#ffffff'
        }).setDepth(9999);

        const loadPath = (window as any).loadPath || './assets/robo/';
        console.log('Game create, loadPath:', loadPath);

        this.zScene = new ZScene('gameScene', this);
        this.zScene.load(loadPath, () => {
            this.zScene.loadStage(this);

            const stage = this.zScene.sceneStage;
            for (const child of stage.list) {
                if (child instanceof ZTimeline) {
                    child.play();
                }
            }
        });
    }

    update(_time: number, delta: number) {
        // FPS counter
        this._frameCount++;
        const now = performance.now();
        const elapsed = now - this._lastTime;
        if (elapsed >= 1000) {
            const fps = (this._frameCount / elapsed) * 1000;
            this._fpsText.setText(`FPS: ${fps.toFixed(1)}`);
            this._fpsText.setDepth(9999);
            this._frameCount = 0;
            this._lastTime = now;
        }

        ZUpdatables.update();
    }

    resize(width: number, height: number) {
        if (this.zScene) {
            this.zScene.resize(width, height);
        }
    }
}