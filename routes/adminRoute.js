const router = require('express').Router()
const Category = require('../models/Category')
const Post = require('../models/Post')

router.get('/', (req, res) => {
    const ipAdress = req.socket.remoteAddress
    console.log(ipAdress)
    res.render('admin/index.handlebars', {ip: ipAdress})
})


//Categories Routes
    router.get('/categories', async (req, res) => {
        await Category.find().sort({date: 'desc'}).lean().then((categories) => {
            res.render('admin/categories', {categories: categories})
        }).catch((error) => {
            req.flash('error_msg', 'That was an error in your query. Contact support.')
            res.redirect('/admin')
        })
    })

    router.get('/categories/add', (req, res) => {
        res.render('admin/addcategories')
    })

    router.post('/categories/new', async (req, res) => {
        const { name, slug } = req.body
        const errors = [];
        if(!name || typeof name == undefined || name == null){
            errors.push({
                status: 422,
                message: 'Mandatory "Name" parameter is empty or is not valid.'
            })
        }
        if(name.length < 2){
            errors.push({
                status: 422,
                message: 'Mandatory "Name" parameter is to short. Must be at least 2 characters.'
            })
        }
        if(!slug || typeof slug == undefined || slug == null){
            errors.push({
                status: 422,
                message: 'Mandatory "slug" parameter is empty or is not valid.'
            })
        }

        if(errors.length > 0){
            res.render('admin/addcategories', {errors: errors})
        } else {
            const category = {
                name,
                slug,
            }
            await Category.create(category).then(() => {
                req.flash('success_msg', `Category ${name} created.`)
                res.redirect('/admin/categories')
                // res.status(201).json({message: `Category: ${name} created.`})
            }).catch((error) => {
                req.flash('error_msg', `That is an error in saving the category ${name} in the database.`)
                errors.push({
                    status: error.status,
                    message: 'Mandatory "slug" parameter is empty or is not valid.'
                })
                res.render('admin/addcategories', {errors: errors})
            })
        }
    })

    router.post('/categories/edit', async(req, res) => {
        const {id, name, slug} = req.body
        const errors = [];
        if(!name || typeof name == undefined || name == null){
            errors.push({
                status: 422,
                message: 'Mandatory "Name" parameter is empty or is not valid.'
            })
        }
        if(name.length < 2){
            errors.push({
                status: 422,
                message: 'Mandatory "Name" parameter is to short. Must be at least 2 characters.'
            })
        }
        if(!slug || typeof slug == undefined || slug == null){
            errors.push({
                status: 422,
                message: 'Mandatory "slug" parameter is empty or is not valid.'
            })
        }

        if(errors.length > 0){
            res.render('admin/editcategories', {errors: errors})
        } else {
            const category = {
                name,
                slug,
            }
            await Category.updateOne({_id: id}, category).then(() => {
                req.flash('success_msg', `Category ${name} updated.`)
                res.redirect('/admin/categories')
            }).catch((error) => {
                req.flash('error_msg', `Failed to update category: ${name}.`)
                res.redirect('/admin/categories')
            })
        }
    })

    router.get('/categories/edit/:id', async(req, res) => {
        const { id } = req.params
        await Category.findOne({_id: id}).lean().then((category) => {
            console.log(category)
            res.render('admin/editcategories', {category: category})
        }).catch((error) => {
            req.flash('error_msg', `Failed to find category.`)
            res.redirect('/admin/categories')
        })
    })

    router.post('/categories/delete', async(req, res) => {
        const { id } = req.body
        await Category.deleteOne({_id: id}).then((category) => {
            req.flash('success_msg', 'Category deleted.')
            res.redirect('/admin/categories')
        }).catch((error) => {
            req.flash('error_msg', `Failed to delete category.`)
            res.redirect('/admin/categories')
        })
    })

//Posts Routes
    router.get('/posts', (req, res) => {
        res.render('admin/posts')
    })

    router.get('/posts/add', (req, res) => {
        Category.find().lean().then((categories) => {
            res.render('admin/addpost', {categories: categories})
        }).catch((error) => {
            req.flash('error_msg', `Failed to retrive categories.`)
            res.redirect('/admin/posts')
        })
    })

module.exports = router 