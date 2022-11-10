//Load Modules
require('dotenv').config()
const express = require('express')
const app = express()
const handleBars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')


//Config
    //Session & Flash
        app.use(session({
            secret: "Curso de Node",
            resave: true,
            saveUninitialized: true,
        }))
        app.use(flash())
    //Middlewear
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            next()
        })
    // Data Base Connection - Mongoose
        const DB_USER = process.env.DB_USER
        const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)
        mongoose.Promise = global.Promise
        mongoose
            .connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@postappcluster.oolow9t.mongodb.net/?retryWrites=true&w=majority`)
            .then(() => {
                console.log('Connected to MongoDB PostAppCluster')
                app.listen(4000)
            })
            .catch((err) => console.log(err))
    // Template Engine
        app.engine('handlebars', handleBars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // Public Folder
        app.use(express.static(path.join(__dirname, 'public')))


//Routes
const adminRoutes = require('./routes/adminRoute')
const { nextTick } = require('process')
const { runInNewContext } = require('vm')
app.use('/admin', adminRoutes)

// Others