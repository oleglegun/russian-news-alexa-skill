import * as ASK from 'ask-sdk-core'
import log from '../../log'

export const PlaybackFinishedHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackFinished'
    },
    async handle(handlerInput) {
        log('---', 'PlaybackFinished')

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

                const deviceId = handlerInput.requestEnvelope.context.System.device.deviceId
                user.Devices[deviceId].ItemsConsumed++
                user.LastPlayedItem = id
                user.ItemsConsumed++

                await putUser(user)

            default:
                return handlerInput.responseBuilder.getResponse()
        }
    },
}
