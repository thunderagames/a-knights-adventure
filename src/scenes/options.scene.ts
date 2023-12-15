import Phaser from "phaser"
import GameSceneKeysEnum from "~/constants/game-scene-keys.enum"
import JsonKeysEnum from "~/constants/json-keys.enum"
import TextureKeysEnum from "~/constants/texture-keys.enum"
import { KnightWarriorGame } from "~/core/knight-warrior.game"
import { MenuUtils } from "~/utils/menu.utils"

export class OptionsScene extends Phaser.Scene {
    private utils = new MenuUtils()
    selector!: Phaser.GameObjects.Rectangle
    constructor() {
        super({
            key: GameSceneKeysEnum.options
        })
    }

    create(): void {
        let texts = this.cache.json.get(JsonKeysEnum.localData)
        texts = texts[(<KnightWarriorGame>this.game).language]

        this.utils.creteBtn(this.scale.width / 2, this.scale.height - 50 - (this.scale.height / 4), texts.backToMenu, this)
            .on(Phaser.Input.Events.POINTER_DOWN, () => {
                this.sound.play('AudioSwordSheath', { volume: 0.08 });
                (<KnightWarriorGame>this.game).dipatchStateAction("backToMenu", null)

            })

        let base_x = this.scale.width / 2
        let base_y = this.scale.height / 4

        this.selector = this.add.rectangle(base_x + 38, base_y + 8, 24, 18, 0xc1c981)

        this.add.text(base_x - 70, base_y, texts.language)
            .setOrigin(0)

        this.add.image(base_x + 30, base_y + 3, TextureKeysEnum.ImgFlagUsa)
            .setOrigin(0)
            .setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN,()=>{
                (<KnightWarriorGame>this.game).language = "en"
                this.scene.restart()
            })

        this.add.image(base_x + 70, base_y + 3, TextureKeysEnum.ImgFlagSpain)
            .setOrigin(0)
            .setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN,()=>{
                (<KnightWarriorGame>this.game).language = "es"
                this.scene.restart()
            })
    }

    update() { 
        let base_x = this.scale.width / 2
        let base_y = this.scale.height / 4

        switch ((<KnightWarriorGame>this.game).language) {
            case "en":
                this.selector.setPosition(base_x + 38, base_y + 8)
                break
            case "es":
                this.selector.setPosition(base_x + 78, base_y + 8)
                break
        }
    }
}