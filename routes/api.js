'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let coords = req.body.coordinate;
      let value = Number(req.body.value);
      let str = req.body.puzzle;
      if (!str || str.length == 0 || !coords || !value) {
        return res.json({ error: 'Required field(s) missing' })
      } 
      let regex = /^[1-9\.]+$/g;
      if (!regex.test(str)) {
        return res.json({ error: 'Invalid characters in puzzle' })
      }
      if (str.length != 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }
      if (value < 1 || value > 9) {
        return res.json({error: 'Invalid value'})
      }
      if (coords.length != 2) {
        return res.json({error: 'Invalid coordinate'})
      }
      let row = coords[0].toUpperCase();
      // rows will be A equals zero to I equals 8 and columns will be 0 to 8
      row = row.charCodeAt(0) - 65;
      let column = coords[1] - 1;
      if (row < 0 || row > 8 || column < 0 || column > 8) {
        return res.json({error: 'Invalid coordinate'})
      }
      let conflict = [];
      let valid = true;
      if (!solver.checkRowPlacement(str, row, column, value)) {
        conflict.push("row");
        valid = false;
      }
      if (!solver.checkColPlacement(str, row, column, value)) {
        conflict.push("column");
        valid = false;
      }
      if (!solver.checkRegionPlacement(str, row, column, value)) {
        conflict.push("region");
        valid = false;
      }
      if (valid) {
        return res.json({valid})
      } else {
        return res.json({valid, conflict})
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let str = req.body.puzzle;
      if (!str || str.length == 0) {
        return res.json({ error: 'Required field missing' })
      } 
      let regex = /^[1-9\.]+$/g;
      if (!regex.test(str)) {
        return res.json({ error: 'Invalid characters in puzzle' })
      }
      if (str.length != 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }
      let solution = solver.solve(str);
      if (!solution) {
        return res.json({ error: 'Puzzle cannot be solved' })
      } else {
        return res.json({ solution: solution })
      }
      
    })
};
