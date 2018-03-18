const crypto = require('crypto')
const moment = require('moment')


const md5Hash = function(text) {
    return crypto
        .createHash('md5')
        .update(text)
        .digest('hex')
}

const dateString = function() {
    return moment().format('YYYYMMDD')
}

module.exports = {
    md5Hash,
    dateString,
}
