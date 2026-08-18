// DemoTitleScene.ts — TypeScript hook-mode scene script for the TitleScene.
// Run with:  ?titleScript=/examples/scene-scripts/DemoTitleScene.ts
// (TypeScript is transpiled in the browser via sucrase from esm.sh.)

type Ctx = {
  scene: any;
  game: any;
  Phaser: any;
  state: Record<string, any>;
  target: string;
  stageId: number;
  gameObjects: any[];
  find(name: string): any;
  overlay(): HTMLDivElement;
  next(): void;
  onCleanup(fn: () => void): void;
};

export default {
  onStart(ctx: Ctx): void {
    const banner = ctx.scene.add.text(128, 240, 'TS SCRIPT ACTIVE', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#00ff88',
      backgroundColor: '#000000',
    }).setOrigin(0.5).setDepth(4000);
    ctx.scene.tweens.add({ targets: banner, alpha: 0.2, yoyo: true, repeat: -1, duration: 600 });
    console.log(`[DemoTitleScene.ts] ${ctx.gameObjects.length} gameObjects on '${ctx.scene.scene.key}'`);
  },
};
