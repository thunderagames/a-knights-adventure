import Phaser from "phaser";
import { timer } from "rxjs";
import AnimationKeysEnum from "~/constants/animation-keys.enum";
import AudioKeysEnum from "~/constants/audio-keys-enum";
import GameSceneKeysEnum from "~/constants/game-scene-keys.enum";
import GameStateActionsEnums from "~/constants/game-state-actions.enum";
import GameStatesEnum from "~/constants/game-states.enum";
import JsonKeysEnum from "~/constants/json-keys.enum";
import SpritesheetKeysEnum from "~/constants/spritesheet-keys.enum";
import TextureKeysEnum from "~/constants/texture-keys.enum";
import { KnightWarriorGame } from "~/core/knight-warrior.game";
import { MenuUtils } from "~/utils/menu.utils";


export class LoaderScene extends Phaser.Scene {
    private count_total_assets = 0;
    private count_loaded_assets = 0;
    assets_json: any;
    loader_assets_label!: Phaser.GameObjects.Text;
    bg_bar_progress!: Phaser.GameObjects.Sprite;
    filled_bar_progress!: Phaser.GameObjects.Sprite;
    game_title!: Phaser.GameObjects.Text;
    local_data: any;

    constructor() {
        super({
            key: GameSceneKeysEnum.loader,
            pack: {
                files: [
                    {
                        key: SpritesheetKeysEnum.LoaderHelmetSrpite,
                        type: 'spritesheet',
                        url: 'img/loader-pack/helmet_loader.png',
                        frameConfig: {
                            frameWidth: 32,
                            frameHeight: 40
                        }
                    },
                    {
                        key: TextureKeysEnum.loaderBar,
                        type: 'image',
                        url: 'img/loader-pack/loading_bar.png',
                    },
                    {
                        key: TextureKeysEnum.loaderBarFull,
                        type: 'image',
                        url: 'img/loader-pack/loading_bar_full.png',
                    },
                    {
                        key: JsonKeysEnum.assets,
                        url: 'data/assets.json',
                        type: 'json'
                    }
                ]
            }
        })
    }

    init(): void {
        this.scale.setGameSize(640, 440)

        this.bg_bar_progress = this.add.sprite(this.scale.width / 2, this.scale.height / 2 + 100, TextureKeysEnum.loaderBar)
            .setOrigin(0.5)
            .setScale(1.3, 1)

        this.filled_bar_progress = this.add.sprite(this.scale.width / 2, this.scale.height / 2 + 100, TextureKeysEnum.loaderBarFull)
            .setOrigin(0.5)
            .setScale(1.3, 1)
            .setVisible(false)

        this.loader_assets_label = this.add.text(32, this.scale.height - 32, `Loading 0 of ${this.count_total_assets} assets...`)

        this.createLoaderAnimations();

        this.add.sprite(this.scale.width / 2, this.scale.height / 2 - 50, SpritesheetKeysEnum.LoaderHelmetSrpite)
            .setOrigin(0.5)
            .setScale(4)
            .play(AnimationKeysEnum.loaderHelmet)

        this.game_title = this.add.text(this.scale.width / 2, 50, 'KNIGHT WARRIOR', { fontSize: 34, fontStyle: 'bold', shadow: { color: '#FF8', offsetX: -5, offsetY: 2, blur: 9, fill: true }, color: '#919191' }).setOrigin(0.5)

        this.load.on(Phaser.Loader.Events.FILE_COMPLETE, () => {
            this.count_loaded_assets++
            let max_width = this.bg_bar_progress.width

            this.loader_assets_label.setText(`Loading ${this.count_loaded_assets} of ${this.count_total_assets} assets...`)
            let current_progress = 100 * this.count_loaded_assets / this.count_total_assets
            let progressBar_width = current_progress * max_width / 100

            this.filled_bar_progress.setCrop(0, 0, progressBar_width, 50)
            this.filled_bar_progress.setVisible(true)
        })


        this.load.on(Phaser.Loader.Events.COMPLETE, () => {
            this.local_data = this.cache.json.get("local-data")
            this.local_data = this.local_data[(<KnightWarriorGame>this.game).language]

            
            let btn_bg = new MenuUtils().creteBtn(this.cameras.main.centerX, this.cameras.main.centerY + 150, this.local_data.start, this)

            btn_bg.on(Phaser.Input.Events.POINTER_DOWN, () => {
                (<KnightWarriorGame>this.game).dipatchStateAction('resourcesLoaded', null)
            })

            this.input.keyboard?.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, () => {
                (<KnightWarriorGame>this.game).dipatchStateAction('resourcesLoaded', null)
            })

            this.input.gamepad?.on(Phaser.Input.Gamepad.Events.BUTTON_DOWN, () => {
                (<KnightWarriorGame>this.game).dipatchStateAction('resourcesLoaded', null)
            })
        })

        this.assets_json = this.game.cache.json.get(JsonKeysEnum.assets)
    }

    preload(): void {
        this.loadAssetsCounter();
        this.load.image(this.assets_json.image)
        this.load.spritesheet(this.assets_json.spritesheet)
        this.load.audio(this.assets_json.audio)
        this.load.json(this.assets_json.json)
    }

    create() {
        // this.local_data = this.cache.json.get("local-data")
        // this.local_data = this.local_data[(<KnightWarriorGame>this.game).language]
        this.game_title.text = this.local_data.title
    }

    private createLoaderAnimations(): void {
        this.anims.create({
            key: AnimationKeysEnum.loaderHelmet,
            frames: this.anims.generateFrameNames(SpritesheetKeysEnum.LoaderHelmetSrpite, { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        })
    }

    private loadAssetsCounter(): void {
        this.count_total_assets = this.assets_json.image.length
        this.count_total_assets += this.assets_json.spritesheet.length
        this.count_total_assets += this.assets_json.audio.length
        this.count_total_assets += this.assets_json.json.length
    }
}