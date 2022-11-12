const mongoose = require('mongoose')

const Post = mongoose.model('Posts', {
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
})

module.exports = Post