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
const Post = require('./models/Post')
const Category = require('./models/Category')


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
const { post } = require('./routes/adminRoute')
app.use('/admin', adminRoutes)

// Others
app.get('/', (req, res) => {
    Post.find().populate({
        path: 'category',
        strictPopulate: false
    }).sort({date: 'desc'}).lean().then((posts) => {
        posts.forEach((post) => {
            post.date = post.date.toDateString()
            let altContent = ''
            for (let i = 0; i <= 70; i++) {
                altContent += post.content.split(" ")[i] + " "
            }
            altContent += '...'
            post.content = altContent
        })
        const importantPost = posts.find((post) => post.category.slug === 'top1')
        posts = posts.filter((post) => post !== importantPost)

        const newsPost = posts.find((post) => post.category.slug === 'top2')
        posts = posts.filter((post) => post !== newsPost)

        const newestPost = posts.shift()
        
        Category.find().lean().then((categories) => {
            res.render('index', {
                importantPost,
                newsPost,
                newestPost,
                posts,
                categories,
            })
        }).catch((err) => {
            console.log(`Home page get Posts failed: ${err}`)
            req.flash('error_msg', 'Comunication with database failed.')
            res.send('<h1>We had a problem.</h1>')
        })
    }).catch((err) => {
        console.log(`Home page get Posts failed: ${err}`)
        req.flash('error_msg', 'Comunication with database failed.')
        res.send('<h1>We had a problem.</h1>')
    })
})

app.get('/post/:slug', (req, res) => {
    const { slug } = req.params
    Post.findOne({slug: slug}).lean().then((post) => {
        res.render('./post/index', {post})
    }).catch((err) => {
        console.log(`Post page database error: ${err}`)
        req.flash('error_msg', 'Comunication with database failed.')
        res.redirect('/')
    })
})

app.get('/category/:slug', (req, res) => {
    const { slug } = req.params
    Category.findOne({slug: slug}).lean().then((category) => {
        res.render('./category/index', {category})
    }).catch((err) => {
        console.log(`Category page database error: ${err}`)
        req.flash('error_msg', 'Comunication with database failed.')
        res.redirect('/')
    })
})