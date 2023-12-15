import Phaser, { Game } from "phaser";
import { timer } from "rxjs";
import GameSceneKeysEnum from "~/constants/game-scene-keys.enum";
import { GameScene } from "~/scenes/game.scene";
import { IntroScene } from "~/scenes/intro.scene";
import { KnightHUDScene } from "~/scenes/knight-hud.scene";
import { LoaderScene } from "~/scenes/loader.scene";
import { MainMenuScene } from "~/scenes/main-menu-.scene";
import { OptionsScene } from "~/scenes/options.scene";

export class KnightWarriorGame extends Phaser.Game {

    private state_machine = {
        state: 'LOADING',
        "LOADING": {
            resourcesLoaded: () => {
                this.scene.stop(GameSceneKeysEnum.loader)
                timer(250).subscribe(() => {
                    this.setStatus('LOADED')
                    this.dipatchStateAction('goToIntroduction', null)
                })
            }
        },
        "LOADED": {
            goToIntroduction: () => {
                this.setStatus('INTRODUCTION')
                this.scene.start(GameSceneKeysEnum.intro)
            }
        },
        "INTRODUCTION": {
            goToMenu: () => {
                this.scene.stop(GameSceneKeysEnum.intro)

                timer(250).subscribe(() => {
                    this.scene.start(GameSceneKeysEnum.mainMenu)
                    this.setStatus('ON_MENU')
                })
            }
        },
        "ON_MENU": {
            goToOptions: () => {
                this.scene.stop(GameSceneKeysEnum.mainMenu)
                this.scene.start(GameSceneKeysEnum.options)
                this.setStatus("ON_OPTIONS")
            },
            goToGame: () => {
                this.scene.stop(GameSceneKeysEnum.mainMenu)
                this.scene.start(GameSceneKeysEnum.game)
                //this.scene.start(GameSceneKeysEnum.KnightHUD)
                this.setStatus("GAME_STARTED")
            }
        },
        "ON_OPTIONS": {
            backToMenu: () => {
                this.scene.stop(GameSceneKeysEnum.options)
                this.scene.start(GameSceneKeysEnum.mainMenu)
                this.setStatus('ON_MENU')
            }
        },
        "GAME_STARTED": {
            pauseGame: () => {
                if (this.scene?.isPaused(GameSceneKeysEnum.game)) {
                    this.scene.resume(GameSceneKeysEnum.game)
                } else {
                    this.scene.pause(GameSceneKeysEnum.game)
                }

            }
        },
        "GAME_PAUSED": {
            resumeGame: () => { },
            restartGame: () => { }
        },
        "GAME_END": {
            restartGame: () => { }
        }
    }

    language = "en"

    constructor() {
        super({
            width: 1024,
            height: 440,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: {
                        y: 1600
                    },
                    debug: false
                }
            },
            scale: {
                autoCenter: Phaser.Scale.CENTER_BOTH,
                mode: Phaser.Scale.FIT,
                expandParent: true
            },
            pixelArt: true,
            scene: [LoaderScene, IntroScene, MainMenuScene, OptionsScene, GameScene, KnightHUDScene],
            input: {
                gamepad: true,
                keyboard: true
            }
        })

        this.input.keyboard
    }


    dipatchStateAction(
        action: 'resourcesLoaded' | 'goToIntroduction' | 'goToMenu' | 'goToOptions' | 'goToGame' | 'backToMenu' | 'pauseGame' | 'resumeGame' | 'restartGame', args: any): void {
        let currentState = this.state_machine[this.state_machine.state]
        let fn_action = currentState[action]
        if (fn_action) {
            fn_action()
        }
    }

    private setStatus(status: 'LOADED' | 'INTRODUCTION' | 'ON_MENU' | 'ON_OPTIONS' | 'GAME_STARTED' | 'GAME_PAUSED' | 'GAME_END') {

        this.state_machine.state = status
    }
}




