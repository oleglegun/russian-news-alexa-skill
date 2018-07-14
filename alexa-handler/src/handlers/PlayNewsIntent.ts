import * as ASK from 'ask-sdk-core'

export const PlayNewsIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'PlayNewsIntent'
        )
    },
    async handle(handlerInput) {
        const {
            generateAudioMetadata,
            getNextNewsItem,
            getUser,
        } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const user = await getUser()
        let item

        if (user) {
            // recurring user
            item = await getNextNewsItem(user.LastPlayedItem)

            if (!item) {
                return handlerInput.responseBuilder.speak('No fresh news.').getResponse()
            }

            return handlerInput.responseBuilder
                .addAudioPlayerPlayDirective(
                    'REPLACE_ALL',
                    item.AudioURL,
                    `ITEM:${item.Id}`,
                    0,
                    undefined,
                    generateAudioMetadata(item)
                )
                .withStandardCard(item.Title, '', item.ImageURL)
                .getResponse()
        }

        // new user
        item = await getNextNewsItem('')

        if (!item) {
            throw new Error('getNextNewsItem() returned "undefined" for the new user')
        }

        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective('REPLACE_ALL', item.AudioURL, `ITEM:${item.Id}`, 0)
            .withStandardCard(item.Title, '', item.ImageURL)
            .getResponse()
    },
}
