import Phaser from "phaser"
import { timer } from "rxjs";
import CharacterAnimationKeysEnum from "~/constants/character-animation-keys.enum";
import SpritesheetKeysEnum from "~/constants/spritesheet-keys.enum"
import TextureKeysEnum from "~/constants/texture-keys.enum";

export class KnightCharacter extends Phaser.Physics.Arcade.Sprite {
    SPEED: number = 120;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, SpritesheetKeysEnum.SprCharacterStand);

        scene.physics.add.existing(this)
        scene.add.existing(this);
        this.createAnimations();
        this.play(CharacterAnimationKeysEnum.stand)
        this.setDepth(5000)
        this.setScale(0.7, 0.7)

        const left_key = scene.input.keyboard?.addKey('LEFT')
        const right_key = scene.input.keyboard?.addKey('RIGHT')
        const space_key = scene.input.keyboard?.addKey('SPACE')
        const ctrl_key = scene.input.keyboard?.addKey('CTRL')
        const up_key = scene.input.keyboard?.addKey('UP')
        const down_key = scene.input.keyboard?.addKey('DOWN')

        ctrl_key?.on(Phaser.Input.Keyboard.Events.DOWN, () => {
            this.SPEED = 190
            this.anims.frameRate = 13
        })

        space_key?.on(Phaser.Input.Keyboard.Events.DOWN, () => {
            if (this.body?.touching.down)
                this.setVelocityY(-500)
        })

        space_key?.on(Phaser.Input.Keyboard.Events.UP, () => {
            if (!this.body?.touching.down && (this.body?.velocity.y || 0) <= 0)
                timer(100).subscribe(() => { this.setVelocityY(0) })
        })

        ctrl_key?.on(Phaser.Input.Keyboard.Events.UP, () => {
            this.SPEED = this.SPEED
            this.anims.frameRate = 10
        })

        left_key?.on(Phaser.Input.Keyboard.Events.DOWN, () => {
            this.setVelocityX(-this.SPEED)
            //this.flipSprite()

        })

        right_key?.on(Phaser.Input.Keyboard.Events.DOWN, () => {
            this.setVelocityX(this.SPEED)
            //this.flipSprite()
        })

        right_key?.on(Phaser.Input.Keyboard.Events.UP, () => {
            //this.flipSprite(0)

        })

        left_key?.on(Phaser.Input.Keyboard.Events.UP, () => {
            //this.flipSprite(0)
        })

        scene.events.on(Phaser.Scenes.Events.UPDATE, () => {
            if (left_key?.isUp && right_key?.isDown) {
                this.setVelocityX(this.SPEED)
                //this.flipSprite(5)
            }

            if (left_key?.isDown && right_key?.isUp) {
                this.setVelocityX(-this.SPEED)
                //this.flipSprite(5)
            }

            // if (up_key?.isDown && this.is_climbing_ladder) {
            //     this.setVelocityY(-260)
            // }

            if ((!left_key?.isDown && !right_key?.isDown) || (left_key?.isDown && right_key?.isDown)) {
                this.setVelocityX(0)
                if (this.anims.getName() != CharacterAnimationKeysEnum.stand)
                    this.play(CharacterAnimationKeysEnum.stand)
            }

            // if (this.is_climbing_ladder && !up_key?.isDown) {
            //     this.setVelocityY(-20)
            // }

            // if (this.is_climbing_ladder && down_key?.isDown) {
            //     this.setVelocityY(200)
            // }

            if (this.body?.touching.none) {
                if (this.anims.getName() != 'knight-jump')
                    this.play('knight-jump')
            }

            if (this.body?.touching.down && this.body.velocity.x != 0) {
                if (this.anims.getName() != CharacterAnimationKeysEnum.run)
                    this.play(CharacterAnimationKeysEnum.run)
            }
            
            if (<number>this.body?.velocity.x > 0) { 
                this.flipX = false;
            }
            if (<number>this.body?.velocity.x < 0) { 
                this.flipX = true;
            }
        })
    }

    private createAnimations() {
        this.anims.create({
            key: CharacterAnimationKeysEnum.stand,
            frames: this.anims.generateFrameNames(SpritesheetKeysEnum.SprCharacterStand),
            frameRate: 6,
            repeat: -1
        })
    }

}