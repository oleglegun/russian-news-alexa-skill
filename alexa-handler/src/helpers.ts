import * as ASK from 'ask-sdk-core'
import { interfaces } from 'ask-sdk-model'

async function getNextNewsItem(
    handlerInput: ASK.HandlerInput,
    currentItemId: string
): Promise<INewsItemDDB | undefined> {
    const { getNews } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

    const news = await getNews()
    const len = news.length

    if (currentItemId === '' && len) {
        // new user in PlayNewsIntent
        return news[0]
    }

    let currentIdx = -1

    for (let i = 0; i < len; i++) {
        if (news[i].Id === currentItemId) {
            currentIdx = i
            break
        }
    }

    // Found, but last
    if (currentIdx === len - 1) {
        return undefined
    }

    // Not found
    if (currentIdx === -1) {
        return news[0]
    }

    // Found
    return news[currentIdx + 1]
}

async function getNewsItemById(
    handlerInput: ASK.HandlerInput,
    newsItemId: string
): Promise<INewsItemDDB | undefined> {
    const { getNews } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

    const news = await getNews()

    for (const item of news) {
        if (item.Id === newsItemId) {
            return item
        }
    }

    return undefined
}

async function getPreviousNewsItem(
    handerInput: ASK.HandlerInput,
    currentItemId: string
): Promise<INewsItemDDB | undefined> {
    const { getNews } = handerInput.attributesManager.getRequestAttributes() as IRequestAttributes

    const news = await getNews()

    const len = news.length

    let currentIdx = -1

    for (let i = 0; i < len; i++) {
        if (news[i].Id === currentItemId) {
            currentIdx = i
            break
        }
    }

    if (currentIdx < 1) {
        return undefined
    }

    return news[currentIdx - 1]
}

function createNewUser(handerInput: ASK.HandlerInput): IUserDDB {
    return {
        DaysActive: 1,
        Invocations: 1,
        FirstAccess: new Date().toISOString(),
        LastAccess: new Date().toISOString(),
        LastPlayedItem: 'new-user',
        Devices: {
            [handerInput.requestEnvelope.context.System.device.deviceId]: {
                ItemsConsumed: 0,
                SupportedInterfaces: Object.keys(
                    handerInput.requestEnvelope.context.System.device.supportedInterfaces
                ),
            },
        },
        ItemsConsumed: 0,
        Role: 'USER',
    }
}

function extractToken(handlerInput: ASK.HandlerInput): IRequestToken {
    const { token } = handlerInput.requestEnvelope.request as { token: string }

    if (!token) {
        throw new Error('extractToken(): no token found.')
    }

    const parts = token.split(':')

    if (parts.length !== 2) {
        throw new Error(`Invalid token "${token}".`)
    }

    switch (parts[0]) {
        case 'ITEM':
            return {
                type: 'ITEM',
                id: parts[1],
            }
        default:
            return {
                type: 'ETC',
                id: parts[1],
            }
    }
}

function isAccessedToday(user: IUserDDB): boolean {
    const today = new Date()
    const userDate = new Date(user.LastAccess)

    return (
        userDate.getDate() === today.getDate() &&
        userDate.getMonth() === today.getMonth() &&
        userDate.getFullYear() === today.getFullYear()
    )
}

function generateAudioMetadata(newsItem: INewsItemDDB): interfaces.audioplayer.AudioItemMetadata {
    return {
        title: newsItem.Title,
        subtitle: 'Russian News Skill',
        art: {
            contentDescription: 'News',
            sources: [
                {
                    url: newsItem.ImageURL,
                },
            ],
        },
    }
}

export {
    createNewUser,
    getNextNewsItem,
    getNewsItemById,
    getPreviousNewsItem,
    generateAudioMetadata,
    extractToken,
    isAccessedToday,
}
