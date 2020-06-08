import weightedRandom from 'weighted-random';

const SYMBOLS = {
  RAINBOW: 0,
  GOLD: 1,
  SILVER: 2,
  VIOLET: 3,
  GREEN: 4,
  ORANGE: 5,
  RED: 6,
  BLUE: 7,
};

const SYMBOL_DATA = {
  VALUES: [],
  WEIGHTS: [],
};

SYMBOL_DATA.VALUES[SYMBOLS.RAINBOW] = 50;
SYMBOL_DATA.VALUES[SYMBOLS.GOLD] = 12;
SYMBOL_DATA.VALUES[SYMBOLS.SILVER] = 6;
SYMBOL_DATA.VALUES[SYMBOLS.VIOLET] = 3;
SYMBOL_DATA.VALUES[SYMBOLS.GREEN] = 2.5;
SYMBOL_DATA.VALUES[SYMBOLS.ORANGE] = 2;
SYMBOL_DATA.VALUES[SYMBOLS.RED] = 1.5;
SYMBOL_DATA.VALUES[SYMBOLS.BLUE] = 1;

SYMBOL_DATA.WEIGHTS[SYMBOLS.RAINBOW] = 6;
SYMBOL_DATA.WEIGHTS[SYMBOLS.GOLD] = 7;
SYMBOL_DATA.WEIGHTS[SYMBOLS.SILVER] = 7;
SYMBOL_DATA.WEIGHTS[SYMBOLS.VIOLET] = 15;
SYMBOL_DATA.WEIGHTS[SYMBOLS.GREEN] = 15;
SYMBOL_DATA.WEIGHTS[SYMBOLS.ORANGE] = 15;
SYMBOL_DATA.WEIGHTS[SYMBOLS.RED] = 15;
SYMBOL_DATA.WEIGHTS[SYMBOLS.BLUE] = 20;

const randomizeSymbols = function () {
  const roll = [];
  for (let i = 0; i < 3; i++) {
    // roll[i] = 0;
    roll[i] = weightedRandom(SYMBOL_DATA.WEIGHTS);
  }
  return roll;
}

const calculatePrize = function (symbols, bet) {
  let price = 0;
  const match = { type: null, count: 0 };

  symbols.sort();
  let prev;
  for (let i = 0; i < symbols.length; i++) {
    if (symbols[i] === prev) {
      match.type = symbols[i];
      match.count++;
    }
    prev = symbols[i];
  }


  if (match.count === 1 && match.type !== SYMBOLS.RAINBOW) {
    price = SYMBOL_DATA.VALUES[match.type] * bet;
  } else if (match.count === 2) {
    price = SYMBOL_DATA.VALUES[match.type] * 6 * bet;
  }

  return price;
}

export default function (bet, forceResult) {
  const symbols = forceResult || randomizeSymbols();
  const prize = calculatePrize(symbols, bet);
  const result = Math.random() > 0.01 ? { symbols, prize } : Error('(Server) This is fake error ;).');
  return result;
}
