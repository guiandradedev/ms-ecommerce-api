export interface SendMailRequest {
    from: string,
    subject: string,
    body: string,
    text: string,
    userMails?: string[], //mail
    tags?: string[] //tags id
}