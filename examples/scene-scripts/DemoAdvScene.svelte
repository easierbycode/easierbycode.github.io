<script>
  // DemoAdvScene.svelte — story-intro scene script built with 5velte-ph4ser
  // (Svelte 5 + Phaser 4 bindings — github.com/easierbycode/svelte-phaser).
  // Run with:
  //   ?advScript=/examples/scene-scripts/DemoAdvScene.svelte&advScriptMode=replace
  //
  // Instead of drawing DOM, this adopts the running game + scene through
  // 5velte-ph4ser's context keys and builds real in-canvas Phaser objects with
  // the core hooks: reactive $state flows into the prop getters, which the
  // hooks re-read and apply once per game step.
  //
  // The core layer is pure TS (no .svelte files), so esm.sh can serve it:
  //  - ?deps=svelte@5.16.0 pins its svelte imports to the same build this
  //    component compiles against (one runtime = shared context/lifecycle)
  //  - ?external=phaser keeps `import Phaser from 'phaser'` bare, so the
  //    page's import map hands the hooks the game's own Phaser instance.
  import { setContext } from 'svelte';
  import {
    GAME_CONTEXT_KEY,
    SCENE_CONTEXT_KEY,
    onGameEvent,
    onInputEvent,
    useRectangle,
    useText,
  } from 'https://esm.sh/5velte-ph4ser@1.0.0/core?external=phaser&deps=svelte@5.16.0';

  let { ctx } = $props();
  const W = ctx.scene.scale.width;
  const H = ctx.scene.scale.height;

  // Adopt the live game + current scene. (createGame/createScene would try to
  // OWN their lifetimes — destroying the game/scene on unmount — but a scene
  // script only borrows them, so provide the contexts directly.)
  setContext(GAME_CONTEXT_KEY, ctx.game);
  setContext(SCENE_CONTEXT_KEY, ctx.scene);

  // Reactive state — plain assignments here re-render the Phaser objects.
  let stars = $state(Array.from({ length: 40 }, () => ({
    x: Math.random() * W, y: Math.random() * H, alpha: Math.random(),
  })));
  let pulse = $state(1);
  let leaving = $state(false);

  // Space backdrop (origin defaults to centre for rectangles).
  useRectangle(() => ({ x: W / 2, y: H / 2, width: W, height: H, fillColor: 0x000010 }));

  for (let i = 0; i < stars.length; i++) {
    useRectangle(() => ({
      x: stars[i].x, y: stars[i].y, width: 2, height: 2,
      fillColor: 0xffffff, alpha: stars[i].alpha,
    }));
  }

  useText(() => ({
    x: W / 2, y: 110, originX: 0.5, originY: 0.5,
    text: 'STAGE ' + (ctx.stageId + 1),
    color: '#ffe81f', fontFamily: 'monospace', fontSize: '28px', fontStyle: 'bold',
  }));

  useText(() => ({
    x: W / 2, y: 145, originX: 0.5, originY: 0.5,
    text: ctx.gameObjects.length + ' gameObjects · 5velte-ph4ser',
    color: '#8899ff', fontFamily: 'monospace', fontSize: '10px',
  }));

  useText(() => ({
    x: W / 2, y: H - 90, originX: 0.5, originY: 0.5,
    text: leaving ? 'GO!' : 'TAP TO FIGHT ▶',
    color: '#ff2255', fontFamily: 'monospace', fontSize: '16px', fontStyle: 'bold',
    alpha: pulse,
  }));

  // Twinkle the stars and pulse the prompt once per game step.
  let t = 0;
  onGameEvent('step', () => {
    t++;
    pulse = 0.6 + Math.sin(t / 12) * 0.4;
    if (t % 4 === 0) {
      const i = Math.floor(Math.random() * stars.length);
      stars[i].alpha = Math.random();
    }
  });

  // In-canvas input via the scene's own input plugin.
  onInputEvent('pointerup', go);

  function go() {
    if (leaving) return;
    leaving = true;
    ctx.next();
  }
</script>

<!-- The DOM layer still works alongside the canvas objects; the overlay host
     is pointer-events:none, so this badge never blocks scene input. -->
<div class="badge">5VELTE-PH4SER</div>

<style>
  .badge {
    position: absolute;
    top: 6px;
    right: 6px;
    padding: 2px 6px;
    border: 1px solid #8899ff;
    color: #8899ff;
    font: 9px monospace;
    letter-spacing: 0.1em;
    background: rgba(0, 0, 16, 0.6);
  }
</style>
