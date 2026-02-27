import mongoose from 'mongoose'

import { mongoUrl } from './config'

mongoose.set('strictQuery', false)
mongoose.connect(`mongodb://${mongoUrl}/mmfblog_v2`, { })
mongoose.Promise = globalThis.Promise

export default mongoose
