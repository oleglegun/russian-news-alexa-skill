import * as AWS from 'aws-sdk'
import * as feedParser from 'feedparser'
import * as request from 'request'
import * as striptags from 'striptags'
import { DDB_TABLE_NAME, S3_BUCKET_NAME } from './env'
import { UnsetEnvironmentVariableError } from './errors'
import { log, md5Hash, newsItemRSSToDDBWithAudio } from './helpers'

const DocumentClient = new AWS.DynamoDB.DocumentClient()
const S3 = new AWS.S3()
const Polly = new AWS.Polly()

/** Gets news from RSS feed */
function getNews(feedURL: string): Promise<INewsItemRSS[]> {
    return new Promise((resolve, reject) => {
        log('GET_NEWS_START:', feedURL)

        const req = request(feedURL)
        const feedparser = new feedParser({})

        const news: INewsItemRSS[] = []

        req.on('error', err => {
            reject(err)
        })

        req.on('response', function(res) {
            const stream = this // `this` is `req`, which is a stream

            if (res.statusCode !== 200) {
                this.emit('error', new Error('Bad status code'))
            } else {
                stream.pipe(feedparser)
            }
        })

        feedparser.on('error', err => {
            reject(err)
        })

        feedparser.on('end', () => {
            log('GET_NEWS_SUCCESS:', `Got ${news.length} news.`)
            news.forEach((item, idx) => log(`${idx + 1}:`, item.title))

            resolve(news)
        })

        feedparser.on('readable', function() {
            const stream = this // `this` is `feedparser`, which is a stream
            let item

            while ((item = stream.read())) {
                news.push({
                    date: item.date.toISOString(),
                    id: md5Hash(item.link),
                    // sometimes item.enclosures can be undefined
                    imageURL: item.enclosures && item.enclosures[0] && item.enclosures[0].url,
                    sourceURL: item.link,
                    text: striptags(item.summary),
                    title: item.title,
                })
            }
        })
    })
}

/** Get news from DynamoDB by key */
function getNewsFromDynamo(key: string): Promise<INewsItemDDB[]> {
    return new Promise((resolve, reject) => {
        if (!DDB_TABLE_NAME) {
            reject(new UnsetEnvironmentVariableError('DDB_TABLE_NAME'))
            return
        }

        const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
            TableName: DDB_TABLE_NAME,
            Key: {
                id: key,
            },
        }

        DocumentClient.get(params, (err, data) => {
            if (err) {
                reject(err)
            } else {
                if (!data.Item) {
                    resolve([])
                    return
                }

                resolve(data.Item.attributes)
            }
        })
    })
}

function putNewsToDynamo(key: string, news: INewsItemDDB[]) {
    log('PUT_NEWS_TO_DYNAMO_START')

    return new Promise((resolve, reject) => {
        if (!DDB_TABLE_NAME) {
            reject(new UnsetEnvironmentVariableError('DDB_TABLE_NAME'))
            return
        }

        const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
            TableName: DDB_TABLE_NAME,
            Item: {
                id: key,
                attributes: news,
            },
        }

        DocumentClient.put(params, (err, data) => {
            if (err) {
                log('PUT_NEWS_TO_DYNAMO_ERROR')
                reject(err)
            } else {
                log('PUT_NEWS_TO_DYNAMO_SUCCESS')
                resolve()
            }
        })
    })
}

/** Generate audio and save it to S3. */
async function processNews(news: INewsItemRSSWithSSML[]): Promise<INewsItemDDB[]> {
    const newsWithAudio: INewsItemDDB[] = []

    const promises = news.map(async item => {
        const { AudioStream } = await synthesizeSpeech(item.ssml)
        const { Location } = await uploadAudioToS3(AudioStream, `news/${item.id}.mp3`)
        newsWithAudio.push(newsItemRSSToDDBWithAudio(item, Location))
    })

    await Promise.all(promises)
    log('ALL_FILES_UPLOADED_SUCCESSFULLY')

    return Promise.resolve(newsWithAudio)
}

function synthesizeSpeech(ssml) {
    const params = {
        OutputFormat: 'mp3',
        Text: ssml,
        TextType: 'ssml',
        VoiceId: 'Maxim',
    }

    return Polly.synthesizeSpeech(params).promise()
}

function uploadAudioToS3(stream, key) {
    console.log('Uploading to S3:', key)

    if (!S3_BUCKET_NAME) {
        throw new UnsetEnvironmentVariableError('S3_BUCKET_NAME')
    }

    const params = {
        ACL: 'public-read',
        Body: stream,
        Bucket: S3_BUCKET_NAME,
        Key: key,
    }

    return S3.upload(params).promise()
}

export {
    getNews,
    getNewsFromDynamo,
    log,
    processNews,
    putNewsToDynamo,
    synthesizeSpeech,
    uploadAudioToS3,
}
