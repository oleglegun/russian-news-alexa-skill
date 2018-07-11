import * as ASK from 'ask-sdk'

export const PlaybackNearlyFinishedHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackNearlyFinished'
    },
    async handle(handlerInput) {
        const {
            getNextNewsItem,
            extractToken,
        } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const { type, id } = extractToken()

        switch (type) {
            case 'ITEM':
            case 'GREETING':
                // return next item
                const nextNewsItem = await getNextNewsItem(id)

                if (!nextNewsItem) {
                    // send audio "Farewell"
                    return handlerInput.responseBuilder.getResponse()
                }

                return handlerInput.responseBuilder
                    .addAudioPlayerPlayDirective(
                        'ENQUEUE',
                        nextNewsItem.AudioURL,
                        `${type}:${nextNewsItem.Id}`,
                        0,
                        `${type}:${id}`
                    )
                    .getResponse()

            case 'FAREWELL':
            default:
                return handlerInput.responseBuilder.getResponse()
        }
    },
}
