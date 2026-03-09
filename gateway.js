
const express = require('express')
const app = express()
const routes = require('./routes')
const fs = require('fs')
const PORT = 3000

// parse JSON request body to JS obj
app.use(express.json())

app.get('/', (req, res) => {
    res.send("On the home page. \n")
})

app.post('/register', (req, res) => {
    const { name, url, port, health, methods } = req.body

    if (!name || !url || !port || !health || !methods){
        return res.status(400).json({ error: 'Missing required fields to register service' })
    }

    const registry = JSON.parse(fs.readFileSync('./routes/registry.json'))
    
    if (!registry.services[name]) {
        registry.services[name] = []
    }

    const alreadyExists = registry.services[name].some(instance => instance.url === url)
    
    if (!alreadyExists) {
        registry.services[name].push({ url, port, health, methods })
    }

    fs.writeFileSync('./routes/registry.json', JSON.stringify(registry, null, 2))
    res.status(201).json({ message: `Service '${name}' registered successfully` })
})

app.post('/unregister', (req, res) => {
    const { name, url } = req.body

    if (!name || !url) {
        return res.status(400).json({ error: 'Missing required fields to unregister service' })
    }

    const registry = JSON.parse(fs.readFileSync('./routes/registry.json'))

    if (!registry.services[name]) {
        return res.status(404).json({ error: `Service '${name}' not found` })
    }

    registry.services[name] = registry.services[name].filter(instance => instance.url !== url)

    if (registry.services[name].length === 0) {
        delete registry.services[name]
    }

    fs.writeFileSync('./routes/registry.json', JSON.stringify(registry, null, 2))
    res.status(200).json({ message: `Service '${name}' unregistered successfully` })
})

app.use('/', routes)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})

