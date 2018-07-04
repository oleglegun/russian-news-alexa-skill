export class UnsetEnvironmentVariableError extends Error {
    constructor(variableName: string) {
        super(`Environment variable "${variableName}" is not set.`)
        this.name = this.constructor.name
    }
}
