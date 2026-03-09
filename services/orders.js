const express = require('express')
const app = express()
const axios = require('axios')
const PORT = 3005
const service = "orders"

app.use(express.json())

app.get('/orders', (req, res) => {
    res.json({ message: "Orders list" })
})

app.post('/orders', (req, res) => {
    res.status(201).json({ message: "Order created", data: req.body })
})

app.get('/orders/:id', (req, res) => {
    res.json({ message: `Order ${req.params.id}` })
})

app.listen(PORT, async () => {
    console.log(`Listening on http://localhost:${PORT}`)

    // register service on spin up 
    await axios.post('http://localhost:3000/register', {
        name: service,
        url: `http://localhost:${PORT}/${service}`,
        port: PORT,
        health: `http://localhost:${PORT}/health`,
        methods: ['GET', 'POST']
    })

    console.log(`${service} registered`)
})

// unregister service on shut down
process.on('SIGINT', async () => {
    await axios.post('http://localhost:3000/unregister', {
        name: service,
        url: `http://localhost:${PORT}/${service}`
    })
    console.log(`${service} unregistered`)
    process.exit(0)
})