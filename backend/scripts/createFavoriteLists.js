import mongoose from 'mongoose'
import User from '../models/User.js'
import List from '../models/List.js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get the directory path for the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env file from the root directory
dotenv.config({ path: join(__dirname, '..', '.env') })

const createFavoriteLists = async () => {
    try {
        // Connect to MongoDB
        const uri = process.env.MONGO_URI
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in .env file')
        }

        await mongoose.connect(uri)
        console.log('Connected to MongoDB')

        // Get all users
        const users = await User.find({})
        console.log(`Found ${users.length} users`)

        // Create favorites list for each user
        for (const user of users) {
            // Check if user already has a favorites list
            const existingFavorites = await List.findOne({
                creator: user._id,
                isFavorites: true
            })

            if (!existingFavorites) {
                const favoritesList = new List({
                    title: 'Favorites',
                    creator: user._id,
                    isFavorites: true,
                    visibility: 'private',
                    questions: []
                })

                await favoritesList.save()
                console.log(`Created favorites list for user: ${user.username}`)
            } else {
                console.log(`User ${user.username} already has a favorites list`)
            }
        }

        console.log('Finished creating favorites lists')
        process.exit(0)
    } catch (error) {
        console.error('Error:', error)
        process.exit(1)
    }
}

createFavoriteLists() 