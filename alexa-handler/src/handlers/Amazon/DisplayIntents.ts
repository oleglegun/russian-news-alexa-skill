import * as ASK from 'ask-sdk-core'
import log from '../../log'

export const DisplayIntentsHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        const intentNames = [
            'AMAZON.MoreIntent',
            'AMAZON.NavigateHomeIntent',
            'AMAZON.NavigateSettingsIntent',
            'AMAZON.NextIntent',
            'AMAZON.PageUpIntent',
            'AMAZON.PageDownIntent',
            'AMAZON.PreviousIntent',
            'AMAZON.ScrollRightIntent',
            'AMAZON.ScrollDownIntent',
            'AMAZON.ScrollLeftIntent',
            'AMAZON.ScrollUpIntent',
        ]
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            intentNames.indexOf(handlerInput.requestEnvelope.request.intent.name) !== -1
        )
    },
    async handle(handlerInput) {
        log('---', 'DisplayIntent')

        return handlerInput.responseBuilder.getResponse()
    },
}
