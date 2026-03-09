const express = require('express')
const app = express()
const axios = require('axios')
const PORT = 3001
const service = "products"

app.use(express.json())
app.get('/products', (req, res) => {
    res.send("On the products page\n")
})

app.listen(PORT, async () => {
    console.log(`Listening on http://localhost:${PORT}`)

    await axios.post('http://localhost:3000/register', { 
        name: service,
        url: `http://localhost:${PORT}/${service}`,
        port: PORT,
        health: `http://localhost:${PORT}/health`,
        methods: ["GET"]        
    })

    console.log(`${service} registerd`)

})

process.on('SIGINT', async () => {
    await axios.post('http://localhost:3000/unregister', {
        name: service,
        url: `http://localhost:${PORT}/${service}`,
    })
    console.log(`${service} unregistered`)
    process.exit(0)
})
