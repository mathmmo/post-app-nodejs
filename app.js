//Load Modules
require('dotenv').config()
const express = require('express')
const app = express()
const handleBars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

//Config
    //Data Base Connection - Mongoose
    const DB_USER = process.env.DB_USER
    const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD)
    mongoose.Promise = global.Promise
    mongoose
        .connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@postappcluster.vpedgrv.mongodb.net/?retryWrites=true&w=majority`)
        .then(() => {
            console.log('Connected to MongoDB PostAppCluster')
            app.listen(3000)
        })
        .catch((err) => console.log(err))
    //Template Engine
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

//Routes

// Others