import { getNews, getNewsFromDynamo, log, processNews, putNewsToDynamo } from './aws'
import { DDB_KEY, FEED_URL, NEWS_LIMIT } from './env'
import { UnsetEnvironmentVariableError } from './errors'
import { addSSML, identifyUnprocessedNews, limitNews, sortNews } from './helpers'

async function generateNews() {
    if (!FEED_URL) {
        throw new UnsetEnvironmentVariableError('FEED_URL')
    }
    log('START')

    try {
        const allNews = await getNews(FEED_URL)
        const processedNews = await getNewsFromDynamo(DDB_KEY)
        const unprocessedNews = identifyUnprocessedNews(allNews, processedNews)

        if (unprocessedNews.length === 0) {
            log('FINISH')
            return
        }
        // sort (old -> new)
        const newsWithSSML = addSSML(sortNews(unprocessedNews))
        const newsWithAudio = await processNews(newsWithSSML)

        const mergedNews = processedNews.concat(newsWithAudio)

        await putNewsToDynamo(DDB_KEY, limitNews(mergedNews, NEWS_LIMIT))
    } catch (error) {
        log('FINISH_WITH_ERROR')
        // Pass error up to generate an appropriate HTTP error code
        throw error
    }

    log('FINISH')
}

export { generateNews }
