require('dotenv').config()
const { Pool } = require('pg')

const config = {
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  allowExitOnIdle: true
}

const pool = new Pool(config)

const readPosts = async () => {
  try{
    const result = await pool.query('SELECT * FROM posts;')
    return result.rows
  }
  catch(error) {
    return { code : 500, error, message: "Error al leer post"}
  }
}

const createPosts = async ({ id, titulo, url, descripcion }) => {
  try {
    const query = 'INSERT INTO posts (id, titulo, img, descripcion) VALUES ($1, $2, $3, $4) RETURNING *;';
    const values = [id, titulo, url, descripcion]
    const result = await pool.query(query, values)
    return result.rows
  }
  catch(error) {
    return { code : 500, error, message: "Error al crear post"}
  }
}

const updatePosts = async (id) => {
  try {
    const query = 'UPDATE posts SET likes = COALESCE(likes, 0) + 1 WHERE id = $1 RETURNING *;'
    const values = [id]
    const result = await pool.query(query, values)
    return result.rows
  }
  catch(error) {
    return { code : 500, error, message: "Error al modifcar post"}
  }
}

const deletePosts = async (id) => {
  try {
    const query = 'DELETE FROM posts WHERE id = $1 RETURNING *;'
    const values = [id]
    const { rowCount } = await pool.query(query, values)
    if (rowCount > 0) {
      return { code: 200, status: 'Post eliminado correctamente!'}
    }
    return { code:404, status: 'id: ${id} not found'}
  }
  catch(error) {
    return { code : 500, error, message: "Error al eliminar post"}
  }
}

module.exports = { readPosts, createPosts, updatePosts, deletePosts }
