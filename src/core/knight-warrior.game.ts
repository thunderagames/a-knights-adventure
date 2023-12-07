import Phaser, { Game } from "phaser";
import { timer } from "rxjs";
import GameSceneKeysEnum from "~/constants/game-scene-keys.enum";
import { GameStateInterface } from "~/constants/game-state.interface";
import GameStatesEnum from "~/constants/game-states.enum";
import { IntroScene } from "~/scenes/intro.scene";
import { LoaderScene } from "~/scenes/loader.scene";
import { MainMenuScene } from "~/scenes/main-menu-.scene";

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
            goToOptions: () => { },
            goToGame: () => { }
        },
        "ON_OPTIONS": {
            backToMenu: () => { }
        },
        "GAME_STARTED": {
            pauseGame: () => { }
        },
        "GAME_PAUSED": {
            resumeGame: () => { },
            restartGame: () => { }
        },
        "GAME_END": {
            restartGame: () => { }
        }
    }


    constructor() {
        super({
            width: 1024,
            height: 440,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: {
                        y: 16000
                    }
                }
            },
            scale: {
                autoCenter: Phaser.Scale.CENTER_BOTH,
                mode: Phaser.Scale.FIT,
                expandParent: true
            },
            pixelArt: true,
            scene: [LoaderScene, IntroScene, MainMenuScene]
        })
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




