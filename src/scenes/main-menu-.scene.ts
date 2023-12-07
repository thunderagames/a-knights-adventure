import Phaser from "phaser"
import GameSceneKeysEnum from "~/constants/game-scene-keys.enum"

export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super(GameSceneKeysEnum.mainMenu)
    }

    create() {
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'MAIN MENU')
    }
}