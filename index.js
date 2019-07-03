const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const server = express();
const db = require("./dbConfig.js");
const cors = require("cors")
require("dotenv").config();
const authRouter = require("./auth/register")
const accountSid = process.env.TWILIOSECRET;
const authToken = process.env.TWILIOTOKEN;
const client = require('twilio')(accountSid, authToken);
const bodyParser = require('body-parser')

server.use(express.json());
server.use(helmet());
server.use(cors())
server.use(bodyParser.urlencoded({ extended: false }))
const port = process.env.PORT || 8000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

server.use("/auth", authRouter)

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
    // console.log("here")
    db("fieldTrips")
        .returning("id")
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
                    .join("fieldTrips", "studentFieldTripJoin.fieldTrip_id", "fieldTrips.id")
                    .join("students", "studentFieldTripJoin.student_id", "students.id")
                    .join("guardians", "students.guardian_id", "guardians.id")
                    .select("guardians.contact", {"guardian_id": "guardians.id"}, {"guardianName": "guardians.name"},{"studentName":"students.name"},{"student_id": "students.id"}, {"tripName":"fieldTrips.name"}, "fieldTrips.date", {"fieldTrip_id": "fieldTrips.id"})
                    .where({fieldTrip_id: id[0]})
                    .then(data  =>  {
                        data.forEach(entry  =>  {
                            client.messages
                                .create({
                                    body: `Hello ${entry.guardianName}, this is an automated message about a fieldtrip coming up for your student, ${entry.studentName}. We are requestiong permission for them to attend our ${entry.tripName} on ${entry.date}. Please reply 'yes' or 'no'`,
                                    from: process.env.FROMNUMBER,
                                    to: entry.contact
                                })
                                .then(message => console.log(message.sid));
                                db("smsOutgoing")
                                    .insert({fieldTrip_id: entry.fieldTrip_id, student_id: entry.student_id, guardian_id: entry.guardian_id})
                                    .then(data  =>  {
                                        console.log(data)
                                    })
                                    .catch(err  =>  {
                                        res.status(500).json({error: err.message})
                                    })
                        })
                        res.status(200).json(data)
                    })
                    .catch(err  =>  {
                        res.status(500).json({error: err.message})
                    })
        })
    })
})

server.put("/fieldTrips/:id",   (req, res)  =>  {
    const { fieldTrip } = req.body
    const { id } = req.params
    db("fieldTrips")
        .where({ id })
        .update(fieldTrip)
        .then(data  =>  {
            data !== 0 ?
            res.status(200).json({data}) :
            res.status(400).json({ error: "Could not find the requested plan"})
        })
        .catch(err  =>  {
            res.status(500).json({error: err.message})
        })
})

server.get("/fieldTrips/:id",   (req, res)  =>  {
    const { id } = req.params
    db("fieldTrips")
        .where({ id })
        .then(data  =>  {
            data.length ?
            res.status(200).json({data}) :
            res.status(400).json({ error: "Fieldtrip not found"})
        })
        .catch(err  =>  {
            res.status(500).json({error: err.message})
        })
})

server.get("/fieldTrips/teachers/:teacher_id",   (req, res)  =>  {
    const { teacher_id } = req.params
    db("fieldtrips")
        .where({ teacher_id })
        .then(data  =>  {
            data.length ?
            res.status(200).json(data) :
            res.status(400).json({ error: "Teacher has no fieldtrips"})
        })
        .catch(err  =>  {
            res.status(500).json({ error: err.message })
        })
})

server.delete("/fieldTrips/:id",    (req, res)  =>  {
    const { id } = req.params
    db("fieldtrips")
        .where({ id })
        .del()
        .then(data  =>  {
            console.log(data)
            data !== 0 ?
            res.status(200).json(data) :
            res.status(400).json({ error: "No fieldtrip with this id"})
        })
        .catch(err  =>  {
            res.status(500).json({ error: err.message })
        })
})

server.post("/sms", (req, res)  =>  {
    const contact = req.body.From.slice(2)
    console.log(contact)
    console.log(req.body)
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    if(dd<10)
    {
        dd='0'+dd;
    }
    if(mm<10)
    {
        mm='0'+mm;
    }

    today = yyyy+'-'+mm+'-'+dd;

    db("guardians")
        .where({contact})
        .first()
        .then(data  =>  {
            console.log("guardian id", data.id)
            db("smsOutgoing")
                .where({guardian_id: data.id})
                .first()
                .then(data  =>  {
                    console.log(data)
                    db("studentFieldTripJoin")
                    .where({fieldTrip_id: data.fieldTrip_id, student_id: data.student_id})
                    .update({ status: 1})
                    .then(data  =>  {
                        console.log(data)
                    })
                })
        })

})

server.get("/students/trip/:trip_id",   (req, res)  =>  {
    const { trip_id } = req.params
    db("studentFieldTripJoin")
        .join("students", "studentFieldTripJoin.student_id", "students.id")
        .where({fieldTrip_id: trip_id})
        .then(data  =>  {
            console.log(data)
        })
})
