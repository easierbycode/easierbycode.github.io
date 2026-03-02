import CONSTANTS from "https://codepen.io/CodeMonkeyGames/pen/MWMxmOq.js";
import PROPERTIES from "https://codepen.io/CodeMonkeyGames/pen/rNERbzw.js";
import { LoadScene } from "https://codepen.io/CodeMonkeyGames/pen/LYKayQE.js";
import {
  AdvScene,
  BigNum,
  Boss,
  Bullet,
  Button,
  Character,
  ComboNum,
  Container,
  ContinueScene,
  Enemy,
  FlirtyGirl,
  FlirtyRevenge,
  GameoverScene,
  GotoTitleButton,
  Graphics,
  HUD,
  Item,
  MonkeyBrain,
  NoButton,
  Pyramid,
  Scene,
  ScoreNum,
  ScorePopover,
  SpecialBtn,
  Sprite,
  TitleScreen,
  Trump,
  YesButton
} from "https://codepen.io/CodeMonkeyGames/pen/MWRrLqy.js";

export class Player extends Character {
  constructor(t) {
    super(t.texture, t.explosion);

    var o = this;
    (t.barrierEffectTexture = "shieldEffect.png"),
      (t.hit = ["hit0.gif", "hit1.gif", "hit2.gif", "hit3.gif", "hit4.gif"]),
      (t.guard = [
        "guard0.gif",
        "guard1.gif",
        "guard2.gif",
        "guard3.gif",
        "guard4.gif"
      ]);

    o.barrier = new Character(t.barrier.texture);
    o.barrier.animationSpeed = 0.25;
    o.barrierEffect = new Character([t.barrierEffectTexture], {
      autoPlay: false,
      physics: false
    });

    this.scene.time.addEvent({
      callback: () => {
        // o.body.setSize(o.width - 14, o.height - 40),
        o.body.setSize(o.height - 40, o.width - 14),
          // o.body.setOffset(7 + o.width / 2, 20 + o.height / 2),
          (o.barrier.visible = false);
        o.barrierEffect.visible = false;
      }
    });

    (o.dragAreaRect = new Graphics(window.gameScene)),
      o.dragAreaRect.clear(),
      o.dragAreaRect.fill(0xffffff, 0),
      o.dragAreaRect.fillRect(
        0,
        0,
        CONSTANTS.GAME_WIDTH,
        CONSTANTS.GAME_HEIGHT
      ),
      o.dragAreaRect.setInteractive({
        useHandCursor: false,
        draggable: true
      });

    window.gameScene.add.existing(o.dragAreaRect);

    return (
      (o.name = t.name),
      (o.hp = t.hp),
      (o.maxHp = t.maxHp),
      (o.shootNormalData = t.shootNormal),
      (o.shootNormalData.explosion = t.hit),
      (o.shootNormalData.guard = t.guard),
      (o.shootBigData = t.shootBig),
      (o.shootBigData.explosion = t.hit),
      (o.shootBigData.guard = t.guard),
      (o.shoot3wayData = t.shoot3way),
      (o.shoot3wayData.explosion = t.hit),
      (o.shoot3wayData.guard = t.guard),
      (o.shootOn = 0),
      (o.bulletList = []),
      (o.bulletFrameCnt = 0),
      (o.bulletIdCnt = 0),
      (o.shootSpeed = 0),
      (o.shootInterval = 0),
      (o.shootData = {}),
      o.shootMode,
      (o._percent = 0),
      (o.unitX = 0),
      (o.unitY = 0),
      (o.animationSpeed = 0.35),
      (o.damageAnimationFlg = 0),
      (o.barrierFlg = 0),
      (o.screenDragFlg = 0),
      (o.beforeX = 0),
      (o.beforeY = 0),
      (o.keyDownFlg = 0),
      (o.keyDownCode = ""),
      o
    );
  }
  static SHOOT_NAME_NORMAL = "normal";
  static SHOOT_NAME_BIG = "big";
  static SHOOT_NAME_3WAY = "3way";
  static SHOOT_SPEED_NORMAL = "speed_normal";
  static SHOOT_SPEED_HIGH = "speed_high";
  static BARRIER = "barrier";
  onScreenDragStart(pointer, localX, localY, event) {
    (this.unitX = localX), (this.screenDragFlg = 1);
  }
  onScreenDragMove(pointer, localX, localY, event) {
    if (this.screenDragFlg) {
      this.unitX = localX;
      this.unitX = Phaser.Math.Clamp(
        this.unitX,
        this.body.width / 2,
        CONSTANTS.GAME_WIDTH - this.body.width / 2
      );
    }
  }
  onScreenDragEnd(t) {
    this.screenDragFlg = 0;
  }
  onKeyDown(t) {
    // TV remote - channel up/down to move, 0 for special
    switch (t.key) {
      case "0":
        return window.gameScene.hud.spFire();
      case "PageUp":
        this.unitX -= 6;
        break;
      case "PageDown":
        this.unitX += 6;
        break;
    }
    (this.keyDownFlg = 1), (this.keyDownCode = t.keyCode), t.preventDefault();
  }
  onKeyUp(t) {
    (this.keyDownFlg = 0), t.preventDefault();
  }
  update() {
    if (this.keyDownFlg) {
      switch (this.keyDownCode) {
        case 37:
          this.unitX -= 6;
          break;
        case 39:
          this.unitX += 6;
      }
      this.unitX <= this.body.width / 2 && (this.unitX = this.body.width / 2),
        this.unitX >= CONSTANTS.GAME_WIDTH - this.body.width / 2 &&
          (this.unitX = CONSTANTS.GAME_WIDTH - this.body.width / 2);
    }
    (this.x += 0.09 * (this.unitX - (this.x + this.body.width / 2))),
      (this.y += 0.09 * (this.unitY - this.y)),
      (this.barrier.x = this.x),
      (this.barrier.y = this.y),
      this.bulletFrameCnt++,
      this.shootOn &&
        this.bulletFrameCnt % (this.shootInterval - this.shootSpeed) == 0 &&
        this.shoot();
    for (var t = 0; t < this.bulletList.length; t++) {
      var e = this.bulletList[t];
      (e.x += 3.5 * Math.cos(e.rotation)),
        (e.y += 3.5 * Math.sin(e.rotation)),
        (e.y <= 40 || e.x <= -e.width || e.x >= CONSTANTS.GAME_WIDTH) &&
          (this.bulletRemove(e), this.bulletRemoveComplete(e));
    }
  }

