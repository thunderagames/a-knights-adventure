import Phaser from "phaser"
import { Subscription, timer } from "rxjs"
import AnimationKeysEnum from "~/constants/animation-keys.enum"
import AudioKeysEnum from "~/constants/audio-keys-enum"
import CharacterAnimationKeysEnum from "~/constants/character-animation-keys.enum"
import GameSceneKeysEnum from "~/constants/game-scene-keys.enum"
import SpritesheetKeysEnum from "~/constants/spritesheet-keys.enum"
import TextureKeysEnum from "~/constants/texture-keys.enum"
import { KnightWarriorGame } from "~/core/knight-warrior.game"

export class IntroScene extends Phaser.Scene {
    fog_particles!: Phaser.GameObjects.Particles.ParticleEmitter
    char!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    bg_layer1!: Phaser.GameObjects.TileSprite
    bg_layer2!: Phaser.GameObjects.TileSprite
    bg_layer3!: Phaser.GameObjects.TileSprite
    bg_layer4!: Phaser.GameObjects.TileSprite
    private plattforms: Phaser.GameObjects.Group = new Phaser.GameObjects.Group(this)
    character_speed = 100
    spr_dragon!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    spr_dragon2!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    thunder_particles!: Phaser.GameObjects.Particles.ParticleEmitter
    step_sound_volume = 0.2
    img_logo_thundera!: Phaser.GameObjects.Image
    subscription = new Subscription()

    constructor() {
        super({
            key: GameSceneKeysEnum.intro
        })
    }

    init() {
        this.scale.setGameSize(640, 440)

        this.fog_particles = this.add.particles(this.scale.width, this.scale.height - 50, TextureKeysEnum.fog, {
            angle: { random: [150, 200] },
            speed: 200,
            frequency: 150,
            lifespan: 2500,
            maxAliveParticles: 120,
            emitCallback: (part: Phaser.GameObjects.Particles.Particle) => {
                part.alpha = Phaser.Math.Between(0, 25) / 400
            }
        }).setDepth(5000)

        this.thunder_particles = this.add.particles(this.scale.width, this.scale.height - 50, TextureKeysEnum.fog, {
            angle: { random: [45, 140] },
            speed: 100,
            frequency: 100,
            lifespan: 600,
            maxAliveParticles: 100,
            tint: 0xffffff,
            emitCallback: (part: Phaser.GameObjects.Particles.Particle) => {
                part.alpha = Phaser.Math.Between(10, 25) / 100
            }
        }).setDepth(1000)
        this.thunder_particles.stop()
        this.thunder_particles.setVisible(false)
    }

    create(): void {
        this.sound.play(AudioKeysEnum.AudioStep, { volume: this.step_sound_volume, loop: true })
        this.sound.play(AudioKeysEnum.AudioWind, { volume: 0.1, loop: false })
        this.createAnimations()

        this.img_logo_thundera = this.add.image(this.scale.width / 2 + 150, this.scale.height - 100, TextureKeysEnum.ImgThunderaLogo).setOrigin(0.5).setDepth(3000).setScale(0.15).setAlpha(0)
        this.img_logo_thundera.setTintFill(0x080f29)

        this.bg_layer1 = this.add.tileSprite(this.cameras.main.worldView.x, this.cameras.main.worldView.y, 0, 0, TextureKeysEnum.ImgCloudsNight1)
        this.bg_layer2 = this.add.tileSprite(this.cameras.main.worldView.x, this.cameras.main.worldView.y, 0, 0, TextureKeysEnum.ImgCloudsNight2)
        this.bg_layer3 = this.add.tileSprite(this.cameras.main.worldView.x, this.cameras.main.worldView.y, 0, 0, TextureKeysEnum.ImgCloudsNight3)
        this.bg_layer4 = this.add.tileSprite(this.cameras.main.worldView.x, this.cameras.main.worldView.y, 0, 0, TextureKeysEnum.ImgCloudsNight4)


        this.char = this.physics.add.sprite(0, 0, SpritesheetKeysEnum.SprCharacterStand)

        this.cameras.main.startFollow(this.char)
        this.cameras.main.setZoom(2)
        this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height)


        this.bg_layer1.setDisplaySize(this.cameras.main.width, this.cameras.main.height)
        this.bg_layer2.setDisplaySize(this.cameras.main.width, this.cameras.main.height)
        this.bg_layer3.setDisplaySize(this.cameras.main.width, this.cameras.main.height).setAlpha(0.6)
        this.bg_layer4.setDisplaySize(this.cameras.main.width, this.cameras.main.height).setAlpha(0.4)

        this.char.setPosition(this.cameras.main.getBounds().x + 20, this.cameras.main.getBounds().bottom - 16)
        this.char.setVelocityX(this.character_speed)
        this.char.setOrigin(0, 1)
        this.char.body.setAllowGravity(false)
        this.char.play(CharacterAnimationKeysEnum.run)

        this.spr_dragon = this.physics.add.sprite(0, 0, SpritesheetKeysEnum.SprDragon)
        this.spr_dragon.play(AnimationKeysEnum.dragonFly)
        this.spr_dragon.body.setAllowGravity(false)
        this.spr_dragon.setScale(0.8)
        this.spr_dragon.setAlpha(0.8)
        this.spr_dragon.setDepth(2000)

