const router = require('express').Router()
const Category = require('../models/Category')

router.get('/', (req, res) => {
    res.render('admin/index.handlebars')
})

router.get('/categories', (req, res) => {
    res.render('admin/categories')
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

module.exports = router 