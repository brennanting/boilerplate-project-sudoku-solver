class SudokuSolver {
  arrConverter(puzzleString) {
    let puzzArr = puzzleString.split("");
    return puzzArr;
  }

  // rows will be A equals zero to I equals 8 and columns will be 0 to 8
  index2rc(index) {
    // 0 to 8 in row 0, 9 to 17 in row 1, etc all the way to 80 in row 8
    let row = Math.floor(index / 9);
    let column = index % 9;
    return { row, column };
  }

  rc2index(row, column) {
    return row * 9 + column;
  }

  validate(puzzleString) {
    if (
      !puzzleString ||
      puzzleString.length == 0 ||
      !/^[1-9\.]+$/g.test(puzzleString) ||
      puzzleString.length != 81
    ) {
      return false;
    }
    let arrToCheck = this.arrConverter(puzzleString);
    for (let i = 0; i < arrToCheck.length; i++) {
      if (arrToCheck[i] == ".") {
        continue;
      } else {
        let coords = this.index2rc(i);
        let row = coords.row;
        let column = coords.column;
        if (this.checkNumArr(arrToCheck, row, column, arrToCheck[i])) {
          return true;
        } else {
          return false;
        }
      }
      // check rows
      // check cols
      // check regions
    }
  }

  checkNumPlacement(puzzleString, row, column, value) {
    let arrToCheck = this.arrConverter(puzzleString);
    return this.checkNumArr(arrToCheck, row, column, value);
  }

  checkNumArr(puzzArr, row, column, value) {
    if (!this.checkRowArr(puzzArr, row, column, value)) {
      return false;
    }
    if (!this.checkColArr(puzzArr, row, column, value)) {
      return false;
    }
    if (!this.checkRegionArr(puzzArr, row, column, value)) {
      return false;
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let arrToCheck = this.arrConverter(puzzleString);
    return this.checkRowArr(arrToCheck, row, column, value);
  }

  checkRowArr(puzzArr, row, column, value) {
    for (let c = 0; c < 9; c++) {
      if (c == column) {
        continue;
      }
      if (puzzArr[this.rc2index(row, c)] == value) {
        // console.log(
        //   "row collision between num and" +
        //     value +
        //     "in row" +
        //     row +
        //     "in column" +
        //     c,
        // );
        return false;
      }
    }
    return true;
  }
  checkColPlacement(puzzleString, row, column, value) {
    let arrToCheck = this.arrConverter(puzzleString);
    return this.checkColArr(arrToCheck, row, column, value);
  }

  checkColArr(puzzArr, row, column, value) {
    for (let r = 0; r < 9; r++) {
      if (r == row) {
        continue;
      }
      if (puzzArr[this.rc2index(r, column)] == value) {
        // console.log(
        //   "column collision between num and" +
        //     value +
        //     "in row" +
        //     r +
        //     "in column" +
        //     column,
        // );
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let arrToCheck = this.arrConverter(puzzleString);
    return this.checkRegionArr(arrToCheck, row, column, value);
  }

  checkRegionArr(puzzArr, row, column, value) {
    // row 0 to 2 in first group, row 3 to 5 in second group, row 6 to 8 in third group
    let rowstart = Math.floor(row / 3) * 3;
    // column 0 to 2 in first group, column 3 to 5 in second group, column 6 to 8 in third group
    let colstart = Math.floor(column / 3) * 3;
    for (let r = rowstart; r < rowstart + 3; r++) {
      for (let c = colstart; c < colstart + 3; c++) {
        if (r == row && c == column) {
          continue;
        }
        if (puzzArr[this.rc2index(r, c)] == value) {
          // console.log(
          //   "region collision between num and" +
          //     value +
          //     "in row" +
          //     r +
          //     "in column" +
          //     c,
          // );
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    // validate
    if (!this.validate(puzzleString)) {
      return false;
    } else {
      const puzzArr = this.arrConverter(puzzleString);
      let result = this.arrSolver(puzzArr);
      if (result) {
        return result.join("") ;
      } else {
        return false;
      }
      // if return true solved
      // if not return true cannot be solved
    }
  }

  getOptions(puzzArr) {
    let startingindex = puzzArr.indexOf(".");
    let index = startingindex;
    let moves = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = startingindex; i < puzzArr.length; i++) {
      if (puzzArr[i] != ".") {
        continue;
      } else {
        let currMoves = [];
        for (let m = 1; m < 10; m++) {
          let coords = this.index2rc(i);
          let row = coords.row;
          let column = coords.column;
          // console.log("trying" + m + "in row" + row + "in column" + column);
          if (this.checkNumArr(puzzArr, row, column, m)) {
            currMoves.push(m);
          }
        }
        if (currMoves.length == 0) {
          return false;
        } else if (currMoves.length == 1) {
          index = i;
          moves = currMoves;
          // console.log(index);
          // console.log(moves)
          break;
        } else if (currMoves.length < moves.length) {
          index = i;
          moves = currMoves;
          // console.log(index);
          // console.log(moves)
        }
      }
    }
    return({ index, moves });
  }

  arrSolver(puzzArr) {
    if (puzzArr.indexOf(".") == -1) {
      return puzzArr;
    }
    // reupdate possibilities
    // if any cell is impossible return false
    // if unique fill it in as the only possibility
    // determine best cell
    // choose one to guess (if only one choice fill that in)
    let bestMove = this.getOptions(puzzArr);
    if (!bestMove) {
      return false;
    }
    for (let m = 0; m < bestMove.moves.length; m++) {
      let coords = this.index2rc(bestMove.index);
      let row = coords.row;
      let column = coords.column;
      puzzArr[bestMove.index] = bestMove.moves[m];
      if (this.checkNumArr(puzzArr, row, column, bestMove.moves[m])) {
        let result = this.arrSolver(puzzArr);
        if (result) {
          return result;
        } else {
          puzzArr[bestMove.index] = ".";
          return false;
        }
      }
    }
  }
}

module.exports = SudokuSolver;
