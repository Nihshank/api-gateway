const express = require('express')
const router = express.Router()
const axios = require('axios')
const registry = require('./registry.json')

router.all('/:path{/*splat}', async (req, res) => {
    const path = req.params.path
    const rest = req.params.splat ? `/${req.params.splat}` : ''
    const service = registry.services[path]

    if (!service){
        return res.status(404).json({ error: `Service '${path}' not found` })
    }

    if (!service.methods.includes(req.method)){
        return res.status(405).json({ error: `Method ${req.method} not allowed` })
    }

    const url = `${service.url}${rest}`

    const response = await axios({
        method: req.method,
        url: url,
        data: req.body,
        headers: {
            'Content-Type': req.headers['content-type'],
            'Authorization': req.headers['authorization']
        },
    })
    res.send(response.data)
})

module.exports = router