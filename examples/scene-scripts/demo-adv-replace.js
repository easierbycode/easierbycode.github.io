// demo-adv-replace.js — replace-mode scene script for the story intro
// (AdvScene). Run with:
//   ?advScript=/examples/scene-scripts/demo-adv-replace.js&advScriptMode=replace
//
// Replaces the dialogue interlude with a Star-Wars-style text crawl built from
// scratch; tap / click / SPACE drops straight into the stage via ctx.next().

export default {
  create(ctx) {
    const { scene, Phaser } = ctx;
    const W = scene.scale.width;
    const H = scene.scale.height;

    scene.add.rectangle(0, 0, W, H, 0x000010).setOrigin(0, 0);
    const stars = scene.add.group();
    for (let i = 0; i < 60; i++) {
      const s = scene.add.rectangle(Phaser.Math.Between(0, W), Phaser.Math.Between(0, H),
        1, 1, 0xffffff).setAlpha(Math.random());
      stars.add(s);
    }

    const crawl = scene.add.text(W / 2, H + 20,
      `STAGE ${ctx.stageId + 1}\n\nA custom intro,\nwritten by a\nSCENE SCRIPT.\n\nIt can read and\nchange every\nGameObject in\nthe scene...\n\n(${ctx.gameObjects.length} so far)\n\nTAP TO FIGHT ▶`, {
        fontFamily: 'monospace', fontSize: '16px', color: '#ffe81f', align: 'center', lineSpacing: 6,
      }).setOrigin(0.5, 0);

    scene.tweens.add({ targets: crawl, y: -crawl.height - 40, duration: 16000, ease: 'Linear' });

    scene.input.on('pointerup', () => ctx.next());
    scene.input.keyboard.on('keydown-SPACE', () => ctx.next());
  },

  update(ctx) {
    // Twinkle: cheap per-frame mutation of scene gameObjects.
    for (const o of ctx.gameObjects) {
      if (o.width === 1 && Math.random() < 0.02) o.setAlpha(Math.random());
    }
  },
};
