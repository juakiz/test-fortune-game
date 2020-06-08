import RLC from '../services/responsive-layout-calculator';
import { INITIAL_BID_INDEX, FONT_FAMILY, FONT_STROKE_COLOR, INITIAL_MONEY, FONT_COLOR } from '../services/game-settings';
import { setTextGradient } from '../utils/general-utils';
import { createText } from '../utils/general-utils';
import Slot from './play/slot';
import SlotController from '../services/slot-controller';
import Counter from '../utils/counter-txt';
import { BID_AMOUNTS } from '../services/globals';
import { SYMBOLS } from '../services/assets-data';

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  create() {
    this.mainCam = this.cameras.main;
    // this.mainCam.fadeIn(900);

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
    // Money counter
    const m_frame = this.add.image(0, 0, 'atlas', 'm_frame.png');
    m_frame.x = RLC.CENTER_X;
    m_frame.y = RLC.CENTER_Y;

    this.moneyTxt = new Counter(this, INITIAL_MONEY, {
      x: RLC.CENTER_X + 205,
      y: 132,
      duration: 5,
      durationPerUnit: true,
      suffix: ' kr',
      style: {
        fontSize: '46px',
        fontFamily: FONT_FAMILY,
        color: FONT_COLOR,
        stroke: FONT_STROKE_COLOR,
        strokeThickness: 8,
      },
    })
      .setOrigin(1, 0.5)
      .setStyle({ fontFamily: 'OSWALDblack', fontSize: '86px' })
      .setShadow(0, 3, '#808080', 11, false, true)
      .setPadding({ x: 6, y: 6 });

    setTextGradient(this.moneyTxt, [
      { percent: 0.1, color: '#feec4e' },
      { percent: 0.4, color: '#fde301' },
      { percent: 0.8, color: '#f0b809' },
    ]);

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
      x: 137,
      y: 782,
      text: `Bid: ${this.bid}`,
      size: '36px',
    })
      .setStroke('#333333', 8);
    this.bidText = bidText;
    bidText.setInteractive();

    const prizesText = createText(this, {
      x: 137,
      y: 705,
      text: 'Prizes',
      size: '36px',
    })
      .setStroke('#333333', 8);
    this.prizesText = prizesText;
    prizesText.setInteractive();

    // Slots
    const slotFrame = this.add.image(RLC.CENTER_X, 310, 'atlas', 'slot_container.png');
    this.slots = [
      new Slot(this, 167, slotFrame.y),
      new Slot(this, RLC.CENTER_X, slotFrame.y),
      new Slot(this, RLC.BOX_WIDTH - 167, slotFrame.y),
    ];

    // Sounds
    this.rockSound = this.sound.add('rock', { volume: 0.5 });
    this.spinSound = this.sound.add('spinning', { loop: true, volume: 0.5 });
    this.stopSound = this.sound.add('stop');
    this.coinsSound = this.sound.add('coins');
    this.flashSound = this.sound.add('flash');


    // Events
    // this.events.on('event', this.onEvent, this);

    // DEBUG
    // JACKPOT
    var keyObj = this.keyObj = this.input.keyboard.addKey('Q');
    keyObj.on('down', function (event) {
      this.startSpin(50, [0, 0, 0])
    }, this);

    // BIG WIN
    var keyObj = this.keyObj = this.input.keyboard.addKey('W');
    keyObj.on('down', function (event) {
      const index = Phaser.Math.Between(1, SYMBOLS.length - 1);
      this.startSpin(50, [index, index, index])
    }, this);

    // INPUT
    // this.input.on('pointerdown', function (pointer) {
    // }, this);
    button_front.on('pointerdown', this.onPushButton, this);
    bidText.on('pointerdown', this.onChangeBid, this);
    prizesText.once('pointerdown', this.ui.onShowPrizes, this.ui);

    this.dustParticles = this.createDustParticles();

    // Resize
    this.scale.on('resize', this.onResize, this);
    this.onResize();

    this.mainCam.y = -1024;
    this.tweens.add({
      targets: this.mainCam,
      y: 0,
      ease: 'Quad.easeIn',
      duration: 1200,
      onComplete: (() => {
        this.rockSound.play();
        this.dustParticles.particles.emitParticle(20);
        this.ui.infoTxt.readyText();
        this.ui.infoTxt.alpha = 0;
        this.tweens.add({
          targets: this.ui.infoTxt,
          alpha: 1,
          duration: 600,
        });
      }).bind(this),
    });
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
    this.moneyTxt.setCounter(amount);
  }

  get balance() {
    return this.moneyTxt.amount;
  }

  onPushButton() {
    if (this.balance - this.bid >= 0) {
      this.startSpin(this.bid);
    } else {
      this.ui.infoTxt.setText('Not enough\ncredit :(');
    }
  }

  startSpin(bid, forceResult = false) {
    const { circle, button_front, ui, slotController, moneyTxt } = this;
    const { infoTxt } = ui;

    if (slotController.spinning || slotController.animating) return;

    slotController.onPushButton(bid, forceResult);
    moneyTxt.modCounter(-bid);
    infoTxt.dotsAnimStart();

    button_front.setScale(0.96, 0.96);
    circle.setFillStyle(0xfb0000);
    this.time.addEvent({
      delay: 100,
      callback: (() => {
        button_front.setScale(1, 1);
      }).bind(this),
    });
  }

  onChangeBid() {
    this.bidIndex = (this.bidIndex + 1) % BID_AMOUNTS.length;
    this.bid = BID_AMOUNTS[this.bidIndex];
    this.bidText.setText(`Bid: ${this.bid}`);
    this.moneyTxt.duration = 5 * (50 / this.bid);
  }

  createDustParticles() {
    const particles = this.add.particles('atlas');
    const emitter = particles.createEmitter({
      on: false,
      radial: true,
      frame: 'smoke.png',
      gravityY: -30,
      alpha: {
        start: 0.5,
        end: 0,
        ease: 'Sine.easeOut',
      },
      angle: {
        min: -150,
        max: -60,
      },
      lifespan: [900, 1600],
      quantity: [30],
      scale: {
        start: 0.8,
        end: 1.2,
        ease: 'Sine.easeOut',
      },
      speed: {
        min: 15,
        max: 60,
      },
      x: {
        min: 0,
        max: 768,
      },
      y: {
        ease: 'Linear',
        min: 1000,
        max: 1050,
      }
    });
    return { particles, emitter };
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
