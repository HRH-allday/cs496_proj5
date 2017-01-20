let mongoose = require('mongoose')
let Schema = mongoose.Schema

let canvasImageSchema = new Schema({
  imgURL: String,
  posX: Number,
  posY: Number
})

module.exports = mongoose.model('canvasImage', canvasImageSchema)
