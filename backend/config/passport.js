import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/User.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const generateUniqueUsername = async (baseUsername) => {
    let username = baseUsername
    let userExists = await User.findOne({ username })
    let counter = 1

    while (userExists) {
        username = `${baseUsername}${counter}`
        userExists = await User.findOne({ username })
        counter++ 
    }

    return username
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
    scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile 
    const email = emails[0].value

    let user = await User.findOne({ email })

    if (!user) {
        const baseUsername = displayName.replace(/\s/g, '').toLowerCase()
        const username = await generateUniqueUsername(baseUsername)

        user = await User.create({
            username,
            email,
            googleId: id
        })
    }

    done(null, user)
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id)
    done(null, user)
})

export default passport