const express = require('express')
const app = express()
const PORT = 3001

app.use(express.json())
app.get('/products', (req, res) => {
    res.send("On the products page\n")
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})