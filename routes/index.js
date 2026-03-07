const express = require('express')
const router = express.Router()


router.all('/:apiName', (req, res) => {
    console.log(`Route to ${req.params.apiName} api`)
    res.send(req.params.apiName + '\n')
})

module.exports = router