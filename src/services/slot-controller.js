import fakeServerCall from "./fake-server-call";

export default class SlotController {
  constructor(playScene) {
    this.scene = playScene;

    this.waiting = false;
  }

  onPushButton(bet) {
    if (this.waiting) return;

    new Promise((resolve, reject) => {
      this.waiting = true;
      this.startSpin();
      const result = fakeServerCall(bet);
      setTimeout(() => {
        if (result) {
          resolve(result);
        }
        else {
          reject(result);
        }
        this.waiting = false;
      }, 40 + Math.random() * 2000);
    })
      .then(this.onResolve.bind(this), this.onReject.bind(this));
  }

  onResolve(result) {
    console.log(result);
    this.stopSpin(result);
  }

  onReject(err) {
    console.log(err);
  }

  startSpin() {
    this.spinning = true;
  }

  stopSpin(result) {
    this.spinning = false;
    this.scene.slots.forEach((slot, i, arr) => {
      slot.setSymbol(result.symbols[i]);
    });
    this.scene.circle.setFillStyle(0x36fe00); // TODO: REMOVE THIS, TEMPORAL
  }

  update() {
    if (this.spinning) {
      this.scene.slots.forEach(slot => {
        slot.setRandomSymbol();
      });
    }
  }
}
