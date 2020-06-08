export default class CoinParticle extends Phaser.GameObjects.Particles.Particle {
  constructor(emitter) {
    super(emitter);

    this.t = 0;
    this.i = 0;
  }

  update(delta, step, processors) {
    var result = super.update(delta, step, processors);

    this.t += delta;
    if (this.t >= CoinParticle.anim.msPerFrame) {
      this.i++;

      if (this.i > CoinParticle.anim.frames.length - 1) {
        this.i = 0;
      }

      this.frame = CoinParticle.anim.frames[this.i].frame;
      this.t -= CoinParticle.anim.msPerFrame;
    }

    return result;
  }
}
