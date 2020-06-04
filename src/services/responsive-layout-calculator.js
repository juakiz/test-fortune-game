import { MINIMUM_WIDTH, MINIMUM_HEIGHT } from "./game-settings";

export default class RLC {
  constructor() {
    throw new Error('AbstractClassError');
  }

  static resize() {

    RLC.SCREEN_WIDTH = window.innerWidth;
    RLC.SCREEN_HEIGHT = window.innerHeight;

    // Letterbox CAMERA calculations
    RLC.SCALE_WIDTH = RLC.SCREEN_WIDTH / RLC.BOX_WIDTH;
    RLC.SCALE_HEIGHT = RLC.SCREEN_HEIGHT / RLC.BOX_HEIGHT;

    RLC.SCALE = (RLC.SCALE_WIDTH < RLC.SCALE_HEIGHT) ? RLC.SCALE_WIDTH : RLC.SCALE_HEIGHT;
    const INVS = RLC.INVS = 1 / RLC.SCALE;

    RLC.CENTER_X = RLC.BOX_WIDTH / 2;
    RLC.CENTER_Y = RLC.BOX_HEIGHT / 2;

    RLC.LEFT = -((RLC.SCREEN_WIDTH / 2) - RLC.CENTER_X * RLC.SCALE) * INVS;
    RLC.RIGHT = -RLC.LEFT + RLC.BOX_WIDTH;
    RLC.TOP = -((RLC.SCREEN_HEIGHT / 2) - RLC.CENTER_Y * RLC.SCALE) * INVS;
    RLC.BOT = -RLC.TOP + RLC.BOX_HEIGHT;

    RLC.TOTAL_WIDTH = RLC.RIGHT - RLC.LEFT;
    RLC.TOTAL_HEIGHT = RLC.BOT - RLC.TOP;
  }
}

// Set letterbox Container size here:
RLC.BOX_WIDTH = MINIMUM_WIDTH;
RLC.BOX_HEIGHT = MINIMUM_HEIGHT;

RLC.resize();
