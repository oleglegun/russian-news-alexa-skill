import * as ASK from 'ask-sdk'

export const PlayNewsIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'PlayNewsIntent'
        )
    },
    async handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const user = await requestAttributes.getUser()
        let item

        if (user && user.LastPlayedItem) {
            // recurring user
            item = await requestAttributes.getNextNewsItem(user.LastPlayedItem)

            if (!item) {
                return handlerInput.responseBuilder.speak('No fresh news.').getResponse()
            }

            return handlerInput.responseBuilder
                .addAudioPlayerPlayDirective('REPLACE_ALL', item.AudioURL, `ITEM:${item.Id}`, 0)
                .getResponse()
        }

        // new user
        item = await requestAttributes.getNextNewsItem('')

        if (!item) {
            throw new Error('getNextNewsItem() returned "undefined" for the new user')
        }

        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective('REPLACE_ALL', item.AudioURL, `ITEM:${item.Id}`, 0)
            .getResponse()
    },
}
