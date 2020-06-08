import RLC from '../services/responsive-layout-calculator';
import CustomFonts from 'Assets/fonts/fonts.css';
import atlasImg from 'Assets/assets.png';
import atlasData from 'Assets/assets.json';
import JPGatlasImg from 'Assets/jpg_imgs.jpg';
import JPGatlasData from 'Assets/jpg_imgs.json';
import Spinning from 'Assets/sounds/spinning.mp3';
import Rock from 'Assets/sounds/rock.mp3';
import Stop from 'Assets/sounds/stop.mp3';
import Coins from 'Assets/sounds/coins.mp3';
import Flash from 'Assets/sounds/flash.mp3';
import { FONT_FAMILY, BACKGROUND_COLOR, COLOR_LOADINGBAR_TOP, COLOR_LOADINGBAR_BOT, COLOR_LOADINGBAR_OUTLINE } from '../services/game-settings';
import { GenerateTexture } from '../utils/generate-texture';


export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('PreloaderScene');
  }

  preload() {
    this.cameras.main.setBackgroundColor(BACKGROUND_COLOR);

    this.overlay = this.add.graphics()
      .fillStyle(0x000000, 0.2)
      .fillRect(0, 0, this.scale.width, this.scale.height);

    this.progress = this.add.graphics();
    this.load.on('progress', this.progressBar, this);

    this.load.rexWebFont({
      google: {
        families: [FONT_FAMILY],
      },
      custom: {
        families: ['OSWALDblack'],
        urls: CustomFonts,
      }
    });

    this.load.atlas('atlas', atlasImg, atlasData);
    this.load.atlas('jpg_atlas', JPGatlasImg, JPGatlasData);

    // if (TEST_IMG) this.load.image('test_img', TEST_IMG);
    this.load.audio('spinning', Spinning);
    this.load.audio('stop', Stop);
    this.load.audio('rock', Rock);
    this.load.audio('coins', Coins);
    this.load.audio('flash', Flash);

    // // On Load Complete event
    // this.load.on('complete', () => {
    //   this.loadingComplete = true;
    //   this.input.on('pointerdown', () => {
    //     // scene.scale.startFullscreen();
    //     this.scene.start('PlayScene');
    //   });
    // });

    this.scale.on('resize', this.onResize, this);
  }

  progressBar(value) {
    this.progressValue = value;
    const { width, height } = this.scale;
    const { progress } = this;

    const barHeight = 40/* height * 0.05 */;
    const barWidth = width * 0.8;
    progress.clear();
    progress.fillStyle(COLOR_LOADINGBAR_TOP, 1);
    progress.fillRect(width * 0.1, (height / 2) - (barHeight / 2), barWidth * value, barHeight);
    progress.fillStyle(COLOR_LOADINGBAR_BOT, 0.8);
    progress.fillRect(width * 0.1, (height / 2), barWidth * value, barHeight / 2);
    progress.lineStyle(4, COLOR_LOADINGBAR_OUTLINE);
    progress.strokeRect(width * 0.1 - 6, (height / 2) - (barHeight / 2) - 6, barWidth + 12, barHeight + 12);
  }

  onResize(gameSize) {
    if (gameSize) this.cameras.resize(gameSize.width, gameSize.height);
    RLC.resize();

    this.overlay.clear().fillRect(0, 0, this.scale.width, this.scale.height);
    this.progressBar(this.progressValue);
  }

  create() {
    this.input.mouse.disableContextMenu();

    GenerateTexture.rectFilled(this, 'slot_bg_black', 152, 152, 0x000000);
    GenerateTexture.rectFilled(this, 'slot_bg_white', 152, 152, 0xffffff);

    GenerateTexture.circleFill(this, 'spinner', 32, 0xcccccc);

    this.progress.destroy();
    this.scene.start('PlayScene');
  }
}