  shoot() {
    switch (this.shootMode) {
      case Player.SHOOT_NAME_NORMAL:
        ((o = new Bullet(this.shootNormalData)).rotation =
          (270 * Math.PI) / 180),
          this.scene.updateBody(o),
          (o.x = this.x),
          (o.y = this.getTopCenter().y),
          (o.name = Player.SHOOT_NAME_NORMAL),
          (o.id = this.bulletIdCnt++),
          o.on(Character.CUSTOM_EVENT_DEAD, this.bulletRemove.bind(this, o)),
          o.on(
            Character.CUSTOM_EVENT_DEAD_COMPLETE,
            this.bulletRemoveComplete.bind(this, o)
          ),
          this.bulletList.push(o);
        break;
      case Player.SHOOT_NAME_BIG:
        ((o = new Bullet(this.shootBigData)).rotation = (270 * Math.PI) / 180),
          this.scene.updateBody(o),
          (o.x = this.x),
          (o.y = this.getTopCenter().y),
          (o.name = Player.SHOOT_NAME_BIG),
          (o.id = this.bulletIdCnt++),
          o.on(Character.CUSTOM_EVENT_DEAD, this.bulletRemove.bind(this, o)),
          o.on(
            Character.CUSTOM_EVENT_DEAD_COMPLETE,
            this.bulletRemoveComplete.bind(this, o)
          ),
          this.bulletList.push(o);
        break;
      case Player.SHOOT_NAME_3WAY:
        const y = this.getTopCenter().y;
        for (var t = 0; t < 3; t++) {
          var o = new Bullet(this.shoot3wayData);

          this.scene.updateBody(o),
            0 == t
              ? ((o.rotation = (280 * Math.PI) / 180),
                (o.x = this.x - 4),
                (o.y = y))
              : 1 == t
              ? ((o.rotation = (270 * Math.PI) / 180),
                (o.x = this.x),
                (o.y = y))
              : 2 == t &&
                ((o.rotation = (260 * Math.PI) / 180),
                (o.x = this.x + 4),
                (o.y = y)),
            (o.id = this.bulletIdCnt++),
            o.on(Character.CUSTOM_EVENT_DEAD, this.bulletRemove.bind(this, o)),
            o.on(
              Character.CUSTOM_EVENT_DEAD_COMPLETE,
              this.bulletRemoveComplete.bind(this, o)
            ),
            this.bulletList.push(o);
        }
    }
  }
  bulletRemove(t) {
    for (var e = 0; e < this.bulletList.length; e++)
      t.id == this.bulletList[e].id && this.bulletList.splice(e, 1);
  }
  bulletRemoveComplete(t) {
    t.off(Character.CUSTOM_EVENT_DEAD, this.bulletRemove.bind(this, t)),
      t.off(
        Character.CUSTOM_EVENT_DEAD_COMPLETE,
        this.bulletRemoveComplete.bind(this, t)
      );
    t.dead();
  }
  shootModeChange(t) {
    switch (((this.shootMode = t), this.shootMode)) {
      case Player.SHOOT_NAME_NORMAL:
        (this.shootData = this.shootNormalData),
          (this.shootInterval = this.shootData.interval);
        break;
      case Player.SHOOT_NAME_BIG:
        (this.shootData = this.shootBigData),
          (this.shootInterval = this.shootData.interval);
        break;
      case Player.SHOOT_NAME_3WAY:
        (this.shootData = this.shoot3wayData),
          (this.shootInterval = this.shootData.interval);
    }
  }
  shootSpeedChange(t) {
    switch (t) {
      case Player.SHOOT_SPEED_NORMAL:
        this.shootSpeed = 0;
        break;
      case Player.SHOOT_SPEED_HIGH:
        this.shootSpeed = 15;
    }
  }
  setUp(t, o, i) {
    let controllerIds = window.controllers
      ? Object.keys(window.controllers)
      : [];
    if (controllerIds.length) {
      this.gamepad = window.controllers[controllerIds[0]];
      this.gamepadVibration = this.gamepad?.vibrationActuator;
    }
    switch (
      ((this.hp = t),
      (this._percent = this.hp / this.maxHp),
      (this.shootMode = o),
      this.shootMode)
    ) {
      case Player.SHOOT_NAME_NORMAL:
        (this.shootData = this.shootNormalData),
          (this.shootInterval = this.shootData.interval);
        break;
      case Player.SHOOT_NAME_BIG:
        (this.shootData = this.shootBigData),
          (this.shootInterval = this.shootData.interval);
        break;
      case Player.SHOOT_NAME_3WAY:
        (this.shootData = this.shoot3wayData),
          (this.shootInterval = this.shootData.interval);
    }
    switch (i) {
      case Player.SHOOT_SPEED_NORMAL:
        this.shootSpeed = 0;
        break;
      case Player.SHOOT_SPEED_HIGH:
        this.shootSpeed = 15;
    }
  }
  shootStop() {
    this.shootOn = 0;
  }
  shootStart() {
    this.shootOn = 1;
  }
  barrierStart() {
    (this.barrierFlg = 1),
      (this.barrier.alpha = 0),
      (this.barrier.visible = true),
      (this.barrierEffect.x = this.x),
      (this.barrierEffect.y = this.y),
      (this.barrierEffect.alpha = 1),
      (this.barrierEffect.visible = true),
      this.barrierEffect.setScale(0.5),
      TweenMax.to(this.barrierEffect, 0.4, {
        scaleX: 1,
        scaleY: 1,
        ease: Quint.easeOut
      }),
      TweenMax.to(this.barrierEffect, 0.5, {
        alpha: 0
      }),
      this.tl && (this.tl.kill(), (this.tl = null)),
      (this.tl = new TimelineMax({
        onComplete: function () {
          (this.barrier.visible = !1),
            (this.barrierFlg = !1),
            (this.barrierEffect.visible = !1);
        },
        onCompleteScope: this
      })),
      this.tl
        .to(
          this.barrier,
          0.3,
          {
            alpha: 1
          },
          "+=0"
        )
        .call(
          function () {
            this.barrier.alpha = 0;
          },
          null,
          this,
          "+=4.0"
        )
        .to(
          this.barrier,
          1,
          {
            alpha: 1
          },
          "+=0"
        )
        .call(
          function () {
            this.barrier.alpha = 0;
          },
          null,
          this,
          "+=1"
        )
        .to(
          this.barrier,
          1,
          {
            alpha: 1
          },
          "+=0"
        )
        .call(
          function () {
            this.barrier.alpha = 0;
          },
          null,
          this,
          "+=0.5"
        )
        .to(
          this.barrier,
          0.5,
          {
            alpha: 1
          },
          "+=0"
        )
        .call(
          function () {
            this.barrier.alpha = 0;
          },
          null,
          this,
          "+=0.5"
        )
        .to(
          this.barrier,
          0.5,
          {
            alpha: 1
          },
          "+=0"
        )
        .call(
          function () {
            this.barrier.alpha = 0;
          },
          null,
          this,
          "+=0.1"
        )
        .call(
          function () {
            this.barrier.alpha = 1;
          },
          null,
          this,
          "+=0.1"
        )
        .call(
          function () {
            this.barrier.alpha = 0;
          },
          null,
          this,
          "+=0.1"
        )
        .call(
          function () {
            this.barrier.alpha = 1;
          },
          null,
          this,
          "+=0.1"
        );
  }
  barrierHitEffect() {
    if (this.gamepadVibration) {
      let weakMagnitude = this.x / CONSTANTS.GAME_WIDTH;
      let strongMagnitude = 1 - weakMagnitude;
      this.gamepadVibration.playEffect("dual-rumble", {
        startDelay: 0,
        duration: 40,
        weakMagnitude,
        strongMagnitude
      });
    } else {
      navigator.vibrate?.(30);
    }
    (this.barrier.tint = 16711680),
      TweenMax.to(this.barrier, 0.2, {
        tint: 16777215
      });
  }
  caFire() {}
  onDamage(t) {
    if (this.barrierFlg);
    else if (!0 !== this.damageAnimationFlg) {
      let weakMagnitude = this.x / CONSTANTS.GAME_WIDTH;
      let strongMagnitude = 1 - weakMagnitude;
      if (
        ((this.hp -= t),
        this.hp <= 0 && (this.hp = 0),
        (this._percent = this.hp / this.maxHp),
        this.hp <= 0)
      )
        if (this.gamepadVibration) {
          this.gamepadVibration.playEffect("dual-rumble", {
            startDelay: 0,
            duration: 777,
            weakMagnitude,
            strongMagnitude
          });

          this.dead();
        } else {
          navigator.vibrate?.(777), this.dead();
        }
      else {
        if (this.gamepadVibration) {
          this.gamepadVibration.playEffect("dual-rumble", {
            startDelay: 0,
            duration: 150,
            weakMagnitude,
            strongMagnitude
          });
        } else {
          navigator.vibrate?.(150);
        }

        var e = new TimelineMax({
          onComplete: function () {
            this.damageAnimationFlg = !1;
          }.bind(this)
        });
        e.to(this, 0.15, {
          delay: 0,
          y: this.y + 2,
          tint: 16711680,
          alpha: 0.2
        }),
          e.to(this, 0.15, {
            delay: 0,
            y: this.y - 2,
            tint: 16777215,
            alpha: 1
          }),
          e.to(this, 0.15, {
            delay: 0.05,
            y: this.y + 2,
            tint: 16711680,
            alpha: 0.2
          }),
          e.to(this, 0.15, {
            delay: 0,
            y: this.y - 2,
            tint: 16777215,
            alpha: 1
          }),
          e.to(this, 0.15, {
            delay: 0.05,
            y: this.y + 2,
            tint: 16711680,
            alpha: 0.2
          }),
          e.to(this, 0.15, {
            delay: 0,
            y: this.y + 0,
            tint: 16777215,
            alpha: 1
          }),
          e.to(this, 0.15, {
            delay: 0.05,
            y: this.y + 2,
            tint: 16711680,
            alpha: 0.2
          }),
          e.to(this, 0.15, {
            delay: 0,
            y: this.y + 0,
            tint: 16777215,
            alpha: 1
          });
      }
      this.damageAnimationFlg = !0;
    }
  }
  dead() {
    this.emit(Character.CUSTOM_EVENT_DEAD),
      this.shootStop(),
      this.explosion.on("animationcomplete", this.explosionComplete.bind(this)),
      (this.explosion.x = this.x),
      (this.explosion.y = this.y),
      this.explosion.play();
    for (var t = 0; t < this.bulletList.length; t++) {
      var e = this.bulletList[t];
      e.destroy();
    }
  }
  explosionComplete() {
    this.emit(Character.CUSTOM_EVENT_DEAD_COMPLETE);
  }
  castAdded(gameObject) {
    super.castAdded();
    gameObject.dragAreaRect.on(
      "pointerdown",
      gameObject.onScreenDragStart.bind(gameObject)
    ),
      gameObject.dragAreaRect.on(
        "pointerup",
        gameObject.onScreenDragEnd.bind(gameObject)
      ),
      gameObject.dragAreaRect.on(
        "pointerupoutside",
        gameObject.onScreenDragEnd.bind(gameObject)
      ),
      gameObject.dragAreaRect.on(
        "pointermove",
        gameObject.onScreenDragMove.bind(gameObject)
      );
    (gameObject.keyDownListener = gameObject.onKeyDown.bind(this)),
      (gameObject.keyUpListener = gameObject.onKeyUp.bind(this)),
      document.addEventListener("keydown", gameObject.keyDownListener),
      document.addEventListener("keyup", gameObject.keyUpListener),
      (gameObject.damageAnimationFlg = 0);
  }
  removedFromScene(gameObject, scene) {
    console.log("[Player] removedFromScene", gameObject);
    document.removeEventListener("keydown", this.keyDownListener),
      document.removeEventListener("keyup", this.keyUpListener),
      (this.keyDownListener = null),
      (this.keyUpListener = null);
  }
  get percent() {
    return this._percent;
  }
  set percent(t) {
    this._percent = t;
  }
}

