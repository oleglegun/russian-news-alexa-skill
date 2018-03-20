const request = require('request')
const FeedParser = require('feedparser')
const { text2SSML } = require('./ssml')
const { addSSML, md5Hash, dateString } = require('./helpers')
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
const S3_BUCKET_NAME = process.env['S3_BUCKET_NAME']

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
                    // ssml: text2SSML(item.summary, config.get('SSML')),
                    url: item.link,
                    image: item.enclosures[0] && item.enclosures[0].url,
                })
            }
        })
    })
}

const identifyFreshNews = function(news) {
    publishToSQS('IDENTIFY_FRESH_NEWS')

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
            resolve(freshNews)
        })
    })
}

const putNewsToDynamo = function(news) {
    publishToSQS('PUT_NEWS_TO_DYNAMO_STARTED')

    if (news.length === 0) {
        console.log('---', 'No new items')
        return
    }

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
            // ReturnValues: 'UPDATED_NEW',
        }

        DDB.batchWrite(params, (err, data) => {
            if (err) reject(err)
            else resolve(news, data)
        })
    })
}

const synthesizeSpeech = function(ssml) {
    console.log('---', 'synthesizing')

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

exports.handler = function(event, context, callback) {
    publishToSQS('STARTED')

    getNews(FEED_URL)
        .then(identifyFreshNews)
        .then(freshNews => addSSML(freshNews, config.get('SSML')))
        .then(freshNewsWithSSML => {
            return new Promise((resolve, reject) => {
                const processedNews = []
                console.log('---', 'processing news')

                // generate audio and upload to S3 concurrently
                const promises = freshNewsWithSSML.map(item => {
                    return new Promise((resolve, reject) => {
                        synthesizeSpeech(item.ssml)
                            .then(data => uploadAudioToS3(data.AudioStream, `news/${item.id}.mp3`))
                            .then(data => {
                                console.log('---', 'processed', item.id, data.Location)
                                processedNews.push(Object.assign({}, item, { audio_url: data.Location }))
                                resolve()
                            })
                            .catch(err => {
                                throw new Error(err, err.stack)
                            })
                    })
                })
                
                // Wait for all requests to finish and return final news array
                Promise.all(promises)
                    .then(() => resolve(processedNews))
                    .catch(reject)
            })
        })
        .then(putNewsToDynamo)
        .then((news, data) => {
            // process all new news
            console.log('---', data)
        })
        .catch(console.log)
}
