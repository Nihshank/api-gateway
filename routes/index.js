const express = require('express')
const router = express.Router()
const axios = require('axios')
const registry = require('./registry.json')

router.all('/:path', async (req, res) => {
    const path = req.params.path
    const service = registry.services[path]

    if (!service){
        return res.status(404).json({ error: `Service '${path}' not found` })
    }

    console.log(`Route to ${path} api`)
    const response = await axios.get(service.url)
    res.send(response.data)
})

module.exports = router