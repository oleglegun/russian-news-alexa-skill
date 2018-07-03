import * as crypto from 'crypto'
import * as moment from 'moment'
import * as pollyRuSSML from 'polly-ru-ssml'

import { INewsItemDDB, INewsItemMapDDB, INewsItemRSS, INewsItemRSSWithSSML } from './types'

const DEBUG = process.env['DEBUG']

function md5Hash(text) {
    return crypto
        .createHash('md5')
        .update(text)
        .digest('hex')
}

function todayDateString() {
    return moment().format('YYYYMMDD')
}

/** Check if news array contains any fresh news */
function identifyUnprocessedNews(
    allNews: INewsItemRSS[],
    processedNews: INewsItemMapDDB
): INewsItemRSS[] {
    log('IDENTIFY_UNPROCESSED_NEWS_START')

    const unprocessedNews = []

    allNews.forEach(item => {
        if (processedNews[item.id] === undefined) {
            unprocessedNews.push(item)
        }
    })

    log('IDENTIFY_UNPROCESSED_NEWS_FINISH: Found', unprocessedNews.length.toString(), 'news.')

    return unprocessedNews
}

// adds ssml field with generated ssml tags to each object in news array
function addSSML(news: INewsItemRSS[], ssmlConfig): INewsItemRSSWithSSML[] {
    const newsWithSSML: INewsItemRSSWithSSML[] = []

    for (const item of news) {
        const ssml =
            '<speak>' +
            pollyRuSSML.ssml(item.title, ssmlConfig) +
            '<break time="1s"/>' +
            pollyRuSSML.ssml(item.text, ssmlConfig) +
            '</speak>'

        newsWithSSML.push(Object.assign({}, item, { ssml }))
    }

    return newsWithSSML
}

function newsItemRSSToDDBWithAudio(newsItem: INewsItemRSS, audioURL: string): INewsItemDDB {
    return {
        Timestamp: newsItem.date,
        Title: newsItem.title,
        SourceURL: newsItem.sourceURL,
        AudioURL: audioURL,
        ImageURL: newsItem.imageURL
    }
}

function mergeNews(
    processedNewsMap: INewsItemMapDDB,
    newsWithAudioMap: INewsItemMapDDB
): INewsItemMapDDB {
    return Object.assign({}, processedNewsMap, newsWithAudioMap)
}

function filterNewsByDate(news: INewsItemRSS[], date: string): INewsItemRSS[] {
    const filteredNews = []

    news.forEach(item => {
        if (moment(item.date).isSame(date, 'day')) {
            filteredNews.push(item)
        }
    })

    return filteredNews
}

function log(...msgs: string[]) {
    if (DEBUG) {
        console.log(...msgs)
    }
}

export {
    addSSML,
    todayDateString,
    filterNewsByDate,
    md5Hash,
    mergeNews,
    newsItemRSSToDDBWithAudio,
    identifyUnprocessedNews,
    log,
}
