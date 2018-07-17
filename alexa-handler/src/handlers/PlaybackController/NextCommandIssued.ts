import * as ASK from 'ask-sdk-core'
import log from '../../log'

export const NextCommandIssuedHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'PlaybackController.NextCommandIssued'
    },
    async handle(handlerInput) {
        log('---', 'NextCommandIssued')

        const {
            getUser,
            putUser,
            getNextNewsItem,
            generateAudioMetadata,
            getRemainingNewsNumber,
        } = handlerInput.attributesManager.getRequestAttributes() as IRequestAttributes

        const user = await getUser()

        if (!user) {
            throw new Error('"user" is undefined')
        }

        // Get currently playing news item
        let nextNewsItem = await getNextNewsItem(user.LastPlayedItem)

        if (!nextNewsItem) {
            throw new Error(`"nextNewsItem" (currently playing) is undefined`)
        }

        user.LastPlayedItem = nextNewsItem.Id
        user.LastAccess = new Date().toISOString()
        await putUser(user)

        // Get next news item
        nextNewsItem = await getNextNewsItem(nextNewsItem.Id)

        if (!nextNewsItem) {
            return handlerInput.responseBuilder.getResponse()
        }

        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective(
                'REPLACE_ALL',
                nextNewsItem.AudioURL,
                `ITEM:${nextNewsItem.Id}`,
                0,
                undefined,
                generateAudioMetadata(nextNewsItem, await getRemainingNewsNumber(nextNewsItem))
            )
            .getResponse()
    },
}
