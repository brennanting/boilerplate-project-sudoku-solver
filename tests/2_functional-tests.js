const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  // Solve a puzzle with valid puzzle string: POST request to /api/solve
  test("Test POST /api/solve with valid puzzle string", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({
        puzzle:
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
          solution:
            "135762984946381257728459613694517832812936745357824196473298561581673429269145378",
        });
        done();
      });
  });

  // Solve a puzzle with missing puzzle string: POST request to /api/solve
  test("Test POST /api/solve with missing puzzle string", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Required field missing" });
        done();
      });
  });

  // Solve a puzzle with invalid characters: POST request to /api/solve
  test("Test POST /api/solve with invalid characters", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({
        puzzle:
          "1.5..2.84ab63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
        done();
      });
  });

  // Solve a puzzle with incorrect length: POST request to /api/solve
  test("Test POST /api/solve with invalid length", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({
        puzzle:
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
          error: "Expected puzzle to be 81 characters long",
        });
        done();
      });
  });

  // Solve a puzzle that cannot be solved: POST request to /api/solve
  test("Test POST /api/solve with puzzle that cannot be solved", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({
        puzzle:
          "9..1....4.14.3.8....3....9....7.8..18....3..........3..21....7...9.4.5..5...16..3",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Puzzle cannot be solved" });
        done();
      });
  });

  // Check a puzzle placement with all fields: POST request to /api/check
  test("Test POST /api/check with all fields", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "..2.3...8.....8....31.2.....6..5.27..1.....5.2.4.6..31....8.6.5.......13..531.4..",
        coordinate: "B8",
        value: 2,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: true });
        done();
      });
  });

  // Check a puzzle placement with single placement conflict: POST request to /api/check
  test("Test POST /api/check with single conflict", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "..2.3...8.....8....31.2.....6..5.27..1.....5.2.4.6..31....8.6.5.......13..531.4..",
        coordinate: "D1",
        value: 5,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: false, conflict: ["row"] });
        done();
      });
  });

  // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
  test("Test POST /api/check with multiple conflicts", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "..2.3...8.....8....31.2.....6..5.27..1.....5.2.4.6..31....8.6.5.......13..531.4..",
        coordinate: "E5",
        value: 6,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
          valid: false,
          conflict: ["column", "region"],
        });
        done();
      });
  });

  // Check a puzzle placement with all placement conflicts: POST request to /api/check
  test("Test POST /api/check with all conflicts", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "..2.3...8.....8....31.2.....6..5.27..1.....5.2.4.6..31....8.6.5.......13..531.4..",
        coordinate: "I8",
        value: 1,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
          valid: false,
          conflict: ["row", "column", "region"],
        });
        done();
      });
  });

  // Check a puzzle placement with missing required fields: POST request to /api/check
  test("Test POST /api/check with missing required fields", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Required field(s) missing" });
        done();
      });
  });

  // Check a puzzle placement with invalid characters: POST request to /api/check
  test("Test POST /api/check with invalid characters", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "..2.3...8test8....31.2.....6..5.27..1.....5.2.4.6..31....8.6.5.......13..531.4..",
        coordinate: "I8",
        value: 1,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
        done();
      });
  });

  // Check a puzzle placement with incorrect length: POST request to /api/check
  test("Test POST /api/check with incorrect length", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "1..2.3...8.....8....31.2.....6..5.27..1.....5.2.4.6..31....8.6.5.......13..531.4..",
        coordinate: "I8",
        value: 1,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
          error: "Expected puzzle to be 81 characters long",
        });
        done();
      });
  });

  // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
  test("Test POST /api/check with invalid coordinate", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "..2.3...8.....8....31.2.....6..5.27..1.....5.2.4.6..31....8.6.5.......13..531.4..",
        coordinate: "8B",
        value: 1,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Invalid coordinate" });
        done();
      });
  });

  // Check a puzzle placement with invalid placement value: POST request to /api/check
  test("Test POST /api/check with invalid value", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle:
          "..2.3...8.....8....31.2.....6..5.27..1.....5.2.4.6..31....8.6.5.......13..531.4..",
        coordinate: "I8",
        value: 39,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Invalid value" });
        done();
      });
  });
});