class TitleScene extends Phaser.Scene {
  constructor() {
    super("title-scene");
  }

  create() {
    this.scene.start("game-scene");
  }
}

class GameScene extends Scene {
  waveInterval = 80;
  waveCount;
  frameCnt;
  frameCntUp = 1;
  enemyWaveFlg = 0;
  theWorldFlg = 0;
  enemyHitTestList;
  itemHitTestList;
  explosionTextures = [];
  specialExplosionTextures = [];
  itemTextureList = {};
  stageEnemyPositionList;

  constructor() {
    super("game-scene");
    window.gameScene = this;
  }

  init() {
    (PROPERTIES.caDamage = PROPERTIES.resource.recipe.data.playerData.caDamage),
      (PROPERTIES.playerMaxHp =
        PROPERTIES.resource.recipe.data.playerData.maxHp),
      (PROPERTIES.playerHp = PROPERTIES.playerMaxHp),
      (PROPERTIES.shootMode =
        PROPERTIES.resource.recipe.data.playerData.defaultShootName);

    for (var s = 0; s < 7; s++) {
      var r = "explosion0" + s + ".png";
      this.explosionTextures[s] = r;
    }
    for (var h = 0; h < 8; h++) {
      var l = "spExplosion0" + h + ".png";
      this.specialExplosionTextures[h] = l;
    }

    (this.itemTextureList.powerupBig = ["powerupBig0.png", "powerupBig1.png"]),
      (this.itemTextureList.powerup3way = [
        "powerup3way0.png",
        "powerup3way1.png"
      ]),
      (this.itemTextureList.barrier = ["barrierItem0.png", "barrierItem1.png"]),
      (this.itemTextureList.speedup = ["speedupItem0.png", "speedupItem1.png"]);

    var d = PROPERTIES.resource.recipe.data.playerData;
    d.explosion = this.explosionTextures;
    this.player = PROPERTIES.player = new Player(d);
    this.player.on(Player.CUSTOM_EVENT_DEAD, this.gameover.bind(this));
    this.player.on(
      Player.CUSTOM_EVENT_DEAD_COMPLETE,
      this.gameoverComplete.bind(this)
    );

    (this.hud = new HUD()),
      this.hud.on(HUD.CUSTOM_EVENT_SP_FIRE, this.spFire.bind(this)); //,
    // set HUD depth to 3
    // this.addChildAt(this.hud, 3),
    this.hud.setDepth(3);
    this.add.existing(this.hud);

    this.title = new TitleScreen(this);
    this.title.on(TitleScreen.EVENT_START, this.gameStart.bind(this));
    this.title.setDepth(4);
    this.add.existing(this.title);

    this.boss;
    this.bossTimerCountDown = 99;
    this.bossTimerFrameCnt = 0;
    this.bossTimerStartFlg = 0;
  }

