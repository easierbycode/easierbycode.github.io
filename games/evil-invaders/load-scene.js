import CONSTANTS from "./constants.js";
import PROPERTIES from "./properties.js";

export class LoadScene extends Phaser.Scene {
  #baseUrl;

  constructor() {
    super("load-scene");

    if ((this.baseUrl = document.getElementById("baseUrl"))) {
      PROPERTIES.baseUrl = this.baseUrl.innerHTML;
    }
  }

  preload() {
    if (new URL(window.location.href).searchParams.get("audio") == "1") {
      let fileTypes = {
        jpg: "image",
        json: "json",
        mp3: "audio",
        png: "image"
      };

      let audioFiles = [];

      for (var n in CONSTANTS.RESOURCE) {
        let fileType = CONSTANTS.RESOURCE[n].match(/\w+$/)[0];

        //       if (fileTypes[fileType] === "audio") audioFiles.push(n);

        //       this.load[fileTypes[fileType]](n, PROPERTIES.baseUrl + CONSTANTS.RESOURCE[n]);

        if (fileTypes[fileType] === "audio") {
          this.load[fileTypes[fileType]](
            n,
            PROPERTIES.baseUrl + CONSTANTS.RESOURCE[n]
          );
        }
      }

      this.load.audio("bgm", "https://assets.codepen.io/11817390/bgm.mp3");
      this.load.audio("boss", "https://assets.codepen.io/11817390/boss-v2.mp3");
      this.load.audio(
        "credits",
        "https://assets.codepen.io/11817390/credits.mp3"
      );
      this.load.audio(
        "bullet_ultra1",
        "https://assets.codepen.io/11817390/bullet_ultra1.mp3"
      );
      this.load.audio(
        "bullet_ultra2",
        "https://assets.codepen.io/11817390/bullet_ultra2.mp3"
      );
      this.load.audio(
        "bullet_ultra3",
        "https://assets.codepen.io/11817390/bullet_ultra3.mp3"
      );
      this.load.audio(
        "bullet_ultra4",
        "https://assets.codepen.io/11817390/bullet_ultra4.mp3"
      );
      this.load.audio(
        "balloon_people",
        "https://assets.codepen.io/11817390/BalloonPeople.wav"
      );
      this.load.audio(
        "cannon",
        "https://assets.codepen.io/11817390/cannon.wav"
      );
      this.load.audio(
        "smooch",
        "https://assets.codepen.io/11817390/smooch.wav"
      );

      // sound select button
      this.load.image(
        "button",
        "https://assets.codepen.io/11817390/button-small-idle.png"
      );
    }

    this.load.spritesheet(
      "kiss-bullet",
      "https://assets.codepen.io/11817390/kiss-bullet.png",
      {
        frameWidth: 25,
        frameHeight: 21
      }
    );

    this.load.atlas(
      "game_asset",
      "https://assets.codepen.io/11817390/evil_invaders_asset.png",
      "https://assets.codepen.io/11817390/evil_invaders_asset.json"
    );

    this.load.atlas(
      "atlas",
      "https://assets.codepen.io/11817390/evil_invaders_asset.png",
      "https://assets.codepen.io/11817390/evil_invaders_asset.json"
    );

    this.load.atlas(
      "game_ui",
      // "https://assets.codepen.io/11817390/game_ui.png",
      "https://assets.codepen.io/11817390/evil_invaders_ui.png",
      "https://assets.codepen.io/11817390/game_ui.json"
    );

    this.load["json"](
      "game.json",
      "https://assets.codepen.io/11817390/evil_invaders.json"
    );

    this.load.on("complete", (loader, totalComplete, totalFailed) => {
      PROPERTIES.resource = {
        recipe: {
          data: loader.cacheManager.json.get("game.json")
        }
      };
      this.scene.start("title-scene");
    });
  }
}
