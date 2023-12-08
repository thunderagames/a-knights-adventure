import Phaser from "phaser"
import GameSceneKeysEnum from "~/constants/game-scene-keys.enum"

export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: GameSceneKeysEnum.game
        })
    }
}