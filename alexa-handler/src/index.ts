import * as ASK from 'ask-sdk'
import handlers from './handlers'
import { ErrorHandler } from './handlers/Error'

export const handler = ASK.SkillBuilders.standard()
    .addRequestHandlers(...handlers)
    .addErrorHandlers(ErrorHandler)
    .lambda()
