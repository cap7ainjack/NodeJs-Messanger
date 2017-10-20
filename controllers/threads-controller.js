const User = require('../models/User')
const Thread = require('../models/Thread')
const Message = require('../models/Message')

const messageChecker = require('../util/messageMatcher')

module.exports = {
    chatRoom: {
        get: (req, res)=>{
            let currentUser = req.user.username
            let otherUser = req.params.username

            Thread.findOne({
              users: { $all: [currentUser, otherUser] }
            }).then(currentThread => {
              if (!currentThread) {
                return res.redirect('/?error=Thread no longer exists')
              }
              let data = { currentThread } // context to send to pug view

              User.findOne({ username: otherUser }).then(secondUser => {
                if (!secondUser) {
                  return res.redirect('/?error=User no longer exists')
                }

                if (secondUser.blockedUsers.indexOf(req.user._id) !== -1) {
                    data.blocked = true
                }
              })
      

              Message.find({ thread: currentThread._id })
                .sort({ dateCreated: 1 })
                .populate('user')
                .then(messages => {

                  data.messages = messages
                  
                  res.render('thread/chat-room', data)
                })
            })      
        },
        post: (req, res)=>{
            let content = req.body.content
            let user = req.user
            let otherUser = req.params.username

            Thread.findOne({
                users: { $all: [user.username, otherUser] }
              })
                .then((currentThread) => {
                    if(!currentThread){
                        return res.redirect('/?error=Thread no longer exists')
                    }

                    let messageData = {
                        thread: currentThread._id,
                        user: user._id,
                        content: content
                     }

                        if(messageChecker.isLink(content)){
                            messageData.isLink = true;
                         if(messageChecker.isImage(content)){
                            messageData.isImage = true;
                        }
                    }

                     Message.create(messageData).then((message) =>{
                        res.redirect(`/thread/${otherUser}`)
                     }).catch(err =>{
                        res.redirect(`/thread/${otherUser}?error=${err.errors.content.message}`)
                     })
                })
        }
    }
}