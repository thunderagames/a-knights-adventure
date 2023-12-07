import Phaser, { Game } from "phaser";
import GameSceneKeysEnum from "~/constants/game-scene-keys.enum";
import { GameStateInterface } from "~/constants/game-state.interface";
import GameStatesEnum from "~/constants/game-states.enum";
import { LoaderScene } from "~/scenes/loader.scene";

export class KnightWarriorGame extends Phaser.Game {

    private state!: GameStateInterface

    private machine = [
        {
            status: GameStatesEnum.loading,
            actions: {
                "load": () => {
                    // this.scene.stop(GameSceneKeysEnum.loader)
                    // this.state.currentState = GameStatesEnum.loaded
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
                expandParent:true
            },
            pixelArt: true,
            scene: [LoaderScene]
        })

        this.state = {
            currentLevel: '',
            currentState: GameStatesEnum.idle
        }
    }

    setState(newState: GameStatesEnum, action: string) {
        let status = this.machine.find(m => m.status == newState)
        
        //console.log(status?.actions[action])
        status?.actions[action]()
    }
}




