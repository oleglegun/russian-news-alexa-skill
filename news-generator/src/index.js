const request = require('request')
const FeedParser = require('feedparser')
const { text2SSML } = require('./ssml')
const { md5Hash, dateString } = require('./helpers')
const config = require('config')

const AWS = require('aws-sdk')
const DDB = new AWS.DynamoDB.DocumentClient()
const S3 = new AWS.S3()
const SQS = new AWS.SQS()
const Polly = new AWS.Polly()

const LAMBDA_NAME = process.env['LAMBDA_NAME']
const DDB_TABLE_NAME = process.env['DDB_TABLE_NAME']
const FEED_URL = process.env['FEED_URL']
const SQS_URL = process.env['SQS_URL']

// steps

// get rss and parse
// generate hashes (ids) for news based on its url
// get news for 2 days from DDB (date > today - 2 days)
// identify non-existent news (check hashes for equality)
// process each non-existent news
//      apply ssml
//      send to polly
//      upload to s3
//      save into DDB/News

const getNews = function(feedURL) {
    publishToSQS('GET_NEWS_STARTED')
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

        feedparser.on('end', function() {
            resolve(news)
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
                    ssml: text2SSML(item.summary, config.get('SSML')),
                    url: item.link,
                    image: item.enclosures[0].url,
                })
            }
        })
    })
}

const putNewsToDynamo = function(news) {
    publishToSQS('PUT_NEWS_TO_DYNAMO_STARTED')

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
            if (err) reject(err)
            else resolve(news, data)
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

const uploadAudioToS3 = function() {}

const publishToSQS = function(message) {
    const params = {
        MessageAttributes: {
            Title: {
                DataType: 'String',
                StringValue: 'Simple Message',
            },
            Author: {
                DataType: 'String',
                StringValue: 'Oleg Legun',
            },
        },
        MessageBody: LAMBDA_NAME + ' ' + message,
        QueueUrl: SQS_URL,
        MessageGroupId: dateString(),
    }
    SQS.sendMessage(params)
        .promise()
        .then(() => console.log(message))
}

/*-----------------------------------------------------------------------------
 *  Helpers
 *----------------------------------------------------------------------------*/

exports.handler = function(event, context, callback) {
    publishToSQS('STARTED')
    getNews(FEED_URL)
        .then(putNewsToDynamo)
        .then((news, data) => {
            // process all new news
            news.forEach(item => {
                synthesizeSpeech()
            })
        })
        .catch(console.log)
}
