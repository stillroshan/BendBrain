import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import connectDB from './config/db.js'

// Initialize express
const app = express()

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

// Middleware
app.use(express.json()) // for parsing application/json
app.use(cors()) // for cross-origin requests
app.use(cookieParser()) // for parsing cookies
app.use(express.urlencoded({ extended: true })) // for parsing URL-encoded payloads

// Routes
app.get('/', (req, res) => {
    res.send('API is running...')
})

// Import routes
import userRoutes from './routes/userRoutes.js'
app.use('/api', userRoutes)

// Listen
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})