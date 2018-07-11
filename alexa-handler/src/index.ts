import * as ASK from 'ask-sdk'
import { CancelIntentHandler } from './handlers/Amazon/CancelIntent'
import { FallbackIntentHandler } from './handlers/Amazon/FallbackIntent'
import { HelpIntentHandler } from './handlers/Amazon/HelpIntent'
import { PauseIntentHandler } from './handlers/Amazon/PauseIntent'
import { ResumeIntentHandler } from './handlers/Amazon/ResumeIntent'
import { StopIntentHandler } from './handlers/Amazon/StopIntent'
import { ErrorHandler } from './handlers/Error'
import { LaunchRequestHandler } from './handlers/LaunchRequest'
import { PlayNewsIntentHandler } from './handlers/PlayNewsIntent'
import { SessionEndedRequestHandler } from './handlers/SessionEndedRequest'
import { Logger } from './interceptors/Logger'
import { RequestAttributesInjector } from './interceptors/RequestAttributesInjector'

export const handler = ASK.SkillBuilders.standard()
    .addRequestHandlers(
        LaunchRequestHandler,
        StopIntentHandler,
        PauseIntentHandler,
        ResumeIntentHandler,
        CancelIntentHandler,
        FallbackIntentHandler,
        HelpIntentHandler,
        PlayNewsIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(RequestAttributesInjector)
    .addResponseInterceptors(Logger)
    .lambda()
