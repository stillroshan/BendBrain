import express from 'express'
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from './config/passport.js'
import session from 'express-session'
import fileUpload from 'express-fileupload'
import { createServer } from 'http'
import setupWebSocket from './websocket.js'

// Load environment variables
dotenv.config()

// Initialize express
const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(express.json()) // for parsing application/json
app.use(cors()) // for cross-origin requests
app.use(cookieParser()) // for parsing cookies
app.use(express.urlencoded({ extended: true })) // for parsing URL-encoded payloads
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(fileUpload({ useTempFiles: true })) // for handling file uploads

// Routes
app.get('/', (req, res) => {
    res.send('API is running...')
})

// Google OAuth
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
app.get('/api/auth/google/callback', passport.authenticate('google', { failureRedirect: '/api/login' }), (req, res) => {
    const token = req.user.generateAuthToken()
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${token}`)
})

// Import routes
import userRoutes from './routes/userRoutes.js'
app.use('/api', userRoutes)

import learningRoutes from './routes/learningRoutes.js'
app.use('/api/learning', learningRoutes)

import questionRoutes from './routes/questionRoutes.js'
app.use('/api/questions', questionRoutes)

import questionListRoutes from './routes/questionListRoutes.js'
app.use('/api/lists', questionListRoutes)

import dashboardRoutes from './routes/dashboardRoutes.js'
app.use('/api/dashboard', dashboardRoutes)

import discussionRoutes from './routes/discussionRoutes.js'
app.use('/api/discussions', discussionRoutes)

const port = process.env.PORT || 4000

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`)
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}`)
        server.listen(port + 1)
    } else {
        console.error(err)
    }
})

const wss = setupWebSocket(server)