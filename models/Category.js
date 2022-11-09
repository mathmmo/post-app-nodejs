const mongoose = require('mongoose')

const Category = mongoose.model('Category', {
    name: String,
    slug: String,
    date: {
        type: Date,
        default: Date.now()
    },
})

module.exports = Category