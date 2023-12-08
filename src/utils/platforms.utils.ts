import SpritesheetKeysEnum from "~/constants/spritesheet-keys.enum"
import TextureKeysEnum from "~/constants/texture-keys.enum"

export class PlatformUtils {
    drawPlatform(x, y, width, type: 'grass', scene: Phaser.Scene, group: Phaser.GameObjects.Group): void {
        let tile_width = 16
        let mid_tile_count = width
        let _x = x
        let sprites_by_types = this.getSpritesIndexByType(type)
        let getImage = (x_: number, frameIndex: number) => {
            let result = new Phaser.Physics.Arcade.Image(scene, x_, y, TextureKeysEnum.SprGrassPlatforms, frameIndex).setOrigin(0).setDepth(10)
            scene.add.existing(result)
            scene.physics.add.existing(result, true)
            group.add(result)
            return result
        }

        getImage(_x, sprites_by_types[0])
        _x += tile_width
        for (let i = 1; i <= mid_tile_count; i++) {
            getImage(_x, sprites_by_types[1])
            _x = _x + tile_width
        }
        getImage(_x, sprites_by_types[2])


        scene.add.image(Phaser.Math.Between(_x, _x - (width * 16)), y, SpritesheetKeysEnum.SprBackgroundDeco1, 0).setOrigin(0.5, 1).setDepth(5)

    }

    private getSpritesIndexByType(type: 'grass'): number[] {
        switch (type) {
            case 'grass':
                return [0, 1, 2]
            // case PlatformTypes.bricks:
            //     return [3, 4, 5]
            // case PlatformTypes.rocks:
            //     return [6, 7, 8]
            // case PlatformTypes.metalOrange:
            //     return [9, 10, 11]
            // case PlatformTypes.green:
            //     return [12, 13, 14]
            // case PlatformTypes.danger:
            //     return [15, 16, 17]
            default:
                return []
        }
    }

}