import { SCENE_IDS } from "./enums/scene-ids.js";

export const LANG = (() => {
    if (typeof document !== "undefined" && document.documentElement) {
        switch (document.documentElement.lang) {
        case "ja":
            return "ja";
        default:
            return "en";
        }
    }
    return "en";
})();

export const BASE_PATH = (() => {
    const base = typeof window !== "undefined" && typeof window.baseUrl === "string" ? window.baseUrl : "http://localhost/";
    return base.replace(/^https?\:\/\/[^\/]+/, "").replace(/\/api\/$/, "");
})();

export const BGM_INFO = {
    boss_bison_bgm: {
        name: "boss_bison_bgm",
        start: 914888,
        end: 6111881,
    },
    boss_barlog_bgm: {
        name: "boss_barlog_bgm",
        start: 782400,
        end: 4315201,
    },
    boss_sagat_bgm: {
        name: "boss_sagat_bgm",
        start: 1635142,
        end: 6883739,
    },
    boss_vega_bgm: {
        name: "boss_vega_bgm",
        start: 513529,
        end: 4325295,
    },
    boss_goki_bgm: {
        name: "boss_goki_bgm",
        start: 864e3,
        end: 6130287,
    },
    boss_fang_bgm: {
        name: "boss_fang_bgm",
        start: 888672,
        end: 5802799,
    },
};

export const RESOURCE_PATHS = {
    // recipe: "game.json",
    // game_ui: "game_ui.json",
    // game_asset: "game_asset.json",
    voice_titlecall: "voice_titlecall.mp3",
    se_decision: "se_decision.mp3",
    se_correct: "se_correct.mp3",
    se_cursor_sub: "se_cursor_sub.mp3",
    se_cursor: "se_cursor.mp3",
    se_over: "se_over.mp3",
    adventure_bgm: "adventure_bgm.mp3",
    g_adbenture_voice0: "g_adbenture_voice0.mp3",
    voice_thankyou: "voice_thankyou.mp3",
    se_explosion: "se_explosion.mp3",
    se_shoot: "se_shoot.mp3",
    se_shoot_b: "se_shoot_b.mp3",
    se_sp: "se_ca.mp3",
    se_sp_explosion: "se_ca_explosion.mp3",
    se_damage: "se_damage.mp3",
    se_guard: "se_guard.mp3",
    se_finish_akebono: "se_finish_akebono.mp3",
    se_barrier_start: "se_barrier_start.mp3",
    se_barrier_end: "se_barrier_end.mp3",
    voice_round0: "voice_round0.mp3",
    voice_round1: "voice_round1.mp3",
    voice_round2: "voice_round2.mp3",
    voice_round3: "voice_round3.mp3",
    voice_fight: "voice_fight.mp3",
    voice_ko: "voice_ko.mp3",
    voice_another_fighter: "voice_another_fighter.mp3",
    g_stage_voice_0: "g_stage_voice_0.mp3",
    g_stage_voice_1: "g_stage_voice_1.mp3",
    g_stage_voice_2: "g_stage_voice_2.mp3",
    g_stage_voice_3: "g_stage_voice_3.mp3",
    g_stage_voice_4: "g_stage_voice_4.mp3",
    g_damage_voice: "g_damage_voice.mp3",
    g_powerup_voice: "g_powerup_voice.mp3",
    g_sp_voice: "g_ca_voice.mp3",
    boss_bison_bgm: "boss_bison_bgm.mp3",
    boss_bison_voice_add: "boss_bison_voice_add.mp3",
    boss_bison_voice_ko: "boss_bison_voice_ko.mp3",
    boss_bison_voice_faint: "boss_bison_voice_faint.mp3",
    boss_bison_voice_faint_punch: "boss_bison_voice_faint_punch.mp3",
    boss_bison_voice_punch: "boss_bison_voice_punch.mp3",
    boss_barlog_bgm: "boss_barlog_bgm.mp3",
    boss_barlog_voice_add: "boss_barlog_voice_add.mp3",
    boss_barlog_voice_ko: "boss_barlog_voice_ko.mp3",
    boss_barlog_voice_projectile: "boss_barlog_voice_tama.mp3",
    boss_barlog_voice_barcelona: "boss_barlog_voice_barcelona.mp3",
    boss_sagat_bgm: "boss_sagat_bgm.mp3",
    boss_sagat_voice_add: "boss_sagat_voice_add.mp3",
    boss_sagat_voice_ko: "boss_sagat_voice_ko.mp3",
    boss_sagat_voice_projectile0: "boss_sagat_voice_tama0.mp3",
    boss_sagat_voice_projectile1: "boss_sagat_voice_tama1.mp3",
    boss_sagat_voice_kick: "boss_sagat_voice_kick.mp3",
    boss_vega_bgm: "boss_vega_bgm.mp3",
    boss_vega_voice_add: "boss_vega_voice_add.mp3",
    boss_vega_voice_ko: "boss_vega_voice_ko.mp3",
    boss_vega_voice_crusher: "boss_vega_voice_crusher.mp3",
    boss_vega_voice_warp: "boss_vega_voice_warp.mp3",
    boss_vega_voice_projectile: "boss_vega_voice_tama.mp3",
    boss_vega_voice_shoot: "boss_vega_voice_shoot.mp3",
    boss_goki_bgm: "boss_goki_bgm.mp3",
    boss_goki_voice_add: "boss_goki_voice_add.mp3",
    boss_goki_voice_ko: "boss_goki_voice_ko.mp3",
    boss_goki_voice_projectile0: "boss_goki_voice_tama0.mp3",
    boss_goki_voice_projectile1: "boss_goki_voice_tama1.mp3",
    boss_goki_voice_ashura: "boss_goki_voice_ashura.mp3",
    boss_goki_voice_syungokusatu0: "boss_goki_voice_syungokusatu0.mp3",
    boss_goki_voice_syungokusatu1: "boss_goki_voice_syungokusatu1.mp3",
    boss_fang_bgm: "boss_fang_bgm.mp3",
    boss_fang_voice_add: "boss_fang_voice_add.mp3",
    boss_fang_voice_ko: "boss_fang_voice_ko.mp3",
    boss_fang_voice_beam0: "boss_fang_voice_beam0.mp3",
    boss_fang_voice_beam1: "boss_fang_voice_beam1.mp3",
    boss_fang_voice_projectile: "boss_fang_voice_tama.mp3",
    bgm_continue: "bgm_continue.mp3",
    bgm_gameover: "bgm_gameover.mp3",
    voice_countdown0: "voice_countdown0.mp3",
    voice_countdown1: "voice_countdown1.mp3",
    voice_countdown2: "voice_countdown2.mp3",
    voice_countdown3: "voice_countdown3.mp3",
    voice_countdown4: "voice_countdown4.mp3",
    voice_countdown5: "voice_countdown5.mp3",
    voice_countdown6: "voice_countdown6.mp3",
    voice_countdown7: "voice_countdown7.mp3",
    voice_countdown8: "voice_countdown8.mp3",
    voice_countdown9: "voice_countdown9.mp3",
    voice_gameover: "voice_gameover.mp3",
    g_continue_yes_voice0: "g_continue_yes_voice0.mp3",
    g_continue_yes_voice1: "g_continue_yes_voice1.mp3",
    g_continue_yes_voice2: "g_continue_yes_voice2.mp3",
    g_continue_no_voice0: "g_continue_no_voice0.mp3",
    g_continue_no_voice1: "g_continue_no_voice1.mp3",
    voice_congra: "voice_congra.mp3",
    title_bg: "title_bg.jpg",
    stage_loop0: "stage_loop0.png",
    stage_loop1: "stage_loop1.png",
    stage_loop2: "stage_loop2.png",
    stage_loop3: "stage_loop3.png",
    stage_loop4: "stage_loop4.png",
    stage_end0: "stage_end0.png",
    stage_end1: "stage_end1.png",
    stage_end2: "stage_end2.png",
    stage_end3: "stage_end3.png",
    stage_end4: "stage_end4.png",
};

