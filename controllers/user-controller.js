const User = require('../models/User')
const encryption = require('../util/encryption')

const Thread = require('../models/Thread')

module.exports = {
  register: {
    get: (req, res) => {
      res.render('user/register')
    },
    post: (req, res) => {
      let userData = req.body

      if (userData.password && userData.password !== userData.confirmedPassword) {
        userData.error = 'Passwords do not match'
        res.render('user/register', userData)
        return
      }

      let salt = encryption.generateSalt()
      userData.salt = salt

      if (userData.password) {
        userData.hashedPass = encryption.generateHashedPassword(salt, userData.password)
      }

      User
        .create(userData)
        .then(user => {
          req.logIn(user, (err, user) => {
            if (err) {
              res.render('users/register', {error: 'Wrong credentials!'})
              return
            }

            res.redirect('/')
          })
        })
        .catch(error => {
          userData.error = error
          res.render('user/register', userData)
        })
    }
  },
  login: {
    get: (req, res) => {
      res.render('user/login')
    },
    post: (req, res) => {
      let userData = req.body

      User
        .findOne({username: userData.username})
        .then(user => {
          if (!user || !user.authenticate(userData.password)) {
            res.render('user/login', {error: 'Wrong credentials!'})
            return
          }

          req.logIn(user, (err, user) => {
            if (err) {
              res.render('user/login', {error: 'Wrong credentials!'})
              return
            }

            res.redirect('/')
          })
        })
    }
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  find: (req, res) => {

    let otherUser = req.query.username //qs.parse(url.parse(req.url).query)
    let currentUser = req.user.username;

      if (otherUser === currentUser) {
        return res.redirect('/?error=Cannot chat with yourself!')
      }

      User.findOne({username: otherUser})
        .then(user => {
          if (!user) {
            return res.redirect('/?error=User does not exist')
          }

          Thread.findOne({
            users: {
              $all: [currentUser, otherUser]
            }
          }).then(existingThread => {
              if (!existingThread) {
                Thread.create({
                  users: [currentUser, otherUser]
                }).then(thread => {
                    user.otherUsers.push(req.user._id)
                    req.user.otherUsers.push(user._id)
                    Promise.all([user.save(),req.user.save()])
                  })
              }

              res.redirect(`/thread/${user.username}`)
            })
        })
  },
  block: (req, res) =>{
    let userId = req.params.userId
    if(!req.user.blockedUsers){
      req.user.blockedUsers = []
    }

    req.user.blockedUsers.push(userId)
    req.user.save().then(() => res.redirect('/'))
  },
  unblock: (req, res) => {
    let userId = req.params.userId
    let index = req.user.blockedUsers.indexOf(userId);
    if (index !== -1) {
      req.user.blockedUsers.splice(index, 1);
    }
    req.user.save().then(() => res.redirect('/')) 
  }
}
