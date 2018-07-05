
export const FEED_URL = process.env['FEED_URL']

const newsLimit = process.env['NEWS_LIMIT']
export const NEWS_LIMIT = newsLimit ? parseInt(newsLimit, 10) : 20

export const DDB_TABLE_NAME = process.env['DDB_TABLE_NAME']
export const S3_BUCKET_NAME = process.env['S3_BUCKET_NAME']
export const DEBUG = process.env['DEBUG']
