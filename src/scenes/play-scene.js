import RLC from '../services/responsive-layout-calculator';
import { BACKGROUND_COLOR } from '../services/settings';

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  create() {
    this.mainCam = this.cameras.main;
    this.mainCam.setBackgroundColor(BACKGROUND_COLOR);
    this.mainCam.fadeIn(200);

    // Gameplay Manager
    // Key props
    // Game Objects
    // Sounds
    // this.music = this.sound.add('music');

    // UI Scene
    this.scene.launch('UIScene', { playScene: this });
    this.ui = this.scene.get('UIScene');

    this.createParticles();

    // Events
    // this.events.on('event', this.onEvent, this);

    // DEBUG
    var keyObj = this.keyObj = this.input.keyboard.addKey('W');  // debug
    keyObj.on('down', function (event) {
      // this.events.emit('event');
    }, this);

    // INPUT
    this.input.on('pointerdown', function (pointer) {
    }, this);

    // Resize
    this.scale.on('resize', this.onResize, this);
    this.onResize();
  }

  removeListeners() {
    this.events.off('event');
    this.removeInputListeners();
    this.ui.removeListeners();
    if (this.keyObj) this.keyObj.off('down'); // debug
  }

  removeInputListeners() {
    this.input.off('pointerdown');
  }

  // Gameplay methods
  createParticles() {
    this.particles = this.add.particles('particle');

    this.particles.createEmitter({
      key: 'particle',
      angle: { min: 0, max: 360 },
      speed: { min: 200, max: 600 },
      quantity: 4,
      lifespan: 600,
      gravityY: 800,
      rotate: { start: 0, end: 360 },
      on: false
    });
  }

  onResize(gameSize, baseSize, displaySize, resolution) {
    RLC.resize();
    this.children.list.forEach(children => { if (children.resize) children.resize(); });
    this.mainCam.setZoom(RLC.SCALE);
    this.mainCam.centerOn(RLC.CENTER_X, RLC.CENTER_Y);
  }

  update(time, delta) {
    this.children.list.forEach(children => { if (children.update) children.update(); });
  }
}
