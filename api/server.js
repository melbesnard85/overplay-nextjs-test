import express from 'express'
import mongoose from 'mongoose'
import Cors from 'cors'
import Imgs from './imgSchema.js'

//App Config
const app = express()
const port = process.env.PORT || 8001
const connection_url = 'mongodb://localhost:27017/overplay-test'
//Middleware
app.use(express.json())
app.use(Cors())
//DB Config
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
})
//API Endpoints
app.get('/', (req, res) => res.status(200).send('Hello TheWebDevqqq'))

app.post('/imgs', (req, res) => {
  const img = req.body

  Imgs.create(img, (err, data) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.status(201).send(data)
    }
  })
})

app.get('/imgs', async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 0
  const limit = parseInt(req.query.limit) || 3
  let startIndex = (pageNumber - 1) * limit
  const imgs = await Imgs.find()
    .sort('-_id')
    .skip(startIndex)
    .limit(limit)
    .exec()
  if (imgs) {
    res.status(200).send(imgs)
  } else {
    res.status(500).send('err')
  }
})

app.get('/imgs/:id', async (req, res) => {
  const img = await Imgs.findById(req.params.id)
  // Check if img exists
  if (img) {
    res.json(img)
  } else {
    res.status(404)
    throw new Error('Img not found')
  }
})
//Listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`))
