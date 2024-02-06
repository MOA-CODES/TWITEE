require('dotenv').config()
require('express-async-errors')

const conn = require('./db/connection')
const Auth_R = require('./routes/Auth_R')
const Twit_R = require('./routes/Twit_R')

const auth = require('./middleware/authentication')
const notfound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')

const express = require('express')
const app = express()

app.use(express.json())

const port = process.env.PORT || 3200

app.get('/', (req, res)=>{
    res.send(`TWITEE`)
})

app.use('/api/v1/auth', Auth_R)
app.use('/api/v1/twit', auth, Twit_R)

app.use(notfound)
app.use(errorHandler)

conn()

app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})
