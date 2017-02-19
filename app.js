const express = require('express')
const session = require('express-session')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const config = require('./config/db.json')

// DB Connect 
mongoose.connect(config.database)

//On DB Connect

mongoose.connection.on("connected", () => {
    console.log("Connected Db")
})

//On DB error

mongoose.connection.on("error", (err) => {
    console.log("error Db" + err)
})
const app = express()

const users = require('./routes/users')


// Port
const port = 3000

//CORS MIddelware
app.use(cors())

// Static Files
app.use(express.static(path.join(__dirname, 'public')))

// BODY PArser
app.use(bodyParser.json())

// Auth Passport Middelware
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

app.use('/users', users)
// app.use('/', (req, res) => {
//     res.send("Ali wow")
// })
app.listen(port, () => {
    console.log(`listening to port ${port}`)
})