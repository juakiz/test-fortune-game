import fakeServerCall from "./fake-server-call";
import { MAX_SERVER_DELAY } from "./game-settings";
import { MATCH_TYPES } from "./globals";

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
      const fakeServerResponse = () => {
        const result = fakeServerCall(bet);
        if (typeof result.symbols !== 'undefined' && typeof result.prize !== 'undefined')
          resolve(result);
        else
          reject(result);
        this.waiting = false;
      }
      setTimeout(fakeServerResponse.bind(this), 20 + Math.random() * MAX_SERVER_DELAY);
    })
      .then(this.onResolve.bind(this), this.onReject.bind(this));
  }

  onResolve(result) {
    console.log(result);
    this.scene.ui.moneyTxt.modCounter(result.prize);
    this.stopSpin(result);
  }

  onReject(err) {
    console.log(err);
    this.stopSpin();
  }

  startSpin() {
    this.spinning = true;
    // this.scene.time.addEvent({
    //   delay: 20,
    //   callBack: (() => {
    //     this.scene.slots.forEach(slot => {
    //       slot.setRandomSymbol();
    //     });
    //   }).bind(this),
    // });

    this.scene.slots.forEach(slot => {
      slot.spin();
      slot.setLight(0);
    });
  }

  stopSpin(result) {
    // this.spinning = false; // TODO: BE CAREFUL WITH THIS (PUT WHEN USER IS READY TO NEW SPIN)
    // if (typeof result !== 'undefined') {
    //   this.scene.slots.forEach((slot, i, arr) => {
    //     slot.setSymbol(result.symbols[i]);
    //   });
    // } else {
    //   this.scene.ui.moneyTxt.modCounter(this.scene.bid);
    // }
    // this.scene.circle.setFillStyle(0x36fe00); // TODO: REMOVE THIS, TEMPORAL

    let delay;
    this.scene.slots.forEach((slot, i, arr) => {
      delay = 600 * i + Math.random() * 200 * i;
      let matchType = this.getMatchType(result.symbols, i);
      setTimeout(
        () => {
          slot.stopSpin(result.symbols[i]);
          if (matchType === MATCH_TYPES.WIN) {
            slot.setLight(2);
            slot.flash();
            arr[i - 1].setLight(2);
            arr[i - 1].flash();
          } else if (matchType === MATCH_TYPES.BIG_WIN) {
            slot.setLight(2);
            slot.flash();
            arr[i - 2].flash();
            arr[i - 1].flash();
          }
        },
        // slot.stopSpin.bind(slot, result.symbols[i]),
        delay,
      );
    });

    setTimeout(
      () => {
        this.scene.circle.setFillStyle(0x36fe00);
        this.spinning = false;
      },
      delay,
    );
  }

  getMatchType(symbols, index) {
    let winType = MATCH_TYPES.NO_WIN;
    if (symbols[index] === symbols[index - 1]) {
      winType = MATCH_TYPES.WIN;
      if (symbols[index] === symbols[index - 2]) {
        winType = MATCH_TYPES.BIG_WIN;
        if (symbols[index] === 0) {
          winType = MATCH_TYPES.JACKPOT;
        }
      } else if (symbols[index] === 0) {
        winType = MATCH_TYPES.NO_WIN;
      }
    }
    return winType;
  }

  update() {
    // if (this.spinning) {
    //   this.scene.slots.forEach(slot => {
    //     slot.setRandomSymbol();
    //   });
    // }
  }
}
