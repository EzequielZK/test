type WinningCombinationsResult = [number, number[]][];

function call(lines: number[]): WinningCombinationsResult {
  const { length } = lines;
  let i = 0;
  const wildSymbol = 0; //Wild Symbol
  const combinationSymbol: number[] = [];

  const matchSymbols: WinningCombinationsResult = [];
  /**
   * This function checks the index sequences and return it
   * @param array Array to look for index combination sequences
   * @returns An object with hasSequence boolean and sequence array to attach to combination
   */
  const checkSequences = (array: number[]) => {
    const { length } = array;
    let i = 1;
    let isSequencial = true;
    let sequences = [];

    for (; i < length; i++) {
      if (array[i] - array[i - 1] === 1) {
        if (!sequences.length) {
          sequences.push(array[i - 1]);
        }
        sequences.push(array[i]);
      } else {
        if (sequences.length < 3) {
          sequences = [];
        }
      }
    }

    if (sequences.length < 3) {
      isSequencial = false;
      sequences = [];
    }

    return { isSequencial, sequences };
  };

  /**
   * This function gets all the wild symbol indexes and return it
   * @returns All wild symbol indexes to join with the symbols indexes
   */
  const getWildSymbolIndex = () => {
    const { length } = lines;
    let i = 0;
    const indexes = [];
    for (; i < length; i++) {
      if (lines[i] === wildSymbol) {
        indexes.push(i);
      }
    }

    return indexes;
  };

  /**
   * This function gets the symbol and return an array with all indexes that this symbol lies
   * @param symbol The symbol to look for all indexes of it
   * @returns An array of all indexes of the symbol passed
   */
  const getSymbolsIndex = (symbol: number) => {
    const { length } = lines;
    let i = 0;
    const indexes = [];
    for (; i < length; i++) {
      if (lines[i] === symbol) {
        indexes.push(i);
      }
    }

    return indexes;
  };

  const wildSymbolIndexes = getWildSymbolIndex();

  if (wildSymbolIndexes.length === lines.length) {
    matchSymbols.push([wildSymbol, wildSymbolIndexes]);
  } else {
    for (; i < length; i++) {
      const testPaySymbol = lines[i] > 0 && lines[i] < 10;
      if (testPaySymbol) {
        const symbolIndexes = getSymbolsIndex(lines[i]);
        const allIndexes = [...symbolIndexes, ...wildSymbolIndexes].sort(
          (a, b) => a - b
        );
        if (allIndexes.length >= 3) {
          const { isSequencial, sequences } = checkSequences(allIndexes);

          if (isSequencial && !combinationSymbol.includes(lines[i])) {
            matchSymbols.push([lines[i], sequences]);
            combinationSymbol.push(lines[i]);
          }
        }
      }
    }
  }
  return matchSymbols;
}
export const WinningCombinations = { call };
