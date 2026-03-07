const express = require('express')
const app = express()
const PORT = 3002

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

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})