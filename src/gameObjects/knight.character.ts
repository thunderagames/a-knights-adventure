import Phaser from "phaser"
import { timer } from "rxjs";
import AnimationKeysEnum from "~/constants/animation-keys.enum";
import CharacterAnimationKeysEnum from "~/constants/character-animation-keys.enum";
import SpritesheetKeysEnum from "~/constants/spritesheet-keys.enum"
import TextureKeysEnum from "~/constants/texture-keys.enum";

export class KnightCharacter extends Phaser.Physics.Arcade.Sprite {
    //SPEED: number = 120;
    character_run_speed = 200
    character_jump_speed = -505
    jump_duration_ms = 300
    can_jump = true
    jump_interval_ms = 650
    attack_timmer = 500
    block_running = false
    have_sword = false
    stop_all = false

    left_key: Phaser.Input.Keyboard.Key | undefined
    right_key: Phaser.Input.Keyboard.Key | undefined
    up_key: Phaser.Input.Keyboard.Key | undefined
    space_key: Phaser.Input.Keyboard.Key | undefined

    worldEnds: boolean = false;
    life = 100;
    lifeBar!: Phaser.GameObjects.Image;

    state_machine = {
        state: 'STAND',
        STAND: {
            run: (direction: 'left' | 'right') => {
                if (this.body?.touching.down && !this.worldEnds && !this.block_running) {
                    let velocity = this.character_run_speed * (direction == "left" ? -1 : 1)
                    this.setVelocityX(velocity)

                    this.state_machine.state = 'RUNNING'
                }
            },
            jump: () => {
                if (this.can_jump) {
                    this.can_jump = false
                    this.setVelocityY(this.character_jump_speed)
                    this.state_machine.state = 'JUMPING'
                    timer(this.jump_duration_ms).subscribe(() => {
                        this.state_machine.state = 'FALLING'
                        this.block_running = false
                    })

                    timer(this.jump_interval_ms).subscribe(() => {
                        this.can_jump = true
                    })
                }

            },
            attack: () => {
                let prev_state = this.state_machine.state
                this.state_machine.state = "ATTACKING"
                this.block_running = true
                this.setSize(55, 40)
                this.setOffset(43, 40)
                this.play(CharacterAnimationKeysEnum.attack).on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.block_running = false
                    this.state_machine.state = prev_state
                    this.setSize(25, 40)
                    this.setTexture(SpritesheetKeysEnum.SprCharacterStand, 0)
                })
            }
        },
        RUNNING: {
            run: (direction: 'left' | 'right') => {
                if (this.body?.touching.down && !this.worldEnds && !this.block_running) {

                    if (this.character_run_speed > 120)
                        this.character_run_speed -= 1

                    let velocity = this.character_run_speed * (direction == "left" ? -1 : 1)
                    this.setVelocityX(velocity)
                    this.flipX = direction == "left"
                }
            },
            jump: () => {
                if (this.can_jump) {
                    this.can_jump = false
                    this.setVelocityY(this.character_jump_speed)
                    this.state_machine.state = 'JUMPING'
                    timer(this.jump_duration_ms).subscribe(() => {
                        this.state_machine.state = 'FALLING'
                    })
                    timer(this.jump_interval_ms).subscribe(() => {
                        this.can_jump = true
                    })
                }
            },
            stop: () => {
                this.setVelocityX(0)
                this.character_run_speed = 200
                this.state_machine.state = 'STAND'
                this.play(CharacterAnimationKeysEnum.stand)
            },
            fall: () => { },
            attack: () => {

                this.state_machine.state = 'STAND'
                this.setVelocityX(0)
                this.dipatchStateAction('attack', null)
            }
        },
        JUMPING: {
            moveX: (direction: 'left' | 'right') => {
                if (!this.worldEnds) {
                    let velocity = this.character_run_speed * (direction == "left" ? -1 : 1)
                    this.setVelocityX(velocity)
                }
            },
            fall: () => { },
            attack: () => { }
        },
        FALLING: {
            stand: () => {
                this.setVelocityX(0)
                this.state_machine.state = 'STAND'
            },
            moveX: (direction: 'left' | 'right') => {
                if (!this.worldEnds) {
                    let velocity = this.character_run_speed * (direction == "left" ? -1 : 1)
                    this.setVelocityX(velocity)
                }
            },
            attack: () => { }
        },
        ATTACKING: {
            hitEnnemy: () => { },
            attackEnd: () => { }
        }
    }

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, SpritesheetKeysEnum.SprCharacterStand);

        //create on scene
        scene.physics.add.existing(this)
        scene.add.existing(this);
        this.setDepth(5000)
        this.setScale(1.2, 1.2)
        this.setOrigin(0.5, 1)
        this.setSize(25, 40)

        //set animations and play default
        this.createAnimations();
        this.play(CharacterAnimationKeysEnum.stand)

        this.left_key = scene.input.keyboard?.addKey('LEFT')
        this.right_key = scene.input.keyboard?.addKey('RIGHT')
        this.up_key = scene.input.keyboard?.addKey('UP')
        this.space_key = scene.input.keyboard?.addKey('SPACE')

        scene.events.on(Phaser.Scenes.Events.UPDATE, (dt, t) => {
            if (this.stop_all) {
                this.setVelocityX(0)
                this.setVelocityY(0)

            } else {

                this.setKeyboardInteraction()
                this.attack_timmer += t;
            }
        })

        this.space_key?.on(Phaser.Input.Keyboard.Events.DOWN, () => {
            if (this.attack_timmer > 500 && this.have_sword) {
                this.attack_timmer = 0
                this.dipatchStateAction('attack', null)
            }
        })


    }

    setKeyboardInteraction() {
        if (this.state_machine.state != "ATTACKING") {
            this.setSize(25, 40)
            if (!this.flipX) {
                this.setOffset(43, 40)
            } else {
                this.setOffset(50, 40)
            }
        } else {
            if (!this.flipX) {
                this.setOffset(55, 40)
            } else {
                this.setOffset(10, 40)
            }
        }


        if (this.state_machine.state != 'JUMPING') {
            if (this.left_key?.isDown) {
                this.dipatchStateAction('run', 'left')
            }

            if (this.right_key?.isDown) {
                this.dipatchStateAction('run', 'right')
            }

            if (this.right_key?.isDown && this.left_key?.isDown || !this.right_key?.isDown && !this.left_key?.isDown) {
                this.dipatchStateAction('stop', null)
            }

        }

        if (this.state_machine.state == 'JUMPING' || this.state_machine.state == 'FALLING') {
            this.play(CharacterAnimationKeysEnum.jump)

            if (this.left_key?.isDown) {
                this.dipatchStateAction('moveX', 'left')
                this.setTexture(SpritesheetKeysEnum.SprCharacterRun, 0)

            }

            if (this.right_key?.isDown) {
                this.dipatchStateAction('moveX', 'right')
                this.setTexture(SpritesheetKeysEnum.SprCharacterRun, 0)
            }

            if (this.body?.touching.down) {
                this.dipatchStateAction('stand', null)
                this.play(CharacterAnimationKeysEnum.stand)
            }

          
        }

        if (this.up_key?.isDown) {
            this.dipatchStateAction('jump', null)
        }

        if (this.state_machine.state != 'STAND' && this.body?.velocity.x != 0) {
            this.flipX = (this.body?.velocity.x || 0) < 0
            if (this.anims.getName() != CharacterAnimationKeysEnum.run) {
                this.play(CharacterAnimationKeysEnum.run)
            }
        }

    }

    dipatchStateAction(action: string, payload: any) {
        let current_state = this.state_machine[this.state_machine.state]
        let action_fn = current_state[action]
        if (action_fn) {
            action_fn(payload)
        }
    }

    private createAnimations() {
        this.anims.create({
            key: CharacterAnimationKeysEnum.stand,
            frames: this.anims.generateFrameNames(SpritesheetKeysEnum.SprCharacterStand),
            frameRate: 6,
            repeat: -1
        })

        this.anims.create({
            key: CharacterAnimationKeysEnum.jump,
            frames: this.anims.generateFrameNames(SpritesheetKeysEnum.SprCharacterJump),
            frameRate: 6,
            repeat: -1
        })
    }

}