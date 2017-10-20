const controllers = require('../controllers')

module.exports = app => {
  app.get('/', controllers.home.get)
  app.get('/user/register', controllers.user.register.get)
  app.post('/user/register', controllers.user.register.post)
  app.post('/user/logout', controllers.user.logout)
  app.get('/user/login', controllers.user.login.get)
  app.post('/user/login', controllers.user.login.post)

  app.get('/user/find', controllers.user.find)

  app.get('/thread/:username', controllers.thread.chatRoom.get)
  app.post('/thread/:username', controllers.thread.chatRoom.post)
  app.get('/user/:userId/block', controllers.user.block)
  app.get('/user/:userId/unblock', controllers.user.unblock)

  app.get('/message/:messageId/like', controllers.message.like)
  app.get('/message/:messageId/unlike', controllers.message.unlike)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found')
    res.end()
  })
}
