const mongoose = require('mongoose')

let messageSchema = mongoose.Schema({
    content: { type: mongoose.Schema.Types.String, required: true,
      max: [1000, "Message can`t be bigger than 1000 symbols"] },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    thread: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Thread' },
    dateCreated: { type: mongoose.Schema.Types.Date, default: Date.now() },
    isImage: {type: mongoose.Schema.Types.Boolean, default: false},
    isLink: {type: mongoose.Schema.Types.Boolean, default: false},
    isLiked:{type: mongoose.Schema.Types.Boolean, default: false},
    likedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  })
  

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
