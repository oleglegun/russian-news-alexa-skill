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
const { NoFreshNewsError } = require('./errors')

const FEED_URL = process.env['FEED_URL']

exports.handler = function(event, context, callback) {
    publishToSQS('START')

    getNews(FEED_URL)
        .then(identifyFreshNews)
        .then(freshNews => addSSML(freshNews, config.get('SSML')))
        .then(freshNewsWithSSML => {
            return new Promise((resolve, reject) => {
                const processedNews = []
                publishToSQS('PROCESSING_FRESH_NEWS_START')

                // generate audio and upload to S3 concurrently
                const promises = freshNewsWithSSML.map(item => {
                    return new Promise((resolve, reject) => {
                        synthesizeSpeech(item.ssml)
                            .then(data => uploadAudioToS3(data.AudioStream, `news/${item.id}.mp3`))
                            .then(data => {
                                processedNews.push(
                                    Object.assign({}, item, { audio_url: data.Location })
                                )
                                resolve()
                            })
                            .catch(err => {
                                console.log(item)
                                reject(err)
                            })
                    })
                })

                // Wait for all requests to finish and return news array with S3 urls
                Promise.all(promises)
                    .then(() => {
                        publishToSQS('PROCESSING_FRESH_NEWS_SUCCESS')
                        resolve(processedNews)
                    })
                    .catch(err => {
                        publishToSQS('PROCESSING_FRESH_NEWS_ERROR')
                        reject(err)
                    })
            })
        })
        .then(putNewsToDynamo)
        .then((news, data) => {
            publishToSQS('FINISH')
        })
        .catch(err => {
            if (err instanceof NoFreshNewsError) {
                console.log('No fresh news found.')
            } else {
                console.log(err, err.stack)
            }
            publishToSQS('FINISH')
        })
}
