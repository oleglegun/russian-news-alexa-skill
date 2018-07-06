import * as crypto from 'crypto'
import * as moment from 'moment'
import * as pollyRuSSML from 'polly-ru-ssml'

import { INewsItemDDB, INewsItemRSS, INewsItemRSSWithSSML } from './types'

const DEBUG = process.env['DEBUG']

function md5Hash(text) {
    return crypto
        .createHash('md5')
        .update(text)
        .digest('hex')
}

/** Check if news array contains any fresh news */
function identifyUnprocessedNews(
    allNews: INewsItemRSS[],
    processedNews: INewsItemDDB[]
): INewsItemRSS[] {
    log('IDENTIFY_UNPROCESSED_NEWS_START')
    const unprocessedNews: INewsItemRSS[] = []

    allNews.forEach(item => {
        for (const processedItem of processedNews) {
            if (processedItem.Id === item.id) {
                return
            }
        }

        unprocessedNews.push(item)
    })

    log('IDENTIFY_UNPROCESSED_NEWS_FINISH: Found', unprocessedNews.length.toString(), 'news.')

    return unprocessedNews
}

// adds ssml field with generated ssml tags to each object in news array
function addSSML(news: INewsItemRSS[]): INewsItemRSSWithSSML[] {
    const newsWithSSML: INewsItemRSSWithSSML[] = []

    for (const item of news) {
        const ssml =
            '<speak>' +
            pollyRuSSML.ssml(item.title) +
            '<break time="1s"/>' +
            pollyRuSSML.ssml(item.text) +
            '</speak>'

        newsWithSSML.push(Object.assign({}, item, { ssml }))
    }

    return newsWithSSML
}

function newsItemRSSToDDBWithAudio(newsItem: INewsItemRSS, audioURL: string): INewsItemDDB {
    return {
        Id: newsItem.id,
        Title: newsItem.title,
        SourceURL: newsItem.sourceURL,
        AudioURL: audioURL,
        ImageURL: newsItem.imageURL ? newsItem.imageURL : '',
    }
}

function sortNews(news: INewsItemRSS[]): INewsItemRSS[] {
    return news.sort((a, b) => {
        return moment(a.date).valueOf() - moment(b.date).valueOf()
    })
}

function limitNews(news: INewsItemDDB[], limit: number): INewsItemDDB[] {
    const len = news.length
    if (len <= limit) {
        return news
    }

    return news.slice(len - limit)
}

function log(...msgs: string[]) {
    if (DEBUG) {
        console.log(...msgs)
    }
}

export {
    addSSML,
    md5Hash,
    newsItemRSSToDDBWithAudio,
    identifyUnprocessedNews,
    log,
    sortNews,
    limitNews,
}
