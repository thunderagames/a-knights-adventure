import Phaser, { Game } from "phaser";
import { GameStateInterface } from "~/constants/game-state.interface";
import GameStatesEnum from "~/constants/game-states.enum";

export class KnightWarriorGame extends Phaser.Game {

    private state!: GameStateInterface

    private machine = [
        {
            status: GameStatesEnum.idle,
            actions: {
                "load": () => {
                    this.scene.start('loader')
                    this.state.currentState = GameStatesEnum.loading
                }
            }
        },
        {
            status: GameStatesEnum.loaded,
            actions: {
                "startIntro": () => { }
            }
        },
        {
            status: GameStatesEnum.readyToPlay,
            actions: {
                "startGame": (stage: number) => { }
            }
        },
        {
            status: GameStatesEnum.playing,
            actions: {
                "pauseGame": () => { },

            }
        },
        {
            status: GameStatesEnum.paused,
            actions: {
                "exitGame": () => { },
                "resume": () => { },
                "restartGame": () => { }
            }
        },
        {
            status: GameStatesEnum.ended,
            actions: {
                restartGame: () => { },
                exitGame: () => { }
            }
        },
    ]

    constructor() {
        super({
            width: 1000,
            height: 450,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: {
                        y: 16000
                    }
                }
            },
            pixelArt: true,
        })

        this.state = {
            currentLevel: '',
            currentState: GameStatesEnum.idle
        }
    }
}




