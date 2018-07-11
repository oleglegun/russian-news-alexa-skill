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
        FirstAccess: new Date().toISOString(),
        LastAccess: new Date().toISOString(),
        Devices: [handerInput.requestEnvelope.context.System.device.deviceId],
        ItemsConsumed: 0,
    }
}

export { createNewUser, getNextNewsItem }
