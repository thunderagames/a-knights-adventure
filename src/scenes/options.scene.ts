import Phaser from "phaser"
import GameSceneKeysEnum from "~/constants/game-scene-keys.enum"
import { KnightWarriorGame } from "~/core/knight-warrior.game"
import { MenuUtils } from "~/utils/menu.utils"

export class OptionsScene extends Phaser.Scene {
    private utils = new MenuUtils()
    constructor() {
        super({
            key: GameSceneKeysEnum.options
        })
    }

    create(): void {
        this.utils.creteBtn(this.scale.width / 2, this.scale.height - 50 - (this.scale.height / 4), 'BACK TO MENU', this)
        .on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.sound.play('AudioSwordSheath', { volume: 0.08 });
            (<KnightWarriorGame>this.game).dipatchStateAction("backToMenu", null)
        })

    }
}