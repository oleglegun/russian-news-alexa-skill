class NoFreshNewsError extends Error {
    constructor() {
        super()
        this.name = 'No Fresh News Found'
    }
}

module.exports = { NoFreshNewsError }
