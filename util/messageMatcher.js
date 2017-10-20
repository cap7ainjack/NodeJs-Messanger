module.exports = {
    isLink: (message) => {
      return message.startsWith('http') || message.startsWith('https')
    },
    isImage: (link) => {
        return link.endsWith('jpg') || link.endsWith('jpeg') || link.endsWith('png');
    }
  }