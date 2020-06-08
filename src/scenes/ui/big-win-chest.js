
export default class BigWinChest extends Phaser.GameObjects.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'atlas', 'chest-closed.png');
    scene.add.existing(this);
    
    this.alpha = 0;

    this.particleManager = this.createParticles();
  }

  // ringAndFlare() {
  //   this.flare = this.scene.add.image(this.x, this.y, 'atlas', 'flare.png');
  //   this.ring = this.scene.add.image(this.x, this.y, 'atlas', 'ring.png');

  //   this.scene.tweens.add({
  //     targets: [this.ring, this.flare],
  //     angle: 360,
  //     duration: 3600,
  //     repeat: -1,
  //   });

  //   this.scene.tweens.add({
  //     targets: this.flare,
  //     scaleX: 2.5,
  //     scaleY: 2.5,
  //     duration: 2400,
  //     repeat: -1,
  //     yoyo: true,
  //     ease: 'Sine.easeInOut'
  //   });
  // }

  show() {
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 300,
      onComplete: this.fade.bind(this),
    });
  }

  fade() {
    this.particleManager.emitter.start();

    this.shakeTwn = this.scene.tweens.add({
      targets: this,
      angle: { from: -2, to: 2 },
      duration: 60,
      yoyo: true,
      repeat: -1,
      delay: 300,
    });

    this.scene.time.addEvent({
      delay: 300,
      callback: (() => {
        this.scene.playScene.flashSound.play();
        this.scene.mainCam.fadeOut(900, 255, 255, 255);
        this.scene.mainCam.once('camerafadeoutcomplete', this.open.bind(this));
      }).bind(this),
    });

    this.scene.tweens.add({
      targets: this,
      delay: 300,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 900,
      ease: 'Sine',
      onComplete: (() => {
        this.scene.tweens.add({
          targets: this,
          scaleX: 1,
          scaleY: 1,
          duration: 300,
          ease: 'Back',
        });
      }).bind(this),
    });
  }

  open() {
    this.shakeTwn.stop();
    this.scene.playScene.circle.setFillStyle(0x36fe00);
    this.scene.mainCam.fadeIn(300, 255, 255, 255);
    this.setTexture('atlas', 'chest-open.png');
    this.scene.input.once('pointerdown', () => {
      this.reset();
    }, this);
  }

  reset() {
    this.alpha = 0;
    this.scene.events.emit('animation-end');
    this.setTexture('atlas', 'chest-closed.png');
    this.particleManager.emitter.stop();
    this.particleManager.emitter.killAll();
  }

  createParticles() {
    const particles = this.scene.add.particles('atlas');
    const emitter = particles.createEmitter({
      x: this.x,
      y: this.y,
      active: true,
      visible: true,
      on: false,
      frame: [
        // 'shiny-particles/shiny-particle0.png',
        'shiny-particles/shiny-particle1.png',
        'shiny-particles/shiny-particle2.png',
        'shiny-particles/shiny-particle3.png',
        'shiny-particles/shiny-particle4.png',
        'shiny-particles/shiny-particle5.png',
        'shiny-particles/shiny-particle6.png',
        'shiny-particles/shiny-particle7.png',
        'shiny-particles/shiny-particle8.png',
      ],
      frequency: 600,
      alpha: {
        start: 1,
        end: 0,
        ease: 'Cubic.easeIn'
      },
      angle: {
        min: 0,
        max: 360,
        ease: 'Cubic.easeOut'
      },
      lifespan: 2400,
      quantity: [1, 2],
      rotate: {
        ease: 'Linear',
        min: 360,
        max: -360
      },
      scale: {
        start: 0,
        end: 2,
        ease: 'Cubic.easeIn'
      },
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(
          -150,
          -100,
          240,
          120
        ),
      },
    });

    return { particles, emitter };
  }
}
