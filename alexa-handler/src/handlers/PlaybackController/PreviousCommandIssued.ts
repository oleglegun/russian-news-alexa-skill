import * as ASK from 'ask-sdk-core'
import log from '../../log'

export const PreviousCommandIssuedHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'PlaybackController.PreviousCommandIssued'
        )
    },
    async handle(handlerInput) {
        log('---', 'PreviousCommandIssued')

        const {
            getPreviousNewsItem,
            getUser,
            putUser,
            getNewsItemById,
            generateAudioMetadata,
            getRemainingNewsNumber,
        } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const user = await getUser()

        if (!user) {
            throw new Error('PreviousIntentHandler: user is undefined.')
        }

        const id = user.LastPlayedItem
        const lastPlayedItem = await getNewsItemById(id)
        const beforeLastPlayedItem = await getPreviousNewsItem(id)

        if (!lastPlayedItem) {
            return handlerInput.responseBuilder.getResponse()
        }

        if (beforeLastPlayedItem) {
            user.LastPlayedItem = beforeLastPlayedItem.Id
        } else {
            // is the oldest news item => no before previous id
            user.LastPlayedItem = 'no-item'
        }

        user.LastAccess = new Date().toISOString()
        await putUser(user)

        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective(
                'REPLACE_ALL',
                lastPlayedItem.AudioURL,
                `ITEM:${lastPlayedItem.Id}`,
                0,
                undefined,
                generateAudioMetadata(lastPlayedItem, await getRemainingNewsNumber(lastPlayedItem))
            )
            .getResponse()
    },
}
