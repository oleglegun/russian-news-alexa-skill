import * as ASK from 'ask-sdk-core'
import log from '../../log'

export const StartOverIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StartOverIntent'
        )
    },
    async handle(handlerInput) {
        log('---', 'StartOverIntent')

        const {
            getNews,
            getUser,
            putUser,
            generateAudioMetadata,
        } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const news = await getNews()

        const user = await getUser()

        if (!user) {
            return handlerInput.responseBuilder.getResponse()
        }

        const newsItem = news[0]

        user.LastPlayedItem = 'no-item'
        user.LastAccess = new Date().toISOString()

        await putUser(user)

        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective(
                'REPLACE_ALL',
                newsItem.AudioURL,
                `ITEM:${newsItem.Id}`,
                0,
                undefined,
                generateAudioMetadata(newsItem)
            )
            .withStandardCard(newsItem.Title, '', newsItem.ImageURL)
            .getResponse()
    },
}
