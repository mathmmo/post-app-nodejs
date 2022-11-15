const router = require('express').Router()
const Category = require('../models/Category')
const Post = require('../models/Post')
const { isAdmin } = require('../helpers/roleAuth')

router.get('/', isAdmin, (req, res) => {
    res.render('admin/index.handlebars')
})


//Categories Routes
    router.get('/categories', isAdmin, async (req, res) => {
        await Category.find().sort({date: 'desc'}).lean().then((categories) => {
            categories.forEach((category) => {
                category.date = category.date.toDateString()
            })
            res.render('admin/categories', {categories: categories})
        }).catch((error) => {
            req.flash('error_msg', 'That was an error in your query. Contact support.')
            res.redirect('/admin')
        })
    })

    router.get('/categories/add', isAdmin, (req, res) => {
        res.render('admin/addcategories')
    })

    router.post('/categories/new', isAdmin, async (req, res) => {
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

    router.post('/categories/edit', isAdmin, async(req, res) => {
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

    router.get('/categories/edit/:id', isAdmin, async(req, res) => {
        const { id } = req.params
        await Category.findOne({_id: id}).lean().then((category) => {
            res.render('admin/editcategories', {category: category})
        }).catch((error) => {
            req.flash('error_msg', `Failed to find category.`)
            res.redirect('/admin/categories')
        })
    })

    router.post('/categories/delete', isAdmin, async(req, res) => {
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
    router.get('/posts', isAdmin, async (req, res) => {
        await Post.find()
        .populate({
            path: 'category',
            strictPopulate: false
        }).sort({date: 'desc'}).lean().then((posts) => {
            posts.forEach((post) => {
                post.date = post.date.toDateString()
            })
            res.render('admin/posts', {posts: posts})
        }).catch((error) => {
            console.log(error)
            req.flash('error_msg', 'That was an error in your query. Contact support.')
            res.redirect('/admin')
        })
    })

    router.get('/posts/add', isAdmin, (req, res) => {
        Category.find().lean().then((categories) => {
            res.render('admin/addpost', {categories: categories})
        }).catch((error) => {
            console.log(error)
            req.flash('error_msg', `Failed to retrive categories.`)
            res.redirect('/admin/posts')
        })
    })

    router.post('/posts/new', isAdmin, async (req, res) => {
        const { title, slug, description, content, category } = req.body
        const errors = [];
        if(title.length < 2 || typeof title == undefined || title == null){
            errors.push({
                status: 422,
                message: 'Mandatory "title" parameter is empty or is not valid.'
            })
        }
        if(slug.length < 2 || typeof slug == undefined || slug == null){
            errors.push({
                status: 422,
                message: 'Mandatory "slug" parameter is empty or is not valid.'
            })
        }
        if(description.length < 2 || typeof description == undefined || description == null){
            errors.push({
                status: 422,
                message: 'Mandatory "description" parameter is empty or is not valid.'
            })
        }
        if(content.length < 2 || typeof content == undefined || content == null){
            errors.push({
                status: 422,
                message: 'Mandatory "content" parameter is empty or is not valid.'
            })
        }
        if(!category || typeof category == undefined || category == null || category == '0'){
            errors.push({
                status: 422,
                message: 'Mandatory "category" parameter is empty or is not valid. Check if that are categories for use.'
            })
        }

        if(errors.length > 0){
            res.render('admin/addpost', {errors: errors})
        } else {
            const post = {
                title,
                slug,
                description,
                content,
                category
            }
            await Post.create(post).then(() => {
                req.flash('success_msg', `Post ${title} created.`)
                res.redirect('/admin/posts')
            }).catch((error) => {
                req.flash('error_msg', `That is an error in saving the post ${title} in the database.`)
                errors.push({
                    status: error.status,
                    message: 'Post creation failed on database. Seek support assistance.'
                })
                res.render('admin/addpost', {errors: errors})
            })
        }
    })

    router.post('/posts/delete', isAdmin, async(req, res) => {
        const { id } = req.body
        await Post.deleteOne({_id: id}).then((category) => {
            req.flash('success_msg', 'Post deleted.')
            res.redirect('/admin/posts')
        }).catch((error) => {
            req.flash('error_msg', `Failed to delete Post.`)
            res.redirect('/admin/posts')
        })
    })

module.exports = router