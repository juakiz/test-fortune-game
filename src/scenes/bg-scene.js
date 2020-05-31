import RLC from '../services/responsive-layout-calculator';

export default class BGScene extends Phaser.Scene {
  constructor() {
    super('BGScene');
  }

  create(data) {
    this.mainCam = this.cameras.main;
    // this.mainCam.setBackgroundColor(BACKGROUND_COLOR);
    this.mainCam.fadeIn(200);

    this.playScene = data.playScene;

    this.bgImg = this.add.image(RLC.CENTER_X, RLC.CENTER_Y, 'jpg_atlas', 'grassland_bg.jpg');

    // Events
    // this.events.on('add-points', this.setScore, this);

    // Resize issue
    this.scale.on('resize', this.onResize, this);
    this.onResize();
  }

  removeListeners() {
    // this.events.off('add-points');
  }

  onResize(gameSize, baseSize, displaySize, resolution) {
    // this.mainCam.setSize(this.scale.gameSize.width, this.scale.gameSize.height);
    this.children.list.forEach(children => { if (children.resize) children.resize(); });
    this.mainCam.setZoom(RLC.SCALE);
    this.mainCam.centerOn(RLC.CENTER_X, RLC.CENTER_Y);
  }

  update(time, delta) {
    this.children.list.forEach(children => { if (children.update) children.update(); });
  }
}
