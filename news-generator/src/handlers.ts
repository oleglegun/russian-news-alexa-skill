import * as config from 'config'
import { getNews, getNewsFromDynamo, log, processNews, putNewsToDynamo } from './aws'
import {
    addSSML,
    filterNewsByDate,
    identifyUnprocessedNews,
    mergeNews,
    todayDateString,
} from './helpers'

const FEED_URL = process.env['FEED_URL']

async function generateNews() {
    log('START')

    const todayDate = todayDateString()
    const allNews = await getNews(FEED_URL)
    const todayNews = filterNewsByDate(allNews, todayDate)
    const processedNewsMap = await getNewsFromDynamo(todayDate)
    const unprocessedNews = identifyUnprocessedNews(todayNews, processedNewsMap)

    if (unprocessedNews.length === 0) {
        log('FINISH')
        return
    }
    const newsWithSSML = addSSML(unprocessedNews, config.get('SSML'))
    const newsWithAudioMap = await processNews(newsWithSSML)

    const mergedNews = mergeNews(processedNewsMap, newsWithAudioMap)
    await putNewsToDynamo(todayDate, mergedNews)

    log('FINISH')
}

export { generateNews }
