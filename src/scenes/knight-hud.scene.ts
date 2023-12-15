import Phaser from "phaser"
import GameSceneKeysEnum from "~/constants/game-scene-keys.enum"
import JsonKeysEnum from "~/constants/json-keys.enum";
import SpritesheetKeysEnum from "~/constants/spritesheet-keys.enum"
import TextureKeysEnum from "~/constants/texture-keys.enum";
import { KnightWarriorGame } from "~/core/knight-warrior.game";

export class KnightHUDScene extends Phaser.Scene {
    sword_found = false
    sword_icon!: Phaser.GameObjects.Image;

    constructor() {
        super({
            key: GameSceneKeysEnum.KnightHUD
        })
    }

    private char: any = null

    init(payload) {
        console.log(payload);
        this.char = payload
    }

    create() {
        let texts = this.cache.json.get(JsonKeysEnum.localData)[(<KnightWarriorGame>this.game).language]

        let scene = this.scene.get(GameSceneKeysEnum.game)
        this.add.rectangle(0, 0, this.scale.getViewPort().width, 45, 0x000)
            .setOrigin(0)
            .setAlpha(0.8)

        this.add.rectangle(10, 5, 170, 35, 0x363636)
            .setOrigin(0)
            .setAlpha(0.8)

        //Life Bar
        this.add.text(25, 16, texts.lifeHud)
            .setOrigin(0)
        this.add.image(75, 14, SpritesheetKeysEnum.SprCharacterHUDLifeBar)
            .setOrigin(0)
            .setAlpha(0.8)
            .setScale(2, 1)

        //Key Icon
        this.add.rectangle(190, 5, 32, 35, 0x363636)
            .setOrigin(0)
            .setAlpha(0.8)

        this.add.image(198, 15, SpritesheetKeysEnum.SprCharacterHUDKeyIcon)
            .setOrigin(0)
            .setScale(1)
            .setAlpha(0.5)

        //Sword Icon
        this.add.rectangle(230, 5, 80, 35, 0x363636)
            .setOrigin(0)
            .setAlpha(0.8)

        this.sword_icon = this.add.image(240, 15, TextureKeysEnum.ImgCharHUDSword)
            .setOrigin(0)
            .setScale(2, 2)
            .setAlpha(0.8)
            .setTintFill(0x5e5e5e)

        //Lives
        this.add.rectangle(320, 5, 150, 35, 0x363636)
            .setOrigin(0)
            .setAlpha(0.8)

        this.add.image(340, 3, SpritesheetKeysEnum.LoaderHelmetSrpite, 1)
            .setOrigin(0)
            .setAlpha(0.5)
            .setScale(1)

        this.add.image(380, 3, SpritesheetKeysEnum.LoaderHelmetSrpite, 1)
            .setOrigin(0)
            .setAlpha(0.5)
            .setScale(1)

        this.add.image(420, 3, SpritesheetKeysEnum.LoaderHelmetSrpite, 1)
            .setOrigin(0)
            .setAlpha(0.5)
            .setScale(1)
            .setTintFill(0x5e5e5e)

    }

    update() {
        if (this.char.have_sword && !this.sword_found) {
            this.sword_icon.tintFill = false
            this.sword_found = true
        }
    }
}