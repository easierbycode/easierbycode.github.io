// demo-title-hook.js — hook-mode scene script for the TitleScene.
// Run with:  ?titleScript=/examples/scene-scripts/demo-title-hook.js
//
// Decorates the default title screen: spins the logo when the intro settles,
// cycles the subtitle's tint, and logs every GameObject in the scene.

export default {
  onStart(ctx) {
    const { scene } = ctx;
    console.log('[demo-title-hook] gameObjects:', ctx.gameObjects.map((o) => o.name || o.type));

    // Named lookups work for anything the scene names or stores on itself.
    const logo = ctx.find('logo');
    if (logo) {
      scene.tweens.add({ targets: logo, angle: 360, delay: 2200, duration: 1200, ease: 'Cubic.easeInOut' });
    }

    const subTitle = ctx.find('subTitle');
    if (subTitle) {
      let hue = 0;
      const timer = scene.time.addEvent({
        delay: 50, loop: true,
        callback: () => {
          hue = (hue + 4) % 360;
          subTitle.setTint(ctx.Phaser.Display.Color.HSLToColor(hue / 360, 1, 0.7).color);
        },
      });
      ctx.onCleanup(() => timer.remove());
    }
  },

  onEnd(ctx) {
    // Flash white, then continue the default hand-off. Returning a promise
    // makes the transition wait for it.
    const { scene } = ctx;
    const flash = scene.add.rectangle(0, 0, 256, 480, 0xffffff).setOrigin(0, 0).setDepth(5000).setAlpha(0);
    return new Promise((resolve) => {
      scene.tweens.add({ targets: flash, alpha: 1, yoyo: true, duration: 150, onComplete: () => resolve() });
    });
  },
};
