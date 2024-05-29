import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './database/connectDB.js'
import User from './models/userModel.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5060
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    console.log('Verbindung mit MongoDB hat geklappt')
    app.listen(port, () => {
      console.log('Server läuft auf:', port)
    })
  } catch (error) {
    console.log(error)
  }
}

// middleware
app.use(cors())
app.use(express.json())

// routes
app.post('/register', async (req, res) => {
  const { email, password, biography, username } = req.body

  if (!email || !password || !biography || !username) {
    return res.status(400).json({ error: 'Invalid registration' })
  }

  try {
    const user = await User.create({ biography, email, password, username })
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' })
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Invalid login' })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ error: 'Invalid login' })
  }

  res.json({ status: 'success ', user })
})

app.get('/users', async (req, res) => res.json(await User.find()))

startServer()
