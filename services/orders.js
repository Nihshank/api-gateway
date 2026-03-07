const express = require('express')
const app = express()
const PORT = 3002

app.use(express.json())
app.get('/orders', (req, res) => {
    res.send("On the orders page\n")
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})