  create() {
    const godMode = new URL(window.location.href).searchParams.get("godmode");
    const stageSelect = new URL(window.location.href).searchParams.get("stage");

    if (godMode != undefined) {
      PROPERTIES.playerMaxHp = 100;
      PROPERTIES.shootMode = Player.SHOOT_NAME_BIG;
      PROPERTIES.shootSpeed = Player.SHOOT_SPEED_HIGH;
    }
    if (stageSelect != undefined) PROPERTIES.stageId = +stageSelect;

    this.title.gameStart(PROPERTIES.stageId),
      this.hud.specialBtnDeactive(),
      TweenMax.delayedCall(
        2.6,
        function () {
          // AudioManager.play("g_stage_voice_" + String(D.stageId)); //,
          this.hud.specialBtnActive();
        }.bind(this)
      );

    var n = PROPERTIES.resource.recipe.data[
      "stage" + PROPERTIES.stageId
    ].enemylist.slice();

    this.stageEnemyPositionList = n.reverse();

    this.player.setUp(
      PROPERTIES.playerMaxHp,
      PROPERTIES.shootMode,
      PROPERTIES.shootSpeed
    ),
      (this.player.x = CONSTANTS.GAME_WIDTH / 2 - this.player.width / 2),
      (this.player.y = CONSTANTS.GAME_HEIGHT - this.player.height - 30),
      (this.player.unitX = CONSTANTS.GAME_WIDTH / 2),
      (this.player.unitY = this.player.y),
      this.hud.setPercent(this.player.percent),
      (this.hud.scoreCount = PROPERTIES.score),
      (this.hud.highScore = PROPERTIES.highScore),
      (this.hud.comboCount = PROPERTIES.combo),
      (this.hud.maxCombo = PROPERTIES.maxCombo),
      (this.hud.spgageCount = PROPERTIES.cagage),
      (this.hud.comboTimeCnt = 0),
      (PROPERTIES.combo = 0),
      (this.enemyWaveFlg = 0),
      (this.theWorldFlg = !1);
    this.waveCount = 0;
    this.frameCnt = 0;
    this.frameCntUp = 1;
    this.enemyHitTestList = [];
    this.itemHitTestList = [];
  }

