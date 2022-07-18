import mongoose from 'mongoose'
const imgSchema = mongoose.Schema({
  imgUrl: String,
  info: String,
  orgSize: Number,
  cmpSize: Number,
})
export default mongoose.model('imgs', imgSchema)
