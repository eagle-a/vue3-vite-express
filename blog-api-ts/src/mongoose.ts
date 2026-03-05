import process from 'node:process'
import mongoose from 'mongoose'

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mmfblog_v2'

mongoose.set('strictQuery', false)
mongoose.connect(mongoUri, {})
mongoose.Promise = globalThis.Promise

export default mongoose
