import * as ASK from 'ask-sdk-core'
import speech from '../../speech'
import log from '../../log'

export const HelpIntentHandler: ASK.RequestHandler = {
    canHandle(handlerInput) {
        return (
            handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
        )
    },
    handle(handlerInput) {
        log('---', 'HelpIntent')

        return handlerInput.responseBuilder
            .speak(speech.help + `I've sent all the information to you Alexa app.`)
            .withStandardCard(
                'Russian News Help',
                speech.help,
                'https://russian-news.s3.amazonaws.com/russian-news-help.png'
            )
            .getResponse()
    },
}
