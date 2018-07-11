interface INewsItemDDB {
    Id: string
    Title: string
    SourceURL: string
    AudioURL: string
    ImageURL: string
}

interface IUserDDB {
    FirstAccess: string
    LastAccess: string
    LastPlayedItem?: string
    DaysActive: number
    ItemsConsumed: number
    Devices: string[]
}

type IGetUserAttributes = (id: string) => Promise<IUserDDB | undefined>

interface IRequestAttributes {
    getNews(): Promise<INewsItemDDB[]>
    getNextNewsItem(currentNewsId: string): Promise<INewsItemDDB | undefined>
    getUser(): Promise<IUserDDB | undefined>
    putUser(attributes: IUserDDB): Promise<void>
    createNewUser(): IUserDDB
}
