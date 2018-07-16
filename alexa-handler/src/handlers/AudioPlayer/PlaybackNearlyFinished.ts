import * as ASK from 'ask-sdk-core'
import log from '../../log'

export const PlaybackNearlyFinishedHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackNearlyFinished'
    },
    async handle(handlerInput) {
        log('---', 'PlaybackNearlyFinished')

        const {
            getNextNewsItem,
            extractToken,
            generateAudioMetadata,
        } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const { type, id } = extractToken()

        switch (type) {
            case 'ITEM':
            case 'GREETING':
                // return next item
                const nextNewsItem = await getNextNewsItem(id)

                if (!nextNewsItem) {
                    // send audio "Farewell"

                    return handlerInput.responseBuilder
                        .addAudioPlayerPlayDirective(
                            'ENQUEUE',
                            'https://russian-news.s3.amazonaws.com/effects/end-sound.mp3',
                            `FAREWELL:`,
                            0,
                            `${type}:${id}`,
                            {
                                title: 'Новостей больше нет',
                                art: {
                                    sources: [
                                        {
                                            url:
                                                'https://russian-news.s3.amazonaws.com/russian-news-logo-big.png',
                                        },
                                    ],
                                },
                            }
                        )
                        .getResponse()
                }

                return handlerInput.responseBuilder
                    .addAudioPlayerPlayDirective(
                        'ENQUEUE',
                        nextNewsItem.AudioURL,
                        `${type}:${nextNewsItem.Id}`,
                        0,
                        `${type}:${id}`,
                        generateAudioMetadata(nextNewsItem)
                    )
                    .getResponse()

            case 'FAREWELL':
            default:
                return handlerInput.responseBuilder.getResponse()
        }
    },
}
