import RLC from '../services/responsive-layout-calculator';
import { INITIAL_BID_INDEX, FONT_STROKE_COLOR } from '../services/game-settings';
import { createText } from '../utils/general-utils';
import Slot from './play/slot';
import SlotController from '../services/slot-controller';
import { BID_AMOUNTS } from '../services/globals';

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  create() {
    this.mainCam = this.cameras.main;
    this.mainCam.fadeIn(200);

    // BG Scene
    this.scene.launch('BGScene', { playScene: this });
    this.bg = this.scene.get('BGScene');
    this.scene.sendToBack('BGScene');

    // UI Scene
    this.scene.launch('UIScene', { playScene: this });
    this.ui = this.scene.get('UIScene');

    // Gameplay Manager
    this.slotController = new SlotController(this);

    // Key props
    this.bidIndex = INITIAL_BID_INDEX;
    this.bid = BID_AMOUNTS[this.bidIndex];

    // Game Objects
    const m_frame = this.add.image(0, 0, 'atlas', 'm_frame.png');
    m_frame.x = RLC.CENTER_X;
    m_frame.y = RLC.CENTER_Y;

    const circle = this.add.circle(0, 0, 131);
    this.circle = circle;
    circle.setFillStyle(0x36fe00);
    // circle.setFillStyle(0xfb0000);

    const spin_txt = createText(this, {
      text: 'SPIN',
      size: '90px',
      color: '#fff',
    });
    spin_txt.setStroke(FONT_STROKE_COLOR, 4);

    const button_bg = this.add.image(0, 0, 'atlas', 'button_bg.png');

    const button_front = this.add.image(0, 0, 'atlas', 'button_front.png');
    this.button_front = button_front;
    button_front.setInteractive();

    button_bg.x = RLC.CENTER_X;
    button_bg.y = RLC.BOX_HEIGHT - (button_bg.displayHeight / 2) - 75;
    circle.setPosition(button_bg.x, button_bg.y);
    spin_txt.setPosition(button_bg.x, button_bg.y - 15);
    button_front.setPosition(button_bg.x, button_bg.y);

    const bidText = createText(this, {
      x: 60,
      y: button_bg.y - 100,
      text: `Bid: ${this.bid}`,
      size: '36px',
    });
    bidText.setOrigin(0, 0.5);
    this.bidText = bidText;
    bidText.setInteractive();

    // Slots
    const slotFrame = this.add.image(RLC.CENTER_X, 310, 'atlas', 'slot_container.png');
    this.slots = [
      new Slot(this, 167, slotFrame.y),
      new Slot(this, RLC.CENTER_X, slotFrame.y),
      new Slot(this, RLC.BOX_WIDTH - 167, slotFrame.y),
    ];

    // Sounds
    // this.music = this.sound.add('music');


    // Events
    // this.events.on('event', this.onEvent, this);

    // DEBUG
    var keyObj = this.keyObj = this.input.keyboard.addKey('W');  // debug
    keyObj.on('down', function (event) {
      // this.ui.particles.emitParticleAt(RLC.CENTER_X, RLC.CENTER_Y, 16);
      // this.add.sprite().setPosition(500, 500).play('coin');
      // this.events.emit('event');
      this.slotController.forceResult = [7, 7, 7];
    }, this);

    // INPUT
    // this.input.on('pointerdown', function (pointer) {
    // }, this);
    button_front.on('pointerdown', this.onPushButton, this);
    bidText.on('pointerdown', this.onChangeBid, this);

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
  set balance(amount) {
    this.ui.moneyTxt.setCounter(amount);
  }

  get balance() {
    return this.ui.moneyTxt.amount;
  }

  onPushButton() {
    const { circle, button_front, ui, slotController } = this;
    const { moneyTxt, infoTxt } = ui;
    
    if (slotController.spinning || slotController.animating) return;

    if (this.balance - this.bid >= 0) {
      slotController.onPushButton(this.bid);
      moneyTxt.modCounter(-this.bid);
      infoTxt.dotsAnimStart();

      button_front.setScale(0.96, 0.96);
      circle.setFillStyle(0xfb0000);
      this.time.addEvent({
        delay: 100,
        callback: (() => {
          button_front.setScale(1, 1);
        }).bind(this),
      });
    } else {
      infoTxt.setText('Not enough\ncredit :(');
    }
  }

  onChangeBid() {
    this.bidIndex = (this.bidIndex + 1) % BID_AMOUNTS.length;
    this.bid = BID_AMOUNTS[this.bidIndex];
    this.bidText.setText(`Bid: ${this.bid}`);
    this.ui.moneyTxt.duration = 5 * (50 / this.bid);
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