  bossAdd() {
    let o;
    (o =
      PROPERTIES.resource.recipe.data.bossData[
        "boss" + PROPERTIES.stageId
      ]).explosion = [
      "explosion00.png",
      "explosion01.png",
      "explosion02.png",
      "explosion03.png",
      "explosion04.png",
      "explosion05.png",
      "explosion06.png"
    ];
    switch (+PROPERTIES.stageId) {
      case 0:
        this.boss = new Pyramid(o);
        break;
      case 1:
        this.boss = new FlirtyGirl(o);
        break;
      case 2:
        this.boss = new Trump(o);
        // needs manual shootStart since not triggered from Akuma code
        this.boss.shootStart();
        break;
      case 3:
        this.boss = new FlirtyRevenge(o);
        break;
      case 4:
        this.boss = new MonkeyBrain(o);
    }
    this.boss.on(Boss.CUSTOM_EVENT_DEAD, this.bossRemove.bind(this, this.boss)),
      this.boss.on(
        Boss.CUSTOM_EVENT_PROJECTILE_ADD,
        this.projectileAdd.bind(this, this.boss)
      );

    this.enemyHitTestList.push(this.boss);

    (this.bossTimerCountDown = 99),
      (this.bossTimerFrameCnt = 0),
      (this.bossTimerStartFlg = 1);

    this.enemyWaveFlg = 0;
  }

  bossRemove(t) {
    this.theWorldFlg = !0; //,
    for (var e = 0; e < this.player.bulletList.length; e++) {
      var o = this.player.bulletList[e];
      o.destroy();
    }
    (this.enemyHitTestList = []),
      (this.player.bulletList = []),
      TweenMax.delayedCall(
        2.5,
        function () {
          this.stageClear();
        }.bind(this)
      );
  }

  playerDamage(t) {
    new TimelineMax()
      .call(
        function () {
          (this.cameras.main.x = 4), (this.cameras.main.y = -2);
        }.bind(this),
        null,
        this,
        "+=0.0"
      )
      .call(
        function () {
          (this.cameras.main.x = -3), (this.cameras.main.y = 1);
        }.bind(this),
        null,
        this,
        "+=0.08"
      )
      .call(
        function () {
          (this.cameras.main.x = 2), (this.cameras.main.y = -1);
        }.bind(this),
        null,
        this,
        "+=0.07"
      )
      .call(
        function () {
          (this.cameras.main.x = -2), (this.cameras.main.y = 1);
        }.bind(this),
        null,
        this,
        "+=0.05"
      )
      .call(
        function () {
          (this.cameras.main.x = 1), (this.cameras.main.y = 1);
        }.bind(this),
        null,
        this,
        "+=0.05"
      )
      .call(
        function () {
          (this.cameras.main.x = 0), (this.cameras.main.y = 0);
        }.bind(this),
        null,
        this,
        "+=0.04"
      ),
      this.player.onDamage(t),
      this.hud.onDamage(this.player.percent);
  }

  enemyWave() {
    this.waveCount >= this.stageEnemyPositionList.length
      ? this.bossAdd()
      : this.enemyAdd();
  }

