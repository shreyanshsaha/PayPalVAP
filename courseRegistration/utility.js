

function createMessage(header, text, type){
  return {
    "header": header,
    "text": text,
    "type": type,
  }
}

module.exports.createMessage = createMessage;