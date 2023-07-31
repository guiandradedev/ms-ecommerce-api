export interface ResponseAdapter {
    id: string,
    attributes: any,
    links: {
        self: string
    },
    token?: {
        access_token: string,
        refresh_token: string
    }
}