require('dotenv').config()
require('express-async-errors')

//docs
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')

const path = require('path')
const swaggerPath = path.resolve(__dirname, './swagger.yaml')
const swaggerDoc = YAML.load(swaggerPath)
const swaggerCss = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css"

const conn = require('./db/connection')
const Auth_R = require('./routes/Auth_R')
const Twit_R = require('./routes/Twit_R')
const Comment_R = require('./routes/Comment_R')

const auth = require('./middleware/authentication')
const notfound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')

const express = require('express')
const app = express()

app.use(express.json())

const port = process.env.PORT || 3200

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc,{customCssUrl:swaggerCss}))
app.get('/', (req, res)=>{
    res.send('<center>\
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"\
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"crossorigin="anonymous" />\
    <h1>TWITEE API</h1><p>This is a Backend API twitter clone, where you can regsiter, login, logout,make Twits and like twits, and also comment and like comments.</p>\
    <p>There is no front-end currently for the app, its a purely a backend app.</p>\
    <p></p>\
    <p>At the end of this websites URL attach:</p>\
    <li>/api/v1/auth for auth routes.</li>\
    <li>/api/v1/twit for posts routes.</li>\
    <li>/api/v1/comment for friends routes.</li>\
    <p></p>\
    <p><i><u><a href="/api-docs">for more detailed documentation click here</a></i></u></p>\
    <p><b>*NOTE: when you make use of the api docs link above, anytime you receive a token in the response body, click on </b></p>\
    <p><b>authorize at the top-right corner and paste it in the value field, also keep in mind the user and posts you create are stored.</b></p>\
    <p></p>\
    <p></p>\
    <h3><p><b>Made by <i><a href="https://github.com/MOA-CODES">MOA-CODES</a></i></b></P></h3>\
    </center>')
})

app.use('/api/v1/auth', Auth_R)
app.use('/api/v1/twit', auth, Twit_R)
app.use('/api/v1/comment',auth,Comment_R)

app.use(notfound)
app.use(errorHandler)

conn()

app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})
