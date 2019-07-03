const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const server = express();
const db = require("./dbConfig.js");
require("dotenv").config();

server.use(express.json());
server.use(helmet());
server.use(cors())

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
        .then(data  =>  {
            data.length ? res.status(200).json({students: data}) : res.status(400).json({ error: "There currently are no students"})
        })
        .catch(err  =>  {
            res.status(500).json({error: err.message})
        })
})

server.get("/students/teacher/:teacher_id", (req, res)  =>  {
    const { teacher_id } = req.params
    db("students")
        .where({ teacher_id })
        .then(data  =>  {
            data.length ? res.status(200).json(data) : res.status(400).json({error: "This teacher either does not exist or has 0 students"})
        })
        .catch(err  =>  {
            res.status(500).json({error: err.message})
        })
})

server.get("/students/:id", (req, res)  =>  {
    const { id } = req.params
    db("students")
        .where({ id })
        .first()
        .then(data  =>  {
            data ? res.status(200).json(data) : res.status(400).json({error: "Student not found"})
        })
        .catch(err  =>  {
            res.status(500).json({error: err.message})
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
            res.status(400).json({error: err.message})
        })
})

server.delete("/students/:id",  (req, res)  =>  {
    const { id } = req.params
    db("students")
        .where({ id })
        .del()
        .then(data  =>  {
            data ? res.status(200).json({data}) : res.status(400).json({error: "Student not found"})
        })
        .catch(err =>   {
            res.status(500).json({error: err.message})
        })
})

server.post("/fieldTrips",  (req, res)  =>  {
    const { fieldTrip } = req.body
    db("fieldTrips")
        .insert(fieldTrip)
        .then(id    =>  {
            db("students")
                .where({teacher_id: fieldTrip.teacher_id})
                .then(data  =>  {
                    data.forEach(student    =>  {
                         db("studentFieldTripJoin")
                            .insert({status: 0, student_id: student.id, fieldTrip_id: id[0]})
                            .catch(err  =>  {
                                res.status(500).json({error: err.message})
                            })
                })
                db("studentFieldTripJoin")
                    .where({fieldTrip_id: id[0]})
                    .then(data  =>  {
                        res.status(200).json(data)
                    })
                    .catch(err  =>  {
                        res.status(500).json({error: err.message})
                    })
        })
    })
})
