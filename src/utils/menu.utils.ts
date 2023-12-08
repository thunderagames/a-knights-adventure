import AudioKeysEnum from "~/constants/audio-keys-enum"

export class MenuUtils {
    private btns_color = 0x3a5e5a
    private btns_alpha = 0.8

    creteBtn = (x: number, y: number, text: string, scene: Phaser.Scene) => {
        scene.add.rectangle(x, y, 280, 35, this.btns_color, this.btns_alpha)
            .setOrigin(0.5, 0.5)
            .setInteractive()

            scene.add.text(x, y, text, { color: '#000', fontSize: 25, fontStyle: 'bold' }).setOrigin(0.5, 0.5)

        let _btn = scene.add.rectangle(x, y, 300, 50, this.btns_color, this.btns_alpha)
            .setOrigin(0.5, 0.5)
            .setAlpha(0.4)
            .setInteractive()
            .on(Phaser.Input.Events.POINTER_OVER, (...rect) => {
                _btn.fillColor = 0x63432a
                scene.sound.play(AudioKeysEnum.AudioSwordHit, { volume: 0.02 })
            }).on(Phaser.Input.Events.POINTER_OUT, (...rect) => {
                _btn.fillColor = this.btns_color
            })

        return _btn
    }
    
}