type AnticipatorConfig = {
  rowSize: number;
  columnSize: number;
  minToAnticipate: number;
  maxToAnticipate: number;
  anticipateCadence: number;
  defaultCadence: number;
};

type SlotCoordinate = {
  column: number;
  row: number;
};

type SpecialSymbol = { specialSymbols: Array<SlotCoordinate> };

type RoundsSymbols = {
  roundOne: SpecialSymbol;
  roundTwo: SpecialSymbol;
  roundThree: SpecialSymbol;
};

type SlotCadence = Array<number>;

type RoundsCadences = {
  roundOne: SlotCadence;
  roundTwo: SlotCadence;
  roundThree: SlotCadence;
};

/**
 * Anticipator configuration. Has all information needed to check anticipator.
 * @param columnSize It's the number of columns the slot machine has.
 * @param minToAnticipate It's the minimum number of symbols to start anticipation.
 * @param maxToAnticipate It's the maximum number of symbols to end anticipation.
 * @param anticipateCadence It's the cadence value when has anticipation.
 * @param defaultCadence It's the cadence value when don't has anticipation.
 */
const anticipatorConfig: AnticipatorConfig = {
  columnSize: 6,
  rowSize: 6,
  minToAnticipate: 1,
  maxToAnticipate: 2,
  anticipateCadence: 2,
  defaultCadence: 1,
};

/**
 * Game rounds with special symbols position that must be used to generate the SlotCadences.
 */
const gameRounds: RoundsSymbols = {
  roundOne: {
    specialSymbols: [
      { column: 1, row: 2 },
      { column: 4, row: 3 },
    ],
  },
  roundTwo: {
    specialSymbols: [
      { column: 0, row: 2 },
      { column: 2, row: 3 },
    ],
  },
  roundThree: {
    specialSymbols: [
      { column: 4, row: 2 },
      { column: 4, row: 3 },
    ],
  },
};

/**
 * This must be used to get all game rounds cadences.
 */
const slotMachineCadences: RoundsCadences = {
  roundOne: [],
  roundTwo: [],
  roundThree: [],
};

/**
 * This function receives an array of coordinates relative to positions in the slot machine's matrix.
 * This array is the positions of the special symbols.
 * And it has to return a slot machine stop cadence.
 * @param symbols Array<SlotCoordinate> positions of the special symbols. Example: [{ column: 0, row: 2 }, { column: 2, row: 3 }]
 * @returns SlotCadence Array of numbers representing the slot machine stop cadence.
 */
function slotCadence(symbols: Array<SlotCoordinate>): SlotCadence {
  // Magic
  const rows = anticipatorConfig.rowSize;
  const columns = anticipatorConfig.columnSize;
  const startAnticipation = anticipatorConfig.minToAnticipate;
  const endAnticipation = anticipatorConfig.maxToAnticipate;
  let cadence = anticipatorConfig.defaultCadence;
  let specialSymbolsFound = 0;

  const cadenceArray: SlotCadence = [];

  let i = 0;

  for (; i < columns; i++) {
    let j = 0;
    const column = i;

    let hasSpecialSymbol = false;

    if (!cadenceArray.length) {
      cadenceArray.push(0);
    } else {
      cadenceArray.push(cadenceArray[i - 1] + cadence);
    }

    for (; j < rows; j++) {
      const row = j;

      hasSpecialSymbol = Boolean(
        symbols.find((symbol) => symbol.column === column && symbol.row === row)
      );

      if (hasSpecialSymbol) {
        specialSymbolsFound++;
        const changedCadence = changeCadenceValue(
          cadence,
          specialSymbolsFound,
          startAnticipation,
          endAnticipation
        );
        cadence = changedCadence;
      }
    }
  }
  return cadenceArray;
}

/**
 * This function compares the number of special symbols found in the matrix and compares it to the start and end anticipation values.
 * It changes the cadence value based on the comparison and return the new cadence value.
 * @param cadence The cadence to be change depending on anticipation value.
 * @param specialSymbolsFound The number of special symbols found in the matrix.
 * @param startAnticipation The start anticipation value.
 * @param endAnticipation The end anticipation value.
 * @returns The new cadence in case of change.
 */
function changeCadenceValue(
  cadence: number,
  specialSymbolsFound: number,
  startAnticipation: number,
  endAnticipation: number
): number {
  if (specialSymbolsFound === startAnticipation) {
    cadence = anticipatorConfig.anticipateCadence;
  } else if (specialSymbolsFound === endAnticipation) {
    cadence = anticipatorConfig.defaultCadence;
  }

  return cadence;
}

/**
 * Get all game rounds and return the final cadences of each.
 * @param rounds RoundsSymbols with contains all rounds special symbols positions.
 * @return RoundsCadences has all cadences for each game round.
 */
function handleCadences(rounds: RoundsSymbols): RoundsCadences {
  slotMachineCadences.roundOne = slotCadence(rounds.roundOne.specialSymbols);
  slotMachineCadences.roundTwo = slotCadence(rounds.roundTwo.specialSymbols);
  slotMachineCadences.roundThree = slotCadence(
    rounds.roundThree.specialSymbols
  );

  return slotMachineCadences;
}

console.log("CADENCES: ", handleCadences(gameRounds));
