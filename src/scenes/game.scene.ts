import Phaser from "phaser"
import { timer } from "rxjs"
import AnimationKeysEnum from "~/constants/animation-keys.enum"
import CharacterAnimationKeysEnum from "~/constants/character-animation-keys.enum"
import GameSceneKeysEnum from "~/constants/game-scene-keys.enum"
import SpritesheetKeysEnum from "~/constants/spritesheet-keys.enum"
import TextureKeysEnum from "~/constants/texture-keys.enum"
import { KnightWarriorGame } from "~/core/knight-warrior.game"
import { KnightCharacter } from "~/gameObjects/knight.character"
import { MinotaurEnnemyNPC } from "~/gameObjects/minotaur_ennemy.npc"
import { PlatformUtils } from "~/utils/platforms.utils"

export class GameScene extends Phaser.Scene {

    private plattforms: Phaser.GameObjects.Group = new Phaser.GameObjects.Group(this)
    private walls: Phaser.GameObjects.Group = new Phaser.GameObjects.Group(this)
    private utils: PlatformUtils = new PlatformUtils()
    bg1!: Phaser.GameObjects.TileSprite
    bg2!: Phaser.GameObjects.TileSprite
    bg3!: Phaser.GameObjects.TileSprite
    bg4!: Phaser.GameObjects.TileSprite
    private width = 960
    private height = 470

    private viewPortSize = { width: 640, height: 480 }
    movingPlatform!: Phaser.Physics.Arcade.Group
    char!: KnightCharacter
    sword!: Phaser.GameObjects.Sprite


    constructor() {
        super({
            key: GameSceneKeysEnum.game
        })
    }

    init() {
        this.scale.setGameSize(this.viewPortSize.width, this.viewPortSize.height)
        let esc_key = this.input.keyboard?.addKey('ESC')
        esc_key?.on(Phaser.Input.Keyboard.Events.DOWN, () => {
            (<KnightWarriorGame>this.game).dipatchStateAction("pauseGame", null)
        })

    }

