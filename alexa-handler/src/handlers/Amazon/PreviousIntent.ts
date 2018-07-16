import * as ASK from 'ask-sdk-core'
import speech from '../../speech'
import log from '../../log'

export const PreviousIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PreviousIntent'
        )
    },
    async handle(handlerInput) {
        log('---', 'PreviousIntent')

        const {
            getPreviousNewsItem,
            getUser,
            putUser,
            getNewsItemById,
            generateAudioMetadata,
        } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const user = await getUser()

        if (!user) {
            throw new Error('PreviousIntentHandler: user is undefined.')
        }

        const id = user.LastPlayedItem

        const lastPlayedItem = await getNewsItemById(id)

        const beforeLastPlayedItem = await getPreviousNewsItem(id)

        if (!lastPlayedItem) {
            return handlerInput.responseBuilder.speak(speech.isOldestNewsItem).getResponse()
        }

        if (beforeLastPlayedItem) {
            user.LastPlayedItem = beforeLastPlayedItem.Id
        } else {
            // is the oldest news item => no before previous id
            user.LastPlayedItem = 'no-item'
        }

        user.LastAccess = new Date().toISOString()

        await putUser(user)

        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective(
                'REPLACE_ALL',
                lastPlayedItem.AudioURL,
                `ITEM:${lastPlayedItem.Id}`,
                0,
                undefined,
                generateAudioMetadata(lastPlayedItem)
            )
            .getResponse()

        return handlerInput.responseBuilder.speak('Previous').getResponse()
    },
}
