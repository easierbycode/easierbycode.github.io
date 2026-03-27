var _frameRate, _repeat;
import CONSTANTS from "./constants.js";
import PROPERTIES from "./properties.js";
// GameLab / Phaser4Sandbox
export class Example3 extends Phaser.Scene {
    constructor(handle, parent) {
        // Add handle and parent parameters
        super({ key: handle }); // Use handle for scene key
        this.parent = parent; // Store parent container reference
        // Initialize properties
        this.logo = null;
        this.emitter = null;
        this.bg = null; // Optional background
        // Store current dimensions
        this.currentWidth = Example3.WIDTH;
        this.currentHeight = Example3.HEIGHT;
    }
    preload() {
        // Assets should ideally be loaded globally by LoadScene or EditorScene
        // Keeping them here for demonstration, but remove if loaded elsewhere.
        // this.load.image("logo", `https://play.rosebud.ai/assets/logo.png?j9ze`); // Redundant if loaded elsewhere
        this.load.image("logo", `https://assets.codepen.io/11817390/logo.png`); // Redundant if loaded elsewhere
        this.load.image("particle", 
        // "https://play.rosebud.ai/assets/particle.png?Wslm"
        "https://assets.codepen.io/11817390/particle.png");
        this.load.spritesheet("clownCar", 
        // `https://play.rosebud.ai/assets/clown-car.png?JB1F`,
        "https://assets.codepen.io/11817390/clown-car.png", { frameWidth: 64, frameHeight: 92 });
        // Load a window background if desired
        // this.load.image('example3Window', 'path/to/your/window/bg.png');
    }
    lightning() {
        // Ensure camera exists before applying effects
        if (!this.cameras.main)
            return;
        // Use hex color codes directly
        this.cameras.main.setBackgroundColor(0xabf2ea);
        this.cameras.main.flash(17, 0x000000);
        this.time.delayedCall(1, () => { var _a; return (_a = this.cameras.main) === null || _a === void 0 ? void 0 : _a.setBackgroundColor(0xfefbff); });
        this.time.delayedCall(16, () => { var _a; return (_a = this.cameras.main) === null || _a === void 0 ? void 0 : _a.flash(34, 0xfefbff); });
        this.time.delayedCall(16 * 2, () => { var _a; return (_a = this.cameras.main) === null || _a === void 0 ? void 0 : _a.setBackgroundColor(0xfefbff); });
        this.time.delayedCall(16 * 3, () => { var _a; return (_a = this.cameras.main) === null || _a === void 0 ? void 0 : _a.setBackgroundColor(0x9fa3c4); });
        this.time.delayedCall(64, () => { var _a; return (_a = this.cameras.main) === null || _a === void 0 ? void 0 : _a.setBackgroundColor(0x7d81a2); });
        this.time.delayedCall(64 + 80, () => {
            if (this.cameras.main) {
                this.cameras.main.setBackgroundColor(0x5d6081);
                this.cameras.main.flash(1, 0x000000, true, () => {
                    var _a;
                    (_a = this.cameras.main) === null || _a === void 0 ? void 0 : _a.shake(17, 0.0035);
                });
            }
        });
        this.time.delayedCall(64 + 80 * 2, () => { var _a; return (_a = this.cameras.main) === null || _a === void 0 ? void 0 : _a.setBackgroundColor(0x3c4061); });
        this.time.delayedCall(64 + 80 * 3, () => { var _a; return (_a = this.cameras.main) === null || _a === void 0 ? void 0 : _a.setBackgroundColor(0x000000); });
    }
    create() {
        // Set viewport/camera based on parent container passed from EditorScene
        if (this.parent) {
            this.cameras.main.setViewport(this.parent.x, this.parent.y, this.currentWidth, this.currentHeight);
            // Set initial background color for the scene (before lightning effect)
            this.cameras.main.setBackgroundColor(0x000000);
            this.cameras.main.setScroll(0, 0);
            // Optional: Add a background frame image if loaded
            // this.bg = this.add.image(0, 0, 'example3Window').setOrigin(0);
        }
        else {
            // Fallback if no parent (e.g., running standalone)
            this.cameras.main.setBackgroundColor(0x000000);
        }
        this.physics.world.setBounds(0, 0, this.currentWidth, this.currentHeight, true, true, false, false);
        const colors = [0xffbb33, 0xd4af37, 0xfcdb06, 0xeeaa00, 0xeecc66, 0xff0000];
        let emitterConfig = {
            speed: 100,
            scale: { start: 1.5, end: 0 },
            blendMode: "ADD",
            tint: {
                onUpdate: (particle, key, value) => {
                    return Phaser.Utils.Array.GetRandom(colors);
                }
            },
            frequency: 10
        };
        // Create emitter using the new syntax: scene.add.particles(x, y, texture, config)
        this.emitter = this.add.particles(0, 0, "particle", emitterConfig);
        this.logo = this.physics.add
            .sprite(this.currentWidth / 2, this.currentHeight * 0.38, "clownCar")
            .setFlipX(true)
            .setScale(2)
            .setOrigin(0.5, 0.95);
        this.logo.anims.create({
            key: "default",
            frames: this.anims.generateFrameNumbers("clownCar", { start: 1, end: 2 }),
            frameRate: 4,
            repeat: -1
        });
        this.logo.play("default");
        this.tweens.add({
            targets: this.logo,
            y: this.logo.y - 10,
            duration: 500,
            ease: "Sine.easeInOut",
            yoyo: true,
            repeat: -1
        });
        this.logo.setVelocity(20, 0);
        this.logo.setBounce(1);
        this.logo.body.setCollideWorldBounds(true, -1, 0, true);
        // Use 'worldbounds' event from the physics world
        this.physics.world.on("worldbounds", (body, up, down, left, right) => {
            // Check if the colliding body is our logo's body
            if (body === this.logo.body) {
                if (left || right) {
                    this.logo.flipX = !this.logo.flipX;
                    // Ensure velocity exists before trying to access it
                    if (this.logo.body.velocity) {
                        this.logo.setVelocityX(-this.logo.body.velocity.x);
                    }
                }
            }
        });
        this.emitter.startFollow(this.logo);
        // Flash camera after 8 seconds
        this.time.addEvent({
            delay: 8000,
            callback: () => {
                this.lightning();
                this.time.delayedCall(1300, () => this.lightning());
            },
            loop: true // Use loop: true instead of repeat: -1
        });
        // Disable world bounds and make logo appear to move away from the camera after 21 seconds
        this.time.addEvent({
            delay: 21000,
            callback: () => {
                if (!this.physics.world)
                    return; // Guard
                this.physics.world.setBoundsCollision(false, false, false, false);
                if (!this.logo || !this.logo.active)
                    return; // Guard logo
                this.tweens.add({
                    targets: this.logo,
                    scale: 1.25,
                    alpha: 0.8,
                    duration: 3000,
                    ease: "Sine.easeInOut",
                    onComplete: () => {
                        if (!this.logo || !this.logo.active)
                            return; // Guard logo again
                        this.tweens.add({
                            targets: this.logo,
                            scale: 8,
                            alpha: 1,
                            y: -400,
                            duration: 3000,
                            ease: "Sine.easeInOut",
                            onComplete: () => {
                                if (this.emitter)
                                    this.emitter.destroy();
                                this.emitter = null; // Clear reference
                            }
                        });
                    }
                });
            }
        });
    }
    update() {
        // Synchronize emitter alpha with logo alpha if both exist
        if (this.emitter && this.emitter.active && this.logo && this.logo.active) {
            this.emitter.setAlpha(this.logo.alpha);
        }
    }
    // Called by EditorScene when the parent zone is dragged
    refresh() {
        if (!this.parent)
            return;
        // Update camera position to match the dragged zone
        this.cameras.main.setPosition(this.parent.x, this.parent.y);
        // Bring this scene's display list to the top
        if (this.sys && this.sys.bringToTop) {
            this.sys.bringToTop();
        }
    }
    // Called by EditorScene for resize/fullscreen
    resizeScene(newWidth, newHeight) {
        this.currentWidth = newWidth;
        this.currentHeight = newHeight;
        if (!this.cameras.main)
            return; // Guard
        // Update camera viewport size
        this.cameras.main.setSize(newWidth, newHeight);
        // Scale background if it exists
        if (this.bg) {
            this.bg.setDisplaySize(newWidth, newHeight);
        }
        // Update physics bounds
        if (this.physics.world) {
            this.physics.world.setBounds(0, 0, newWidth, newHeight);
        }
        // Reposition logo (e.g., maintain relative position)
        if (this.logo && this.logo.body) {
            this.logo.setPosition(newWidth / 2, newHeight * 0.38);
            this.logo.body.setCollideWorldBounds(true); // Re-apply world bounds
        }
        // Emitter position updates automatically via startFollow
        console.log(`${this.scene.key} resized to ${newWidth}x${newHeight}`);
    }
    shutdown() {
        var _a, _b, _c, _d;
        // Stop all tweens targeting scene objects
        if (this.logo)
            this.tweens.killTweensOf(this.logo);
        // Remove timers and event listeners
        this.time.removeAllEvents();
        (_a = this.physics.world) === null || _a === void 0 ? void 0 : _a.off("worldbounds"); // Remove specific listener
        // Destroy game objects
        (_b = this.logo) === null || _b === void 0 ? void 0 : _b.destroy();
        (_c = this.emitter) === null || _c === void 0 ? void 0 : _c.destroy();
        (_d = this.bg) === null || _d === void 0 ? void 0 : _d.destroy();
        // Nullify references
        this.logo = null;
        this.emitter = null;
        this.parent = null;
        this.bg = null;
    }
}
// Define static dimensions needed by EditorScene.createWindow
Example3.WIDTH = 360;
Example3.HEIGHT = 640;
// CONTAINER
export class Container extends Phaser.GameObjects.Container {
    constructor(scene, x, y, children, isExclusive) {
        super(scene || window.gameScene, x, y, children);
        // this.exclusive = isExclusive ? isExclusive : false;
        this.id = null;
        // this.on("addedtoscene", this.atCastAdded.bind(this));
        this.on("removedfromscene", this.atCastRemoved.bind(this));
    }
    set hitArea(rect) {
        // DRJ - can this be removed?
        this.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
        this.scene.physics.add.existing(this);
        this.body.setSize(rect.width, rect.height);
        this.body.setOffset(rect.x, rect.y);
    }
    get hitArea() {
        var _a, _b;
        return {
            height: ((_a = this.body) === null || _a === void 0 ? void 0 : _a.height) || 0,
            width: ((_b = this.body) === null || _b === void 0 ? void 0 : _b.width) || 0
        };
    }
    // DRJ - can probably remove
    set tint(t) {
        this.character && this.character.setTint(t);
    }
    addChildAt(gameObject, index) {
        super.addAt(gameObject, index);
    }
    addChild(gameObject) {
        super.add(gameObject);
    }
    removeChild(gameObject) {
        super.remove(gameObject, true);
    }
    atCastAdded(t) {
        console.log("[Container] atCastAdded");
        this.parentNode;
        this.castAdded(t);
    }
    atCastRemoved(t) {
        this.parentNode;
        this.castRemoved(t);
    }
    addedToScene(gameObject, scene) {
        this.castAdded(gameObject);
    }
    castAdded() {
        console.log("[Container] castAdded");
    }
    castRemoved(t) {
        console.log("[Container] castRemoved", t);
    }
    removeHandler(gameObject) {
        if (gameObject.displayList)
            gameObject.displayList.remove(gameObject);
    }
}
export class TitleScreen extends Container {
    // DRJ - layer does not have addChild method
    // class TitleScreen extends Phaser.GameObjects.Layer {
    constructor(scene, x = 0, y = 0) {
        super(scene || window.gameScene);
        var t = this;
        (t.gameStartBg = new Graphics(window.gameScene)),
            t.gameStartBg.fill(16777215, 0.2),
            t.gameStartBg.fillRect(0, 0, CONSTANTS.GAME_WIDTH, CONSTANTS.GAME_HEIGHT),
            (t.gameStartBg.visible = !1),
            (t.gameStartBg.alpha = 0),
            (t.stageNumList = []);
        for (var o = 0; o < 4; o++) {
            var n = "stageNum" + String(o + 1) + ".gif";
            // (n.scaleMode = PIXI.SCALE_MODES.NEAREST), (t.stageNumList[o] = n);
            t.stageNumList[o] = n;
        }
        (t.stageNum = new Sprite(scene, 0, CONSTANTS.GAME_HEIGHT / 2 - 20, "game_ui", "__BASE", true)),
            (t.stageNum.visible = !1);
        var a = "stageFight.gif";
        return (
        // (a.scaleMode = PIXI.SCALE_MODES.NEAREST),
        (t.stageFight = new Sprite(scene, 0, 0, "game_ui", a, true)),
            (t.stageFight.x = t.stageFight.width / 2),
            (t.stageFight.y =
                CONSTANTS.GAME_HEIGHT / 2 + t.stageFight.height / 2 - 20),
            (t.stageFight.visible = !1),
            t.stageFight.setOrigin(0.5),
            (t.stageClearBg = new Graphics(scene)),
            t.stageClearBg.fill(16777215, 0.4),
            t.stageClearBg.fillRect(0, 0, CONSTANTS.GAME_WIDTH, CONSTANTS.GAME_HEIGHT),
            (t.stageClearBg.visible = !1),
            (t.stageClearBg.alpha = 0),
            (t.stageClearText = new Sprite(scene, 0, 0, "game_ui", "stageclear.gif", true)),
            (t.stageClearText.x =
                CONSTANTS.GAME_WIDTH / 2 - t.stageClearText.width / 2),
            (t.stageClearText.y =
                CONSTANTS.GAME_HEIGHT / 2 - t.stageClearText.height),
            // DRJ - added
            (t.stageClearText.visible = !1),
            (t.stageClearText.alpha = 0),
            // (t.stageTimeoverBg = new PIXI.Graphics()),
            // t.stageTimeoverBg.beginFill(16777215, 0.4),
            // t.stageTimeoverBg.drawRect(0, 0, i.GAME_WIDTH, i.GAME_HEIGHT),
            // (t.stageTimeoverBg.visible = !1),
            // (t.stageTimeoverBg.alpha = 0),
            (t.stageTimeoverText = new Sprite(scene, 0, 0, "game_ui", "stageTimeover.gif")),
            // DRJ - visibility was originally set on parent, stageTimeoverBg
            (t.stageTimeoverText.visible = !1),
            (t.stageTimeoverText.alpha = 0),
            (t.stageTimeoverText.x =
                CONSTANTS.GAME_WIDTH / 2 - t.stageTimeoverText.width / 2),
            (t.stageTimeoverText.y =
                CONSTANTS.GAME_HEIGHT / 2 - t.stageTimeoverText.height),
            (t.knockoutK = new Sprite(window.gameScene, 0, 0, "game_ui", "knockoutK.gif", true)),
            (t.knockoutK.x = CONSTANTS.GAME_CENTER - t.knockoutK.width / 2),
            (t.knockoutK.y = CONSTANTS.GAME_MIDDLE),
            t.knockoutK.setOrigin(0.5),
            (t.knockoutK.visible = !1),
            (t.knockoutO = new Sprite(window.gameScene, 0, 0, "game_ui", "knockoutO.gif", true)),
            (t.knockoutO.x = CONSTANTS.GAME_CENTER + t.knockoutO.width / 2),
            (t.knockoutO.y = CONSTANTS.GAME_MIDDLE),
            t.knockoutO.setOrigin(0.5),
            (t.knockoutO.visible = !1),
            t);
    }
    gameStart(t) {
        var o, n, a = !1;
        4 == t
            ? ((n = 3),
                (a = !0),
                (o = new Graphics(window.gameScene)).fill(0, 1),
                o.fillRect(0, 0, CONSTANTS.GAME_WIDTH, CONSTANTS.GAME_HEIGHT),
                this.addChild(o))
            : // AudioManager.play("voice_another_fighter"))
                (n = t); //,
        (this.gameStartBg.visible = !0),
            this.stageNum.setTexture("game_ui", this.stageNumList[n]),
            (this.stageNum.visible = !0),
            (this.stageNum.alpha = 0),
            (this.stageFight.visible = !0),
            (this.stageFight.alpha = 0),
            this.stageFight.setScale(1.2);
        var s = new TimelineMax({
            onComplete: function () {
                (this.gameStartBg.visible = !1), this.emit(TitleScreen.EVENT_START);
            }.bind(this)
        });
        a &&
            s.to(o, 0.3, {
                alpha: 0
            }, "+=3"),
            s.to(this.gameStartBg, 0.3, {
                alpha: 1
            }),
            s.addCallback(function () {
                //   AudioManager.play(["voice_round" + n]);
            }, "+=0", null, this),
            s.to(this.stageNum, 0.3, {
                alpha: 1
            }),
            s.to(this.stageNum, 0.1, {
                delay: 1,
                alpha: 0
            }),
            s.to(this.stageFight, 0.2, {
                alpha: 1
            }, "-=0.1"),
            s.to(this.stageFight, 0.2, {
                scaleX: 1,
                scaleY: 1
            }, "-=0.2"),
            s.addCallback(function () {
                //   AudioManager.play("voice_fight");
            }, "+=0", null, this),
            s.to(this.stageFight, 0.2, {
                scaleX: 1.5,
                scaleY: 1.5
            }, "+=0.4"),
            s.to(this.stageFight, 0.2, {
                alpha: 0
            }, "-=0.2"),
            s.to(this.gameStartBg, 0.2, {
                alpha: 0
            }, "-=0.1");
    }
    akebonofinish() {
        (this.knockoutK.visible = !0),
            this.knockoutK.setScale(0),
            (this.knockoutO.visible = !0),
            this.knockoutO.setScale(0);
        var t = new TimelineMax();
        t.to(this.knockoutK, 0.4, {
            scaleX: 1,
            scaleY: 1,
            ease: Back.easeOut
        }),
            t.to(this.knockoutO, 0.4, {
                scaleX: 1,
                scaleY: 1,
                ease: Back.easeOut
            }, "-=0.25"); //,
        //   AudioManager.play("voice_ko"),
        //   AudioManager.play("se_finish_akebono");
    }
    stageClear() {
        // (this.stageClearBg.visible = !0),
        (this.stageClearText.visible = !0),
            // TweenMax.to(this.stageClearBg, 0.5, {
            TweenMax.to(this.stageClearText, 0.5, {
                delay: 0.3,
                alpha: 1
            });
    }
    timeover() {
        // (this.stageTimeoverBg.visible = !0),
        (this.stageTimeoverText.visible = !0),
            // TweenMax.to(this.stageTimeoverBg, 0.5, {
            TweenMax.to(this.stageTimeoverText, 0.5, {
                delay: 0.3,
                alpha: 1
            });
    }
    addedToScene(gameObject, scene) {
        this.scene.time.addEvent({
            callback: () => {
                this.addChild(this.gameStartBg),
                    // this.gameStartBg.addChild(this.stageNum),
                    // this.gameStartBg.addChild(this.stageFight),
                    this.addChild(this.stageClearBg),
                    // DRJ - need to decide what to do with Graphics that add children
                    this.addChild(this.stageClearText), // this.stageClearBg.addChild(this.stageClearText),
                    // this.addChild(this.stageTimeoverBg),
                    // DRJ - need to decide what to do with Graphics that add children
                    this.addChild(this.stageTimeoverText), // this.stageTimeoverBg.addChild(this.stageTimeoverText),
                    this.addChild(this.knockoutK),
                    this.addChild(this.knockoutO);
            }
        });
    }
}
TitleScreen.EVENT_START = "evenStart";
TitleScreen.EVENT_RESTART = "evenRestart";
export class Sprite extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, addToScene) {
        super(scene, x, y, texture, frame);
        this.setOrigin(0);
        if (addToScene)
            scene.add.existing(this);
    }
}
export class Button extends Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.on("addedtoscene", this.atCastAdded),
            this.on("removedfromscene", this.atCastRemoved);
    }
    atCastAdded(t) {
        this.castAdded();
    }
    atCastRemoved(t) {
        this.castRemoved();
    }
    castAdded() { }
    castRemoved() { }
    set interactive(bool) {
        bool ? super.setInteractive() : super.disableInteractive();
    }
}
// ContinueScene / TitleScene - BigNum
export class BigNum extends Container {
    constructor(t) {
        super();
        this.maxDigit = t;
        this.textureList = [];
        for (let i = 0; i <= 9; i++) {
            this.textureList[i] = "bigNum" + String(i) + ".gif";
        }
        this.numSpList = [];
        for (let n = 0; n < t; n++) {
            const a = new Sprite(this.scene, 0, 0, "game_ui", this.textureList[0]);
            a.x = (t - 1 - n) * (a.width - 1);
            this.addChild(a);
            this.numSpList[n] = a;
        }
    }
    setNum(t) {
        for (let e = String(t), o = 0; o < this.maxDigit; o++) {
            const i = e.substr(o, 1);
            i
                ? this.numSpList[e.length - 1 - o].setTexture("game_ui", this.textureList[Number(i)])
                : this.numSpList[o].setTexture("game_ui", this.textureList[0]);
        }
    }
    castAdded(t) { }
    castRemoved(t) { }
}
// ContinueScene - GotoTitleButton
export class GotoTitleButton extends Container {
    constructor(scene) {
        super();
        this.textureDefault = "gotoTitleBtn0.gif";
        this.textureOver = "gotoTitleBtn1.gif";
        this.textureDown = "gotoTitleBtn2.gif";
        this.btn = new Sprite(scene, 0, 0, "game_ui", this.textureDefault).setInteractive();
        this.addChild(this.btn);
        this.bindEvents();
    }
    onOver() {
        // AudioManager.play("se_over");
        this.btn.setTexture("game_ui", this.textureOver);
    }
    onOut() {
        this.btn.setTexture("game_ui", this.textureDefault);
    }
    onDown() {
        this.btn.setTexture("game_ui", this.textureDown);
    }
    onUp() {
        this.btn.disableInteractive();
        // AudioManager.play("se_correct");
        this.btn.setTexture("game_ui", this.textureDefault);
    }
    bindEvents() {
        this.onOverBound = this.onOver.bind(this);
        this.onOutBound = this.onOut.bind(this);
        this.onDownBound = this.onDown.bind(this);
        this.onUpBound = this.onUp.bind(this);
        this.btn.on("pointerover", this.onOverBound);
        this.btn.on("pointerout", this.onOutBound);
        this.btn.on("pointerdown", this.onDownBound);
        this.btn.on("pointerupoutside", this.onOutBound);
        this.btn.on("pointerup", this.onUpBound);
    }
    unbindEvents() {
        this.btn.off("pointerover", this.onOverBound);
        this.btn.off("pointerout", this.onOutBound);
        this.btn.off("pointerdown", this.onDownBound);
        this.btn.off("pointerupoutside", this.onOutBound);
        this.btn.off("pointerup", this.onUpBound);
    }
    castAdded() {
        super.castAdded();
        this.bindEvents();
    }
    castRemoved() {
        super.castRemoved();
        this.unbindEvents();
    }
}
// ContinueScene - NoButton
export class NoButton extends Button {
    constructor(scene) {
        super(scene, 0, 0, "game_ui", "continueNo.gif");
        this.textureDefault = "continueNo.gif";
        this.textureOver = "continueNoOver.gif";
        this.textureDown = "continueNoDown.gif";
        this.interactive = true;
        this.buttonMode = true;
    }
    onOver() {
        //   AudioManager.play("se_over");
        // this.texture = this.textureOver;
        this.setTexture("game_ui", this.textureOver);
    }
    onOut() {
        // this.texture = this.textureDefault;
        this.setTexture("game_ui", this.textureDefault);
    }
    onDown() {
        // this.texture = this.textureDown;
        this.setTexture("game_ui", this.textureDown);
    }
    onUp() {
        //   AudioManager.play("se_cursor");
        this.setTexture("game_ui", this.textureDefault);
    }
    castAdded() {
        this.on("pointerover", this.onOver.bind(this));
        this.on("pointerout", this.onOut.bind(this));
        this.on("pointerdown", this.onDown.bind(this));
        this.on("pointerupoutside", this.onOut.bind(this));
        this.on("pointerup", this.onUp.bind(this));
    }
    castRemoved() {
        this.off("pointerover", this.onOver.bind(this));
        this.off("pointerout", this.onOut.bind(this));
        this.off("pointerdown", this.onDown.bind(this));
        this.off("pointerupoutside", this.onOut.bind(this));
        this.off("pointerup", this.onUp.bind(this));
    }
}
// ContinueScene - YesButton
export class YesButton extends Button {
    constructor(scene) {
        super(scene, 0, 0, "game_ui", "continueYes.gif");
        this.textureDefault = "continueYes.gif";
        this.textureOver = "continueYesOver.gif";
        this.textureDown = "continueYesDown.gif";
        this.interactive = true;
        this.buttonMode = true;
    }
    onOver() {
        //   AudioManager.play("se_over");
        this.setTexture("game_ui", this.textureOver);
    }
    onOut() {
        this.setTexture("game_ui", this.textureDefault);
    }
    onDown() {
        this.setTexture("game_ui", this.textureDown);
    }
    onUp() {
        //   AudioManager.play("se_correct");
        this.setTexture("game_ui", this.textureDefault);
    }
    castAdded() {
        this.on("pointerover", this.onOver.bind(this));
        this.on("pointerout", this.onOut.bind(this));
        this.on("pointerdown", this.onDown.bind(this));
        this.on("pointerupoutside", this.onOut.bind(this));
        this.on("pointerup", this.onUp.bind(this));
    }
    castRemoved() {
        this.off("pointerover", this.onOver.bind(this));
        this.off("pointerout", this.onOut.bind(this));
        this.off("pointerdown", this.onDown.bind(this));
        this.off("pointerupoutside", this.onOut.bind(this));
        this.off("pointerup", this.onUp.bind(this));
    }
}
export class Scene extends Phaser.Scene {
    constructor(sceneKey) {
        super(sceneKey);
    }
    addChild(gameObj) {
        this.add.existing(gameObj);
    }
    removeChild(gameObj) {
        gameObj.disableInteractive();
        this.children.remove(gameObj);
    }
    addChildAt(gameObj, depth) {
        this.add.existing(gameObj);
        gameObj.setDepth(depth);
    }
    init() {
        this.events.once("shutdown", this.sceneRemoved, this);
    }
    nextScene() {
        this.scene.stop();
    }
    sceneRemoved() {
        console.log("[Scene] sceneRemoved()", this);
        // // Loop from the end
        let i = this.children.length - 1;
        while (i >= 0) {
            // Get child
            let child = this.children.list[i];
            // Check for image or sprite
            if (child.type === "Image" || child.type === "Sprite") {
                console.log("[Scene] child.destroy()", child);
                // Remove child
                child.destroy();
                // Remove all its tweens
                this.tweens.killTweensOf(child);
            }
            // Decrement
            i--;
        }
    }
}
export class Graphics extends Phaser.GameObjects.Graphics {
    constructor(scene) {
        super(scene);
    }
    fill(color, alpha) {
        super.fillStyle(color, alpha);
        return this;
    }
    fillRect(x, y, width, height) {
        this.rect = new Phaser.GameObjects.Rectangle(this.scene, x, y, width, height);
        super.fillRect(x, y, width, height);
        return this;
    }
    setInteractive(hitArea, callback, dropZone) {
        super.setInteractive(this.rect, Phaser.Geom.Rectangle.Contains, dropZone);
        return this;
    }
}
export class SpecialBtn extends Container {
    constructor() {
        super(window.gameScene, 0, 0, undefined, true);
        this.initProperties();
        this.initGraphics();
        this.initTimeline();
        this.initHitArea();
    }
    initProperties() {
        this.okFlg = false;
        this.isClear = false;
    }
    initGraphics() {
        // Background sprites
        this.hudCabtnBg1 = new Sprite(window.gameScene, 0, 0, "game_ui", "hudCabtnBg1.gif");
        this.hudCabtnBg1.setPosition(32, 32);
        this.hudCabtnBg1.alpha = 0;
        this.hudCabtnBg1.setOrigin(0.5);
        this.hudCabtnBg0 = new Sprite(window.gameScene, 0, 0, "game_ui", "hudCabtnBg0.gif");
        this.hudCabtnBg0.setPosition(-18, -18);
        this.hudCabtnBg0.alpha = 0;
        // Gauge bar and mask
        this.caGageBarBg = new Sprite(window.gameScene, 0, 0, "game_ui", "hudCabtn100per.gif");
        this.caGageBarMask = new Graphics(window.gameScene);
        this.caGageBarMask.fillRect(0, 0, 66, -66);
        this.caGageBarMask.setPosition(0, 66);
        this.caGageBarMask.scaleY = 0;
        this.caGageBar = new Sprite(window.gameScene, 0, 0, "game_ui", "hudCabtn0per.gif");
        this.caGageBar.setMask(this.caGageBarMask.createGeometryMask());
        // Overlay circle
        this.overCircle = new Graphics(window.gameScene);
        this.overCircle.fill(0xffffff);
        this.overCircle.fillCircle(33, 33, 28);
        this.overCircle.alpha = 0;
    }
    initTimeline() {
        this.timeline = new TimelineMax({ repeat: -1 });
        this.timeline
            .to(this.hudCabtnBg1, 0.4, { alpha: 1 })
            .to(this.hudCabtnBg1, 0.4, { alpha: 0 })
            .pause();
    }
    initHitArea() {
        this.hitArea = new Phaser.GameObjects.Rectangle(window.gameScene, 5, 5, this.caGageBarBg.width - 10, this.caGageBarBg.height - 12);
    }
    onOver() {
        TweenMax.to(this.overCircle, 0.1, { alpha: 0.65 });
        TweenMax.to(this.overCircle, 0.3, { delay: 0.1, alpha: 0 });
    }
    onDown() {
        const { x, y } = this;
        const shakePattern = [
            { x, y: y - 1 },
            { x: x - 1, y: y + 1 },
            { x: x + 1, y: y - 1 },
            { x, y }
        ];
        shakePattern.forEach((pos, i) => TweenMax.to(this, 0.001, Object.assign(Object.assign({}, pos), { delay: 0.05 * i })));
    }
    setPercent(percent) {
        this.caGageBarMask.scaleY = percent;
        if (percent >= 1 && !this.okFlg) {
            this.onPrepareOk();
            this.okFlg = true;
        }
    }
    onPrepareOk() {
        this.hudCabtnBg0.alpha = 1;
        this.hudCabtnBg1.alpha = 1;
        this.hudCabtnBg1.setScale(1.4);
        TweenMax.to(this.hudCabtnBg1, 0.5, { scaleX: 1, scaleY: 1 });
        this.timeline.resume();
        if (!this.isClear) {
            this.onActive();
        }
    }
    spFire() {
        this.onDeactive();
        this.okFlg = false;
        this.timeline.pause();
        this.hudCabtnBg1.alpha = 0;
        this.hudCabtnBg0.alpha = 0;
    }
    onActive() {
        this.interactive = true;
        this.buttonMode = true;
        this.on("pointerover", this.onOver.bind(this));
        this.on("pointerdown", this.onDown.bind(this));
    }
    onDeactive() {
        this.interactive = false;
        this.buttonMode = false;
        this.off("pointerover", this.onOver.bind(this));
        this.off("pointerdown", this.onDown.bind(this));
    }
    castAdded() {
        [
            this.hudCabtnBg1,
            this.hudCabtnBg0,
            this.caGageBarBg,
            this.caGageBarMask,
            this.caGageBar,
            this.overCircle
        ].forEach((child) => this.addChild(child));
    }
    setPosition(x, y) {
        super.setPosition(x, y);
        if (this.caGageBarMask) {
            this.caGageBarMask.setPosition(this.caGageBarMask.x + x, this.caGageBarMask.y + y);
        }
    }
    castRemoved() {
        [
            this.hudCabtnBg1,
            this.hudCabtnBg0,
            this.caGageBarBg,
            this.caGageBarMask,
            this.caGageBar,
            this.overCircle
        ].forEach((child) => this.removeChild(child));
    }
}
export class ScorePopover extends Container {
    constructor(score, multiplier) {
        super(window.gameScene, 0, 0);
        this.textureList = Array.from({ length: 10 }, (_, i) => `smallNum${i}.gif`);
        // Create score digits
        const scoreString = String(score);
        let offsetX = 0;
        scoreString.split("").forEach((digit, index) => {
            const sprite = new Sprite(window.gameScene, offsetX, 0, "game_ui", this.textureList[Number(digit)]);
            offsetX += sprite.width - 2;
            this.addChild(sprite);
        });
        // Create multiplier "x" symbol
        const multiplierSymbol = new Sprite(window.gameScene, offsetX + 8, 0, "game_ui", "smallNumKakeru.gif");
        this.addChild(multiplierSymbol);
        // Create multiplier digits
        const multiplierString = String(multiplier);
        offsetX = multiplierSymbol.x + multiplierSymbol.width + 1;
        multiplierString.split("").forEach((digit) => {
            const sprite = new Sprite(window.gameScene, offsetX, 0, "game_ui", this.textureList[Number(digit)]);
            offsetX += sprite.width - 1;
            this.addChild(sprite);
        });
    }
    castAdded() {
        // Empty implementation since Container handles adding children
    }
    castRemoved() {
        // Empty implementation since Container handles removing children
    }
}
export class ScoreNum extends Container {
    constructor(maxDigit) {
        super(window.gameScene, 0, 0);
        this.maxDigit = maxDigit;
        this.textureList = Array.from({ length: 10 }, (_, i) => `smallNum${i}.gif`);
        this.numSpList = [];
        for (let i = 0; i < maxDigit; i++) {
            const initialSprite = new Sprite(window.gameScene, 0, 0, "game_ui", this.textureList[0]);
            initialSprite.x = (maxDigit - 1 - i) * (initialSprite.width - 2);
            this.addChild(initialSprite);
            this.numSpList[i] = initialSprite;
        }
    }
    setNum(number) {
        const numString = String(number).padStart(this.maxDigit, "0");
        this.numSpList.forEach((sprite, index) => {
            const digit = numString[this.maxDigit - 1 - index];
            sprite.setTexture("game_ui", this.textureList[Number(digit)]);
            sprite.alpha = number.toString().length > index ? 1 : 0.5;
        });
    }
}
export class ComboNum extends Container {
    constructor(t) {
        super(window.gameScene, 0, 0);
        this.numTextureList = [];
        for (var e = 0; e <= 9; e++)
            this.numTextureList[e] = "comboNum" + String(e) + ".gif";
        this.nowDisplayNumList = [];
    }
    setNum(t) {
        if (this.nowDisplayNumList.length)
            for (var e = 0; e < this.nowDisplayNumList.length; e++)
                this.removeChild(this.nowDisplayNumList[e]);
        for (var o = String(t), i = 0; i < o.length; i++) {
            var n = o.substr(i, 1), a = new Sprite(window.gameScene, 0, 0, "game_ui", this.numTextureList[n]);
            (a.x = i * a.width), this.addChild(a), (this.nowDisplayNumList[i] = a);
        }
    }
}
// HUD
export class HUD extends Container {
    constructor() {
        super(window.gameScene, 0, 0);
        // Background
        this.hudBg = new Sprite(window.gameScene, 0, 0, "game_ui", "hudBg0.gif");
        this.hudDamageBg = new Sprite(window.gameScene, 0, 0, "game_ui", "hudBg1.gif");
        this.hudDamageBg.alpha = 0;
        // HP Bar
        this.hpBar = new Sprite(window.gameScene, 0, 0, "game_ui", "hpBar.gif");
        this.hpBar.x = 49;
        this.hpBar.y = 7;
        this.hpBar.scaleX = 0.5;
        // Special Button
        this.specialBtn = new SpecialBtn();
        this.specialBtn.alpha = 0.5;
        this.specialBtn.setPosition(CONSTANTS.GAME_WIDTH - 70, CONSTANTS.GAME_MIDDLE + 15);
        // Score
        this.scoreTitleTxt = new Sprite(window.gameScene, 0, 0, "game_ui", "smallScoreTxt.gif");
        this.scoreTitleTxt.x = 30;
        this.scoreTitleTxt.y = 25;
        this.scoreNumTxt = new ScoreNum(10);
        this.scoreNumTxt.x = this.scoreTitleTxt.x + this.scoreTitleTxt.width + 2;
        this.scoreNumTxt.y = this.scoreTitleTxt.y;
        this.scoreNumTxt.setNum(99);
        // Combo
        this.comboBar = new Sprite(window.gameScene, 0, 0, "game_ui", "comboBar.gif");
        this.comboBar.x = 149;
        this.comboBar.y = 32;
        this.comboNumTxt = new ComboNum(2);
        this.comboNumTxt.x = 194;
        this.comboNumTxt.y = 19;
        this.comboNumTxt.setNum(99);
        // Initial states
        this.comboTimeCnt = 0;
        this.comboFlg = false;
        this._scoreRatio = 0;
        this._scoreCount = 0;
        this._highScore = 0;
        this._comboCount = 0;
        this._maxComb = 0;
        this._spgageCount = 0;
        this.spgageFlg = false;
        this.spFireFlg = false;
        // Container for score popovers
        this.scoreViewWrap = new Container(window.gameScene);
    }
    onKeyUp(event) {
        switch (event.keyCode) {
            case 32: // Space key
                if (this.spgageFlg) {
                    this.spFire();
                }
                break;
        }
        event.preventDefault();
    }
    scoreView(target) {
        const popover = new ScorePopover(target.score, this._scoreRatio);
        this.scoreViewWrap.addChild(popover);
        // Position the popover over the target
        popover.x = Math.floor(target.body.x - target.body.width / 2);
        popover.y = Math.floor(target.body.y);
        TweenMax.to(popover, 0.8, {
            y: popover.y - 20,
            onComplete: () => {
                this.scoreViewWrap.removeChild(popover);
            },
            onCompleteScope: this
        });
    }
    // Game update loop
    update() {
        this.comboTimeCnt -= 0.1;
        if (this.comboTimeCnt <= 0) {
            this.comboTimeCnt = 0;
            if (this.comboFlg === true) {
                this.comboCount = 0;
                this.comboFlg = false;
            }
        }
        // Update the combo bar scale based on time left
        this.comboBar.scaleX = this.comboTimeCnt / 100;
    }
    spPrepareOk() {
        const timeline = new TimelineMax();
        timeline
            .to(this.hpBar, 0.1, {
            tint: 0xff0000,
            ease: Linear.easeNone
        })
            .to(this.hpBar, 0.4, {
            tint: 0xffffff,
            ease: Linear.easeNone
        });
        this.spgageFlg = true;
    }
    spFire() {
        if (this.spgageFlg) {
            // Reset special gauge
            this.spgageCount = 0;
            this.spgageFlg = false;
            this.specialBtn.spFire();
            this.emit(HUD.CUSTOM_EVENT_SP_FIRE);
        }
    }
    onDamage(scaleValue) {
        TweenMax.to(this.hpBar, 0.5, {
            scaleX: scaleValue
        });
        const timeline = new TimelineMax();
        timeline
            .to(this.hudDamageBg, 0.1, { alpha: 1 })
            .to(this.hudDamageBg, 0.1, { alpha: 0 }, "+=0.1")
            .to(this.hudDamageBg, 0.1, { alpha: 1 }, "+=0.1")
            .to(this.hudDamageBg, 0.1, { alpha: 0 }, "+=0.1")
            .to(this.hpBar, 0.1, { tint: 0xff0000, ease: Linear.easeNone }, "-=0.7")
            .to(this.hpBar, 0.4, { tint: 0xffffff, ease: Linear.easeNone }, "-=0.6");
    }
    recovery(scaleValue) {
        TweenMax.to(this.hpBar, 1, { scaleX: scaleValue });
    }
    specialBtnActive() {
        this.specialBtn.onActive();
        this.specialBtn.on("pointerup", this.spFire.bind(this));
        this.onKeyUpListener = this.onKeyUp.bind(this);
        document.addEventListener("keyup", this.onKeyUpListener);
    }
    specialBtnDeactive(isClear = false) {
        if (isClear) {
            this.specialBtn.isClear = true;
        }
        this.specialBtn.onDeactive();
        this.specialBtn.off("pointerup", this.spFire.bind(this));
        if (this.onKeyUpListener) {
            document.removeEventListener("keyup", this.onKeyUpListener);
        }
    }
    setPercent(value) {
        this.hpBar.scaleX = value;
    }
    castAdded() {
        this.spgageFlg = false;
        this.spFireFlg = false;
        this.comboTimeCnt = 0;
        this.addChild(this.hudBg);
        this.addChild(this.hudDamageBg);
        this.addChild(this.hpBar);
        this.addChild(this.specialBtn);
        this.addChild(this.scoreTitleTxt);
        this.addChild(this.scoreNumTxt);
        this.addChild(this.comboBar);
        this.addChild(this.comboNumTxt);
        this.addChildAt(this.scoreViewWrap, 5);
        this.onKeyUpListener = this.onKeyUp.bind(this);
    }
    castRemoved() {
        this.removeChild(this.hudBg);
        this.removeChild(this.hudDamageBg);
        this.removeChild(this.hpBar);
        this.removeChild(this.specialBtn);
        this.removeChild(this.scoreTitleTxt);
        this.removeChild(this.scoreNumTxt);
        this.removeChild(this.comboBar);
        this.removeChild(this.comboNumTxt);
        this.removeChild(this.scoreViewWrap);
        this.onKeyUpListener = null;
    }
    get spgageCount() {
        return this._spgageCount;
    }
    set spgageCount(value) {
        if (!this.spFireFlg) {
            if (value === 0) {
                this._spgageCount = 0;
            }
            else {
                this._spgageCount += value;
            }
            if (this._spgageCount >= 100) {
                this._spgageCount = 100;
                if (!this.spgageFlg) {
                    this.spPrepareOk();
                }
            }
            this.specialBtn.setPercent(this._spgageCount / 100);
        }
    }
    get scoreCount() {
        return this._scoreCount;
    }
    set scoreCount(value) {
        this._scoreRatio = Math.ceil(this._comboCount / 10);
        if (this._scoreRatio <= 1) {
            this._scoreRatio = 1;
        }
        if (value === 0) {
            this._scoreCount = 0;
        }
        else {
            this._scoreCount += value * this._scoreRatio;
        }
        this.scoreNumTxt.setNum(this._scoreCount);
        if (this._highScore < this._scoreCount) {
            this._highScore = this._scoreCount;
        }
    }
    get highScore() {
        return this._highScore;
    }
    set highScore(value) {
        this._highScore = value;
    }
    get comboCount() {
        return this._comboCount;
    }
    set comboCount(value) {
        if (value === 0) {
            this._comboCount = 0;
        }
        else {
            this.comboTimeCnt = 100;
            this._comboCount += value;
            this.comboFlg = true;
        }
        this.comboNumTxt.setNum(this._comboCount);
        if (this._comboCount >= this._maxComb) {
            this._maxComb = this._comboCount;
        }
    }
    get maxCombCount() {
        return this._maxComb;
    }
    set maxCombCount(value) {
        this._maxComb = value;
    }
}
HUD.CUSTOM_EVENT_SP_FIRE = "customEventSpFire";
export class Character extends Phaser.GameObjects.Sprite {
    constructor(characterTextures, opts = {
        autoPlay: true,
        physics: true
    }) {
        super(opts.scene || window.gameScene, 0, 0, opts.texture || "game_asset", characterTextures[0]);
        _frameRate.set(this, null);
        _repeat.set(this, null);
        this.speed = 0;
        this.deadFlg = 0;
        // if 2nd param is Array convert it
        if (Array.isArray(opts)) {
            opts = {
                explosionTextures: opts,
                autoPlay: true,
                physics: true
            };
        }
        if (void 0 !== opts.explosionTextures) {
            this.explosion = new Character(opts.explosionTextures, {
                autoPlay: false,
                physics: false
            });
            var n = this.height / this.explosion.height;
            n >= 1 && (n = 1),
                this.explosion.setScale(n + 0.2),
                (this.explosion.animationSpeed = 0.4),
                (this.explosion.loop = !1);
        }
        this.anims.create({
            key: "default",
            frames: [
                ...characterTextures.map((k) => {
                    return { key: opts.texture || "game_asset", frame: k };
                })
            ],
            frameRate: opts.frameRate || 6,
            repeat: -1,
            hideOnComplete: true,
            showOnStart: true
        });
        if (opts.autoPlay) {
            this.on("addedtoscene", (gameObject) => {
                this.scene.time.addEvent({
                    callback: () => {
                        this.castAdded(gameObject);
                    }
                });
            });
        }
        if (opts.physics)
            this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
    }
    castAdded() {
        this.play();
    }
    set animationSpeed(percentOfSixty) {
        this.frameRate = 60 * percentOfSixty;
    }
    set loop(bool) {
        this.repeat = Boolean(bool);
    }
    play(key = "default") {
        if (!this.anims)
            return;
        if (this.frameRate != null || this.repeat != null) {
            let animConfig = { key };
            if (this.frameRate != null)
                animConfig.frameRate = this.frameRate;
            if (this.repeat != null)
                animConfig.repeat = this.repeat ? -1 : 0;
            super.play(animConfig);
        }
        else {
            super.play(key);
        }
    }
}
_frameRate = new WeakMap(), _repeat = new WeakMap();
Character.CUSTOM_EVENT_DEAD = "customEventdead";
Character.CUSTOM_EVENT_DEAD_COMPLETE = "customEventdeadComplete";
Character.CUSTOM_EVENT_PROJECTILE_ADD = "customEventprojectileadd";
export class Item extends Character {
    constructor(t) {
        super(t);
        var o = this;
        return (o.animationSpeed = 0.08), o;
    }
}
export class Enemy extends Character {
    constructor(opts) {
        // super(opts.texture, opts.explosion);
        super(opts.texture, {
            explosionTextures: opts.explosion,
            texture: opts.textureKey || "game_asset",
            autoPlay: true,
            physics: true
        });
        this.name = opts.name;
        this.interval = opts.interval;
        this.score = opts.score;
        this.hp = opts.hp;
        this.speed = opts.speed;
        this.specialgage = opts.cagage;
        this.projectileData = opts.projectileData;
        this.itemName = opts.itemName;
        this.itemTexture = opts.itemTexture;
        this.bulletFrameCnt = 0;
        this.shootFlg = true;
        this.disableAutoShooting = false;
        this.interval <= -1 && (this.disableAutoShooting = 1);
        this.deadFlg = 0;
    }
    update() {
        switch ((this.bulletFrameCnt++,
            this.shootFlg &&
                !this.disableAutoShooting &&
                this.bulletFrameCnt % this.interval == 0 &&
                this.shoot(),
            (this.y += this.speed),
            this.name)) {
            case "invaderGold":
                this.y >= CONSTANTS.GAME_HEIGHT / 1.5 &&
                    (this.x += 0.005 * (PROPERTIES.player.x - this.x));
                break;
            case "flirtyGirl":
            case "stickman":
                this.y <= 10 &&
                    (this.x >= this.width / 2 + CONSTANTS.GAME_WIDTH / 2
                        ? ((this.x =
                            this.x >= this.width / 2 + CONSTANTS.GAME_WIDTH
                                ? CONSTANTS.GAME_WIDTH
                                : this.x),
                            (this.posName = "right"))
                        : ((this.x = this.x <= this.width / 2 ? -this.width : this.x),
                            (this.posName = "left"))),
                    this.y >= CONSTANTS.GAME_HEIGHT / 3 &&
                        ("right" == this.posName
                            ? (this.x -= 1)
                            : "left" == this.posName && (this.x += 1));
        }
    }
    shoot() {
        this.emit(Character.CUSTOM_EVENT_PROJECTILE_ADD);
    }
    onDamage(t) {
        "infinity" == this.hp
            ? // ? (TweenMax.to(this, 0.05, {
                //   filters: [this.whitefilter],
                // }),
                //   TweenMax.to(this, 0.3, {
                //     delay: 0.1,
                //     filters: null,
                //   }))
                undefined
            : this.deadFlg ||
                ((this.hp -= t),
                    this.hp <= 0
                        ? (this.dead.bind(this)(), (this.deadFlg = !0))
                        : (TweenMax.to(this, 0.1, {
                            tint: 16711680
                        }),
                            TweenMax.to(this, 0.1, {
                                delay: 0.1,
                                tint: 16777215
                            })));
    }
    dead() {
        "infinity" == this.hp ||
            (this.emit(Character.CUSTOM_EVENT_DEAD),
                (this.shootFlg = !1),
                this.explosion.on("animationcomplete", this.explosionComplete.bind(this)),
                (this.explosion.x = this.x),
                (this.explosion.y = this.y),
                this.explosion.play(),
                this.destroy());
        // AudioManager.stop("se_damage"),
        // AudioManager.play("se_explosion"));
    }
    explosionComplete() {
        this.explosion.destroy(), this.emit(Character.CUSTOM_EVENT_DEAD_COMPLETE);
    }
}
export class Boss extends Character {
    constructor(opts) {
        super(opts.anim.idle, opts.explosion);
        this.scene.physics.add.existing(this);
        this.scene.time.addEvent({
            callback: () => {
                this.scene.updateBody(this);
            }
        });
        Object.keys(opts.anim).forEach((key) => {
            this.anims.create({
                key,
                frames: opts.anim[key].map((frame) => ({
                    key: "game_asset",
                    frame
                })),
                frameRate: 6,
                repeat: -1
            });
        });
        this.name = "boss";
        this.interval = opts.interval;
        this.score = opts.score;
        this.hp = opts.hp;
        this.cagage = opts.cagage;
        this.animList = opts.anim;
        this.projectileData = opts.projectileData;
        this.shootOn = 1;
        this.bulletFrameCnt = 0;
        this.moveFlg = 0;
        this.deadFlg = 0;
    }
    shoot() {
        this.emit(Character.CUSTOM_EVENT_PROJECTILE_ADD);
        // AudioManager.play("se_shoot");
    }
    onTheWorld(t) {
        // DRJ - added.  fixes Pyramid and Trump not having tlShoot defined
        //  when shootStart has not been called yet
        if (typeof this.tlShoot === "undefined")
            return;
        t ? this.tlShoot.pause() : this.hp >= 1 && this.tlShoot.resume();
    }
    onDamage(t) {
        this.deadFlg ||
            ((this.hp -= t),
                this.hp <= 0
                    ? (this.dead.bind(this)(), (this.deadFlg = !0))
                    : (TweenMax.isTweening(this) &&
                        TweenMax.killTweensOf(this, {
                            tint: !0
                        }),
                        TweenMax.to(this, 0.1, {
                            tint: 16773120
                        }),
                        TweenMax.to(this, 0.1, {
                            delay: 0.2,
                            tint: 16777215
                        }))); //,
        // this.hp <= PROPERTIES.caDamage &&
        // (this.dengerousFlg ||
        //   (this.unit.addChild(this.dengerousBalloon),
        //     this.dengerousBalloon.play(),
        //     // TweenMax.to(this.dengerousBalloon.scale, 1, {
        //     TweenMax.to(this.dengerousBalloon, 1, {
        //       // x: 1,
        //       scaleX: 1,
        //       // y: 1,
        //       scaleY: 1,
        //       ease: Elastic.easeOut,
        //     }),
        //     (this.dengerousFlg = !0)))));
    }
    dead() {
        if (this.hp <= 0) {
            this.gokiFlg || this.emit(Character.CUSTOM_EVENT_DEAD),
                this.stop(),
                // this.shadow.stop(),
                (this.explotionCnt = 0); //,
            // AudioManager.stop("se_damage");
            for (var t = 0; t < 5; t++)
                TweenMax.delayedCall(0.25 * t, function () {
                    var t = this.explosion;
                    t.setScale(1),
                        (t.animationSpeed = 0.15),
                        (t.loop = !1),
                        t.on("animationcomplete", this.explosionComplete.bind(this, t)),
                        (t.x = this.x + Math.random() * this.width - t.width / 2),
                        (t.y = this.y + Math.random() * this.height - t.height / 2),
                        // this.addChild(t),
                        t.play(); //,
                    // AudioManager.play("se_explosion");
                }, null, this);
            var e = this.x, o = this.y;
            new TimelineMax()
                .call(function () {
                (this.x = e + 4), (this.y = o + -2);
            }, null, this, "+=0.0")
                .call(function () {
                (this.x = e + -3), (this.y = o + 1);
            }, null, this, "+=0.08")
                .call(function () {
                (this.x = e + 2), (this.y = o + -1);
            }, null, this, "+=0.07")
                .call(function () {
                (this.x = e + -2), (this.y = o + 1);
            }, null, this, "+=0.05")
                .call(function () {
                (this.x = e + 1), (this.y = o + 1);
            }, null, this, "+=0.05")
                .call(function () {
                (this.x = e + 0), (this.y = o + 0);
            }, null, this, "+=0.04")
                .call(function () {
                (this.x = e + 4), (this.y = o + -2);
            }, null, this, "+=0.0")
                .call(function () {
                (this.x = e + -3), (this.y = o + 1);
            }, null, this, "+=0.08")
                .call(function () {
                (this.x = e + 2), (this.y = o + -1);
            }, null, this, "+=0.07")
                .call(function () {
                (this.x = e + -2), (this.y = o + 1);
            }, null, this, "+=0.05")
                .call(function () {
                (this.x = e + 1), (this.y = o + 1);
            }, null, this, "+=0.05")
                .call(function () {
                (this.x = e + 0), (this.y = o + 0);
            }, null, this, "+=0.04")
                .to(this, 1, {
                delay: 0.5,
                alpha: 0
            }),
                this.onDead();
        }
    }
    explosionComplete(t) {
        // this.removeChild(t),
        t.destroy(), 4 == this.explotionCnt && this.destroy(), this.explotionCnt++;
    }
    castAdded() {
        let x = CONSTANTS.GAME_WIDTH / 2 - this.width / 2;
        this.x = x;
        (this.y = -298), (this.moveFlg = 1);
    }
}
export class MonkeyBrain extends Boss {
    constructor(t) {
        super(t);
        var o = this;
        // if ("object" !== typeof t.anim.idle[0]) {
        // for (var i = 0; i < t.anim.idle.length; i++) {
        //   var n = PIXI.Texture.fromFrame(t.anim.idle[i]);
        //   t.anim.idle[i] = n;
        // }
        // for (var a = 0; a < t.anim.wait.length; a++) {
        //   var s = PIXI.Texture.fromFrame(t.anim.wait[a]);
        //   t.anim.wait[a] = s;
        // }
        // for (var r = 0; r < t.anim.charge.length; r++) {
        //   var h = PIXI.Texture.fromFrame(t.anim.charge[r]);
        //   t.anim.charge[r] = h;
        // }
        // for (var l = 0; l < t.anim.shoot.length; l++) {
        //   var u = PIXI.Texture.fromFrame(t.anim.shoot[l]);
        //   t.anim.shoot[l] = u;
        // }
        // for (var c = 0; c < t.projectileDataA.texture.length; c++)
        //   t.projectileDataA.texture[c] = PIXI.Texture.fromFrame(t.projectileDataA.texture[c]);
        (t.projectileDataA.name = "beam"), (t.projectileDataA.cnt = 0);
        // for (var f = 0; f < t.projectileDataB.texture.length; f++)
        //   t.projectileDataB.texture[f] = PIXI.Texture.fromFrame(t.projectileDataB.texture[f]);
        (t.projectileDataB.name = "smoke"), (t.projectileDataB.cnt = 0);
        // for (var d = 0; d < t.projectileDataC.texture.length; d++)
        //   t.projectileDataC.texture[d] = PIXI.Texture.fromFrame(t.projectileDataC.texture[d]);
        (t.projectileDataC.name = "meka"), (t.projectileData = t.projectileDataA);
        // }
        return (
        // (o.hitArea = new PIXI.Rectangle(
        //   window.gameScene,
        //   35,
        //   55,
        //   // o.width - 70,
        //   // o.height - 70
        //   o.width - 70,
        //   o.height - 70
        // )),
        // (o.dengerousBalloon.x = 70),
        // (o.dengerousBalloon.y = 40),
        (o.projectileDataA = t.projectileDataA),
            (o.projectileDataB = t.projectileDataB),
            (o.projectileDataC = t.projectileDataC),
            // o.removeChild(o.shadow),
            o);
    }
    update() {
        this.moveFlg
            ? (this.y >= 48 && (this.moveFlg = !1), (this.y += 0.7))
            : (this.shootOn &&
                this.bulletFrameCnt % this.interval == 0 &&
                ((this.shootOn = !1),
                    // AudioManager.play("boss_fang_voice_add"),
                    TweenMax.delayedCall(1, function () {
                        this.shootStart();
                    }.bind(this))),
                this.bulletFrameCnt++);
    }
    shootStart() {
        this.tlShoot && this.tlShoot.kill(),
            (this.tlShoot = new TimelineMax({
                delay: 0.5,
                onComplete: this.shootStart,
                onCompleteScope: this
            }));
        var t = Math.random();
        t >= 0 && 0.3 >= t
            ? ((this.projectileData = this.projectileDataA),
                this.tlShoot.addCallback(this.onCharge, "+=0", null, this),
                this.tlShoot.addCallback(this.onShoot, "+=0.5", null, this),
                this.tlShoot.addCallback(this.onBeamVoice2, "+=0.0", null, this),
                this.tlShoot.addCallback(this.onShoot, "+=0.5", null, this),
                this.tlShoot.addCallback(this.onBeamVoice2, "+=0.0", null, this),
                this.tlShoot.addCallback(this.onShoot, "+=0.5", null, this),
                this.tlShoot.addCallback(this.onBeamVoice2, "+=0.0", null, this),
                this.tlShoot.addCallback(this.onIdle, "+=0.3", null, this),
                this.tlShoot.addCallback(function () { }, "+=1", null, this))
            : t >= 0.31 && 0.7 >= t
                ? ((this.projectileData = this.projectileDataC),
                    // AudioManager.play("boss_fang_voice_beam1"),
                    this.tlShoot.addCallback(this.shoot, "+=0.0", null, this),
                    this.tlShoot.addCallback(this.onWait, "+=0.5", null, this),
                    this.tlShoot.addCallback(function () { }, "+=4", null, this))
                : t >= 0.71 &&
                    1 >= t &&
                    ((this.projectileData = this.projectileDataB),
                        this.tlShoot.addCallback(this.onSmoke, "+=0", null, this),
                        this.tlShoot.addCallback(this.onWait, "+=1.0", null, this),
                        this.tlShoot.addCallback(this.shoot, "+=0.3", null, this),
                        this.tlShoot.addCallback(this.shoot, "+=0.3", null, this),
                        this.tlShoot.addCallback(this.shoot, "+=0.3", null, this),
                        this.tlShoot.addCallback(this.shoot, "+=0.3", null, this),
                        this.tlShoot.addCallback(this.shoot, "+=0.3", null, this),
                        this.tlShoot.addCallback(this.shoot, "+=0.3", null, this),
                        this.tlShoot.addCallback(this.shoot, "+=0.3", null, this),
                        this.tlShoot.addCallback(this.shoot, "+=0.3", null, this),
                        this.tlShoot.addCallback(this.shoot, "+=0.3", null, this),
                        this.tlShoot.addCallback(this.shoot, "+=0.3", null, this),
                        this.tlShoot.addCallback(this.shoot, "+=0.3", null, this),
                        this.tlShoot.addCallback(this.shoot, "+=0.3", null, this),
                        this.tlShoot.addCallback(function () { }, "+=7", null, this));
    }
    onCharge() {
        // (this.character.textures = this.animList.charge),
        //   (this.shadow.textures = this.animList.charge),
        //   this.character.play(),
        //   this.shadow.play();
        this.play("charge");
    }
    onBeamVoice2() {
        // AudioManager.play("boss_fang_voice_beam0");
    }
    onBeamVoice() {
        // AudioManager.play("boss_fang_voice_beam1");
    }
    onShoot() {
        // (this.character.textures = this.animList.shoot),
        //   (this.shadow.textures = this.animList.shoot),
        //   this.character.play(),
        //   this.shadow.play(),
        //   this.shoot(),
        //   (this.character.loop = !1),
        //   (this.shadow.loop = !1);
        this.loop = 0;
        this.play("shoot");
        this.shoot();
    }
    onSmoke() {
        // AudioManager.play("boss_fang_voice_tama");
    }
    onIdle() {
        // (this.character.textures = this.animList.idle),
        //   (this.shadow.textures = this.animList.idle),
        //   this.character.play(),
        //   this.shadow.play(),
        //   (this.character.loop = !0),
        //   (this.shadow.loop = !0);
        this.loop = 1;
        this.play("idle");
    }
    onWait() {
        // (this.character.textures = this.animList.wait),
        //   (this.shadow.textures = this.animList.wait),
        //   this.character.play(),
        //   this.shadow.play(),
        //   (this.character.loop = !0),
        //   (this.shadow.loop = !0);
        this.loop = 1;
        this.play("wait");
    }
    onDead() {
        // this.tlShoot && (this.tlShoot.pause(), this.tlShoot.kill()),
        //   AudioManager.play("boss_fang_voice_ko");
        this.tlShoot && (this.tlShoot.pause(), this.tlShoot.kill()); //,
        // AudioManager.play("boss_fang_voice_ko");
    }
    castAdded(t) {
        super.castAdded(t), (this.tlShoot = new TimelineMax()), (this.y = -249);
    }
    castRemoved(t) {
        super.castRemoved(t),
            this.tlShoot && (this.tlShoot.pause(), this.tlShoot.kill());
    }
}
export class Trump extends Boss {
    constructor(t) {
        super(t);
        var o = this;
        // if ("object" !== typeof t.anim.idle[0]) {
        // for (var i = 0; i < t.anim.idle.length; i++) {
        //   var n = PIXI.Texture.fromFrame(t.anim.idle[i]);
        //   t.anim.idle[i] = n;
        // }
        // for (var a = 0; a < t.anim.syngoku.length; a++) {
        //   var s = PIXI.Texture.fromFrame(t.anim.syngoku[a]);
        //   t.anim.syngoku[a] = s;
        // }
        // for (var r = 0; r < t.anim.syngokuFinish.length; r++) {
        //   var h = PIXI.Texture.fromFrame(t.anim.syngokuFinish[r]);
        //   t.anim.syngokuFinish[r] = h;
        // }
        // for (var l = 0; l < t.anim.syngokuFinishTen.length; l++) {
        //   var u = PIXI.Texture.fromFrame(t.anim.syngokuFinishTen[l]);
        //   t.anim.syngokuFinishTen[l] = u;
        // }
        // for (var c = 0; c < t.anim.shootA.length; c++) {
        //   var f = PIXI.Texture.fromFrame(t.anim.shootA[c]);
        //   t.anim.shootA[c] = f;
        // }
        // for (var d = 0; d < t.anim.shootB.length; d++) {
        //   var p = PIXI.Texture.fromFrame(t.anim.shootB[d]);
        //   t.anim.shootB[d] = p;
        // }
        // for (var m = 0; m < t.projectileDataA.texture.length; m++)
        //   t.projectileDataA.texture[m] = PIXI.Texture.fromFrame(t.projectileDataA.texture[m]);
        // for (var y = 0; y < t.projectileDataB.texture.length; y++)
        //   t.projectileDataB.texture[y] = PIXI.Texture.fromFrame(t.projectileDataB.texture[y]);
        t.projectileData = t.projectileDataA;
        // }
        (t.projectileDataA.explosion = t.explosion),
            (t.projectileDataB.explosion = t.explosion),
            o.body.setSize(44, 88),
            o.body.setOffset(32, 16),
            // (o.unit.hitArea = new PIXI.Rectangle(
            //   window.gameScene,
            //   15,
            //   20,
            //   // o.unit.width - 30,
            //   // o.unit.height - 24
            //   o.character.width - 30,
            //   o.character.height - 24
            // )),
            // (o.dengerousBalloon.x = 5),
            // (o.dengerousBalloon.y = 20),
            (o.projectileDataA = t.projectileDataA),
            (o.projectileDataB = t.projectileDataB),
            (o.shungokuHitEffectTextureList = []);
        for (var g = 0; g < 5; g++)
            o.shungokuHitEffectTextureList[g] = "hit" + String(g) + ".png";
        return o;
    }
    update() { }
    shootStart() {
        this.tlShoot && this.tlShoot.kill();
        var t = PROPERTIES.player, 
        // e = this.width - this.hitArea.width,
        e = this.width - this.body.width, o = t.x + t.width / 2 - this.width / 2;
        o - e / 2 <= -e / 2 && (o = -e / 2),
            // o >= CONSTANTS.GAME_WIDTH - this.hitArea.width - e / 2 &&
            //   (o = CONSTANTS.GAME_WIDTH - this.hitArea.width - e / 2),
            o >= CONSTANTS.GAME_WIDTH - this.body.width - e / 2 &&
                (o = CONSTANTS.GAME_WIDTH - this.body.width - e / 2),
            (this.tlShoot = new TimelineMax({
                delay: 0.5,
                onComplete: this.shootStart,
                onCompleteScope: this
            }));
        var n = Math.random();
        if (n >= 0 && 0.34 >= n)
            this.tlShoot.to(this, 0.4, {
                x: o
            }),
                this.tlShoot.addCallback(this.onShootA, "+=0", null, this),
                this.tlShoot.addCallback(function () {
                    (this.projectileData = this.projectileDataA),
                        // AudioManager.play("boss_goki_voice_tama0"),
                        this.shoot();
                }, "+=0.75", null, this),
                this.tlShoot.addCallback(this.onShootA, "+=0", null, this),
                this.tlShoot.addCallback(function () {
                    (this.projectileData = this.projectileDataA), this.shoot();
                }, "+=0.75", null, this),
                this.tlShoot.addCallback(this.onShootA, "+=0", null, this),
                this.tlShoot.addCallback(function () {
                    (this.projectileData = this.projectileDataA),
                        // AudioManager.play("boss_goki_voice_tama0"),
                        this.shoot();
                }, "+=0.75", null, this),
                this.tlShoot.addCallback(this.onShootA, "+=0", null, this),
                this.tlShoot.addCallback(function () {
                    (this.projectileData = this.projectileDataA), this.shoot();
                }, "+=0.75", null, this),
                this.tlShoot.addCallback(this.onShootA, "+=0", null, this),
                this.tlShoot.addCallback(function () {
                    (this.projectileData = this.projectileDataA),
                        // AudioManager.play("boss_goki_voice_tama0"),
                        this.shoot();
                }, "+=0.75", null, this),
                this.tlShoot.addCallback(this.onShootA, "+=0", null, this),
                this.tlShoot.addCallback(function () {
                    (this.projectileData = this.projectileDataA), this.shoot();
                }, "+=0.75", null, this),
                // this.tlShoot.addCallback(this.onIdle, "+=0.3", null, this);
                this.tlShoot.addCallback(this.onIdle, "+=0.73", null, this);
        else if (n >= 0.35 && 0.64 >= n)
            this.tlShoot.to(this, 0.4, {
                x: o
            }),
                this.tlShoot.addCallback(this.onShootB, "+=0", null, this),
                this.tlShoot.addCallback(function () {
                    (this.projectileData = this.projectileDataB), this.shoot();
                }, "+=0.4", null, this),
                this.tlShoot.addCallback(this.onIdle, "+=0.8", null, this);
        else if (n >= 0.65 && 0.89 >= n)
            this.tlShoot.addCallback(this.ashuraSenku, "+=0.4", null, this),
                this.tlShoot.to(this, 1.2, {
                    y: CONSTANTS.GAME_HEIGHT - this.height + 80
                }),
                this.tlShoot.to(this, 0.7, {
                    x: Math.random() * (CONSTANTS.GAME_WIDTH - this.width),
                    y: CONSTANTS.GAME_HEIGHT / 4
                }, "+=0.2"),
                this.tlShoot.addCallback(this.onIdle, "+=0.3", null, this);
        else if (n >= 0.9 && 1 >= n) {
            var a = Math.random > 0.5 ? 60 : CONSTANTS.GAME_HEIGHT / 4;
            this.tlShoot.addCallback(this.ashuraSenku, "+=0", null, this),
                this.tlShoot.to(this, 0.7, {
                    x: Math.random() * (CONSTANTS.GAME_WIDTH - this.width),
                    y: a
                }),
                this.tlShoot.addCallback(this.onIdle, "+=0.3", null, this);
        }
    }
    onIdle() {
        // (this.character.textures = this.animList.idle),
        //   (this.shadow.textures = this.animList.idle),
        //   this.character.play(),
        //   this.shadow.play();
        this.play("idle");
    }
    onShootA() {
        // (this.character.textures = this.animList.shootA),
        //   (this.shadow.textures = this.animList.shootA),
        //   this.character.play(),
        //   this.shadow.play(),
        //   (this.character.loop = !1),
        //   (this.shadow.loop = !1);
        this.play("shootA");
    }
    onShootB() {
        // (this.character.textures = this.animList.shootB),
        //   (this.shadow.textures = this.animList.shootB),
        //   this.character.play(),
        //   this.shadow.play(),
        //   (this.character.loop = !1),
        //   (this.shadow.loop = !1),
        //   AudioManager.play("boss_goki_voice_tama1");
        this.loop = 0;
        this.once("animationcomplete", () => {
            this.loop = 1;
            this.play("idle");
        }).play("shootB");
    }
    ashuraSenku() {
        // (this.character.textures = this.animList.syngoku),
        //   (this.shadow.textures = this.animList.syngoku),
        //   this.character.play(),
        //   this.shadow.play(),
        //   (this.character.loop = !1),
        //   (this.shadow.loop = !1),
        //   AudioManager.play("boss_goki_voice_ashura");
        this.loop = 0;
        this.once("animationcomplete", () => {
            this.scene.time.addEvent({
                callback: () => {
                    this.loop = 1;
                    this.play("idle");
                },
                delay: 1200
            });
        }).play("syngoku");
    }
    toujou() {
        // AudioManager.play("boss_goki_voice_add");
    }
    shungokusatsu(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        // AudioManager.play("boss_goki_voice_syungokusatu0");
        var o = window.gameScene.add.graphics();
        // o.beginFill(0),
        o.fill(0),
            // o.drawRect(0, 0, CONSTANTS.GAME_WIDTH, CONSTANTS.GAME_HEIGHT),
            o.fillRect(0, 0, CONSTANTS.GAME_WIDTH, CONSTANTS.GAME_HEIGHT); //,
        // o.endFill(),
        // this.addChild(o);
        var n = window.gameScene.add.graphics();
        // n.beginFill(16777215),
        n.fill(16777215),
            // n.drawRect(0, 0, CONSTANTS.GAME_WIDTH, CONSTANTS.GAME_HEIGHT),
            n.fillRect(0, 0, CONSTANTS.GAME_WIDTH, CONSTANTS.GAME_HEIGHT),
            // n.endFill(),
            (n.alpha = 0); //,
        // this.addChild(n);
        for (var a = new TimelineMax(), s = 0; s < 10; s++)
            a.addCallback(function () {
                var e = new Character(this.shungokuHitEffectTextureList);
                (e.x = t.x + Math.random() * t.width),
                    (e.y = t.y + Math.random() * (t.height / 2)),
                    (e.animationSpeed = 0.15),
                    (e.loop = 0),
                    // e.onComplete = this.effectComplete.bind(this, e),
                    e.on("animationcomplete", this.effectComplete.bind(this, e)); //,
                // e.play(),
                // AudioManager.play("se_damage" ),
                // this.addChild(e);
            }, "+=" + String(0.05), null, this),
                a.addCallback(function () {
                    n.alpha = 0.2;
                }, "+=" + String(0), null, this),
                a.addCallback(function () {
                    n.alpha = 0;
                }, "+=" + String(0.06), null, this);
        a.addCallback(function () {
            e ? this.play("syngokuFinishTen") : this.play("syngokuFinish");
        }, "+=0", null, this),
            a.to(o, 0.3, {
                alpha: 0
            }, "+=0.7"),
            a.addCallback(function () {
                // AudioManager.play("boss_goki_voice_syungokusatu1");
            }, "-=0.15", null, this),
            a.addCallback(function () {
                // (this.character.textures = this.animList.idle),
                //   (this.shadow.textures = this.animList.idle),
                //   this.character.play(),
                //   this.shadow.play(),
                //   (this.character.loop = !0),
                //   (this.shadow.loop = !0);
                this.loop = 1;
                this.play("idle");
            }, "+=1.5", null, this);
    }
    effectComplete(t) {
        // (t.alpha = 0), this.removeChild(t);
        t.alpha = 0;
    }
    onDead() {
        this.tlShoot && (this.tlShoot.pause(), this.tlShoot.kill()); //,
        // AudioManager.play("boss_goki_voice_ko");
    }
    castAdded(t) {
        super.castAdded(t),
            (this.tlShoot = new TimelineMax()),
            // (this.character.textures = this.animList.syngoku),
            // (this.shadow.textures = this.animList.syngoku),
            // this.character.play(),
            // this.shadow.play(),
            // (this.character.loop = !1),
            // (this.shadow.loop = !1);
            (this.loop = 0);
        this.scene.time.addEvent({
            callback: () => {
                this.once("animationcomplete", () => {
                    this.loop = 1;
                    this.play("idle");
                }).play("syngoku");
            }
        });
    }
    castRemoved(t) {
        super.castRemoved(t),
            this.tlShoot && (this.tlShoot.pause(), this.tlShoot.kill());
    }
}
export class Pyramid extends Boss {
    constructor(opts) {
        super(opts);
        Object.keys(opts.anim).forEach((key) => {
            if (!this.scene.anims.exists(key)) {
                this.anims.create({
                    key,
                    frames: opts.anim[key].map((frame) => ({
                        key: "game_asset",
                        frame
                    })),
                    frameRate: key == "attack" ? 60 : 6,
                    repeat: -1
                });
            }
        });
        this.play("idle");
        (opts.projectileDataB.name = "psychoField"),
            (opts.projectileDataA.name = "pentagram"),
            (this.projectileData = this.projectileDataA),
            (this.projectileDataA = opts.projectileDataA),
            (this.projectileDataB = opts.projectileDataB);
    }
    update() {
        this.shootOn &&
            this.bulletFrameCnt % this.interval == 0 &&
            ((this.shootOn = 0),
                // AudioManager.play("boss_sagat_voice_add"),
                TweenMax.delayedCall(1, function () {
                    this.shootStart();
                }.bind(this))),
            this.bulletFrameCnt++;
    }
    shootStart() {
        this.tlShoot && this.tlShoot.kill();
        var t = PROPERTIES.player, e = this.width - this.width, o = t.x + t.width / 2 - this.width / 2;
        o - e / 2 <= -e / 2 && (o = -e / 2),
            o >= CONSTANTS.GAME_WIDTH - this.width - e / 2 &&
                (o = CONSTANTS.GAME_WIDTH - this.width - e / 2);
        var n = CONSTANTS.GAME_HEIGHT / 4, a = CONSTANTS.GAME_HEIGHT - this.height + 70;
        this.tlShoot = new TimelineMax({
            delay: 0.5,
            onComplete: this.shootStart,
            onCompleteScope: this
        });
        var a = Math.random();
        a >= 0 && 0.1 >= a
            ? // ? (this.tlShoot.to(this.vegaBlur, 0.1, {
                // blur: 10,
                // }),
                (this.tlShoot.addCallback(this.onWarp, "+=0", null, this),
                    this.tlShoot.addCallback(function () {
                        this.x = 0;
                    }, "+=0", null, this),
                    // this.tlShoot.to(this.vegaBlur, 0.1, {
                    //   blur: 0,
                    // }),
                    // this.tlShoot.to(
                    //   this.vegaBlur,
                    //   0.1,
                    //   {
                    //     blur: 10,
                    //   },
                    //   "+=0.2"
                    // ),
                    this.tlShoot.addCallback(function () {
                        this.x = CONSTANTS.GAME_WIDTH - this.width;
                    }, "+=0", null, this),
                    // this.tlShoot.to(this.vegaBlur, 0.1, {
                    //   blur: 0,
                    // }),
                    // this.tlShoot.to(
                    //   this.vegaBlur,
                    //   0.1,
                    //   {
                    //     blur: 10,
                    //   },
                    //   "+=0.2"
                    // ),
                    this.tlShoot.addCallback(function () {
                        this.x = Math.floor(Math.random() * (CONSTANTS.GAME_WIDTH - this.width));
                    }, "+=0", null, this),
                    // this.tlShoot.to(this.vegaBlur, 0.1, {
                    //   blur: 0,
                    // }),
                    this.tlShoot.addCallback(function () { }, "+=0.5", null, this))
            : a >= 0.11 && 0.4 >= a
                ? ((this.projectileData = this.projectileDataA),
                    // this.tlShoot.to(this.vegaBlur, 0.1, {
                    //   blur: 15,
                    // }),
                    this.tlShoot.addCallback(function () {
                        (this.x = 0),
                            // AudioManager.play("boss_vega_voice_tama"),
                            this.onPsychoShoot();
                    }, "+=0", null, this),
                    // this.tlShoot.to(this.vegaBlur, 0.1, {
                    //   blur: 0,
                    // }),
                    // this.tlShoot.to(this.vegaBlur, 0.1, {
                    //   delay: 0.3,
                    //   blur: 15,
                    // }),
                    this.tlShoot.addCallback(function () {
                        (this.x = 160), this.onPsychoShoot();
                    }, "+=0", null, this),
                    // this.tlShoot.to(this.vegaBlur, 0.1, {
                    //   blur: 0,
                    // }),
                    // this.tlShoot.to(this.vegaBlur, 0.1, {
                    //   delay: 0.3,
                    //   blur: 15,
                    // }),
                    this.tlShoot.addCallback(function () {
                        (this.x = 16), this.onPsychoShoot();
                    }, "+=0", null, this),
                    // this.tlShoot.to(this.vegaBlur, 0.1, {
                    //   blur: 0,
                    // }),
                    // this.tlShoot.to(this.vegaBlur, 0.1, {
                    //   delay: 0.3,
                    //   blur: 15,
                    // }),
                    this.tlShoot.addCallback(function () {
                        (this.x = 128),
                            // AudioManager.play("boss_vega_voice_tama"),
                            this.onPsychoShoot();
                    }, "+=0", null, this),
                    // this.tlShoot.to(this.vegaBlur, 0.1, {
                    //   blur: 0,
                    // }),
                    // this.tlShoot.to(this.vegaBlur, 0.1, {
                    //   delay: 0.3,
                    //   blur: 15,
                    // }),
                    this.tlShoot.addCallback(function () {
                        (this.x = 32), this.onPsychoShoot();
                    }, "+=0", null, this),
                    // this.tlShoot.to(this.vegaBlur, 0.1, {
                    //   blur: 0,
                    // }),
                    // this.tlShoot.to(this.vegaBlur, 0.1, {
                    //   delay: 0.3,
                    //   blur: 15,
                    // }),
                    this.tlShoot.addCallback(function () {
                        (this.x = 96), this.onPsychoShoot();
                    }, "+=0", null, this),
                    // this.tlShoot.to(this.vegaBlur, 0.1, {
                    //   blur: 0,
                    // }),
                    // this.tlShoot.to(this.vegaBlur, 0.1, {
                    //   delay: 0.3,
                    //   blur: 15,
                    // }),
                    this.tlShoot.addCallback(function () {
                        (this.x = CONSTANTS.GAME_CENTER - this.width / 2),
                            // AudioManager.play("boss_vega_voice_tama"),
                            this.onPsychoShoot();
                    }, "+=0", null, this),
                    // this.tlShoot.to(this.vegaBlur, 0.1, {
                    //   blur: 0,
                    // }),
                    this.tlShoot.addCallback(function () { }, "+=4.0", null, this))
                : a >= 0.41 && 0.7 >= a
                    ? ((this.projectileData = this.projectileDataB),
                        this.tlShoot.to(this, 0.3, {
                            x: CONSTANTS.GAME_CENTER - this.width / 2,
                            y: n + 10
                        }),
                        this.tlShoot.addCallback(function () {
                            this.onPsychoFieldAttack();
                        }, "+=0.5", null, this),
                        this.tlShoot.addCallback(this.onPsychoShoot, "+=0.3", null, this),
                        this.tlShoot.addCallback(this.onPsychoShoot, "+=1", null, this),
                        this.tlShoot.addCallback(this.onPsychoShoot, "+=1", null, this),
                        this.tlShoot.addCallback(this.onPsychoShoot, "+=1", null, this),
                        this.tlShoot.addCallback(this.onPsychoShoot, "+=1", null, this),
                        this.tlShoot.addCallback(this.onIdle, "+=0.0", null, this),
                        this.tlShoot.addCallback(function () { }, "+=3.0", null, this))
                    : a >= 0.71 &&
                        1 >= a &&
                        // (this.tlShoot.to(this.vegaBlur, 0.1, {
                        // blur: 15,
                        // }),
                        (this.tlShoot.addCallback(function () {
                            this.x = o;
                        }, "+=0", null, this),
                            // this.tlShoot.to(this.vegaBlur, 0.1, {
                            //   blur: 0,
                            // }),
                            this.tlShoot.to(this, 0.2, {
                                y: n - 20
                            }),
                            this.tlShoot.addCallback(this.onAttack, "+=0", null, this),
                            this.tlShoot.to(this, 0.9, {
                                y: CONSTANTS.GAME_HEIGHT - 15
                            }),
                            this.tlShoot.addCallback(this.onIdle, "+=0.0", null, this),
                            this.tlShoot.addCallback(function () {
                                (this.x = CONSTANTS.GAME_CENTER - this.width / 2),
                                    (this.y = -this.height);
                            }, "+=0.0", null, this),
                            this.tlShoot.to(this, 1, {
                                y: n
                            }),
                            this.tlShoot.addCallback(function () { }, "+=1", null, this));
    }
    onIdle() {
        this.play("idle");
    }
    onPsychoShoot() {
        this.play("shoot");
        this.shoot();
    }
    onPsychoFieldShoot() {
        this.play("shoot");
        this.shoot();
    }
    onWarp() {
        // AudioManager.play("boss_vega_voice_warp");
        this.play("warp");
    }
    onAttack() {
        // AudioManager.play("boss_vega_voice_crusher"),
        this.play("attack");
    }
    onPsychoFieldAttack() {
        // AudioManager.play("boss_vega_voice_shoot"),
        this.play("shoot");
    }
    onDead() {
        this.tlShoot && (this.tlShoot.pause(), this.tlShoot.kill()); //,
        // AudioManager.play("boss_bison_voice_ko");
    }
}
export class Bullet extends Character {
    constructor(opts) {
        super(opts.texture);
        if (opts.sound) {
            this.soundOptions = opts.sound;
            this.soundPlayed = false;
        }
        this.name = opts.name;
        this.damage = opts.damage;
        this.speed = opts.speed;
        this.hp = opts.hp;
        this.score = opts.score;
        this.deadFlg = 0;
        if (opts.postFX && opts.name !== "psychoField") {
            this.bloomPipeline = this.postFX.addBloom(0xffffff, 1, 1, 2, 0.65);
            if (!Bullet.bloomPipelines) {
                Bullet.bloomPipelines = [];
            }
            Bullet.bloomPipelines.push(this.bloomPipeline);
            if (!Bullet.sharedTween) {
                Bullet.sharedTween = this.scene.tweens.add({
                    targets: Bullet.bloomPipelines,
                    strength: { from: 0.65, to: 1.05 },
                    duration: 150,
                    ease: "Sine.easeInOut",
                    yoyo: true,
                    repeat: -1
                });
            }
        }
    }
    update() {
        if (!this.soundPlayed &&
            this.soundOptions &&
            this.y > 40 &&
            this.y < CONSTANTS.GAME_HEIGHT - 40 &&
            this.scene &&
            this.scene.sound &&
            this.scene.game.cache.audio.exists(this.soundOptions[0])) {
            const randomIndex = Math.floor(Math.random() * this.soundOptions.length);
            const soundKey = this.soundOptions[randomIndex];
            const pan = Phaser.Math.Clamp(this.x / (CONSTANTS.GAME_WIDTH / 2) - 1, -1, 1);
            let opts = { pan };
            if (soundKey === "balloon_people" || soundKey === "smooch") {
                opts.volume = 0.1;
                opts.rate = 1.1;
            }
            this.scene.sound.play(soundKey, opts);
            this.soundPlayed = true;
        }
        if (this.name == "pentagram") {
            this.rotation += Phaser.Utils.Array.GetRandom([0.015, 0.01, 0.05]);
        }
        this.rotX
            ? ((this.x += this.rotX * this.speed), (this.y += this.rotY * this.speed))
            : "meka" == this.name
                ? (this.cont++,
                    this.cont >= this.start &&
                        (this.targetX || (this.targetX = this.player.x),
                            (this.x += 0.009 * (this.targetX - this.x)),
                            (this.y += Math.cos(this.cont / 5) + 2.5 * this.speed)))
                : (this.y += this.speed);
    }
    onDamage(t, e) {
        this.deadFlg ||
            ((this.hp -= t),
                this.hp <= 0
                    ? (this.dead.bind(this)(e), (this.deadFlg = 1))
                    : (TweenMax.to(this, 0.1, {
                        tint: 16711680
                    }),
                        TweenMax.to(this, 0.1, {
                            delay: 0.1,
                            tint: 16777215
                        })));
    }
    dead(t) {
        this.emit(Character.CUSTOM_EVENT_DEAD);
        // Tween bullet's scaleX to 0 before destroying
        // TweenMax.to(this, 1.0, {
        //   scaleX: 0,
        //   alpha: 0.45,
        //   // tint: 0x00ff00,
        //   tint: 0xf200f9,
        //   ease: Expo.easeOut,
        //   onComplete: () => {
        //     if (this.explosion) {
        //       this.explosion.on(
        //         "animationcomplete",
        //         this.explosionComplete.bind(this)
        //       );
        //       this.explosion.x = this.x;
        //       this.explosion.y = this.y;
        //       this.explosion.play();
        //     }
        //     this.destroy();
        //   }
        // });
        if (this.explosion) {
            this.explosion.on("animationcomplete", this.explosionComplete.bind(this));
            this.explosion.x = this.x;
            this.explosion.y = this.y;
            this.explosion.play();
        }
        this.destroy();
    }
    explosionComplete() {
        this.explosion.destroy(), this.emit(Character.CUSTOM_EVENT_DEAD_COMPLETE);
    }
}
export class FlirtyGirl extends Boss {
    constructor(opts) {
        super(opts);
        Object.keys(opts.anim).forEach((key) => {
            this.anims.create({
                key,
                frames: opts.anim[key].map((frame) => ({
                    key: "game_asset",
                    frame
                })),
                frameRate: key == "attack" ? 20 : 6,
                repeat: -1
            });
        });
        (this.projectileDataA = opts.projectileDataA),
            (this.projectileDataB = opts.projectileDataB),
            (this.projectileData = this.projectileDataA);
    }
    update() {
        this.shootOn &&
            this.bulletFrameCnt % this.interval == 0 &&
            ((this.shootOn = 0),
                // AudioManager.play("boss_sagat_voice_add"),
                TweenMax.delayedCall(1, function () {
                    this.shootStart();
                }.bind(this))),
            this.bulletFrameCnt++;
    }
    shootStart() {
        this.tlShoot && this.tlShoot.kill();
        var t = PROPERTIES.player, e = this.width - this.width, o = t.x + t.width / 2 - this.width / 2;
        o - e / 2 <= -e / 2 && (o = -e / 2),
            o >= CONSTANTS.GAME_WIDTH - this.width - e / 2 &&
                (o = CONSTANTS.GAME_WIDTH - this.width - e / 2);
        var n = CONSTANTS.GAME_HEIGHT / 4, a = CONSTANTS.GAME_HEIGHT - this.height + 70;
        this.tlShoot = new TimelineMax({
            delay: 0.5,
            onComplete: this.shootStart,
            onCompleteScope: this
        });
        var s = Math.random();
        s >= 0 && 0.3 >= s
            ? ((this.projectileData = this.projectileDataA),
                this.tlShoot.to(this, 0.25, {
                    x: 35 + -20
                }),
                this.tlShoot.addCallback(this.onCharge, "+=0", null, this),
                this.tlShoot.addCallback(this.onShoot, "+=0.25", null, this),
                this.tlShoot.to(this, 0.25, {
                    x: 35 + 10
                }),
                this.tlShoot.addCallback(this.onCharge, "+=0", null, this),
                this.tlShoot.addCallback(this.onShoot, "+=0.25", null, this),
                this.tlShoot.to(this, 0.25, {
                    x: 35 + 35
                }),
                this.tlShoot.addCallback(this.onCharge, "+=0", null, this),
                this.tlShoot.addCallback(this.onShoot, "+=0.25", null, this),
                this.tlShoot.to(this, 0.25, {
                    x: 35 + 80
                }),
                this.tlShoot.addCallback(this.onCharge, "+=0", null, this),
                this.tlShoot.addCallback(this.onShoot, "+=0.25", null, this),
                this.tlShoot.to(this, 0.25, {
                    x: 35 + 120
                }),
                this.tlShoot.addCallback(this.onCharge, "+=0", null, this),
                this.tlShoot.addCallback(this.onShoot, "+=0.25", null, this),
                this.tlShoot.to(this, 0.25, {
                    x: 35 + 160
                }),
                this.tlShoot.addCallback(this.onCharge, "+=0", null, this),
                this.tlShoot.addCallback(this.onShoot, "+=0.25", null, this),
                this.tlShoot.addCallback(function () {
                    this.onIdle();
                }, "+=0.3", null, this))
            : s >= 0.31 && 0.6 >= s
                ? ((this.projectileData = this.projectileDataA),
                    this.tlShoot.to(this, 0.25, {
                        x: 35 + o
                    }),
                    this.tlShoot.addCallback(this.onCharge, "+=0", null, this),
                    this.tlShoot.addCallback(this.onShoot, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onCharge, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onShoot, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onCharge, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onShoot, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onCharge, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onShoot, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onCharge, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onShoot, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onCharge, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onShoot, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onCharge, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onShoot, "+=0.2", null, this),
                    this.tlShoot.addCallback(function () {
                        this.onIdle();
                    }, "+=0.3", null, this))
                : s >= 0.61 && 0.8 >= s
                    ? ((this.projectileData = this.projectileDataB),
                        this.tlShoot.to(this, 0.25, {
                            x: 35 + o
                        }),
                        this.tlShoot.addCallback(this.onCharge, "+=0", null, this),
                        this.tlShoot.addCallback(this.onBigShoot, "+=1.3", null, this),
                        this.tlShoot.addCallback(function () {
                            this.onIdle();
                        }, "+=0.3", null, this))
                    : s >= 0.81 &&
                        1 >= s &&
                        (this.tlShoot.to(this, 0.4, {
                            x: 45 + o,
                            y: n - 20
                        }),
                            this.tlShoot.addCallback(this.onTigerKnee, "+=0.0", null, this),
                            this.tlShoot.to(this, 0.3, {
                                y: a
                            }, "+=0.5"),
                            this.tlShoot.addCallback(this.onTigerKneeVoice, "-=0.2", null, this),
                            this.tlShoot.to(this, 0.2, {
                                y: n
                            }, "+=0.05"),
                            this.tlShoot.addCallback(this.onIdle, "+=0.0", null, this));
    }
    onCharge() {
        this.play("charge");
    }
    onShoot() {
        this.play("shoot");
        this.shoot(); //,
        // AudioManager.play("boss_sagat_voice_tama0");
    }
    onBigShoot() {
        this.play("shoot");
        this.shoot(); //,
        // AudioManager.play("boss_sagat_voice_tama1");
    }
    onIdle() {
        this.play("idle");
    }
    onTigerKnee() {
        this.play("attack");
    }
    onTigerKneeVoice() {
        // AudioManager.play("boss_sagat_voice_kick");
    }
    onDead() {
        this.tlShoot && (this.tlShoot.pause(), this.tlShoot.kill()); //,
        // AudioManager.play("boss_sagat_voice_ko");
    }
}
export class FlirtyRevenge extends Boss {
    constructor(t) {
        super(t);
        this.projectileData.name = "yuck";
    }
    update() {
        this.moveFlg
            ? (this.y >= CONSTANTS.GAME_HEIGHT / 4 &&
                ((this.y = CONSTANTS.GAME_HEIGHT / 4), (this.moveFlg = !1)),
                (this.y += 1))
            : (this.shootOn &&
                this.bulletFrameCnt % this.interval == 0 &&
                ((this.shootOn = !1),
                    // this.character.stop(),
                    // this.shadow.stop(),
                    // AudioManager.play("boss_barlog_voice_add"),
                    TweenMax.delayedCall(1, function () {
                        this.shootStart();
                    }.bind(this))),
                this.bulletFrameCnt++);
    }
    shootStart() {
        var t = PROPERTIES.player, e = this.width - this.body.width, o = t.x + t.width / 2 - this.width / 2;
        o - e / 2 <= -e / 2 && (o = -e / 2),
            o >= CONSTANTS.GAME_WIDTH - this.body.width - e / 2 &&
                (o = CONSTANTS.GAME_WIDTH - this.body.width - e / 2);
        var n = CONSTANTS.GAME_HEIGHT / 4, a = CONSTANTS.GAME_HEIGHT - this.height + 34;
        this.tlShoot && this.tlShoot.kill(),
            (this.tlShoot = new TimelineMax({
                delay: 0.5,
                onComplete: this.shootStart,
                onCompleteScope: this
            }));
        var s = Math.random();
        if (s >= 0 && 0.3 >= s) {
            var r = Math.random() * (CONSTANTS.GAME_WIDTH - this.width), h = Math.random() * (CONSTANTS.GAME_HEIGHT - 400) + 60;
            this.tlShoot.addCallback(this.onMove, "+=0.0", null, this),
                this.tlShoot.to(this, 0.6, {
                    x: r,
                    y: h
                }),
                this.tlShoot.addCallback(this.onMoveStop, "+=0.1", null, this);
        }
        else
            s >= 0.31 && 0.8 >= s
                ? (this.tlShoot.addCallback(this.onMove, "+=0.0", null, this),
                    this.tlShoot.to(this, 0.3, {
                        x: o
                    }),
                    this.tlShoot.addCallback(this.onShoot, "+=0.4", null, this),
                    this.tlShoot.addCallback(this.onMoveStop, "+=0.5", null, this))
                : s >= 0.81 &&
                    1 >= s &&
                    (this.tlShoot.addCallback(this.onMove, "+=0.0", null, this),
                        this.tlShoot.to(this, 0.5, {
                            x: o
                        }),
                        this.tlShoot.addCallback(this.onCharge, "+=0.0", null, this),
                        this.tlShoot.addCallback(this.onAttack, "+=0.7", null, this),
                        this.tlShoot.to(this, 0.3, {
                            y: n - 70
                        }, "+=0.0"),
                        this.tlShoot.to(this, 0.6, {
                            y: a
                        }, "+=0.1"),
                        this.tlShoot.to(this, 0.2, {
                            y: n
                        }, "+=0.0"),
                        this.tlShoot.addCallback(this.onMoveStop, "+=0.0", null, this));
    }
    onMove() {
        // (this.character.textures = this.animList.idle),
        //   (this.shadow.textures = this.animList.idle),
        //   this.character.play(),
        //   this.shadow.play();
        this.play("idle");
    }
    onMoveStop() {
        // (this.character.textures = this.animList.idle),
        //   (this.shadow.textures = this.animList.idle),
        //   this.character.stop(),
        //   this.shadow.stop();
        this.play("idle");
    }
    onIdle() {
        // (this.character.textures = this.animList.idle),
        //   (this.shadow.textures = this.animList.idle);
        this.play("idle");
    }
    onCharge() {
        // (this.character.textures = this.animList.charge),
        //   (this.shadow.textures = this.animList.charge),
        //   this.character.play(),
        //   this.shadow.play();
        this.play("charge");
    }
    onAttack() {
        // (this.character.textures = this.animList.attack),
        //   (this.shadow.textures = this.animList.attack),
        //   this.character.play(),
        //   this.shadow.play(),
        //   AudioManager.play("boss_barlog_voice_barcelona");
        this.play("attack");
    }
    onAttackVoice() { }
    onShoot() {
        // (this.character.textures = this.animList.shoot),
        //   (this.shadow.textures = this.animList.shoot),
        //   this.character.play(),
        //   this.shadow.play(),
        this.play("shoot"), this.shoot();
        //,
        //   AudioManager.play("boss_barlog_voice_tama");
    }
    onDead() {
        this.tlShoot && (this.tlShoot.pause(), this.tlShoot.kill());
        //,
        // AudioManager.play("boss_barlog_voice_ko");
    }
    castAdded(t) {
        super.castAdded(t), (this.tlShoot = new TimelineMax());
    }
    castRemoved(t) {
        super.castRemoved(t),
            this.tlShoot && (this.tlShoot.pause(), this.tlShoot.kill());
    }
}
export class Sagat extends Boss {
    constructor(opts) {
        super(opts);
        // Object.keys(opts.anim).forEach((key) => {
        //   this.anims.create({
        //     key,
        //     frames: this.anims.generateFrameNames("game_asset", {
        //       prefix: opts.anim[key][0].replace("0.gif", ""),
        //       suffix: ".gif",
        //       start: 0,
        //       end: opts.anim[key].length - 1,
        //       frameRate: 6,
        //       repeat: -1
        //     })
        //   });
        // });
        Object.keys(opts.anim).forEach((key) => {
            this.anims.create({
                key,
                frames: opts.anim[key].map((frame) => ({
                    key: "game_asset",
                    frame
                })),
                frameRate: 6,
                repeat: -1
            });
        });
        this.play("idle");
        this.setOrigin(0, 0.5);
        (this.tamaDataA = opts.tamaDataA),
            (this.tamaDataB = opts.tamaDataB),
            (this.tamaData = this.tamaData);
    }
    update() {
        this.shootOn &&
            this.bulletFrameCnt % this.interval == 0 &&
            ((this.shootOn = 0),
                // AudioManager.play("boss_sagat_voice_add"),
                TweenMax.delayedCall(1, function () {
                    this.shootStart();
                }.bind(this))),
            this.bulletFrameCnt++;
    }
    shootStart() {
        this.tlShoot && this.tlShoot.kill();
        var t = PROPERTIES.player, 
        // e = this.unit.width - this.unit.hitArea.width,
        e = this.width - this.width, o = t.x + t.width / 2 - this.width / 2;
        o - e / 2 <= -e / 2 && (o = -e / 2),
            o >= CONSTANTS.GAME_WIDTH - this.width - e / 2 &&
                (o = CONSTANTS.GAME_WIDTH - this.width - e / 2);
        var n = CONSTANTS.GAME_HEIGHT / 4, a = CONSTANTS.GAME_HEIGHT - this.height + 70;
        this.tlShoot = new TimelineMax({
            delay: 0.5,
            onComplete: this.shootStart,
            onCompleteScope: this
        });
        var s = Math.random();
        s >= 0 && 0.3 >= s
            ? ((this.tamaData = this.tamaDataA),
                this.tlShoot.to(this, 0.25, {
                    x: -20
                }),
                this.tlShoot.addCallback(this.onCharge, "+=0", null, this),
                this.tlShoot.addCallback(this.onShoot, "+=0.25", null, this),
                this.tlShoot.to(this, 0.25, {
                    x: 10
                }),
                this.tlShoot.addCallback(this.onCharge, "+=0", null, this),
                this.tlShoot.addCallback(this.onShoot, "+=0.25", null, this),
                this.tlShoot.to(this, 0.25, {
                    x: 35
                }),
                this.tlShoot.addCallback(this.onCharge, "+=0", null, this),
                this.tlShoot.addCallback(this.onShoot, "+=0.25", null, this),
                this.tlShoot.to(this, 0.25, {
                    x: 80
                }),
                this.tlShoot.addCallback(this.onCharge, "+=0", null, this),
                this.tlShoot.addCallback(this.onShoot, "+=0.25", null, this),
                this.tlShoot.to(this, 0.25, {
                    x: 120
                }),
                this.tlShoot.addCallback(this.onCharge, "+=0", null, this),
                this.tlShoot.addCallback(this.onShoot, "+=0.25", null, this),
                this.tlShoot.to(this, 0.25, {
                    x: 160
                }),
                this.tlShoot.addCallback(this.onCharge, "+=0", null, this),
                this.tlShoot.addCallback(this.onShoot, "+=0.25", null, this),
                this.tlShoot.addCallback(function () {
                    this.onIdle();
                }, "+=0.3", null, this))
            : s >= 0.31 && 0.6 >= s
                ? ((this.tamaData = this.tamaDataA),
                    this.tlShoot.to(this, 0.25, {
                        x: o
                    }),
                    this.tlShoot.addCallback(this.onCharge, "+=0", null, this),
                    this.tlShoot.addCallback(this.onShoot, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onCharge, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onShoot, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onCharge, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onShoot, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onCharge, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onShoot, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onCharge, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onShoot, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onCharge, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onShoot, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onCharge, "+=0.2", null, this),
                    this.tlShoot.addCallback(this.onShoot, "+=0.2", null, this),
                    this.tlShoot.addCallback(function () {
                        this.onIdle();
                    }, "+=0.3", null, this))
                : s >= 0.61 && 0.8 >= s
                    ? ((this.tamaData = this.tamaDataB),
                        this.tlShoot.to(this, 0.25, {
                            x: o
                        }),
                        this.tlShoot.addCallback(this.onCharge, "+=0", null, this),
                        this.tlShoot.addCallback(this.onBigShoot, "+=1.3", null, this),
                        this.tlShoot.addCallback(function () {
                            this.onIdle();
                        }, "+=0.3", null, this))
                    : s >= 0.81 &&
                        1 >= s &&
                        (this.tlShoot.to(this, 0.4, {
                            x: o,
                            y: n - 20
                        }),
                            this.tlShoot.addCallback(this.onTigerKnee, "+=0.0", null, this),
                            this.tlShoot.to(this, 0.3, {
                                y: a
                            }, "+=0.5"),
                            this.tlShoot.addCallback(this.onTigerKneeVoice, "-=0.2", null, this),
                            this.tlShoot.to(this, 0.2, {
                                y: n
                            }, "+=0.05"),
                            this.tlShoot.addCallback(this.onIdle, "+=0.0", null, this));
    }
    onCharge() {
        // (this.character.textures = this.animList.charge),
        //   (this.shadow.textures = this.animList.charge),
        //   this.character.play(),
        //   this.shadow.play();
        this.play("charge");
    }
    onShoot() {
        // (this.character.textures = this.animList.shoot),
        //   (this.shadow.textures = this.animList.shoot),
        //   this.character.play(),
        //   this.shadow.play(),
        this.play("shoot");
        this.shoot(); //,
        // AudioManager.play("boss_sagat_voice_tama0");
    }
    onBigShoot() {
        // (this.character.textures = this.animList.shoot),
        //   (this.shadow.textures = this.animList.shoot),
        //   this.character.play(),
        //   this.shadow.play(),
        this.play("shoot");
        this.shoot(); //,
        // AudioManager.play("boss_sagat_voice_tama1");
    }
    onIdle() {
        // (this.character.textures = this.animList.idle),
        //   (this.shadow.textures = this.animList.idle),
        //   this.character.play(),
        //   this.shadow.play();
        this.play("idle");
    }
    onTigerKnee() {
        // (this.character.textures = this.animList.attack),
        //   (this.shadow.textures = this.animList.attack);
        this.play("attack");
    }
    onTigerKneeVoice() {
        // AudioManager.play("boss_sagat_voice_kick");
    }
}
export class AdvScene extends Phaser.Scene {
    constructor() {
        super("adv-scene");
        // this.senario = "ja" == i.LANG ? ja : en;
        return this;
    }
    create() {
        // HACKARONI-DRJ: remove me
        // this.endingFlg = false;
        (this.endingFlg = !1),
            5 == PROPERTIES.stageId
                ? (this.endingFlg = !0)
                : 4 == PROPERTIES.stageId
                    ? (console.log("voice_thankyou"),
                        PROPERTIES.akebonoCnt >= 4 && 0 == PROPERTIES.continueCnt
                            ? (this.endingFlg = !1)
                            : (this.endingFlg = !0))
                    : (this.endingFlg = !1);
        this.sceneRemoved();
        setTimeout(() => {
            window.gameScene.theWorldFlg = false;
        }, 50);
    }
    sceneRemoved() {
        // AudioManager.play("se_correct"),
        //   AudioManager.stop("adventure_bgm"),
        //   super.sceneRemoved(),
        this.endingFlg
            ? this.scene.start("gameover-scene")
            : this.scene.start("game-scene");
    }
}
export class ContinueScene extends Scene {
    constructor() {
        super("continue-scene");
    }
    onCountDown() {
        if (this.countDown < 0) {
            this.selectNo.bind(this)();
        }
        else {
            this.tl = new TimelineMax({
                onComplete: this.onCountDown,
                onCompleteScope: this
            });
            this.tl
                .to(this.cntText, 0.4, {
                delay: 0.4,
                alpha: 0
            })
                .call(() => {
                this.cntText.setTexture("game_ui", "countdown" + this.countDown + ".gif");
                // AudioManager.play(["voice_countdown" + this.countDown]);
                this.countDown--;
            }, null, this, "+=0")
                .to(this.cntText, 0.8, {
                alpha: 1
            });
        }
    }
    create() {
        this.sceneSwitch = 0;
        this.countDown = 9;
        // AudioManager.bgmPlay("bgm_continue", 102735, 698597);
        // Replace PIXI.Graphics with Graphics
        this.bg = new Graphics(this);
        this.bg.fill(0, 1);
        this.bg.fillRect(0, 0, CONSTANTS.STAGE_WIDTH, CONSTANTS.STAGE_HEIGHT);
        this.add.existing(this.bg); // Use add.existing instead of addChild for Phaser
        // this.continueTitle = new PIXI.Sprite(
        this.continueTitle = new Sprite(this, 0, 0, "game_ui", "continueTitle.gif");
        this.continueTitle.x = 0;
        this.continueTitle.y = 70;
        // this.addChild(this.continueTitle);
        this.add.existing(this.continueTitle);
        // this.loseFaceTexture = [
        //   "continueFace0.gif",
        //   "continueFace1.gif"
        // ];
        this.loseFaceTexture = ["monkeyBrain0.png", "monkeyBrain1.png"];
        // DRJ - create gray version?
        this.loseFaceGrayTexture = ["monkeyBrain0.png"];
        // this.loseFaceSmileTexture = ["continueFace3.gif"];
        this.loseFaceSmileTexture = ["monkeyBrain1.png"];
        // this.loseFace = new PIXI.extras.AnimatedSprite(this.loseFaceTexture);
        this.loseFace = new Character(this.loseFaceTexture, {
            scene: this,
            texture: "game_asset"
        });
        this.loseFace.x = 20;
        this.loseFace.y = this.continueTitle.y + this.continueTitle.height + 38;
        this.loseFace.animationSpeed = 0.05;
        this.loseFace.play();
        this.add.existing(this.loseFace);
        // this.cntTextBg = new PIXI.Sprite(PIXI.Texture.fromFrame("countdownBg.gif"));
        this.cntTextBg = new Sprite(this, 0, 0, "game_ui", "countdownBg.gif");
        this.cntTextBg.x = this.cntTextBg.x + this.cntTextBg.width + 20;
        this.cntTextBg.y = this.continueTitle.y + this.continueTitle.height + 30;
        // this.addChild(this.cntTextBg);
        this.add.existing(this.cntTextBg);
        // this.cntText = new PIXI.Sprite(PIXI.Texture.fromFrame("countdown9.gif"));
        this.cntText = new Sprite(this, 0, 0, "game_ui", "countdown9.gif");
        this.cntText.x = this.cntTextBg.x;
        this.cntText.y = this.cntTextBg.y;
        this.cntText.alpha = 0;
        // this.addChild(this.cntText);
        this.add.existing(this.cntText);
        this.yesText = new YesButton(this);
        this.yesText.x = CONSTANTS.GAME_CENTER - this.yesText.width / 2 - 50;
        this.yesText.y = CONSTANTS.GAME_MIDDLE - this.yesText.height / 2 + 70;
        this.yesText.on("pointerup", this.selectYes.bind(this));
        // this.addChild(this.yesText);
        this.add.existing(this.yesText);
        this.noText = new NoButton(this);
        this.noText.x = CONSTANTS.GAME_CENTER - this.noText.width / 2 + 50;
        this.noText.y = CONSTANTS.GAME_MIDDLE - this.noText.height / 2 + 70;
        this.noText.on("pointerup", this.selectNo.bind(this));
        // this.addChild(this.noText);
        this.add.existing(this.noText);
        this.continueTitle.alpha = this.loseFace.alpha = this.cntTextBg.alpha = this.yesText.alpha = this.noText.alpha = 0;
        TweenMax.to([
            this.continueTitle,
            this.loseFace,
            this.cntTextBg,
            this.yesText,
            this.noText
        ], 0.8, {
            alpha: 1
        });
        var t = PROPERTIES.resource.recipe.data["ja" == CONSTANTS.LANG ? "continueComment" : "continueCommentEn"], e = t[Math.floor(Math.random() * t.length)], o = {
            fontFamily: "sans-serif",
            fontSize: 15,
            color: Phaser.Display.Color.IntegerToColor(16777215).rgba,
            wordWrap: {
                width: 230
            },
            align: "center",
            padding: {
                x: 10,
                y: 10
            }
        };
        // this.commentText = new PIXI.Text(e, o);
        this.commentText = new Phaser.GameObjects.Text(this, 0, 0, e, o);
        this.commentText.x = CONSTANTS.GAME_CENTER - this.commentText.width / 2;
        this.commentText.y = CONSTANTS.GAME_HEIGHT - 120;
        // this.addChild(this.commentText);
        this.add.existing(this.commentText);
        this.onCountDown.bind(this)();
    }
    selectYes() {
        this.countDown < 0 && (this.countDown = 0),
            // AudioManager.stop("voice_countdown" + this.countDown),
            this.tl.kill(),
            (this.sceneSwitch = 1),
            this.nextSceneAnim();
        var t = Math.floor(3 * Math.random());
        // AudioManager.play(["g_continue_yes_voice" + String(t)]);
    }
    selectNo() {
        this.countDown < 0 && (this.countDown = 0),
            // g.stop("voice_countdown" + this.countDown),
            PROPERTIES.lowModeFlg ||
                //   ((AudioManager.resource.bgm_continue.volume = 0),
                //     TweenMax.to(AudioManager.resource.bgm_continue, 1.5, {
                //       volume: 0.25,
                //       delay: 2.8,
                //     })),
                // AudioManager.play("voice_gameover"),
                // AudioManager.play("bgm_gameover"),
                this.tl.kill(),
            (this.countDown = 0),
            (this.cntText.alpha = 0.2),
            this.cntText.setTexture("game_ui", "countdown0.gif"),
            // DRJ - added
            this.loseFace.stop(),
            this.loseFace.setTexture("game_asset", this.loseFaceGrayTexture[0]),
            // DRJ - should removeChild be refactored?
            this.removeChild(this.commentText),
            (this.gameOverTxt = new Sprite(this, 0, 0, "game_ui", "continueGameOver.gif")),
            (this.gameOverTxt.x = CONSTANTS.GAME_CENTER - this.gameOverTxt.width / 2),
            (this.gameOverTxt.y =
                CONSTANTS.GAME_MIDDLE - this.gameOverTxt.height / 2 - 35),
            (this.gameOverTxt.alpha = 0),
            // DRJ - refactor?
            this.addChild(this.gameOverTxt),
            (this.tl = new TimelineMax({
                onComplete: function () {
                    var t = this;
                    if (PROPERTIES.score > PROPERTIES.highScore) {
                        PROPERTIES.highScore = PROPERTIES.score;
                        document.cookie =
                            "afc2019_highScore=" +
                                PROPERTIES.score +
                                `; expires=Tue, 02 Apr ${new Date().getFullYear() + 1} 7:00:00 UTC; secure;`;
                        this.continueNewrecord = new Sprite(this, 0, 0, "game_ui", "continueNewrecord.gif");
                        this.continueNewrecord.x = 0;
                        this.continueNewrecord.y =
                            this.loseFace.y + this.loseFace.height + 10;
                        this.add.existing(this.continueNewrecord);
                    }
                    this.scoreTitleTxt = new Sprite(this, 0, 0, "game_ui", "scoreTxt.gif");
                    this.scoreTitleTxt.x = 32;
                    this.scoreTitleTxt.y = this.loseFace.y + this.loseFace.height + 30;
                    this.add.existing(this.scoreTitleTxt);
                    this.bigNumTxt = new BigNum(10);
                    this.bigNumTxt.x =
                        this.scoreTitleTxt.x + this.scoreTitleTxt.width + 3;
                    this.bigNumTxt.y = this.scoreTitleTxt.y - 2;
                    this.bigNumTxt.setNum(PROPERTIES.score);
                    this.add.existing(this.bigNumTxt);
                    this.gotoTitleBtn = new GotoTitleButton(this);
                    this.gotoTitleBtn.x =
                        CONSTANTS.GAME_CENTER - this.gotoTitleBtn.width / 2;
                    this.gotoTitleBtn.y =
                        CONSTANTS.GAME_MIDDLE - this.gotoTitleBtn.height / 2 + 160;
                    this.gotoTitleBtn.btn.on("pointerup", () => t.nextSceneAnim());
                    this.add.existing(this.gotoTitleBtn);
                },
                onCompleteScope: this
            })),
            this.tl
                .to(this.cameras.main, 0.07, {
                x: 0,
                y: 10
            })
                .call(function () {
                this.bg.fill(7798784, 1),
                    this.bg.fillRect(0, 0, CONSTANTS.STAGE_WIDTH, CONSTANTS.STAGE_HEIGHT);
            }, null, this, "+=0")
                .to(this, 0.07, {
                x: 0,
                y: -5
            })
                .call(function () {
                this.bg.fill(0, 1),
                    this.bg.fillRect(0, 0, CONSTANTS.STAGE_WIDTH, CONSTANTS.STAGE_HEIGHT);
            }, null, this, "+=0")
                .to(this, 0.07, {
                x: 0,
                y: 3
            })
                .call(function () {
                this.bg.fill(7798784, 1),
                    this.bg.fillRect(0, 0, CONSTANTS.STAGE_WIDTH, CONSTANTS.STAGE_HEIGHT);
            }, null, this, "+=0")
                .to(this, 0.07, {
                x: 0,
                y: 0
            })
                .call(function () {
                this.bg.fill(0, 1),
                    this.bg.fillRect(0, 0, CONSTANTS.STAGE_WIDTH, CONSTANTS.STAGE_HEIGHT);
            }, null, this, "+=0")
                .to(this.gameOverTxt, 1, {
                delay: 0.3,
                alpha: 1.5
            })
                .call(function () {
                var t = Math.floor(2 * Math.random());
                // AudioManager.play(["g_continue_no_voice" + String(t)]);
            }, null, this, "+=0"),
            this.removeChild(this.yesText),
            this.removeChild(this.noText);
    }
    tweet() {
        // F.tweet(1);
    }
    nextSceneAnim(t) {
        1 == this.sceneSwitch
            ? ((this.yesText.interactive = !1),
                (this.yesText.buttonMode = !1),
                (this.noText.interactive = !1),
                (this.noText.buttonMode = !1),
                // (this.loseFace.textures = this.loseFaceSmileTexture))
                this.loseFace.setTexture("game_asset", this.loseFaceSmileTexture[0]))
            : (this.gotoTitleBtn.off("pointerup"),
                (this.gotoTitleBtn.interactive = !1),
                (this.gotoTitleBtn.buttonMode = !1)),
            // TweenMax.to(this, 1.5, {
            TweenMax.to(this.cameras.main, 1.5, {
                alpha: 0,
                delay: 0.3,
                onComplete: this.nextScene,
                onCompleteScope: this
            });
    }
    sceneRemoved() {
        // g.stop("bgm_continue"),
        // F.dlog("ContinueScene.sceneRemoved() Start."),
        // Ae(Me(e.prototype), "sceneRemoved", this).call(this),
        super.sceneRemoved(),
            1 == this.sceneSwitch
                ? ((PROPERTIES.playerMaxHp =
                    PROPERTIES.resource.recipe.data.playerData.maxHp),
                    (PROPERTIES.playerHp = PROPERTIES.playerMaxHp),
                    (PROPERTIES.shootMode =
                        PROPERTIES.resource.recipe.data.playerData.defaultShootName),
                    (PROPERTIES.shootSpeed =
                        PROPERTIES.resource.recipe.data.playerData.defaultShootSpeed),
                    PROPERTIES.continueCnt++,
                    (PROPERTIES.score = PROPERTIES.continueCnt),
                    // (B.Scene = new Ki()))
                    this.scene.start("game-scene"))
                : // : (B.Scene = new mn()),
                    this.scene.start("title-scene"); //,
        // B.Manager.game.stage.addChild(B.Scene),
        // F.dlog("ContinueScene.sceneRemoved() End.");
    }
}
export class GameoverScene extends Scene {
    constructor() {
        super("gameover-scene");
    }
    create() {
        const textures = ["congraBg0.gif", "congraBg1.gif", "congraBg2.gif"];
        this.bg = new Character(textures, { texture: "game_ui" });
        // DRJ - added
        this.bg.setOrigin(0);
        this.bg.animationSpeed = 0.1;
        this.bg.alpha = 0;
        this.bg.play();
        this.addChild(this.bg);
        this.congraInfoBg = new Sprite(this, 0, 0, "game_ui", "congraInfoBg.gif");
        this.congraInfoBg.setOrigin(0, 0.5);
        this.congraInfoBg.x = 0;
        this.congraInfoBg.y = 210;
        this.congraInfoBg.alpha = 0;
        this.addChild(this.congraInfoBg);
        const congraTxtTextures = [
            "congraTxt0.gif",
            "congraTxt1.gif",
            "congraTxt2.gif"
        ];
        this.congraTxt = new Character(congraTxtTextures, { texture: "game_ui" });
        // DRJ - added
        this.congraTxt.setOrigin(0, 0.5);
        this.congraTxt.animationSpeed = 0.2;
        // this.congraTxt.setOrigin(0.5);
        this.congraTxt.x = this.congraTxt.width / 2;
        this.congraTxt.y = 6 + this.congraTxt.height / 2;
        this.congraTxt.play();
        this.addChild(this.congraTxt);
        this.congraTxtEffect = new Sprite(this, 0, 0, "game_ui", congraTxtTextures[0]);
        this.congraTxtEffect.setOrigin(0.5);
        this.congraTxtEffect.visible = false;
        this.addChild(this.congraTxtEffect);
        this.continueFlg = false;
        if (PROPERTIES.score > PROPERTIES.highScore) {
            PROPERTIES.highScore = PROPERTIES.score;
            document.cookie = `afc2019_highScore=${PROPERTIES.score}; expires=Tue, 02 Apr ${new Date().getFullYear()} 7:00:00 UTC; secure;`;
            this.continueNewrecord = new Sprite(this, 0, 0, "game_ui", "continueNewrecord.gif");
            this.continueNewrecord.x = 0;
            this.continueNewrecord.y = CONSTANTS.GAME_MIDDLE - 40;
            this.continueNewrecord.setScale(1, 0);
            this.addChild(this.continueNewrecord);
            this.continueFlg = true;
        }
        this.scoreContainer = new Container(this, 32, CONSTANTS.GAME_MIDDLE - 23);
        this.scoreContainer.setScale(1, 0);
        this.addChild(this.scoreContainer);
        this.scoreTitleTxt = new Sprite(this, 0, 0, "game_ui", "scoreTxt.gif");
        this.scoreContainer.addChild(this.scoreTitleTxt);
        this.bigNumTxt = new BigNum(10);
        this.bigNumTxt.x = this.scoreTitleTxt.x + this.scoreTitleTxt.width + 3;
        this.bigNumTxt.y = this.scoreTitleTxt.y - 2;
        this.bigNumTxt.setNum(PROPERTIES.score);
        this.scoreContainer.addChild(this.bigNumTxt);
        this.gotoTitleBtn = new GotoTitleButton(this);
        this.gotoTitleBtn.x = CONSTANTS.GAME_CENTER - this.gotoTitleBtn.width / 2;
        this.gotoTitleBtn.y = CONSTANTS.GAME_HEIGHT - this.gotoTitleBtn.height - 13;
        this.gotoTitleBtn.on("pointerup", () => {
            this.nextSceneAnim();
        });
        this.addChild(this.gotoTitleBtn);
        this.congraTxt.setScale(5);
        this.congraTxt.x = CONSTANTS.GAME_WIDTH + this.congraTxt.width / 2;
        this.congraTxt.y = CONSTANTS.GAME_MIDDLE - 32;
        const timeline = new TimelineMax();
        timeline
            .to(this.congraTxt, 2.5, {
            x: -(this.congraTxt.width - CONSTANTS.GAME_WIDTH),
            ease: Linear.easeNone
        })
            .addCallback(() => {
            this.congraTxt.x = CONSTANTS.GAME_CENTER;
            this.congraTxt.y = CONSTANTS.GAME_MIDDLE - 60;
            this.congraTxtEffect.x = this.congraTxt.x;
            this.congraTxtEffect.y = this.congraTxt.y;
            this.congraTxt.setScale(3);
        }, "-=2.0")
            .to(this.bg, 0.8, { alpha: 1 }, "-=0.3")
            .to(this.congraTxt, 0.5, {
            scaleX: 1,
            scaleY: 1,
            ease: Expo.easeIn
        })
            .to(this.congraTxtEffect, 0, { visible: true }, "+=0.0")
            .to(this.congraTxtEffect, 1, {
            scaleX: 1.5,
            scaleY: 1.5,
            ease: Expo.easeOut
        })
            .to(this.congraTxtEffect, 1, {
            alpha: 0,
            ease: Expo.easeOut
        }, "-=1")
            .to(this.congraInfoBg, 0.3, { alpha: 1 }, "-=0.5");
        if (this.continueFlg) {
            timeline.to(this.continueNewrecord, 0.5, {
                scaleY: 1,
                ease: Elastic.easeOut
            });
        }
        timeline.to(this.scoreContainer, 0.5, {
            scaleX: 1,
            scaleY: 1,
            ease: Elastic.easeOut
        }, "-=0.25");
    }
    update(time, delta) { }
    nextSceneAnim() {
        this.gotoTitleBtn.off("pointerup");
        this.gotoTitleBtn.interactive = false;
        this.gotoTitleBtn.buttonMode = false;
        TweenMax.to(this, 1.5, {
            alpha: 0,
            delay: 0.3,
            onComplete: this.nextScene,
            onCompleteScope: this
        });
    }
    tweet() { }
    sceneRemoved() {
        super.sceneRemoved();
        this.scene.start("title-scene");
    }
}
//  This Scene has no aspect ratio lock, it will scale to fit the browser window, but will zoom to match the Game
export class BackgroundScene extends Phaser.Scene {
    constructor() {
        super("BackgroundScene");
    }
    preload() {
        this.load.setBaseURL("https://assets.codepen.io/11817390/");
        this.load.atlas("atlas", "atlas.png", "atlas.json");
        this.load.image("guide", "360x640-guide.png");
        this.load.spritesheet("smiley-disc", "smiley-disc.png", {
            frameWidth: 16,
            frameHeight: 16
        });
    }
    create() {
        this.scene.launch("GameScene");
        this.gameScene = this.scene.get("GameScene");
    }
}
export class PinkBunny extends Phaser.GameObjects.Sprite {
    constructor(options, scene, x, y = 0) {
        let multiplier = x > scene.GAME_WIDTH / 2 ? -1 : 1;
        let { idx, descendFaster } = options;
        descendFaster = descendFaster || false;
        super(scene, x + 78 * idx * multiplier, y + -51 * idx, "atlas", "pink-bunny-0.png");
        scene.add.existing(this);
        let originX = x > scene.GAME_WIDTH / 2 ? 1 : 0;
        this.setOrigin(originX, 1);
        if (!this.anims.exists("default")) {
            this.anims.create({
                key: "default",
                frames: [
                    { key: "atlas", frame: "pink-bunny-0.png", isKeyFrame: true },
                    { key: "atlas", frame: "pink-bunny-1.png" }
                ],
                frameRate: 4,
                repeat: -1
            });
        }
        this.play("default");
        let xTarget = x > scene.GAME_WIDTH / 2
            ? Math.ceil(scene.GAME_WIDTH * 0.55)
            : Math.ceil(scene.GAME_WIDTH * 0.35);
        // bounce towards the center of the screen
        this.tween = scene.tweens.add({
            targets: this,
            x: xTarget,
            duration: descendFaster ? 1050 : 1150,
            yoyo: true,
            repeat: 10,
            ease: Phaser.Math.Easing.Quadratic.Out
        });
        // vertically descend
        //
        // 640px over 10 seconds = 64px per second
        // each bunny is 48px tall
        // if bunnies are launched at same time, add 3/4 of a second to each consecutive one
        // and add -48 to the y value
        let duration = descendFaster ? 8000 : 11000;
        this.tween2 = scene.tweens.add({
            targets: this,
            y: scene.GAME_HEIGHT + this.height,
            duration: duration + idx * 750,
            onComplete: () => {
                this.destroy();
                this.tween.destroy();
                this.tween2.destroy();
            }
        });
    }
    destroy() {
        this.tween.destroy();
        this.tween2.destroy();
        super.destroy();
    }
}
export class SmileyDisc extends Phaser.GameObjects.Sprite {
    constructor(options, scene, x, y = 0) {
        let { idx, exitAfter2Tweens, offsetX, ease, descendFaster } = options;
        descendFaster = descendFaster || false;
        ease = ease || Phaser.Math.Easing.Quadratic.Out;
        let multiplier = x > scene.GAME_WIDTH / 2 ? -1 : 1;
        let _x = offsetX ? x + 78 * idx * multiplier : x;
        super(scene, _x, y + -51 * idx, "smiley-disc", 0);
        this.setScale(3);
        scene.add.existing(this);
        let originX = x > scene.GAME_WIDTH / 2 ? 1 : 0;
        this.setOrigin(originX, 1);
        if (!this.anims.exists("default")) {
            this.anims.create({
                key: "default",
                frames: this.anims.generateFrameNumbers("smiley-disc", {
                    start: 0,
                    end: 3
                }),
                frameRate: 21,
                repeat: -1
            });
        }
        this.play("default");
        let xTarget;
        if (exitAfter2Tweens) {
            xTarget =
                x > scene.GAME_WIDTH / 2
                    ? Math.ceil(scene.GAME_WIDTH * 0.49)
                    : Math.ceil(scene.GAME_WIDTH * 0.51);
        }
        else {
            xTarget =
                x > scene.GAME_WIDTH / 2
                    ? Math.ceil(scene.GAME_WIDTH * 0.55)
                    : Math.ceil(scene.GAME_WIDTH * 0.35);
        }
        // bounce towards the center of the screen
        let tweenConfig = {
            targets: this,
            x: xTarget,
            duration: descendFaster ? 1050 : 1150,
            yoyo: true,
            ease
        };
        if (exitAfter2Tweens) {
            tweenConfig.repeat = 2;
            tweenConfig.onComplete = () => {
                this.tween2.setTimeScale(3.75);
                this.play({ key: "default", frameRate: 24 });
            };
        }
        else {
            tweenConfig.repeat = 10;
        }
        this.tween = scene.tweens.add(tweenConfig);
        // vertically descend
        //
        // 640px over 10 seconds = 64px per second
        // each smiley is 48px tall
        // if smileys are launched at same time, add 3/4 of a second to each consecutive one
        // and add -48 to the y value
        let duration = descendFaster ? 8000 : 11000;
        this.tween2 = scene.tweens.add({
            targets: this,
            y: scene.GAME_HEIGHT + this.displayHeight,
            duration: duration + idx * 750,
            onComplete: () => {
                this.destroy();
                this.tween.destroy();
                this.tween2.destroy();
            }
        });
    }
    destroy() {
        this.tween.destroy();
        this.tween2.destroy();
        super.destroy();
    }
}
export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene, scene.GAME_WIDTH / 2, scene.GAME_HEIGHT / 2, "atlas", "cyber-liberty-dude-0.png");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(3)
            .setInteractive({ draggable: true })
            .setCollideWorldBounds(true)
            .setDepth(1);
        // dude is 22x32
        this.body.setSize(22, 32);
        // offset is 5x0
        this.body.setOffset(5, 0);
        this.anims.create({
            key: "default",
            frames: this.anims.generateFrameNames("atlas", {
                prefix: "cyber-liberty-dude-",
                start: 0,
                end: 1,
                suffix: ".png"
            }),
            frameRate: 14,
            repeat: -1
        });
        this.play("default");
        this.on("drag", function (pointer, dragX, dragY) {
            this.x = dragX;
            this.y = dragY;
        });
    }
}
export const ENEMY_WAVES = [
    function (viewportLeft, viewportRight) {
        viewportLeft || (viewportLeft = 0);
        viewportRight || (viewportRight = this.GAME_WIDTH);
        for (let idx = 0; idx < 3; idx++) {
            new SmileyDisc({ idx, exitAfter2Tweens: true }, this, viewportLeft);
            new SmileyDisc({ idx, exitAfter2Tweens: true }, this, viewportRight);
        }
    },
    function (viewportLeft, viewportRight) {
        viewportLeft || (viewportLeft = 0);
        viewportRight || (viewportRight = this.GAME_WIDTH);
        for (let idx = 0; idx < 4; idx++) {
            new SmileyDisc({
                idx,
                offsetX: true,
                ease: Phaser.Math.Easing.Quadratic.In,
                descendFaster: true
            }, this, viewportLeft);
            new PinkBunny({ idx, descendFaster: true }, this, viewportRight);
        }
    },
    function (viewportLeft, viewportRight) {
        viewportLeft || (viewportLeft = 0);
        viewportRight || (viewportRight = this.GAME_WIDTH);
        new PinkBunny({ idx: 0, descendFaster: true }, this, viewportLeft);
        new PinkBunny({ idx: 0, descendFaster: true }, this, viewportRight);
        for (let idx = 1; idx < 4; idx++) {
            new SmileyDisc({ idx, offsetX: true, descendFaster: true }, this, viewportLeft);
            new SmileyDisc({ idx, offsetX: true, descendFaster: true }, this, viewportRight);
        }
    }
];
export const config = {
    type: Phaser.AUTO,
    backgroundColor: "#092344",
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: "phaser-example",
        width: 360,
        height: 640,
        min: {
            width: 180,
            height: 320
        },
        max: {
            width: 2160,
            height: 3840
        }
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    pixelArt: true,
    roundPixels: false
};
export class MyScene extends Phaser.Scene {
    constructor() {
        super({ key: "MyScene" });
    }
    preload() {
        // No external assets to load;
        // we will generate textures for emojis on the fly.
    }
    create() {
        // Fade camera in
        this.cameras.main.setAlpha(0);
        this.tweens.add({
            targets: this.cameras.main,
            alpha: 1,
            duration: 1000,
            ease: "Linear"
        });
        // Create a Text object and give it arcade physics
        const invader = this.add.text(400, 300, "👾", { fontSize: "64px" });
        invader.setDepth(1); // Bring the emoji to the front
        this.physics.add.existing(invader);
        invader.body.setVelocity(150, 150);
        invader.body.setBounce(1, 1);
        invader.body.setCollideWorldBounds(true);
        invader.body.onWorldBounds = (body, up, down, left, right) => {
            if ((up && left) || (up && right) || (down && left) || (down && right)) {
                invader.setTint(Math.random() * 0xffffff);
                this.cameras.main.shake(100, 0.05);
            }
        };
        invader.setInteractive();
        invader.enableFilters();
        // invader.filters.internal.addBloom();
        invader.filters.internal.addPixelate();
        // invader.preFX.addBloom();
        /* ```
         *
         * @class Glow
         * @extends Phaser.FX.Controller
         * @memberof Phaser.FX
         * @constructor
         * @since 3.60.0
         *
         * @param {Phaser.GameObjects.GameObject} gameObject - A reference to the Game Object that has this fx.
         * @param {number} [color=0xffffff] - The color of the glow effect as a number value.
         * @param {number} [outerStrength=4] - The strength of the glow outward from the edge of the Sprite.
         * @param {number} [innerStrength=0] - The strength of the glow inward from the edge of the Sprite.
         * @param {boolean} [knockout=false] - If `true` only the glow is drawn, not the texture itself.
         */
        invader.filters.internal.addGlow(0xf200f9, 0, 1);
        // invader.setPostPipeline(Phaser.Renderer.WebGL.Pipelines.BloomPostFX);
        // Create a second invader
        const invader2 = this.add.text(200, 150, "👾", { fontSize: "64px" });
        invader2.setDepth(1);
        this.physics.add.existing(invader2);
        invader2.body.setVelocity(-150, -150);
        invader2.body.setBounce(1, 1);
        invader2.body.setCollideWorldBounds(true);
        invader2.setInteractive();
        invader2.enableFilters();
        invader2.filters.internal.addPixelate();
        // invader2.preFX.addBloom()
        invader2.filters.internal.addGlow(0xf200f9, 0, 1);
        // invader2.setPostPipeline(Phaser.Renderer.WebGL.Pipelines.BloomPostFX);
        // Enable collision between invaders
        this.physics.add.collider(invader, invader2, () => {
            invader.setTint(Math.random() * 0xffffff);
            invader2.setTint(Math.random() * 0xffffff);
            // Emit "Brooke" particles from invader
            const brookeText = "Brooke";
            const brookeTextureKey = "emoji-" + brookeText;
            this.generateEmojiTexture(brookeText, brookeTextureKey);
            const emitter1 = this.add.particles(invader.x, invader.y, brookeTextureKey, {
                lifespan: 2000,
                speed: { min: 50, max: 100 },
                scale: { start: 0.5, end: 0 },
                gravityY: 50,
                blendMode: "ADD",
                emitting: false
            });
            emitter1.explode(20);
            // Emit "Sawyer" particles from invader2
            const sawyerText = "Sawyer";
            const sawyerTextureKey = "emoji-" + sawyerText;
            this.generateEmojiTexture(sawyerText, sawyerTextureKey);
            const emitter2 = this.add.particles(invader2.x, invader2.y, sawyerTextureKey, {
                lifespan: 2000,
                speed: { min: 50, max: 100 },
                scale: { start: 0.5, end: 0 },
                gravityY: 50,
                blendMode: "ADD",
                emitting: false
            });
            emitter2.explode(20);
        });
        // Handle invader clicks
        invader.on("pointerdown", (pointer) => {
            const randomXVelocity = Phaser.Math.Between(-300, 300);
            const randomYVelocity = Phaser.Math.Between(-300, 300);
            invader.body.setVelocity(randomXVelocity, randomYVelocity);
        });
        invader2.on("pointerdown", (pointer) => {
            const randomXVelocity = Phaser.Math.Between(-300, 300);
            const randomYVelocity = Phaser.Math.Between(-300, 300);
            invader2.body.setVelocity(randomXVelocity, randomYVelocity);
        });
        // Handle user clicks
        this.input.on("pointerdown", (pointer) => {
            const emojis = ["💥", "✨", "🌟", "💫", "💨", "Cat", "All the🙂"];
            const randomEmoji = Phaser.Utils.Array.GetRandom(emojis);
            const textureKey = "emoji-" + randomEmoji;
            this.generateEmojiTexture(randomEmoji, textureKey);
            const emitter = this.add.particles(pointer.x, pointer.y, textureKey, {
                lifespan: 4000,
                speed: { min: 150, max: 250 },
                scale: { start: 0.8, end: 0 },
                gravityY: 150,
                blendMode: "ADD",
                emitting: false
            });
            emitter.explode(50);
        });
        this.scene.run("gameScene");
    }
    update() {
        // Empty for now
    }
    /**
     * Generate a texture on the fly from an emoji (or any text).
     * This will create a “key” in Phaser’s texture manager so that
     * the particles can use it as an image/texture frame.
     */
    generateEmojiTexture(emoji, key) {
        if (this.textures.exists(key))
            return;
        // Create an off-screen Text object
        const tempText = this.add
            .text(0, 0, emoji, {
            fontSize: "64px",
            color: "#fff"
        })
            .setOrigin(0, 0) // Ensure text origin is at top-left
            .setVisible(false); // Hide from the main scene
        // Force Phaser to measure text fully
        tempText.updateText();
        // Use the measured width/height
        const { width, height } = tempText;
        // Create a RenderTexture with the same measured size
        const rt = this.make.renderTexture({
            x: 0,
            y: 0,
            width,
            height
        }, false);
        // Draw the text at (0,0) on the RenderTexture
        rt.draw(tempText, 0, 0);
        // Save the RenderTexture as a new texture key in the Texture Manager
        rt.saveTexture(key);
        // Cleanup
        tempText.destroy();
        rt.destroy();
    }
}
import { GAME_DIMENSIONS } from "./constants.js";
import { gameState } from "./gameState.js";
import { PLAYER_STATES } from "./enums/player-boss-states.js";
import { getDisplayedHighScore, getWorldBestLabel } from "./hi-score-ui.js";
var GW = GAME_DIMENSIONS.WIDTH;
var GH = GAME_DIMENSIONS.HEIGHT;
var GCX = GAME_DIMENSIONS.CENTER_X;
var GCY = GAME_DIMENSIONS.CENTER_Y;
function recipeData() {
    return gameState._phaserRecipe || null;
}
function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
}
function rectOverlap(a, b) {
    return (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y);
}
export class PhaserGameScene extends Phaser.Scene {
    constructor() {
        super({ key: "PhaserGameScene" });
    }
    create() {
        this.recipe = recipeData();
        if (!this.recipe) {
            this.scene.start("PhaserTitleScene");
            return;
        }
        this.frameCnt = 0;
        this.waveCount = 0;
        this.waveInterval = 80;
        this.enemyWaveFlg = false;
        this.theWorldFlg = false;
        this.sceneSwitch = 0;
        this.bossActive = false;
        this.bossTimerCountDown = 99;
        this.bossTimerFrameCnt = 0;
        this.bossTimerStartFlg = false;
        this.gameStarted = false;
        this.stageCleared = false;
        this.playerDead = false;
        this.scoreCount = 0;
        this.comboCount = 0;
        this.comboTimeCnt = 0;
        this.spGauge = 0;
        this.spFired = false;
        var stageId = gameState.stageId || 0;
        this.stageKey = "stage" + String(stageId);
        var enemyList = this.recipe[this.stageKey]
            ? this.recipe[this.stageKey].enemylist
            : [];
        this.stageEnemyPositionList = enemyList || [];
        this.stageBg = this.add.tileSprite(0, 0, GW, GH, "stage_loop" + stageId);
        this.stageBg.setOrigin(0, 0);
        this.stageEndBg = this.add.image(0, -GH, "stage_end" + stageId);
        this.stageEndBg.setOrigin(0, 0);
        this.stageEndBg.setVisible(false);
        this.unitGroup = this.add.group();
        this.bulletGroup = this.add.group();
        this.enemyBulletGroup = this.add.group();
        this.itemGroup = this.add.group();
        this.enemies = [];
        this.playerBullets = [];
        this.enemyBullets = [];
        this.items = [];
        this.createPlayer();
        this.createHUD();
        this.createCover();
        this.boss = null;
        this.bossSprite = null;
        this.bossHp = 0;
        this.bossMaxHp = 0;
        this.bossScore = 0;
        this.bossInterval = 0;
        this.bossIntervalCnt = 0;
        this.bossName = "";
        this.showTitle();
        this.input.on("pointermove", this.onPointerMove, this);
        this.input.on("pointerdown", this.onPointerDown, this);
        this.input.on("pointerup", this.onPointerUp, this);
        this.isDragging = false;
        this.shootTimer = 0;
        this.shootInterval = this.recipe.playerData.shootNormal.interval || 23;
        this.shootMode = gameState.shootMode || "normal";
        this.shootSpeed = gameState.shootSpeed || "speed_normal";
        this.stageBgmName = "";
        this.playBossBgm(stageId);
    }
    playBossBgm(stageId) {
        var bossNames = ["bison", "barlog", "sagat", "vega", "fang"];
        var name = bossNames[stageId] || "bison";
        var key = "boss_" + name + "_bgm";
        this.stageBgmName = key;
    }
    createPlayer() {
        var pd = this.recipe.playerData;
        var frames = pd.texture || [];
        var frameKey = frames[0] || "player00.gif";
        this.playerSprite = this.add.sprite(GCX, GH - 80, "game_asset", frameKey);
        this.playerSprite.setOrigin(0.5);
        this.playerHp = gameState.playerHp || pd.maxHp;
        this.playerMaxHp = gameState.playerMaxHp || pd.maxHp;
        this.playerAnimFrames = frames;
        this.playerAnimIdx = 0;
        this.playerAnimTimer = 0;
        this.barrierActive = false;
        this.barrierTimer = 0;
        this.barrierSprite = null;
    }
    createHUD() {
        this.hudBg = this.add.sprite(0, 0, "game_ui", "hudBg0.gif");
        this.hudBg.setOrigin(0, 0);
        this.hudBg.setDepth(100);
        this.hpBar = this.add.sprite(49, 7, "game_ui", "hpBar.gif");
        this.hpBar.setOrigin(0, 0);
        this.hpBar.setDepth(101);
        this.hpBar.setScale(this.playerHp / this.playerMaxHp, 1);
        this.scoreLabel = this.add.sprite(30, 25, "game_ui", "smallScoreTxt.gif");
        this.scoreLabel.setOrigin(0, 0);
        this.scoreLabel.setDepth(101);
        this.scoreText = this.add.text(this.scoreLabel.x + this.scoreLabel.width + 2, 25, "0", {
            fontFamily: "Arial",
            fontSize: "12px",
            fontStyle: "bold",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 2
        });
        this.scoreText.setDepth(101);
        this.worldBestText = this.add.text(30, 40, getWorldBestLabel() + " " + String(getDisplayedHighScore()), {
            fontFamily: "Arial",
            fontSize: "9px",
            fontStyle: "bold",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 2
        });
        this.worldBestText.setDepth(101);
        this.comboLabel = this.add.sprite(149, 32, "game_ui", "comboBar.gif");
        this.comboLabel.setOrigin(0, 0);
        this.comboLabel.setDepth(101);
        this.comboLabel.setScale(0, 1);
        this.comboText = this.add.text(194, 19, "0", {
            fontFamily: "Arial",
            fontSize: "14px",
            fontStyle: "bold",
            color: "#ffff00",
            stroke: "#000000",
            strokeThickness: 2
        });
        this.comboText.setDepth(101);
        this.spGaugeBar = this.add.graphics();
        this.spGaugeBar.setDepth(102);
        this.updateSpGauge();
        this.spBtn = this.add.text(GW - 35, GCY + 20, "SP", {
            fontFamily: "Arial",
            fontSize: "14px",
            fontStyle: "bold",
            color: "#ff0000",
            backgroundColor: "#330000",
            padding: { x: 6, y: 4 }
        });
        this.spBtn.setOrigin(0.5);
        this.spBtn.setDepth(103);
        this.spBtn.setInteractive({ useHandCursor: true });
        this.spBtn.setAlpha(0.3);
        this.spBtn.on("pointerup", this.onSpFire, this);
        this.bossTimerText = this.add.text(GCX, 60, "", {
            fontFamily: "Arial",
            fontSize: "16px",
            fontStyle: "bold",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 2
        });
        this.bossTimerText.setOrigin(0.5, 0);
        this.bossTimerText.setDepth(101);
        this.bossTimerText.setVisible(false);
    }
    createCover() {
        this.coverOverlay = this.add.tileSprite(0, 0, GW, GH, "game_ui", "stagebgOver.gif");
        this.coverOverlay.setOrigin(0, 0);
        this.coverOverlay.setDepth(99);
    }
    showTitle() {
        var stageId = gameState.stageId || 0;
        var self = this;
        this.titleText = this.add.text(GCX, GCY - 40, "ROUND " + String(stageId + 1), {
            fontFamily: "sans-serif",
            fontSize: "24px",
            fontStyle: "bold",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 3
        });
        this.titleText.setOrigin(0.5);
        this.titleText.setDepth(200);
        this.fightText = this.add.text(GCX, GCY + 10, "FIGHT!", {
            fontFamily: "sans-serif",
            fontSize: "18px",
            fontStyle: "bold",
            color: "#ff4444",
            stroke: "#000000",
            strokeThickness: 3
        });
        this.fightText.setOrigin(0.5);
        this.fightText.setDepth(200);
        this.fightText.setAlpha(0);
        this.playSound("voice_round" + String(Math.min(stageId, 3)), 0.7);
        this.tweens.add({
            targets: this.titleText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500,
            yoyo: true,
            onComplete: function () {
                self.playSound("voice_fight", 0.7);
                self.tweens.add({
                    targets: self.fightText,
                    alpha: 1,
                    duration: 300,
                    onComplete: function () {
                        self.time.delayedCall(800, function () {
                            if (self.titleText)
                                self.titleText.destroy();
                            if (self.fightText)
                                self.fightText.destroy();
                            self.titleText = null;
                            self.fightText = null;
                            self.startGame();
                        });
                    }
                });
            }
        });
    }
    startGame() {
        this.gameStarted = true;
        this.enemyWaveFlg = true;
        this.frameCnt = 0;
        this.waveCount = 0;
    }
    onPointerDown(pointer) {
        this.isDragging = true;
    }
    onPointerUp(pointer) {
        this.isDragging = false;
    }
    onPointerMove(pointer) {
        if (!this.gameStarted || this.playerDead || this.theWorldFlg) {
            return;
        }
        this.playerSprite.x = clamp(pointer.x, 16, GW - 16);
    }
    updateSpGauge() {
        this.spGaugeBar.clear();
        this.spGaugeBar.fillStyle(0x333333, 0.7);
        this.spGaugeBar.fillRect(GW - 70, GCY + 35, 60, 8);
        this.spGaugeBar.fillStyle(this.spGauge >= 100 ? 0xff0000 : 0x00aaff, 1);
        this.spGaugeBar.fillRect(GW - 70, GCY + 35, 60 * Math.min(this.spGauge / 100, 1), 8);
    }
    onSpFire() {
        if (this.spGauge < 100 || this.spFired || !this.gameStarted) {
            return;
        }
        this.doSpFire();
    }
    doSpFire() {
        this.spFired = true;
        this.spGauge = 0;
        this.updateSpGauge();
        this.playSound("se_sp", 0.8);
        this.playSound("g_sp_voice", 0.7);
        this.theWorldFlg = true;
        for (var i = this.playerBullets.length - 1; i >= 0; i--) {
            this.playerBullets[i].destroy();
        }
        this.playerBullets = [];
        var spLine = this.add.graphics();
        spLine.setDepth(150);
        spLine.fillStyle(0xff0000, 1);
        spLine.fillRect(this.playerSprite.x - 1, 0, 3, GH);
        var self = this;
        this.tweens.add({
            targets: spLine,
            alpha: 0,
            duration: 600,
            onComplete: function () {
                spLine.destroy();
            }
        });
        this.time.delayedCall(300, function () {
            self.spExplosions();
        });
        this.time.delayedCall(2500, function () {
            self.theWorldFlg = false;
            self.spFired = false;
            for (var e = self.enemies.length - 1; e >= 0; e--) {
                var en = self.enemies[e];
                if (en && en.active && en.getData("type") !== "boss") {
                    self.enemyDie(en, true);
                }
            }
        });
    }
    spExplosions() {
        var self = this;
        var count = 0;
        var interval = this.time.addEvent({
            delay: 60,
            repeat: 15,
            callback: function () {
                var ex = count % 8;
                var ey = Math.floor(count / 8);
                var x = ex * 35 + (ey % 2 === 0 ? 0 : 15);
                var y = GH - 60 - ey * 45;
                var explosion = self.add.sprite(x, y, "game_asset", "spExplosion00.gif");
                explosion.setOrigin(0, 0);
                explosion.setDepth(140);
                self.playSound("se_sp_explosion", 0.3);
                self.tweens.add({
                    targets: explosion,
                    alpha: 0,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    duration: 500,
                    onComplete: function () {
                        explosion.destroy();
                    }
                });
                count++;
            }
        });
    }
    shoot() {
        if (!this.gameStarted || this.playerDead || this.theWorldFlg) {
            return;
        }
        var pd = this.recipe.playerData;
        var shootData;
        switch (this.shootMode) {
            case "big":
                shootData = pd.shootBig;
                break;
            case "3way":
                shootData = pd.shoot3way;
                break;
            default:
                shootData = pd.shootNormal;
                break;
        }
        var frameKey = (shootData.texture && shootData.texture[0]) || "shot00.gif";
        if (this.shootMode === "3way") {
            for (var a = -1; a <= 1; a++) {
                var b = this.add.sprite(this.playerSprite.x + a * 10, this.playerSprite.y - 20, "game_asset", frameKey);
                b.setOrigin(0.5);
                b.setDepth(50);
                b.setData("damage", shootData.damage);
                b.setData("hp", shootData.hp);
                b.setData("angle", a * 0.15);
                this.playerBullets.push(b);
            }
        }
        else {
            var bullet = this.add.sprite(this.playerSprite.x, this.playerSprite.y - 20, "game_asset", frameKey);
            bullet.setOrigin(0.5);
            bullet.setDepth(50);
            bullet.setData("damage", shootData.damage);
            bullet.setData("hp", shootData.hp);
            bullet.setData("angle", 0);
            if (this.shootMode === "big") {
                bullet.setScale(1.5);
            }
            this.playerBullets.push(bullet);
        }
        this.playSound("se_shoot", 0.3);
    }
    createEnemy(data, x, y, itemName) {
        var frames = data.texture || [];
        var frameKey = frames[0] || "soliderA0.gif";
        var enemy = this.add.sprite(x, y, "game_asset", frameKey);
        enemy.setOrigin(0.5);
        enemy.setDepth(40);
        enemy.setData("type", "enemy");
        enemy.setData("hp", data.hp || 1);
        enemy.setData("maxHp", data.hp || 1);
        enemy.setData("speed", data.speed || 0.8);
        enemy.setData("score", data.score || 100);
        enemy.setData("spgage", data.spgage || 1);
        enemy.setData("interval", data.interval || 300);
        enemy.setData("shootCnt", 0);
        enemy.setData("itemName", itemName || null);
        enemy.setData("frames", frames);
        enemy.setData("animIdx", 0);
        enemy.setData("animTimer", 0);
        enemy.setData("projData", data.bulletData || data.projectileData || null);
        this.enemies.push(enemy);
        return enemy;
    }
    enemyWave() {
        if (this.waveCount >= this.stageEnemyPositionList.length) {
            this.bossAdd();
            return;
        }
        var row = this.stageEnemyPositionList[this.waveCount] || [];
        for (var i = 0; i < row.length; i++) {
            var code = String(row[i]);
            if (code === "00")
                continue;
            var enemyType = code.substr(0, 1);
            var itemCode = code.substr(1, 1);
            var dataKey = "enemy" + enemyType;
            var enemyData = this.recipe.enemyData
                ? this.recipe.enemyData[dataKey]
                : null;
            if (!enemyData)
                continue;
            var itemName = null;
            switch (itemCode) {
                case "1":
                    itemName = PLAYER_STATES.SHOOT_NAME_BIG;
                    break;
                case "2":
                    itemName = PLAYER_STATES.SHOOT_NAME_3WAY;
                    break;
                case "3":
                    itemName = PLAYER_STATES.SHOOT_SPEED_HIGH;
                    break;
                case "9":
                    itemName = PLAYER_STATES.BARRIER;
                    break;
            }
            this.createEnemy(enemyData, 32 * i + 16, -16, itemName);
        }
        this.waveCount++;
    }
    bossAdd() {
        if (this.bossActive)
            return;
        this.bossActive = true;
        this.enemyWaveFlg = false;
        var stageId = gameState.stageId || 0;
        var bossData = this.recipe.bossData
            ? this.recipe.bossData["boss" + String(stageId)]
            : null;
        if (!bossData) {
            this.stageClear();
            return;
        }
        this.bossHp = bossData.hp || 100;
        this.bossMaxHp = this.bossHp;
        this.bossScore = bossData.score || 5000;
        this.bossInterval = bossData.interval || 60;
        this.bossIntervalCnt = 0;
        this.bossName = bossData.name || "boss";
        var bossFrames = (bossData.anim && bossData.anim.idle) || bossData.texture || [];
        var bossFrame = bossFrames[0] || "bison_idle0.gif";
        this.bossSprite = this.add.sprite(GCX, -50, "game_asset", bossFrame);
        this.bossSprite.setOrigin(0.5);
        this.bossSprite.setDepth(45);
        this.bossSprite.setData("type", "boss");
        this.bossSprite.setData("hp", this.bossHp);
        this.bossSprite.setData("frames", bossFrames);
        this.bossSprite.setData("animIdx", 0);
        this.bossSprite.setData("animTimer", 0);
        this.bossSprite.setData("projData", bossData.bulletData || bossData.projectileData || null);
        this.enemies.push(this.bossSprite);
        var self = this;
        var bossNames = ["bison", "barlog", "sagat", "vega", "fang"];
        var voiceKey = "boss_" + (bossNames[stageId] || "bison") + "_voice_add";
        this.playSound(voiceKey, 0.7);
        var bgmKey = "boss_" + (bossNames[stageId] || "bison") + "_bgm";
        this.playBgm(bgmKey, 0.4);
        this.tweens.add({
            targets: this.bossSprite,
            y: 80,
            duration: 2000,
            ease: "Quint.easeOut",
            onComplete: function () {
                self.bossTimerCountDown = 99;
                self.bossTimerFrameCnt = 0;
                self.time.delayedCall(3000, function () {
                    self.bossTimerStartFlg = true;
                    self.bossTimerText.setVisible(true);
                    self.spBtn.setAlpha(1);
                });
            }
        });
        this.stageEndBg.setVisible(true);
        this.tweens.add({
            targets: this.stageEndBg,
            y: 0,
            duration: 3000
        });
    }
    enemyDie(enemy, isSp) {
        if (!enemy || !enemy.active)
            return;
        var score = enemy.getData("score") || 100;
        var spgage = enemy.getData("spgage") || 1;
        this.comboCount++;
        var ratio = Math.max(1, Math.ceil(this.comboCount / 10));
        this.scoreCount += score * ratio;
        this.comboTimeCnt = 100;
        if (!isSp) {
            this.spGauge = Math.min(100, this.spGauge + spgage);
            this.updateSpGauge();
            if (this.spGauge >= 100) {
                this.spBtn.setAlpha(1);
            }
        }
        var itemName = enemy.getData("itemName");
        if (itemName) {
            this.dropItem(enemy.x, enemy.y, itemName);
        }
        this.showExplosion(enemy.x, enemy.y);
        this.showScorePopup(enemy.x, enemy.y, score * ratio);
        this.playSound("se_explosion", 0.35);
        var idx = this.enemies.indexOf(enemy);
        if (idx >= 0)
            this.enemies.splice(idx, 1);
        enemy.destroy();
    }
    showExplosion(x, y) {
        var ex = this.add.sprite(x, y, "game_asset", "explosion00.gif");
        ex.setOrigin(0.5);
        ex.setDepth(60);
        this.tweens.add({
            targets: ex,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 400,
            onComplete: function () {
                ex.destroy();
            }
        });
    }
    showScorePopup(x, y, score) {
        var txt = this.add.text(x, y, String(score), {
            fontFamily: "Arial",
            fontSize: "10px",
            fontStyle: "bold",
            color: "#ffff00",
            stroke: "#000000",
            strokeThickness: 2
        });
        txt.setOrigin(0.5);
        txt.setDepth(110);
        this.tweens.add({
            targets: txt,
            y: y - 20,
            alpha: 0,
            duration: 800,
            onComplete: function () {
                txt.destroy();
            }
        });
    }
    dropItem(x, y, itemName) {
        var frameMap = {
            big: "powerupBig0.gif",
            "3way": "powerup3way0.gif",
            speed_high: "speedupItem0.gif",
            barrier: "barrierItem0.gif"
        };
        var frameKey = frameMap[itemName] || "powerupBig0.gif";
        var item = this.add.sprite(x, y, "game_asset", frameKey);
        item.setOrigin(0.5);
        item.setDepth(55);
        item.setData("itemName", itemName);
        this.items.push(item);
    }
    playerDamage(amount) {
        this.playerHp -= amount;
        if (this.playerHp <= 0) {
            this.playerHp = 0;
            this.playerDie();
        }
        this.hpBar.setScale(Math.max(0, this.playerHp / this.playerMaxHp), 1);
        this.playSound("se_damage", 0.15);
        this.cameras.main.shake(150, 0.01);
        var self = this;
        this.tweens.add({
            targets: this.hudBg,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 2
        });
    }
    playerDie() {
        if (this.playerDead)
            return;
        this.playerDead = true;
        this.gameStarted = false;
        this.showExplosion(this.playerSprite.x, this.playerSprite.y);
        this.playerSprite.setVisible(false);
        var self = this;
        this.time.delayedCall(2000, function () {
            gameState.score = self.scoreCount;
            self.scene.start("PhaserContinueScene");
        });
    }
    stageClear() {
        if (this.stageCleared)
            return;
        this.stageCleared = true;
        this.gameStarted = false;
        gameState.score = this.scoreCount;
        var self = this;
        var clearText = this.add.text(GCX, GCY, "STAGE CLEAR!", {
            fontFamily: "sans-serif",
            fontSize: "20px",
            fontStyle: "bold",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 3
        });
        clearText.setOrigin(0.5);
        clearText.setDepth(200);
        this.playSound("voice_ko", 0.7);
        this.time.delayedCall(2500, function () {
            self.stopAllSounds();
            gameState.stageId++;
            self.scene.start("PhaserAdvScene");
        });
    }
    timeoverComplete() {
        gameState.score = this.scoreCount;
        var self = this;
        this.time.delayedCall(2500, function () {
            self.stopAllSounds();
            self.scene.start("PhaserContinueScene");
        });
    }
    playSound(key, volume) {
        if (gameState.lowModeFlg)
            return;
        try {
            var vol = typeof volume === "number" ? volume : 0.7;
            if (this.cache.audio.exists(key)) {
                var existing = this.sound.get(key);
                if (existing) {
                    this.sound.play(key, { volume: vol });
                }
                else {
                    this.sound.add(key).play({ volume: vol });
                }
            }
        }
        catch (e) { }
    }
    playBgm(key, volume) {
        if (gameState.lowModeFlg)
            return;
        try {
            if (this.cache.audio.exists(key)) {
                var existing = this.sound.get(key);
                if (existing) {
                    if (existing.isPlaying)
                        existing.stop();
                    existing.play({ volume: volume || 0.4, loop: true });
                }
                else {
                    this.sound.add(key, { loop: true, volume: volume || 0.4 }).play();
                }
            }
        }
        catch (e) { }
    }
    stopAllSounds() {
        try {
            this.sound.stopAll();
        }
        catch (e) { }
    }
    update(time, delta) {
        if (!this.gameStarted)
            return;
        if (this.playerDead || this.stageCleared)
            return;
        if (this.theWorldFlg) {
            this.updateHUD();
            return;
        }
        this.stageBg.tilePositionY -= 0.7;
        this.shootTimer += delta;
        var interval = this.shootSpeed === "speed_high"
            ? this.shootInterval * 0.6
            : this.shootInterval;
        var intervalMs = interval * (1000 / 120);
        if (this.shootTimer >= intervalMs) {
            this.shootTimer = 0;
            this.shoot();
        }
        for (var b = this.playerBullets.length - 1; b >= 0; b--) {
            var bullet = this.playerBullets[b];
            if (!bullet.active) {
                this.playerBullets.splice(b, 1);
                continue;
            }
            var angle = bullet.getData("angle") || 0;
            bullet.y -= 4;
            bullet.x += angle * 4;
            if (bullet.y < -20) {
                bullet.destroy();
                this.playerBullets.splice(b, 1);
            }
        }
        for (var e = this.enemies.length - 1; e >= 0; e--) {
            var enemy = this.enemies[e];
            if (!enemy || !enemy.active) {
                this.enemies.splice(e, 1);
                continue;
            }
            var isBoss = enemy.getData("type") === "boss";
            if (!isBoss) {
                var speed = enemy.getData("speed") || 0.8;
                enemy.y += speed;
                var shootCnt = enemy.getData("shootCnt") + 1;
                enemy.setData("shootCnt", shootCnt);
                var shootInterval = enemy.getData("interval") || 300;
                if (shootInterval > 0 && shootCnt % shootInterval === 0) {
                    this.enemyShoot(enemy);
                }
            }
            else {
                this.bossIntervalCnt++;
                if (this.bossInterval > 0 &&
                    this.bossIntervalCnt % this.bossInterval === 0) {
                    this.enemyShoot(enemy);
                }
                if (!this.bossSprite || !this.bossSprite.active) {
                    this.enemies.splice(e, 1);
                    continue;
                }
            }
            var animFrames = enemy.getData("frames");
            if (animFrames && animFrames.length > 1) {
                var animTimer = enemy.getData("animTimer") + delta;
                enemy.setData("animTimer", animTimer);
                if (animTimer > 150) {
                    enemy.setData("animTimer", 0);
                    var animIdx = (enemy.getData("animIdx") + 1) % animFrames.length;
                    enemy.setData("animIdx", animIdx);
                    try {
                        enemy.setFrame(animFrames[animIdx]);
                    }
                    catch (err) { }
                }
            }
            var eRect = {
                x: enemy.x - enemy.width / 2,
                y: enemy.y - enemy.height / 2,
                w: enemy.width,
                h: enemy.height
            };
            for (var bb = this.playerBullets.length - 1; bb >= 0; bb--) {
                var pb = this.playerBullets[bb];
                if (!pb || !pb.active)
                    continue;
                var bRect = {
                    x: pb.x - pb.width / 2,
                    y: pb.y - pb.height / 2,
                    w: pb.width,
                    h: pb.height
                };
                if (enemy.y >= 40 && rectOverlap(eRect, bRect)) {
                    var dmg = pb.getData("damage") || 1;
                    var ehp = enemy.getData("hp") - dmg;
                    enemy.setData("hp", ehp);
                    if (this.shootMode !== "big") {
                        pb.destroy();
                        this.playerBullets.splice(bb, 1);
                    }
                    if (ehp <= 0) {
                        if (isBoss) {
                            this.bossDie(enemy);
                        }
                        else {
                            this.enemyDie(enemy, false);
                        }
                        break;
                    }
                }
            }
            if (!enemy.active)
                continue;
            if (this.barrierActive && this.barrierSprite) {
                var barRect = {
                    x: this.barrierSprite.x - 20,
                    y: this.barrierSprite.y - 20,
                    w: 40,
                    h: 40
                };
                if (rectOverlap(eRect, barRect) && !isBoss) {
                    this.enemyDie(enemy, false);
                    continue;
                }
            }
            var pRect = {
                x: this.playerSprite.x - 8,
                y: this.playerSprite.y - 16,
                w: 16,
                h: 32
            };
            if (rectOverlap(eRect, pRect) && !isBoss) {
                this.playerDamage(1);
                this.enemyDie(enemy, false);
                continue;
            }
            if (!isBoss &&
                (enemy.y > GH + 20 || enemy.x < -40 || enemy.x > GW + 40)) {
                var idx = this.enemies.indexOf(enemy);
                if (idx >= 0)
                    this.enemies.splice(idx, 1);
                enemy.destroy();
            }
        }
        for (var eb = this.enemyBullets.length - 1; eb >= 0; eb--) {
            var eBullet = this.enemyBullets[eb];
            if (!eBullet || !eBullet.active) {
                this.enemyBullets.splice(eb, 1);
                continue;
            }
            var rotX = eBullet.getData("rotX") || 0;
            var rotY = eBullet.getData("rotY") || 1;
            var spd = eBullet.getData("speed") || 1;
            eBullet.x += rotX * spd;
            eBullet.y += rotY * spd;
            if (eBullet.y > GH + 20 ||
                eBullet.y < -20 ||
                eBullet.x < -20 ||
                eBullet.x > GW + 20) {
                eBullet.destroy();
                this.enemyBullets.splice(eb, 1);
                continue;
            }
            var ebRect = {
                x: eBullet.x - eBullet.width / 2,
                y: eBullet.y - eBullet.height / 2,
                w: eBullet.width,
                h: eBullet.height
            };
            var pRect2 = {
                x: this.playerSprite.x - 8,
                y: this.playerSprite.y - 16,
                w: 16,
                h: 32
            };
            if (rectOverlap(ebRect, pRect2)) {
                var edamage = eBullet.getData("damage") || 1;
                this.playerDamage(edamage);
                eBullet.destroy();
                this.enemyBullets.splice(eb, 1);
            }
        }
        for (var it = this.items.length - 1; it >= 0; it--) {
            var item = this.items[it];
            if (!item || !item.active) {
                this.items.splice(it, 1);
                continue;
            }
            item.y += 1;
            var iRect = {
                x: item.x - item.width / 2,
                y: item.y - item.height / 2,
                w: item.width,
                h: item.height
            };
            var pRect3 = {
                x: this.playerSprite.x - 12,
                y: this.playerSprite.y - 20,
                w: 24,
                h: 40
            };
            if (rectOverlap(iRect, pRect3)) {
                var iname = item.getData("itemName");
                this.collectItem(iname);
                item.destroy();
                this.items.splice(it, 1);
                continue;
            }
            if (item.y > GH) {
                item.destroy();
                this.items.splice(it, 1);
            }
        }
        if (this.enemyWaveFlg) {
            if (this.frameCnt % this.waveInterval === 0) {
                this.enemyWave();
            }
            this.frameCnt++;
        }
        if (this.bossTimerStartFlg) {
            this.bossTimerFrameCnt++;
            if (this.bossTimerFrameCnt % 60 === 0) {
                this.bossTimerCountDown--;
                if (this.bossTimerCountDown <= 0) {
                    this.bossTimerStartFlg = false;
                    this.timeoverComplete();
                }
            }
            this.bossTimerText.setText("TIME " + String(Math.max(0, this.bossTimerCountDown)));
        }
        this.comboTimeCnt -= 0.1;
        if (this.comboTimeCnt <= 0) {
            this.comboTimeCnt = 0;
            this.comboCount = 0;
        }
        if (this.barrierActive) {
            this.barrierTimer -= delta / 1000;
            if (this.barrierTimer <= 0) {
                this.barrierActive = false;
                if (this.barrierSprite) {
                    this.barrierSprite.destroy();
                    this.barrierSprite = null;
                }
                this.playSound("se_barrier_end", 0.9);
            }
            else if (this.barrierSprite) {
                this.barrierSprite.x = this.playerSprite.x;
                this.barrierSprite.y = this.playerSprite.y;
            }
        }
        this.playerAnimTimer += delta;
        if (this.playerAnimTimer > 150 && this.playerAnimFrames.length > 1) {
            this.playerAnimTimer = 0;
            this.playerAnimIdx =
                (this.playerAnimIdx + 1) % this.playerAnimFrames.length;
            try {
                this.playerSprite.setFrame(this.playerAnimFrames[this.playerAnimIdx]);
            }
            catch (err) { }
        }
        this.updateHUD();
    }
    enemyShoot(enemy) {
        var projData = enemy.getData("projData");
        if (!projData)
            return;
        var frames = projData.texture || [];
        var frameKey = frames[0] || "normalProjectile0.gif";
        var speed = projData.speed || 1;
        var bullet = this.add.sprite(enemy.x, enemy.y + enemy.height / 2, "game_asset", frameKey);
        bullet.setOrigin(0.5);
        bullet.setDepth(41);
        bullet.setData("speed", speed);
        bullet.setData("damage", projData.damage || 1);
        var dx = this.playerSprite.x - enemy.x;
        var dy = this.playerSprite.y - enemy.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        bullet.setData("rotX", dx / dist);
        bullet.setData("rotY", dy / dist);
        this.enemyBullets.push(bullet);
    }
    bossDie(boss) {
        if (this.stageCleared)
            return;
        this.bossTimerStartFlg = false;
        this.bossTimerText.setVisible(false);
        this.theWorldFlg = true;
        this.comboCount++;
        var ratio = Math.max(1, Math.ceil(this.comboCount / 10));
        this.scoreCount += this.bossScore * ratio;
        this.showExplosion(boss.x, boss.y);
        this.showScorePopup(boss.x, boss.y, this.bossScore * ratio);
        var bossNames = ["bison", "barlog", "sagat", "vega", "fang"];
        var stageId = gameState.stageId || 0;
        var voiceKey = "boss_" + (bossNames[stageId] || "bison") + "_voice_ko";
        this.playSound(voiceKey, 0.9);
        this.playSound("se_finish_akebono", 0.9);
        var idx = this.enemies.indexOf(boss);
        if (idx >= 0)
            this.enemies.splice(idx, 1);
        boss.destroy();
        this.bossSprite = null;
        this.bossActive = false;
        for (var eb = this.enemyBullets.length - 1; eb >= 0; eb--) {
            if (this.enemyBullets[eb] && this.enemyBullets[eb].active) {
                this.enemyBullets[eb].destroy();
            }
        }
        this.enemyBullets = [];
        var self = this;
        this.time.delayedCall(2000, function () {
            self.stageClear();
        });
    }
    collectItem(itemName) {
        this.playSound("g_powerup_voice", 0.55);
        switch (itemName) {
            case PLAYER_STATES.SHOOT_SPEED_HIGH:
                this.shootSpeed = "speed_high";
                break;
            case PLAYER_STATES.BARRIER:
                this.barrierActive = true;
                this.barrierTimer = 4;
                this.playSound("se_barrier_start", 0.9);
                if (this.barrierSprite)
                    this.barrierSprite.destroy();
                this.barrierSprite = this.add.sprite(this.playerSprite.x, this.playerSprite.y, "game_asset", "barrier0.gif");
                this.barrierSprite.setOrigin(0.5);
                this.barrierSprite.setDepth(51);
                this.barrierSprite.setAlpha(0.6);
                break;
            case PLAYER_STATES.SHOOT_NAME_BIG:
                this.shootMode = "big";
                this.shootSpeed = "speed_normal";
                break;
            case PLAYER_STATES.SHOOT_NAME_3WAY:
                this.shootMode = "3way";
                this.shootSpeed = "speed_normal";
                break;
            default:
                this.shootMode = "normal";
                break;
        }
    }
    updateHUD() {
        if (this.scoreText) {
            this.scoreText.setText(String(this.scoreCount));
        }
        if (this.comboText) {
            this.comboText.setText(String(this.comboCount));
        }
        if (this.comboLabel) {
            this.comboLabel.setScale(this.comboTimeCnt / 100, 1);
        }
        if (this.worldBestText) {
            var best = Math.max(getDisplayedHighScore(), this.scoreCount);
            this.worldBestText.setText(getWorldBestLabel() + " " + String(best));
        }
    }
}
export default PhaserGameScene;