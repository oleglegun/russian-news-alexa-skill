import * as ASK from 'ask-sdk-core'
import { PlayNewsIntentHandler } from '../PlayNewsIntent'
import log from '../../log'

export const RepeatIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent'
        )
    },
    async handle(handlerInput) {
        log('---', 'RepeatIntent')

        const {
            getUser,
            getNextNewsItem,
            generateAudioMetadata,
        } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const user = await getUser()

        if (!user) {
            throw new Error('RepeatIntentHandler: user is undefined.')
        }

        const newsItem = await getNextNewsItem(user.LastPlayedItem)

        if (!newsItem) {
            throw new Error(
                'RepeatIntentHandler: getNextNewsItem(user.LastPlayedItem) returns undefined.'
            )
        }

        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective(
                'REPLACE_ALL',
                newsItem.AudioURL,
                `ITEM:${newsItem.Id}`,
                0,
                undefined,
                generateAudioMetadata(newsItem)
            )
            .getResponse()
    },
}
