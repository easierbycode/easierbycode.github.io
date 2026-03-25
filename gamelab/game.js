import Boing from './scenes/Boing.js';
import Stars from './scenes/Stars.js';
import Clock from './scenes/Clock.js';
import Eyes from './scenes/Eyes.js';
import Invaders from './scenes/Invaders.js';
import Juggler from './scenes/Juggler.js';
import Example2 from './scenes/Example2.js';
import MyScene from './scenes/MyScene.js';

const SCENES = { Boing, Stars, Clock, Eyes, Invaders, Juggler, Example2, MyScene };

const params = new URLSearchParams(window.location.search);
const sceneName = params.get('scene') || 'MyScene';
const SceneClass = SCENES[sceneName] || SCENES['MyScene'];

const WIDTH = SceneClass.WIDTH || 400;
const HEIGHT = SceneClass.HEIGHT || 400;
const fakeParent = { x: 0, y: 0 };

// Instantiate the scene — MyScene uses a no-arg constructor, others take (handle, parent)
const sceneInstance = (SceneClass.length === 0)
    ? new SceneClass()
    : new SceneClass(sceneName, fakeParent);

// BootScene preloads all assets that the windowed scenes rely on,
// then dynamically adds and starts the chosen demo scene.
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'boot' });
    }

    preload() {
        const host = window.location.hostname;
        const base = (host === 'localhost' || host === '127.0.0.1')
            ? ''
            : 'https://easierbycode.com/gamelab/public';
        this.load.setBaseURL(base);

        // Boing
        this.load.atlas('boing', 'assets/phaser3/boing.png', 'assets/phaser3/boing.json');

        // Stars
        this.load.image('star', 'assets/phaser3/star2.png');
        this.load.image('starsWindow', 'assets/phaser3/stars-window.png');

        // Clock
        this.load.image('clockWindow', 'assets/phaser3/clock-window.png');

        // Eyes
        this.load.image('eye', 'assets/phaser3/eye.png');
        this.load.image('eyesWindow', 'assets/phaser3/eyes-window.png');

        // Invaders
        this.load.image('invaders.boom', 'assets/games/multi/boom.png');
        this.load.image('invaders.bullet2', 'assets/games/multi/bullet2.png');
        this.load.image('invaders.explode', 'assets/games/multi/explode.png');
        this.load.image('invaders.mothership', 'assets/games/multi/mothership.png');
        this.load.image('invaders.ship', 'assets/games/multi/ship.png');
        this.load.spritesheet('invaders.bullet', 'assets/games/multi/bullet.png', { frameWidth: 12, frameHeight: 14 });
        this.load.spritesheet('invaders.invader1', 'assets/games/multi/invader1.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('invaders.invader2', 'assets/games/multi/invader2.png', { frameWidth: 22, frameHeight: 16 });
        this.load.spritesheet('invaders.invader3', 'assets/games/multi/invader3.png', { frameWidth: 24, frameHeight: 16 });
        this.load.image('invadersWindow', 'assets/phaser3/invaders-window.png');

        // Juggler
        this.load.spritesheet('juggler', 'assets/phaser3/juggler.png', { frameWidth: 128, frameHeight: 184 });
        this.load.image('jugglerWindow', 'assets/phaser3/juggler-window.png');
    }

    create() {
        // Boing animation
        if (!this.anims.exists('boing')) {
            this.anims.create({
                key: 'boing',
                frames: this.anims.generateFrameNames('boing', { prefix: 'boing', start: 1, end: 14 }),
                frameRate: 28,
                repeat: -1
            });
        }

        // Juggler animation
        if (!this.anims.exists('juggler')) {
            this.anims.create({
                key: 'juggler',
                frames: this.anims.generateFrameNumbers('juggler'),
                frameRate: 28,
                repeat: -1
            });
        }

        // Invaders animations
        if (!this.anims.exists('bullet')) {
            this.anims.create({ key: 'bullet', frames: this.anims.generateFrameNumbers('invaders.bullet'), frameRate: 8, repeat: -1 });
        }
        if (!this.anims.exists('invader1')) {
            this.anims.create({ key: 'invader1', frames: this.anims.generateFrameNumbers('invaders.invader1'), frameRate: 2, repeat: -1 });
        }
        if (!this.anims.exists('invader2')) {
            this.anims.create({ key: 'invader2', frames: this.anims.generateFrameNumbers('invaders.invader2'), frameRate: 2, repeat: -1 });
        }
        if (!this.anims.exists('invader3')) {
            this.anims.create({ key: 'invader3', frames: this.anims.generateFrameNumbers('invaders.invader3'), frameRate: 2, repeat: -1 });
        }

        // Add and start the chosen demo scene
        this.scene.add(sceneName, sceneInstance, true);
    }
}

new Phaser.Game({
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    parent: 'game-container',
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: [BootScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
});
