import RLC from '../services/responsive-layout-calculator';
import { BACKGROUND_COLOR } from '../services/game-settings';
import { createText } from '../utils/general-utils';
import Slot from './play/slot';
import SlotController from '../services/slot-controller';

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  create() {
    this.mainCam = this.cameras.main;
    this.mainCam.fadeIn(200);

    // Gameplay Manager
    // Key props
    // Game Objects

    const m_frame = this.add.image(0, 0, 'atlas', 'm_frame.png');
    m_frame.x = RLC.CENTER_X;
    m_frame.y = RLC.CENTER_Y;

    const circle = this.add.circle(0, 0, 131);
    this.circle = circle;
    circle.setFillStyle(0x36fe00);
    // circle.setFillStyle(0xfb0000);

    const spin_txt = createText(this, {
      // fontFamily: 'OSWALDblack',
      text: 'SPIN',
      size: '90px',
      color: '#fff',
    });
    // spin_txt.setStroke();

    const button_bg = this.add.image(0, 0, 'atlas', 'button_bg.png');
    button_bg.x = RLC.CENTER_X;
    button_bg.y = RLC.BOX_HEIGHT - (button_bg.displayHeight / 2) - 75;

    circle.setPosition(button_bg.x, button_bg.y);
    spin_txt.setPosition(button_bg.x, button_bg.y - 15);

    const button_front = this.add.image(0, 0, 'atlas', 'button_front.png');
    this.button_front = button_front;
    button_front.x = button_bg.x;
    button_front.y = button_bg.y;

    button_front.setInteractive();
    button_front.on('pointerdown', this.onPushButton, this);

    // Slots
    const slotFrame = this.add.image(RLC.CENTER_X, 310, 'atlas', 'slot_container.png');
    this.slots = [
      new Slot(this, 167, slotFrame.y),
      new Slot(this, RLC.CENTER_X, slotFrame.y),
      new Slot(this, RLC.BOX_WIDTH - 167, slotFrame.y),
    ];
    this.slotController = new SlotController(this);

    // Sounds
    // this.music = this.sound.add('music');

    // BG Scene
    this.scene.launch('BGScene', { playScene: this });
    this.bg = this.scene.get('BGScene');
    this.scene.sendToBack('BGScene');

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
  onPushButton() {
    if (this.slotController.spinning) return; // TODO: REMOVE THIS, TEMPORAL
    const {circle, button_front } = this;

    button_front.setScale(0.96, 0.96);
    circle.setFillStyle(0xfb0000);
    this.time.addEvent({
      delay: 100,
      callback: (() => {
        button_front.setScale(1, 1);
      }).bind(this),
    });

    this.slotController.onPushButton(5);
  }



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
    this.slotController.update();
  }
}
