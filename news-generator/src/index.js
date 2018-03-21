const config = require('config')
const {
    getNews,
    identifyFreshNews,
    synthesizeSpeech,
    putNewsToDynamo,
    uploadAudioToS3,
    publishToSQS,
} = require('./aws')
const { addSSML } = require('./helpers')

const FEED_URL = process.env['FEED_URL']

exports.handler = function(event, context, callback) {
    publishToSQS('START')

    getNews(FEED_URL)
        .then(identifyFreshNews)
        .then(freshNews => addSSML(freshNews, config.get('SSML')))
        .then(freshNewsWithSSML => {
            return new Promise((resolve, reject) => {
                const processedNews = []

                // generate audio and upload to S3 concurrently
                const promises = freshNewsWithSSML.map(item => {
                    return new Promise((resolve, reject) => {
                        synthesizeSpeech(item.ssml)
                            .then(data => uploadAudioToS3(data.AudioStream, `news/${item.id}.mp3`))
                            .then(data => {
                                console.log('---', 'processed', item.id, data.Location)
                                processedNews.push(
                                    Object.assign({}, item, { audio_url: data.Location })
                                )
                                resolve()
                            })
                            .catch(err => {
                                throw new Error(err, err.stack)
                            })
                    })
                })

                // Wait for all requests to finish and return news array with S3 urls
                Promise.all(promises)
                    .then(() => resolve(processedNews))
                    .catch(reject)
            })
        })
        .then(putNewsToDynamo)
        .then((news, data) => {
            publishToSQS('FINISH')
        })
        .catch(reason => {
            console.log(reason)
            publishToSQS('FINISH')
        })
}
