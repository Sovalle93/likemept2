require('dotenv').config()
const express = require ('express')
const cors = require ('cors')
const { createPosts, readPosts, updatePosts, deletePosts } = require ("../utils/pg")

const PORT = process.env.PORT ?? 3000
console.log(process.env.PORT)
const app = express()

app.use(cors())
app.use(express.json())

app.get('/posts', async (_, res) => {
    try {
        const result = await readPosts()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
})

app.post('/posts', async (req, res) => {
    try {
        const result = await createPosts(req.body)
        res.status(result?.code ? 500 : 201).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
})

app.put('/posts/like/:id', async (req, res) => {
    try {
        const { id } = req.params
        const result = await updatePosts(id)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.delete('/posts/:id', async (req, res) => {
    try{
        const { id } = req.params
        await deletePosts(id)
        res.status(204).json('Posts eliminado con exito!')
    } catch(error) {
        res.status(500).json(error)
    }
})

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
})

app.all("*", (_, res) => res.status(404).json({ code : 201, message:  "Resource not found"}))


module.exports = app
