import Phaser from "phaser"
import { timer } from "rxjs"
import CharacterAnimationKeysEnum from "~/constants/character-animation-keys.enum"
import GameSceneKeysEnum from "~/constants/game-scene-keys.enum"
import SpritesheetKeysEnum from "~/constants/spritesheet-keys.enum"
import TextureKeysEnum from "~/constants/texture-keys.enum"
import { KnightCharacter } from "~/gameObjects/knight.character"
import { PlatformUtils } from "~/utils/platforms.utils"

export class GameScene extends Phaser.Scene {

    private plattforms: Phaser.GameObjects.Group = new Phaser.GameObjects.Group(this)
    private utils: PlatformUtils = new PlatformUtils()
    bg1!: Phaser.GameObjects.TileSprite
    bg2!: Phaser.GameObjects.TileSprite
    bg3!: Phaser.GameObjects.TileSprite
    bg4!: Phaser.GameObjects.TileSprite
    private width = 640
    private height = 480


    constructor() {
        super({
            key: GameSceneKeysEnum.game
        })
    }

    init() {
        this.scale.setGameSize(this.width, this.height)
    }

    create(): void {
        let bg_width = this.width
        let bg_height = this.height

        this.bg1 = this.add.tileSprite(0, 0, bg_width, bg_height, TextureKeysEnum.ImgCloudsDay1).setOrigin(0)
        this.bg2 = this.add.tileSprite(0, 0, bg_width, bg_height, TextureKeysEnum.ImgCloudsDay2).setOrigin(0)
        this.bg3 = this.add.tileSprite(0, 0, bg_width, bg_height, TextureKeysEnum.ImgCloudsDay3).setOrigin(0)
        this.bg4 = this.add.tileSprite(0, 0, bg_width, bg_height, TextureKeysEnum.ImgCloudsDay4).setOrigin(0).setAlpha(0.5)

        this.add.tileSprite(160, this.scale.height - 60, 75, 44, SpritesheetKeysEnum.SprBackgroundDeco1, 1).setOrigin(0).setDepth(8)

        this.utils.drawPlatform(0, this.scale.height - 16, 48, 'grass', this, this.plattforms)
        this.utils.drawPlatform(150, this.scale.height - 75, 4, 'grass', this, this.plattforms)
        this.utils.drawPlatform(250, this.scale.height - 150, 4, 'grass', this, this.plattforms)
        this.utils.drawPlatform(380, this.scale.height - 130, 2, 'grass', this, this.plattforms)
        this.utils.drawPlatform(440, this.scale.height - 90, 2, 'grass', this, this.plattforms)

        this.utils.drawPlatform(this.scale.width - (this.scale.width / 4), 50, 3, 'grass', this, this.plattforms)

        this.plattforms.add(
            this.physics.add.existing(
                this.add.tileSprite(229, this.scale.height - 60, 16, 44, TextureKeysEnum.SprGrassPlatforms, 3).setOrigin(0).setDepth(11), true
            )
        )

        this.plattforms.add(
            this.physics.add.existing(
                this.add.tileSprite(328, this.scale.height - 134, 16, 120, TextureKeysEnum.SprGrassPlatforms, 3).setOrigin(0).setDepth(11), true
            )
        )


        this.add.sprite(195, this.scale.height - 35, SpritesheetKeysEnum.SprDecoration1, 0).setDepth(15).setScale(1, 1.2)

        let char = new KnightCharacter(this, 20, this.scale.height - 40)
        this.physics.add.collider(char, this.plattforms)

        this.cameras.main.startFollow(char)
        this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height)
        this.cameras.main.setZoom(2.5)

        timer(10).subscribe(() => {
            this.bg1.setPosition(this.cameras.main.worldView.x, this.cameras.main.worldView.y)
            this.bg2.setPosition(this.cameras.main.worldView.x, this.cameras.main.worldView.y)
            this.bg3.setPosition(this.cameras.main.worldView.x, this.cameras.main.worldView.y)
            this.bg4.setPosition(this.cameras.main.worldView.x, this.cameras.main.worldView.y)
        })
    }

    update() {
        this.bg1.setPosition(this.cameras.main.worldView.x, this.cameras.main.worldView.y)
        this.bg4.tilePositionX += 0.05
        this.bg2.tilePositionX += 0.1
        this.bg3.tilePositionX += 0.15
    }
}