  enemyAdd() {
    for (
      var t = this.stageEnemyPositionList[this.waveCount], e = 0;
      e < t.length;
      e++
    ) {
      var o = t[e];

      if ("00" !== o) {
        var i = String(o).substr(0, 1),
          n = String(o).substr(1, 2),
          a = PROPERTIES.resource.recipe.data.enemyData["enemy" + i];

        switch (((a.explosion = this.explosionTextures), n)) {
          case "1":
            (a.itemName = Player.SHOOT_NAME_BIG),
              (a.itemTexture = this.itemTextureList.powerupBig);
            break;
          case "2":
            (a.itemName = Player.SHOOT_NAME_3WAY),
              (a.itemTexture = this.itemTextureList.powerup3way);
            break;
          case "3":
            (a.itemName = Player.SHOOT_SPEED_HIGH),
              (a.itemTexture = this.itemTextureList.speedup);
            break;
          case "9":
            (a.itemName = Player.BARRIER),
              (a.itemTexture = this.itemTextureList.barrier);
            break;
          default:
            (a.itemName = null), (a.itemTexture = null);
        }

        var s = new Enemy(a);
        (s.x = s.width / 2 + 32 * e),
          (s.y = -32),
          s.on(Enemy.CUSTOM_EVENT_DEAD, this.enemyRemove.bind(this, s)),
          s.on(
            Enemy.CUSTOM_EVENT_DEAD_COMPLETE,
            this.enemyRemoveComplete.bind(this, s)
          ),
          s.on(
            Enemy.CUSTOM_EVENT_PROJECTILE_ADD,
            this.projectileAdd.bind(this, s)
          ),
          this.enemyHitTestList.push(s);
      }
    }
    this.waveCount++;
  }

  projectileAdd(character) {
    switch (character.projectileData.name) {
      case "beam":
        for (var e = 0; e < 2; e++) {
          var o = 0 == e ? 121 : 141,
            n = new Bullet(character.projectileData),
            a = n.width,
            s = n.height,
            r = void 0;
          switch (character.projectileData.cnt) {
            case 0:
              (r = 105), this.updateBody(n);
              break;
            case 1:
              (r = 90), this.updateBody(n);
              break;
            case 2:
              (r = 75), this.updateBody(n);
          }
          (n.rotation = (r * Math.PI) / 180),
            (n.rotX = Math.cos((r * Math.PI) / 180)),
            (n.rotY = Math.sin((r * Math.PI) / 180)),
            (n.x = character.x + o),
            (n.y = character.y + 50),
            n.on(Bullet.CUSTOM_EVENT_DEAD, this.enemyRemove.bind(this, n)),
            n.on(
              Bullet.CUSTOM_EVENT_DEAD_COMPLETE,
              this.enemyRemoveComplete.bind(this, n)
            ),
            // this.unitContainer.addChild(n),
            this.enemyHitTestList.push(n);
        }
        character.projectileData.cnt >= 2
          ? (character.projectileData.cnt = 0)
          : character.projectileData.cnt++;
        break;
      case "smoke":
        var h = 60 * Math.random() + 60,
          l = new Bullet(character.projectileData);
        (l.hitArea = new Phaser.GameObjects.Rectangle(
          window.gameScene,
          20,
          20,
          l.width - 40,
          l.height - 40
        )),
          (l.rotX = Math.cos((h * Math.PI) / 180)),
          (l.rotY = Math.sin((h * Math.PI) / 180)),
          (l.x = character.x + character.width / 2 - 50),
          (l.y = character.y + 45),
          l.on(Bullet.CUSTOM_EVENT_DEAD, this.enemyRemove.bind(this, l)),
          l.on(
            Bullet.CUSTOM_EVENT_DEAD_COMPLETE,
            this.enemyRemoveComplete.bind(this, l)
          ),
          //   (l.loop = !1),
          //   l.on(
          //     "animationcomplete",
          //     function () {
          //       // l.character.gotoAndPlay(6);
          //       l.play({ startFrame: 6, repeat: 0 });
          //     }.bind(this)
          //   ),
          //   this.unitContainer.addChild(l),
          this.enemyHitTestList.push(l);
        break;
      case "meka":
        for (var u = 0; u < 32; u++) {
          var c = new Bullet(character.projectileData);
          (c.cont = 0),
            (c.start = 10 * u),
            (c.player = this.player),
            (c.x = character.body.x + character.body.width / 2),
            (c.y = character.body.y + character.body.height),
            c.setScale(0);
          var f = Math.random() * (CONSTANTS.GAME_WIDTH - 2 * character.body.x),
            d = Math.random() * character.body.height + character.body.y;
          TweenMax.to(c, 0.3, {
            x: f,
            y: d
          }),
            TweenMax.to(c, 0.3, {
              scaleX: 1,
              scaleY: 1
            }),
            c.on(Bullet.CUSTOM_EVENT_DEAD, this.enemyRemove.bind(this, c)),
            c.on(
              Bullet.CUSTOM_EVENT_DEAD_COMPLETE,
              this.enemyRemoveComplete.bind(this, c)
            ),
            // this.unitContainer.addChild(c),
            this.enemyHitTestList.push(c);
        }
        break;
      case "psychoField":
        for (var p = 0; p < 72; p++) {
          var m = new Bullet(character.projectileData, character.explosion);
          this.updateBody(m);
          (m.rotX = Math.cos(((p / 72) * 360 * Math.PI) / 180)),
            (m.rotY = Math.sin(((p / 72) * 360 * Math.PI) / 180)),
            (m.x = 50 * m.rotX + character.x + m.width / 2),
            (m.y = 50 * m.rotY + character.y);
          this.enemyHitTestList.push(m);
        }
        break;
      default:
        const bullet = new Bullet(
          character.projectileData,
          character.explosion
        );
        this.updateBody(bullet);
        (bullet.x = character.x), (bullet.y = character.y + bullet.height / 2);

        this.enemyHitTestList.push(bullet);
    }
  }

