const express = require('express')
const router = express.Router()
const axios = require('axios')

router.all('/:apiName', async (req, res) => {
    const api = req.params.apiName

    console.log(`Route to ${req.params.apiName} api`)
    const response = await axios.get(`http://localhost:3001/${api}`)
    res.send(response.data)
})

module.exports = router