const crypto = require('crypto')
const moment = require('moment')
const { text2SSML } = require('./ssml')

const md5Hash = function(text) {
    return crypto
        .createHash('md5')
        .update(text)
        .digest('hex')
}

const dateString = function() {
    return moment().format('YYYYMMDD')
}

// adds ssml field with generated ssml tags to each object in news array
const addSSML = function(news, ssmlConfig) {
    const newsWithSSML = []

    for (let i = 0; i < news.length; i++) {
        const ssml =
            '<speak>' +
            text2SSML(news[i].title, ssmlConfig) +
            ssmlConfig.break +
            text2SSML(news[i].text, ssmlConfig) +
            '</speak>'

        newsWithSSML.push(Object.assign({}, news[i], { ssml }))
    }

    return newsWithSSML
}

module.exports = {
    addSSML,
    dateString,
    md5Hash,
}
