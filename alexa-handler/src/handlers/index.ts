import { CancelIntentHandler } from './Amazon/CancelIntent'
import { FallbackIntentHandler } from './Amazon/FallbackIntent'
import { HelpIntentHandler } from './Amazon/HelpIntent'
import { PauseIntentHandler } from './Amazon/PauseIntent'
import { ResumeIntentHandler } from './Amazon/ResumeIntent'
import { StopIntentHandler } from './Amazon/StopIntent'
import { LaunchRequestHandler } from './LaunchRequest'
import { SessionEndedRequestHandler } from './SessionEndedRequest'

export default [
    LaunchRequestHandler,
    StopIntentHandler,
    PauseIntentHandler,
    ResumeIntentHandler,
    CancelIntentHandler,
    FallbackIntentHandler,
    HelpIntentHandler,
    SessionEndedRequestHandler,
]
