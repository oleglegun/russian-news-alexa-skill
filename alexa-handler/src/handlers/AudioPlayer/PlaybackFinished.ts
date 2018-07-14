import * as ASK from 'ask-sdk-core'

export const PlaybackFinishedHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackFinished'
    },
    async handle(handlerInput) {
        const {
            extractToken,
            getUser,
            putUser,
        } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const { type, id } = extractToken()

        switch (type) {
            case 'ITEM':
                const user = await getUser()

                if (!user) {
                    throw new Error('User not found.')
                }

                user.LastPlayedItem = id
                user.ItemsConsumed++

                await putUser(user)

            default:
                return handlerInput.responseBuilder.getResponse()
        }
    },
}
