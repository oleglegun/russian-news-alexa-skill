import * as ASK from 'ask-sdk'

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
                // save progress
                const user = await getUser()

                if (!user) {
                    throw new Error('User not found.')
                }

                const updatedUser = {
                    ItemsConsumed: user.ItemsConsumed + 1,
                    LastAccess: new Date().toISOString(),
                    LastPlayedItem: id,
                } as IUserDDB

                await putUser(Object.assign(user, updatedUser))

            default:
                return handlerInput.responseBuilder.getResponse()
        }
    },
}