    create(): void {
        this.setBackground()
        this.setPlatforms()
        this.setCharacter()
        this.configureMainCamera()


        let ennemy_switch = this.add.sprite(330, this.height - 60, TextureKeysEnum.ImgEnnemySwitch)
            .setOrigin(0)
        this.physics.add.existing(ennemy_switch, true)
        let minotaur = new MinotaurEnnemyNPC(this, 415, this.height - 60)

        this.physics.add.collider(this.char, this.walls)
        this.physics.add.collider(minotaur, this.plattforms)
        this.physics.add.collider(minotaur, this.walls, () => {
            minotaur.speed_x = minotaur.speed_x * -1
        })
        this.addMoviblePlatform();

        this.physics.add.overlap(this.char, minotaur, (char, minotaur) => {
            let m = <MinotaurEnnemyNPC>minotaur
            if (m.body?.velocity.y == 0 && this.char.state_machine.state == "ATTACKING") {
                if (m.anims.getName() != AnimationKeysEnum.SprMinotaurDead) {
                    m.speed_x = 0
                    m.play(AnimationKeysEnum.SprMinotaurDead)
                }
            }

        })

        this.physics.add.overlap(ennemy_switch, this.char, () => {
            if (minotaur.anims.getName() != AnimationKeysEnum.SprMinotaurAttack) {
                minotaur.play(AnimationKeysEnum.SprMinotaurAttack)
            }
        })


        this.physics.add.existing(this.sword, true)
        this.physics.add.overlap(this.char, this.sword, (char, sword) => {
            let s = <Phaser.GameObjects.Sprite>sword
            this.char.have_sword = true
            s.setAlpha(0)
            this.char.stop_all = true
            this.cameras.main.flash()
            if (this.char.anims.getName() != CharacterAnimationKeysEnum.attack)

                this.char.play(CharacterAnimationKeysEnum.attack).on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.char.stop_all = false

                    s.destroy()
                })

        })

        this.game.scene.start(GameSceneKeysEnum.KnightHUD, this.char)
    }

    private addMoviblePlatform(): void {
        let spr = this.add.sprite(800, 320, TextureKeysEnum.SprGrassPlatforms, 0)
        let spr1 = this.add.sprite(816, 320, TextureKeysEnum.SprGrassPlatforms, 1)
        let spr2 = this.add.sprite(828, 320, TextureKeysEnum.SprGrassPlatforms, 2)
        this.movingPlatform = this.physics.add.group([
            spr,
            spr1,
            spr2
        ])

        this.movingPlatform.children.iterate((s, index) => {
            let b = (<Phaser.Physics.Arcade.Body>s.body)
            b.setAllowGravity(false)
            b.setImmovable(true)
            return true
        })

        this.physics.add.collider(this.movingPlatform, this.char, (character, platform) => {
            let p = <Phaser.Physics.Arcade.Sprite>platform
            if ((<Phaser.Physics.Arcade.Sprite>this.movingPlatform.getChildren()[0]).y > 110)
                this.movingPlatform.setVelocityY(-150)
            else {
                this.movingPlatform.setVelocityY(0)
            }
        })
    }

    private setCharacter() {
        this.add.sprite(195, this.scale.height - 55, SpritesheetKeysEnum.SprDecoration1, 0).setDepth(15).setScale(1.4, 1.8)
        this.char = new KnightCharacter(this, 50, this.height - 16)
        this.physics.add.collider(this.char, this.plattforms)
    }

    private configureMainCamera(): void {
        this.cameras.main.startFollow(this.char)
        this.cameras.main.setSize(640, 480)
        this.cameras.main.setBounds(0, 0, this.width, this.height)

        this.cameras.main.setZoom(1.5)
    }

    private setBackground(): void {
        let bg_width = this.width
        let bg_height = this.height
        let bg_scale = { x: 1, y: 1.45 }

        this.bg1 = this.add.tileSprite(0, 0, bg_width, bg_height, TextureKeysEnum.ImgCloudsDay1)
            .setOrigin(0)
            .setTileScale(bg_scale.x, bg_scale.y)

        this.bg2 = this.add.tileSprite(0, 0, bg_width, bg_height, TextureKeysEnum.ImgCloudsDay2)
            .setOrigin(0)
            .setTileScale(bg_scale.x, bg_scale.y)

        this.bg3 = this.add.tileSprite(0, 0, bg_width, bg_height, TextureKeysEnum.ImgCloudsDay3)
            .setOrigin(0)
            .setTileScale(bg_scale.x, bg_scale.y)

        this.bg4 =
            this.add.tileSprite(0, 0, bg_width, bg_height, TextureKeysEnum.ImgCloudsDay4)
                .setOrigin(0)
                .setAlpha(0.5)
                .setTileScale(bg_scale.x, bg_scale.y)

        let bg_rocks =
            this.add.tileSprite(0, 0, bg_width, bg_height, TextureKeysEnum.ImgBackgroundRocks)
                .setOrigin(0)
                .setAlpha(0.8)
                .setTileScale(bg_scale.x * 0.9, bg_scale.y * 0.9)

        this.add.tween({
            targets: [this.bg2, this.bg3, this.bg4],
            alpha: (Phaser.Math.Between(3, 7) / 10),
            duration: 1500,
            yoyo: true,
            repeat: -1
        })
    }

    private setPlatforms(): void {
        //add the background walls
        this.add.tileSprite(153, this.height - 76, 85, 60, SpritesheetKeysEnum.SprBackgroundDeco1, 1).setOrigin(0).setDepth(8)

        //floor
        this.utils.drawPlatform(0, this.height - 16, this.width / 16, 'grass', this, this.plattforms)

        //first platform to appear
        let platform1 = this.utils.drawPlatform(150, this.height - 92, 7, 'grass', this, this.plattforms)
        this.utils.addTreeToPlatform(platform1, 'right', this)
        //second platform
        let platform2 = this.utils.drawPlatform(290, this.height - 162, 12, 'grass', this, this.plattforms)
        this.utils.addTreeToPlatform(platform2, 'right', this)
        this.utils.addTreeToPlatform(platform2, 'left', this)
        //third one
        this.utils.drawPlatform(440, 180, 2, 'grass', this, this.plattforms)

        //fourth
        this.utils.drawPlatform(530, 110, 2, 'grass', this, this.plattforms)

        //sword
        this.sword = this.add.sprite(630, 65, TextureKeysEnum.ImgSword)
        this.utils.drawPlatform(600, 70, 2, 'grass', this, this.plattforms)


        this.utils.drawPlatform(720, 130, 2, 'grass', this, this.plattforms)


        this.physics.add.image(430, this.height - 32, TextureKeysEnum.ImgCharHUDKey)
            .setOrigin(0)
            .setScale(0.5)
            .body.setAllowGravity(false)

        this.utils.drawPlatform(840, 130, 2, 'grass', this, this.plattforms)

        this.walls.add(
            this.physics.add.existing(
                this.add.tileSprite(230, this.height - 76, 64, 60, TextureKeysEnum.SprGrassPlatforms, 4)
                    .setOrigin(0)
                    .setDepth(9), true)
        )

        this.walls.add(
            this.physics.add.existing(
                this.add.tileSprite(450, this.height - 150, 64, 136, TextureKeysEnum.SprGrassPlatforms, 4)
                    .setOrigin(0)
                    .setDepth(9), true
            )
        )
    }

    update() {
        this.bg1.tilePositionX += 0.01
        this.bg2.tilePositionX += 0.03
        this.bg3.tilePositionX += 0.05
        this.bg4.tilePositionX += 0.07

        if (!this.getTouchingMovingPlatform()) {
            let plat1 = <Phaser.Physics.Arcade.Sprite>this.movingPlatform.getChildren()[0]
            if (plat1.y < 390)
                this.movingPlatform.setVelocityY(150)
            else {
                this.movingPlatform.setVelocityY(0)
            }
        }

        if (this.char) {
            if (this.char.x < 15 || this.char.x > this.width - 35) {
                this.char.worldEnds = true
                if (this.char.flipX)
                    this.char.setX(17)
                else
                    this.char.setX(this.width - 37)
            }
            else {
                this.char.worldEnds = false
            }
        }
    }

    getTouchingMovingPlatform(): boolean {
        let result = false

        this.movingPlatform.children.iterate((c) => {
            result = (<Phaser.Physics.Arcade.Sprite>c).body?.touching.up || false

            return !result
        })


        return result
    }
}

