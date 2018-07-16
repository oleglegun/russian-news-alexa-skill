import * as ASK from 'ask-sdk-core'
import speech from '../../speech'
import log from '../../log'

export const NextIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NextIntent'
        )
    },
    async handle(handlerInput) {
        log('---', 'NextIntent')

        const {
            getUser,
            putUser,
            getNextNewsItem,
            generateAudioMetadata,
        } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const user = await getUser()

        if (!user) {
            throw new Error('NextIntentHandler: user is undefined.')
        }

        // Get currently playing news item
        let nextNewsItem = await getNextNewsItem(user.LastPlayedItem)

        if (!nextNewsItem) {
            throw new Error('NextIndentHandler: nextNewsItem (currently playing) is undefined.')
        }

        user.LastPlayedItem = nextNewsItem.Id
        await putUser(user)

        // Get next news item
        nextNewsItem = await getNextNewsItem(nextNewsItem.Id)

        if (!nextNewsItem) {
            return handlerInput.responseBuilder
                .speak(speech.noNews)
                .addAudioPlayerStopDirective()
                .getResponse()
        }

        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective(
                'REPLACE_ALL',
                nextNewsItem.AudioURL,
                `ITEM:${nextNewsItem.Id}`,
                0,
                undefined,
                generateAudioMetadata(nextNewsItem)
            )
            .getResponse()
    },
}