  enemyRemove(t) {
    if (
      ((this.hud.comboCount = 1),
      (this.hud.scoreCount = t.score),
      (this.hud.spgageCount = t.specialgage),
      this.hud.scoreView(t),
      t.itemName)
    ) {
      var e = new Item(t.itemTexture);
      (e.x = t.x),
        (e.y = t.y),
        (e.name = t.itemName),
        this.itemHitTestList.push(e);
    }
    for (var o = 0; o < this.enemyHitTestList.length; o++)
      t == this.enemyHitTestList[o] && this.enemyHitTestList.splice(o, 1);
  }

  enemyRemoveComplete(t) {
    t.off(Enemy.CUSTOM_EVENT_DEAD, this.enemyRemove.bind(this)),
      t.off(
        Enemy.CUSTOM_EVENT_DEAD_COMPLETE,
        this.enemyRemoveComplete.bind(this)
      ),
      t.off(Enemy.CUSTOM_EVENT_PROJECTILE_ADD, this.projectileAdd.bind(this)),
      t.destroy();
  }

  update() {
    if (!this.theWorldFlg) {
      this.player.update();

      this.hud.update();

      for (var t = 0; t < this.enemyHitTestList.length; t++) {
        var o = this.enemyHitTestList[t];
        o.update();

        var n = -o.width / 2,
          a = CONSTANTS.GAME_WIDTH - o.width / 2;

        if (o.y >= 40 && o.x >= n && o.x <= a) {
          for (var s = 0; s < this.player.bulletList.length; s++) {
            var r = this.player.bulletList[s];
            if (this.physics.world.overlap(o, r))
              switch (this.player.shootMode) {
                case Player.SHOOT_NAME_NORMAL:
                  o.onDamage(r.damage), r.onDamage(1, o.hp);
                  break;
                case Player.SHOOT_NAME_BIG:
                  null == o["bulletid" + r.id]
                    ? ((o["bulletid" + r.id] = 0),
                      (o["bulletframeCnt" + r.id] = 0),
                      o.onDamage(r.damage),
                      r.onDamage(1, o.hp))
                    : (o["bulletframeCnt" + r.id]++,
                      o["bulletframeCnt" + r.id] % 15 == 0 &&
                        (o["bulletid" + r.id]++,
                        o["bulletid" + r.id] <= 1 &&
                          (o.onDamage(r.damage), r.onDamage(1, o.hp))));
                  break;
                case Player.SHOOT_NAME_3WAY:
                  o.onDamage(r.damage), r.onDamage(1, o.hp);
                  break;
                default:
                  o.onDamage(1), r.onDamage(1, o.hp);
              }
          }
        }

        if (this.player.barrierFlg)
          this.physics.world.overlap(o, this.player.barrier) &&
            (this.player.barrierHitEffect(), o.dead());
        else if (this.physics.world.overlap(o, this.player))
          if ("goki" == o.name) {
            (this.theWorldFlg = !0),
              this.boss && this.boss.onTheWorld(this.theWorldFlg),
              this.boss.shungokusatsu(this.player, !0),
              (this.player.alpha = 0);
            for (var h = 0; h < this.player.bulletList.length; h++) {
              var l = this.player.bulletList[h];
              l.destroy();
            }
            TweenMax.delayedCall(
              1.8,
              function () {
                this.player.alpha = 1;
              }.bind(this),
              null,
              this
            ),
              TweenMax.delayedCall(
                1.9,
                function () {
                  this.stageBg.akebonoGokifinish();
                }.bind(this),
                null,
                this
              ),
              TweenMax.delayedCall(
                2.7,
                function () {
                  this.playerDamage(100);
                }.bind(this),
                null,
                this
              ),
              TweenMax.delayedCall(
                3,
                function () {
                  this.title.akebonofinish();
                }.bind(this),
                null,
                this
              );
          } else this.playerDamage(1);

        (o.x <= -50 ||
          o.x >= CONSTANTS.GAME_WIDTH + 33 ||
          o.y <= -33 ||
          o.y >= CONSTANTS.GAME_HEIGHT + o.height / 2) &&
          "boss" !== o.name &&
          (o.explosion && o.explosion.destroy(),
          o.destroy(),
          this.enemyHitTestList.splice(t, 1));
      }

      for (var u = 0; u < this.itemHitTestList.length; u++) {
        var c = this.itemHitTestList[u];
        if (((c.y += 1), this.physics.world.overlap(c, this.player))) {
          switch (c.name) {
            case Player.SHOOT_SPEED_HIGH:
              (PROPERTIES.shootSpeed = c.name),
                this.player.shootSpeedChange(PROPERTIES.shootSpeed);
              break;
            case Player.BARRIER:
              this.player.barrierStart();
              break;
            default:
              this.player.shootMode !== c.name &&
                ((PROPERTIES.shootSpeed = Player.SHOOT_SPEED_NORMAL),
                this.player.shootSpeedChange(PROPERTIES.shootSpeed)),
                (PROPERTIES.shootMode = c.name),
                this.player.shootModeChange(PROPERTIES.shootMode);
          }
          c.destroy(), this.itemHitTestList.splice(u, 1);
        }
        c.y >= CONSTANTS.GAME_HEIGHT - 10 &&
          (c.destroy(), this.itemHitTestList.splice(u, 1));
      }

      this.enemyWaveFlg &&
        (this.frameCnt % this.waveInterval == 0 && this.enemyWave(),
        (this.frameCnt += this.frameCntUp));
    }
  }

  stageClear() {
    (this.theWorldFlg = !0),
      (PROPERTIES.playerHp = this.player.hp),
      PROPERTIES.stageId++,
      (this.sceneSwitch = 1),
      this.player.shootStop(),
      TweenMax.delayedCall(
        2.3,
        function () {
          this.nextScene();
          this.sceneRemoved();
        }.bind(this)
      );
  }

