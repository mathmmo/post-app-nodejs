const router = require('express').Router()

router.get('/', (req, res) => {
    res.send("Landing ADM Panel page")
})

router.get('/posts', (req, res) => {
    res.send("ADM Posts panel page")
})

router.get('/categories', (req, res) => {
    res.send("ADM Categories pnel page")
})

module.exports = router 