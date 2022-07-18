import mongoose from 'mongoose'
const imgSchema = mongoose.Schema({
  cmpUrl: String,
  orgUrl: String,
  orgInfo: Object,
})
export default mongoose.model('imgs', imgSchema)
