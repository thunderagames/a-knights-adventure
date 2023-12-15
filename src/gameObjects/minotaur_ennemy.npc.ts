import Phaser from "phaser"
import { interval } from "rxjs"
import AnimationKeysEnum from "~/constants/animation-keys.enum"
import SpritesheetKeysEnum from "~/constants/spritesheet-keys.enum"
import TextureKeysEnum from "~/constants/texture-keys.enum"

export class MinotaurEnnemyNPC extends Phaser.Physics.Arcade.Sprite {

    speed_x = 50
    attacking: boolean = false
    

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, SpritesheetKeysEnum.SprMinotaurStand)

        //create on scene
        scene.physics.add.existing(this)
        scene.add.existing(this);
        this.setDepth(5000)
        this.setScale(1.6, 1.8)

        this.setSize(30, 40)
        this.setOffset(10, 8)
        this.createAnimations()
        this.play(AnimationKeysEnum.SprMinotaurStand)

        scene.events.on(Phaser.Scenes.Events.UPDATE, () => {
           // this.setVelocityX(this.speed_x)

            let goingToLeft = (this.body?.velocity.x || 0) > 0
            this.flipX = goingToLeft
        })
    }

    private createAnimations() {
        this.anims.create({
            key: AnimationKeysEnum.SprMinotaurStand,
            frames: this.anims.generateFrameNames(SpritesheetKeysEnum.SprMinotaurStand),
            frameRate: 4,
            repeat: -1
        })

        this.anims.create({
            key: AnimationKeysEnum.SprMinotaurAttack,
            frames: this.anims.generateFrameNames(SpritesheetKeysEnum.SprMinotaurAttack),
            frameRate: 6,
            repeat: -1
        })

        this.anims.create({
            key: AnimationKeysEnum.SprMinotaurRun,
            frames: this.anims.generateFrameNames(SpritesheetKeysEnum.SprMinotaurRun),
            frameRate: 6,
            repeat: -1
        })


        this.anims.create({
            key: AnimationKeysEnum.SprMinotaurDead,
            frames: this.anims.generateFrameNames(SpritesheetKeysEnum.SprMinotaurDead),
            frameRate: 6,
            repeat: 0
        })
    }
}