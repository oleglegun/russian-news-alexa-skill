const request = require('request')
const FeedParser = require('feedparser')
const { text2SSML } = require('./ssml')
const { md5Hash, dateString } = require('./helpers')

const AWS = require('aws-sdk')
const DDB = new AWS.DynamoDB.DocumentClient()
const S3 = new AWS.S3()
const SQS = new AWS.SQS()
const Polly = new AWS.Polly()

const LAMBDA_NAME = process.env['LAMBDA_NAME']
const DDB_TABLE_NAME = process.env['DDB_TABLE_NAME']
const SQS_URL = process.env['SQS_URL']
const S3_BUCKET_NAME = process.env['S3_BUCKET_NAME']

// gets news from RSS feed
// returns array with news
const getNews = function(feedURL) {
    publishToSQS('GET_NEWS_START')

    return new Promise(resolve => {
        const req = request(feedURL)
        const feedparser = new FeedParser()

        const news = []

        req.on('error', function(error) {
            throw error
        })

        req.on('response', function(res) {
            const stream = this // `this` is `req`, which is a stream

            if (res.statusCode !== 200) {
                this.emit('error', new Error('Bad status code'))
            } else {
                stream.pipe(feedparser)
            }
        })

        feedparser.on('error', function(error) {
            throw error
        })

         

        feedparser.on('readable', function() {
            const stream = this // `this` is `feedparser`, which is a stream
            let item

            while ((item = stream.read())) {
                news.push({
                    id: md5Hash(item.link),
                    date: item.date.toString(),
                    title: item.title,
                    text: item.summary,
                    url: item.link,
                    image: item.enclosures[0] && item.enclosures[0].url,
                })
            }
        })
    })
}

const identifyFreshNews = function(news) {
    publishToSQS('IDENTIFY_FRESH_NEWS_START')

    return new Promise((resolve, reject) => {
        // generate query requests as array of promises
        const promises = news.map(item => {
            const params = {
                TableName: DDB_TABLE_NAME,
                ExpressionAttributeValues: {
                    ':id': item.id,
                },
                KeyConditionExpression: 'NewsId=:id',
            }

            return DDB.query(params).promise()
        })

        Promise.all(promises).then(items => {
            // return

            const freshNews = []
            items.forEach((item, idx) => {
                // if item exists in table (already processed) => skip it
                if (item.Count === 0) {
                    // if not found => doesn't exist => add it to freshNews
                    freshNews.push(news[idx])
                }
            })

            publishToSQS('IDENTIFY_FRESH_NEWS_SUCCESS')

            if (freshNews.length === 0) {
                console.log(`No fresh news found.`)
                reject('No fresh news found.')
            } else {
                console.log(`Found ${freshNews.length} fresh news.`)
                resolve(freshNews)
            }
        })
    })
}

const putNewsToDynamo = function(news) {
    publishToSQS('PUT_NEWS_TO_DYNAMO_START')

    return new Promise((resolve, reject) => {
        const newsItems = news.map(item => {
            return {
                PutRequest: {
                    Item: {
                        NewsId: item.id,
                        DateAdded: dateString(),
                        Timestamp: item.date,
                        Title: item.title,
                        Text: item.text,
                        SourceURL: item.url,
                        AudioURL: item.audio_url,
                        ImageURL: item.image,
                    },
                },
            }
        })

        const params = {
            RequestItems: {
                [DDB_TABLE_NAME]: [...newsItems],
            },
        }

        DDB.batchWrite(params, (err, data) => {
            if (err) {
                publishToSQS('PUT_NEWS_TO_DYNAMO_ERROR')
                reject(err)
            } else {
                publishToSQS('PUT_NEWS_TO_DYNAMO_SUCCESS')
                resolve()
            }
        })
    })
}

const synthesizeSpeech = function(ssml) {
    const params = {
        OutputFormat: 'mp3',
        VoiceId: 'Maxim',
        TextType: 'ssml',
        Text: ssml,
    }

    return Polly.synthesizeSpeech(params).promise()
}

const uploadAudioToS3 = function(stream, key) {
    console.log('---', 'uploading to S3', key)
    const params = {
        Bucket: S3_BUCKET_NAME,
        Key: key,
        Body: stream,
        ACL: 'public-read',
    }

    return S3.upload(params).promise()
}

const publishToSQS = function(message) {
    const params = {
        // MessageAttributes: {
        //     Title: {
        //         DataType: 'String',
        //         StringValue: 'Simple Message',
        //     },
        //     Author: {
        //         DataType: 'String',
        //         StringValue: 'Oleg Legun',
        //     },
        // },
        MessageBody: LAMBDA_NAME + ': ' + message,
        QueueUrl: SQS_URL,
        MessageGroupId: dateString(),
    }
    SQS.sendMessage(params)
        .promise()
        .then(() => console.log(message))
}

module.exports = {
    getNews,
    identifyFreshNews,
    putNewsToDynamo,
    synthesizeSpeech,
    uploadAudioToS3,
    publishToSQS,
}
