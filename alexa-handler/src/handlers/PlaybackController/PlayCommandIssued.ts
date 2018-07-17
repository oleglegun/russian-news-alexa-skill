import * as ASK from 'ask-sdk-core'
import log from '../../log'

export const PlayCommandIssuedHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'PlaybackController.PlayCommandIssued'
    },
    async handle(handlerInput) {
        log('---', 'PlayCommandIssued')

        const {
            getUser,
            generateAudioMetadata,
            getRemainingNewsNumber,
            getNextNewsItem,
        } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const user = await getUser()

        if (!user) {
            throw new Error(`"user" is undefined`)
        }

        const newsItem = await getNextNewsItem(user.LastPlayedItem)

        if (!newsItem) {
            return handlerInput.responseBuilder.getResponse()
        }

        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective(
                'REPLACE_ALL',
                newsItem.AudioURL,
                `ITEM:${newsItem.Id}`,
                0,
                undefined,
                generateAudioMetadata(newsItem, await getRemainingNewsNumber(newsItem))
            )
            .getResponse()
    },
}