        this.spr_dragon2 = this.physics.add.sprite(0, 0, SpritesheetKeysEnum.SprDragon)
        this.spr_dragon2.setScale(0.45)
        this.spr_dragon2.setAlpha(0.4)
        this.spr_dragon2.setTintFill(0x0f0f0e)
        this.spr_dragon2.play(AnimationKeysEnum.dragonFly)
        this.spr_dragon2.body.setAllowGravity(false)
        this.spr_dragon2.setDepth(800)


        this.drawPlatform(0, this.scale.height - 16, 50, '')
        this.characterAnimationTimeline()

        this.subscription.add(
            timer(150).subscribe(() => {
                this.cameras.main.setLerp(0.035)
                this.spr_dragon.setPosition(0, this.cameras.main.worldView.top + 32)
                this.spr_dragon.setVelocityX(120)
                this.spr_dragon2.setPosition(0, this.cameras.main.worldView.top + 16)
                this.spr_dragon2.setVelocityX(95)
            }))

        this.subscription.add(
            timer(2000).subscribe(() => {
                this.tweens.add({
                    targets: this.spr_dragon,
                    alpha: 0.3,
                    //velocityX: 250,
                    duration: 500,
                    repeat: -1,
                    yoyo: true
                })
            })
        )
        this.input.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.subscription.unsubscribe();
            this.sound.stopAll();
            (<KnightWarriorGame>this.game).dipatchStateAction('goToMenu', null)
        })
    }

    private createAnimations(): void {
        this.anims.create({
            key: CharacterAnimationKeysEnum.attack,
            frames: this.anims.generateFrameNames(SpritesheetKeysEnum.SprCharacterAttack, { frames: [0, 1, 2, 3] }),
            frameRate: 10,
            repeat: 0
        })

        this.anims.create({
            key: CharacterAnimationKeysEnum.run,
            frames: this.anims.generateFrameNames(SpritesheetKeysEnum.SprCharacterRun),
            frameRate: 10,
            repeat: -1
        })


        this.anims.create({
            key: AnimationKeysEnum.dragonFly,
            frames: this.anims.generateFrameNames(SpritesheetKeysEnum.SprDragon),
            frameRate: 10,
            repeat: -1
        })
    }

    private characterAnimationTimeline(): void {
        this.thunder_particles.start()
        this.subscription.add(
            timer(4600).subscribe(() => {
                this.sound.stopByKey(AudioKeysEnum.AudioStep)
                this.char.setVelocityX(0)
                this.char.play(CharacterAnimationKeysEnum.attack)
                this.sound.play(AudioKeysEnum.AudioThunder, { volume: 0.4, loop: false })

                this.thunder_particles.setVisible(true)
                this.tweens.add({
                    targets: this.thunder_particles,
                    alpha: 0,
                    duration: 350,
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        this.thunder_particles.destroy(true)
                    }
                })

                this.tweens.add({
                    targets: this.img_logo_thundera,
                    tint: 0xffffff,
                    alpha: 1,
                    duration: 700,
                    repeat: 0
                })
            }))
        this.subscription.add(
            this.subscription.add(
                timer(5900).subscribe(() => {
                    this.sound.play(AudioKeysEnum.AudioStep, { volume: this.step_sound_volume, loop: true })
                    timer(1500).subscribe(() => {
                        this.sound.stopByKey(AudioKeysEnum.AudioStep);
                        timer(3000).subscribe(() => {
                            (<KnightWarriorGame>this.game).dipatchStateAction('goToMenu', null)
                        })
                    })
                    if (this.char) {
                        this.char.setVelocityX(this.character_speed)
                        this.char.play(CharacterAnimationKeysEnum.run)
                    }
                }))
        )
    }

    update(d, dt): void {
        this.bg_layer1.tilePositionX += 0.1
        this.bg_layer2.tilePositionX += 0.3
        this.bg_layer3.tilePositionX += 0.4
        this.bg_layer4.tilePositionX += 0.6

        this.bg_layer1.setPosition(this.cameras.main.worldView.x, this.cameras.main.worldView.y)
        this.bg_layer2.setPosition(this.cameras.main.worldView.x, this.cameras.main.worldView.y)
        this.bg_layer3.setPosition(this.cameras.main.worldView.x, this.cameras.main.worldView.y)
        this.bg_layer4.setPosition(this.cameras.main.worldView.x, this.cameras.main.worldView.y)

        this.thunder_particles.setPosition(this.cameras.main.worldView.centerX, this.cameras.main.worldView.top - 50)
    }

    private drawPlatform(x, y, width, type): void {
        let tile_width = 16
        let mid_tile_count = width
        let _x = x
        let sprites_by_types = [0, 1, 2]
        let getImage = (x_: number, frameIndex: number) => {
            let result = new Phaser.Physics.Arcade.Image(this, x_, y, TextureKeysEnum.SprGrassPlatforms, frameIndex).setOrigin(0)
            this.add.existing(result)
            this.physics.add.existing(result, true)
            this.plattforms.add(result)
            return result
        }

        getImage(_x, sprites_by_types[0])
        _x += tile_width
        for (let i = 1; i <= mid_tile_count; i++) {
            getImage(_x, sprites_by_types[1])
            _x = _x + tile_width
        }
        getImage(_x, sprites_by_types[2])
    }

}