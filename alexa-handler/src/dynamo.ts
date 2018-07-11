import { DynamoDB } from 'aws-sdk'
import { DDB_NEWS_KEY, DDB_TABLE_NAME, DEBUG } from './env'
import { UnsetEnvironmentVariableError } from './errors'

const DDBClient = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

async function getNewsItems(): Promise<INewsItemDDB[]> {
    return new Promise<INewsItemDDB[]>((resolve, reject) => {
        if (!DDB_TABLE_NAME || !DDB_NEWS_KEY) {
            reject(new UnsetEnvironmentVariableError('DDB_TABLE_NAME/DDB_NEWS_KEY'))
            return
        }
        if (DEBUG) {
            console.log('DDB_REQUEST:', 'getNewsItems')
        }

        const params: DynamoDB.DocumentClient.GetItemInput = {
            Key: {
                id: DDB_NEWS_KEY,
            },
            TableName: DDB_TABLE_NAME,
        }

        DDBClient.get(params, (err, data) => {
            if (err) {
                reject(err)
                return
            }

            if (data.Item) {
                resolve(data.Item.attributes)
            } else {
                reject(
                    new Error(
                        `No news items found in table "${DDB_TABLE_NAME}" for key "${DDB_NEWS_KEY}." `
                    )
                )
            }
        })
    })
}

async function getUserAttributes(id: string): Promise<IUserDDB | undefined> {
    return new Promise<IUserDDB | undefined>((resolve, reject) => {
        if (!DDB_TABLE_NAME) {
            reject(new UnsetEnvironmentVariableError('DDB_TABLE_NAME'))
            return
        }

        if (DEBUG) {
            console.log('DDB_REQUEST:', 'getUserAttributes')
        }

        const params: DynamoDB.DocumentClient.GetItemInput = {
            Key: { id },
            TableName: DDB_TABLE_NAME,
        }

        DDBClient.get(params, (err, data) => {
            if (err) {
                reject(err)
                return
            }

            if (!data.Item) {
                resolve(undefined)
                return
            }

            resolve(data.Item.attributes)
        })
    })
}

async function putUserAttributes(id: string, attributes: IUserDDB): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        if (!DDB_TABLE_NAME) {
            reject(new UnsetEnvironmentVariableError('DDB_TABLE_NAME'))
            return
        }

        if (DEBUG) {
            console.log('DDB_REQUEST:', 'putUserAttributes')
        }

        const params: DynamoDB.DocumentClient.PutItemInput = {
            Item: {
                id,
                attributes,
            },
            TableName: DDB_TABLE_NAME,
        }

        DDBClient.put(params, (err, data) => {
            if (err) {
                reject(err)
                return
            }
            resolve()
        })
    })
}

export { getNewsItems, getUserAttributes, putUserAttributes }
