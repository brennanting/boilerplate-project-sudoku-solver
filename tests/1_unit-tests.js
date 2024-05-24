const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  // Logic handles a valid puzzle string of 81 characters
  test("Testing valid puzzle string input", () => {
    assert.deepEqual(
      solver.validate(
        "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
      ),
      { valid: true },
    );
  });

  // Logic handles a puzzle string with invalid characters (not 1-9 or .)
  test("Testing invalid characters in puzzle string input", () => {
    assert.deepEqual(
      solver.validate(
        "82ab4..6...16..89...98315.749.157.....!.......53..4...96.415..81..7632..3...28.51",
      ),
      { valid: false, error: "Invalid characters in puzzle" },
    );
  });

  // Logic handles a puzzle string that is not 81 characters in length
  test("Testing puzzle string with invalid length", () => {
    assert.deepEqual(
      solver.validate(
        "82.4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
      ),
      { valid: false, error: "Expected puzzle to be 81 characters long" },
    );
  });

  // Logic handles a valid row placement
  test("Testing valid row placement", () => {
    assert.equal(
      solver.checkRowPlacement(
        ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",
        6,
        1,
        6,
      ),
      true,
    );
  });

  // Logic handles an invalid row placement
  test("Testing invalid row placement", () => {
    assert.equal(
      solver.checkRowPlacement(
        ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",
        6,
        1,
        1,
      ),
      false,
    );
  });

  // Logic handles a valid column placement
  test("Testing valid column placement", () => {
    assert.equal(
      solver.checkColPlacement(
        ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",
        6,
        0,
        3,
      ),
      true,
    );
  });

  // Logic handles an invalid column placement
  test("Testing invalid column placement", () => {
    assert.equal(
      solver.checkColPlacement(
        ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",
        6,
        1,
        5,
      ),
      false,
    );
  });

  // Logic handles a valid region (3x3 grid) placement
  test("Testing valid region placement", () => {
    assert.equal(
      solver.checkRegionPlacement(
        ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",
        6,
        0,
        1,
      ),
      true,
    );
  });

  // Logic handles an invalid region (3x3 grid) placement
  test("Testing invalid region placement", () => {
    assert.equal(
      solver.checkRegionPlacement(
        ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",
        6,
        0,
        9,
      ),
      false,
    );
  });

  // Valid puzzle strings pass the solver
  test("Testing solving valid puzzle string", () => {
    assert.isString(
      solver.solve(
        "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
      ),
    );
    assert.isOk(
      solver.solve(
        "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
      ),
    );
  });

  // Invalid puzzle strings fail the solver
  test("Testing solving invalid puzzle string", () => {
    assert.isNotOk(
      solver.solve(
        "2..9............6......1...5.26..4.7.....41......98.23.....3.8...5.1......7......",
      ),
    );
  });

  // Solver returns the expected solution for an incomplete puzzle
  test("Testing solving incomplete puzzle string", () => {
    assert.isString(
      solver.solve(
        "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
      ),
    );
    assert.equal(
      solver.solve(
        "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3",
      ),
      "568913724342687519197254386685479231219538467734162895926345178473891652851726943",
    );
  });
});
