const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const server = express();
const db = require("./dbConfig.js");
require("dotenv").config();

server.use(express.json());
server.use(helmet());

const port = process.env.PORT || 8000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

server.get("/", (req, res) => {
  db("teachers")
    .then(rows => {
      res.json(rows);
    })
    .catch(err => {
      res.status(500).json({ error: "could not get students" });
    });
});
server.post("/students", (req, res) => {
  const { guardian, student } = req.body;
  const guardianContact = guardian.contact;
  db("guardians")
    .where({ contact: guardianContact })
    .first()
    .then(guardianObj => {
      console.log("Log 1", guardianObj);
      console.log("Student", student, "Guardian", guardian);
      guardianObj
        ? db("students")
            .insert({ ...student, guardian_id: guardianObj.id })
            .then(id => {
              console.log("Hit");
              res.status(201).json(id);
            })
            .catch(err => {
              console.log("Hit2");
              res.status(500).json({ message: err.message });
            })
        : db("guardians")
            .returning("id")
            .insert(guardian)
            .then(id => {
              db("students")
                .returning("id")
                .insert({ ...student, guardian_id: id[0] })
                .then(id => {
                  db("students")
                    .where({ id: id[0] })
                    .first();
                });
              console.log("Second Log", { ...student, guardian_id: id[0] });
              res.status(201).json({ message: ` guardian was added ${id}` });
            })
            .catch(err => console.log(err.message));
    })
    .catch(err => console.log(err.message));
});

server.get("/students", (req, res)  =>  {
    db("students")
        .then(rows  =>  {
            res.status(200).json(rows)
        })
})

server.put("/students/:id", (req, res)  =>  {
    const { student } = req.body
    const { id } = req.params
    console.log("here 1st")
    db("students")
        .where({id})
        .update(student)
        .then(data  =>  {
            console.log("here", data)
            res.status(200).json(data)
        })
        .catch(err  =>  {
            res.status(400).json(err)
        })
})
