const Message = require('../models/Message')

module.exports = {
    like: (req, res) => {
      toggle(req, res, 'like')
    },
    unlike: (req, res) => {
      toggle(req, res, 'unlike')
    }
  }

function toggle(req, res, action){
    let messageId =  req.params.messageId

    Message.findOne({_id: messageId}).then((message) =>{
        if(!message){
            return res.redirect('/?error=Mesage no longer exist')
        }

        if(action ==='like'){
            message.isLiked = true
            message.likedUser = req.user._id
        }

        if(action ==='unlike'){
            message.isLiked = false
            message.likedUser = '';
        }

    })
}