export const SCENE_NAMES = SCENE_IDS;

export const STAGE_IDS = {
    PROLOGUE: 0,
    ENDING: 4,
    SPENDING: 5,
};

export const GAME_DIMENSIONS = {
    WIDTH: 256,
    HEIGHT: 480,
    CENTER_X: 128,
    CENTER_Y: 240,
};

export const STAGE_DIMENSIONS = {
    WIDTH: typeof window !== "undefined" ? window.innerWidth : GAME_DIMENSIONS.WIDTH,
    HEIGHT: typeof window !== "undefined" ? window.innerHeight : GAME_DIMENSIONS.HEIGHT,
    CENTER_X: typeof window !== "undefined" ? window.innerWidth / 2 : GAME_DIMENSIONS.CENTER_X,
    CENTER_Y: typeof window !== "undefined" ? window.innerHeight / 2 : GAME_DIMENSIONS.CENTER_Y,
};

export const ANIMATION = {
    BASE_SPEED: 0.33,
};

export const FPS = 30;

// Backward-compatible default export used by legacy game modules.
const CONSTANTS = {
    LANG,
    RESOURCE: RESOURCE_PATHS,
    GAME_WIDTH: GAME_DIMENSIONS.WIDTH,
    GAME_HEIGHT: GAME_DIMENSIONS.HEIGHT,
    GAME_CENTER: GAME_DIMENSIONS.CENTER_X,
    GAME_MIDDLE: GAME_DIMENSIONS.CENTER_Y,
    STAGE_WIDTH: STAGE_DIMENSIONS.WIDTH,
    STAGE_HEIGHT: STAGE_DIMENSIONS.HEIGHT,
};

export default CONSTANTS;
