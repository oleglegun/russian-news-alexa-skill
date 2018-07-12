import * as ASK from 'ask-sdk'

async function getNextNewsItem(
    handlerInput: ASK.HandlerInput,
    currentItemId: string
): Promise<INewsItemDDB | undefined> {
    const { getNews } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

    const news = await getNews()
    const len = news.length

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

function createNewUser(handerInput: ASK.HandlerInput): IUserDDB {
    return {
        DaysActive: 1,
        Invocations: 1,
        FirstAccess: new Date().toISOString(),
        LastAccess: new Date().toISOString(),
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

    if (token === '') {
        throw new Error('Empty token in request.')
    }

    const parts = token.split(':')

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

export { createNewUser, getNextNewsItem, extractToken, isAccessedToday }
