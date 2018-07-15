import { DEBUG } from './env'

export default function log(...items: string[]) {
    if (DEBUG) {
        console.log(...items)
    }
}
