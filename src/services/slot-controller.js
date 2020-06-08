import fakeServerCall from "./fake-server-call";
import { MAX_SERVER_DELAY } from "./game-settings";
import { MATCH_TYPES } from "./globals";

export default class SlotController {
  constructor(playScene) {
    this.scene = playScene;

    this.waiting = false;
    this.forceResult = false;
  }

  onPushButton(bid) {
    if (this.waiting) return;

    new Promise((resolve, reject) => {
      this.waiting = true;
      this.startSpin();
      const fakeServerResponse = () => {
        const result = fakeServerCall(bid, this.forceResult);
        if (typeof result.symbols !== 'undefined' && typeof result.prize !== 'undefined')
          resolve(result);
        else {
          reject({ err: result, bid });
        }
        this.waiting = false;
      }
      setTimeout(fakeServerResponse.bind(this), 20 + Math.random() * MAX_SERVER_DELAY);
    })
      .then(this.onResolve.bind(this), this.onReject.bind(this));
  }

  onResolve(result) {
    console.log(result);
    this.stopSpin(result);
  }

  onReject(errorData) {
    alert('[Info]: Simulated server error, bid refund.')
    console.log(errorData.err);
    this.scene.slots.forEach((slot, i, arr) => {
      slot.stopSpin();
    });
    this.scene.ui.infoTxt.readyText();
    this.scene.ui.moneyTxt.modCounter(errorData.bid);
    this.scene.circle.setFillStyle(0x36fe00);
    this.spinning = false;

  }

  startSpin() {
    this.spinning = true;
    this.scene.slots.forEach(slot => {
      slot.spin();
      slot.setLight(0);
    });
  }

  stopSpin(result) {
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
            slot.flash(5);
            arr[i - 2].flash(5);
            arr[i - 1].flash(5);
          } else if (matchType === MATCH_TYPES.JACKPOT) {
            alert('JACKPOT!!!');
            slot.flash(20);
            arr[i - 2].flash(20);
            arr[i - 1].flash(20);
          }

          // Last Slot?
          if (i === 2)
            this.setPrize(result);
        },
        delay,
      );
    });
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

  setPrize(result) {
    this.spinning = false;
    const { symbols, prize } = result;
    const { ui } = this.scene;
    const winType = this.getWinType(symbols);

    if (prize === 0) {
      ui.infoTxt.readyText();
    } else {
      ui.moneyTxt.modCounter(prize);
      if (winType === MATCH_TYPES.WIN) {
        ui.infoTxt.setText(`Win: ${prize} kr!`);
        ui.infoTxt.scaleIn(1400, 100);
        ui.particles.emitParticle(Math.ceil(prize * 0.05));
      } else if (winType === MATCH_TYPES.BIG_WIN) {
        this.animating = true;
        ui.infoTxt.setText(`Big Win:\n${prize} kr!!`);
        ui.infoTxt.scaleIn(900, 900, 0);
        setTimeout(
          (() => {
            ui.infoTxt.visible = false;
            ui.chest.show();
            ui.events.once('animation-end', () => {
              this.animating = false;
              ui.infoTxt.visible = true;
            });
          }).bind(this),
          2400,
        );
      }
    }
    this.scene.circle.setFillStyle(0x36fe00);
  }

  getWinType(symbols) {
    symbols.sort();
    let prev;
    let count = 0;
    for (let i = 0; i < symbols.length; i++) {
      if (symbols[i] === prev)
        count++;
      prev = symbols[i];
    }

    if (count === 2 && prev === 0)
      count++;

    return count;
  }

  update() {
  }
}
