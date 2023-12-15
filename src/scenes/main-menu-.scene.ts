import Phaser from "phaser"
import AudioKeysEnum from "~/constants/audio-keys-enum"
import GameSceneKeysEnum from "~/constants/game-scene-keys.enum"
import JsonKeysEnum from "~/constants/json-keys.enum"
import TextureKeysEnum from "~/constants/texture-keys.enum"
import { KnightWarriorGame } from "~/core/knight-warrior.game"
import { MenuUtils } from "~/utils/menu.utils"

export class MainMenuScene extends Phaser.Scene {
    private utils = new MenuUtils()

    bg_layer1!: Phaser.GameObjects.TileSprite
    bg_layer3!: Phaser.GameObjects.TileSprite
    bg_layer2!: Phaser.GameObjects.TileSprite
    constructor() {
        super(GameSceneKeysEnum.mainMenu)
    }

    create() {
        let json_local = this.cache.json.get(JsonKeysEnum.localData)
        json_local = json_local[(<KnightWarriorGame>this.game).language]

        this.bg_layer1 = this.add.tileSprite(this.cameras.main.worldView.x, this.cameras.main.worldView.y, 0, 0, TextureKeysEnum.ImgCloudsNight1).setOrigin(0)
        this.bg_layer2 = this.add.tileSprite(this.cameras.main.worldView.x, this.cameras.main.worldView.y, 0, 0, TextureKeysEnum.ImgCloudsNight3).setOrigin(0)
        this.bg_layer3 = this.add.tileSprite(this.cameras.main.worldView.x, this.cameras.main.worldView.y, 0, 0, TextureKeysEnum.ImgCloudsNight4).setOrigin(0)

        this.bg_layer1.setDisplaySize(this.cameras.main.width, this.cameras.main.height)
        this.bg_layer2.setDisplaySize(this.cameras.main.width, this.cameras.main.height)
        this.bg_layer3.setDisplaySize(this.cameras.main.width, this.cameras.main.height).setAlpha(0.6)

        let btn_x = this.scale.width / 2
        let height = this.scale.height
        this.utils.creteBtn(btn_x, height / 4 + 50, json_local.play, this)
            .on(Phaser.Input.Events.POINTER_DOWN, () => {
                this.sound.play('AudioSwordSheath', { volume: 0.03 });
                (<KnightWarriorGame>this.game).dipatchStateAction("goToGame", null)
            })

        this.utils.creteBtn(btn_x, height - 50 - (this.scale.height / 4), json_local.options, this)
            .on(Phaser.Input.Events.POINTER_DOWN, () => {
                this.sound.play('AudioSwordSheath', { volume: 0.03 });
                (<KnightWarriorGame>this.game).dipatchStateAction("goToOptions", null)
            })


        this.add.image(this.scale.width / 2, this.scale.height - 60, TextureKeysEnum.ImgThunderaLogoSmall)
            .setScale(0.5)
            .setAlpha(0.6)

      

        let title = this.add.text(
            this.scale.width / 2,
            70,
            json_local.title,
            {
                fontSize: 34,
                fontStyle: 'bold',
                shadow: {
                    color: '#FF8',
                    offsetX: -3,
                    offsetY: 2,
                    blur: 4,
                    fill: true
                },
                color: '#242323'
            }).setOrigin(0.5)
            
        this.tweens.add({
            targets: title,
            alpha: 0.4,
            duration: 500,
            yoyo: true,
            repeat: -1
        })
    }

    update() {
        this.bg_layer1.tilePositionX += 0.07 
        this.bg_layer2.tilePositionX += 0.1
        this.bg_layer3.tilePositionX += 0.15
    }
}