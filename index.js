const express = require('express')
const helmet = require('helmet')
const knex = require('knex')
const server = express();
const db = require('./dbConfig.js')
require('dotenv').config()


server.use(express.json())
server.use(helmet())

const port = process.env.PORT || 8000
server.listen(port, function()  {
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`)
})

server.get('/', (req, res)  =>  {
    db('teachers')
    .then(rows  =>  {
        res.json(rows)
    })
    .catch(err  =>  {
        res.status(500).json({ error: "could not get students"})
    })
})