  gameover() {
    (this.theWorldFlg = !0), this.boss && this.boss.onTheWorld(1);
  }

  gameoverComplete() {
    this.boss && this.boss.onTheWorld(1),
      TweenMax.delayedCall(
        2,
        function () {
          this.sceneRemoved();
        }.bind(this)
      );
  }

  spFire() {
    (this.theWorldFlg = true),
      (this.hud.spFireFlg = true),
      this.boss && this.boss.onTheWorld(this.theWorldFlg);

    // Create timeline for special attack animation
    var timeline = new TimelineMax();

    timeline
      .call(
        function () {
          for (
            var t = this,
              // e = 0,
              e = 26,
              o = 0,
              n = function (n) {
                n % 8 == 0 && ((e = o % 2 == 0 ? -30 : -45), o++);
                var a = new Character(gameScene.specialExplosionTextures, {
                  autoPlay: false
                });
                // (a.animationSpeed = 0.2),
                (a.animationSpeed = 0.3),
                  (a.loop = !1),
                  (a.x = e),
                  (a.y = CONSTANTS.GAME_HEIGHT - 45 * o - 120),
                  a.on(
                    "animationcomplete",
                    function (t) {
                      t.destroy();
                    }.bind(t, a)
                  ),
                  // (e += 30),
                  (e += 52),
                  TweenMax.delayedCall(
                    // 0.01 * n,
                    0.005 * n,
                    function () {
                      // this.unitContainer.addChild(a),
                      a.play(); //,
                      // n % 16 == 0 && AudioManager.play("se_ca_explosion");
                    },
                    null,
                    t
                  );
              },
              a = 0;
            a < 64;
            a++
          )
            n(a);
        },
        null,
        this
      )
      .call(
        function () {
          var t = this,
            e = this.enemyHitTestList.slice();
          if (e.length >= 100)
            for (var o = 0; o < e.length; o++) {
              var n = e[o];
              n.x >= -n.width / 2 &&
                n.x <= CONSTANTS.GAME_WIDTH &&
                n.y >= 20 &&
                n.y <= CONSTANTS.GAME_HEIGHT &&
                n.onDamage(PROPERTIES.caDamage);
            }
          else
            for (
              var a = function (o) {
                  var n = e[o];
                  n.x >= -n.width / 2 &&
                    n.x <= CONSTANTS.GAME_WIDTH &&
                    n.y >= 20 &&
                    n.y <= CONSTANTS.GAME_HEIGHT &&
                    TweenMax.delayedCall(
                      0.005 * o,
                      function () {
                        n.onDamage(PROPERTIES.caDamage);
                      },
                      null,
                      t
                    );
                },
                s = 0;
              s < e.length;
              s++
            )
              a(s);
        },
        null,
        this,
        "+=0.8"
      )
      .call(
        function () {
          this.theWorldFlg = false;
          this.hud.spFireFlg = false;

          if (this.boss) {
            if (this.boss.hp <= 0) {
              this.theWorldFlg = true;
            } else {
              this.boss.onTheWorld(this.theWorldFlg);
            }
          }
        },
        null,
        this,
        "+=0.7"
      );
  }

  gameStart() {
    this.enemyWaveFlg = 1;
    this.player.shootStart();
  }

  nextScene() {
    this.scene.stop();
  }

  sceneRemoved() {
    for (var t = 0; t < this.children.length; t++) {
      var o = this.children[t];
      this.sys.displayList.remove(o);
    }

    if (this.boss) {
      delete this.boss;
    }

    if (1 === this.sceneSwitch) {
      this.scene.start("adv-scene");
    } else {
      this.scene.start("continue-scene");
    }
  }

  updateBody(sprite) {
    this.time.addEvent({
      callback: () => {
        if (!sprite.body) return;

        if (sprite.angle == 0) {
          return sprite.body.setSize(sprite.width, sprite.height);
        }

        return sprite.body.setSize(sprite.height, sprite.width);
      }
    });
  }
}

class SandboxScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
    window.gameScene = this;
  }

  create() {
    const pic0 = this.add.image(40, 30, "game_ui", "hudCabtn100per.gif");

    const pic = this.add.image(40, 30, "game_ui", "hudCabtn0per.gif");

    const maskRect = this.add
      .rectangle(40, 30, 50, -50, 0x000000)
      .setVisible(false)
      .setScale(1, 0);

    this.mask = maskRect.createGeometryMask();

    pic.setMask(this.mask);
  }
}

var config = {
  // type: Phaser.CANVAS,
  width: CONSTANTS.GAME_WIDTH,
  height: CONSTANTS.GAME_HEIGHT,
  physics: {
    default: "arcade",
    arcade: {
      debug: new URL(window.location.href).searchParams.get("debug") == "1"
    }
  },
  scene: new URL(window.location.href).searchParams.get("sandbox")
    ? [LoadScene, TitleScene, SandboxScene]
    : [
        LoadScene,
        TitleScene,
        AdvScene,
        GameScene,
        GameoverScene,
        ContinueScene
      ],
  scale: {
    autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY,
    mode: Phaser.Scale.ScaleModes.FIT
  },
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true
  },
  fps: {
    target: new URL(window.location.href).searchParams.get("turbo") ? 120 : 60,
    forceSetTimeOut: true
  }
};

// Create game instance
var game = new Phaser.Game(config);
