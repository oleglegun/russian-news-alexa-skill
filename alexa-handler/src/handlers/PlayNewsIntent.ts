import * as ASK from 'ask-sdk'

export const PlayNewsIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'PlayNewsIntent'
        )
    },
    async handle(handlerInput) {
        const {
            getUser,
            getNextNewsItem,
        } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const user = await getUser()
        let item

        const card = {}

        if (user && user.LastPlayedItem) {
            // recurring user
            item = await getNextNewsItem(user.LastPlayedItem)

            if (!item) {
                return handlerInput.responseBuilder.speak('No fresh news.').getResponse()
            }

            return handlerInput.responseBuilder
                .addAudioPlayerPlayDirective('REPLACE_ALL', item.AudioURL, `ITEM:${item.Id}`, 0)
                .withStandardCard(item.Title, '', item.ImageURL, item.ImageURL)
                .getResponse()
        }

        // new user
        item = await getNextNewsItem('')

        if (!item) {
            throw new Error('getNextNewsItem() returned "undefined" for the new user')
        }

        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective('REPLACE_ALL', item.AudioURL, `ITEM:${item.Id}`, 0)
            .withStandardCard(item.Title, item.SourceURL, item.ImageURL, item.ImageURL)
            .getResponse()
    },
}
