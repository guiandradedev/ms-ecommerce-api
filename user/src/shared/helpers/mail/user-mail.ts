export type AuthMailRequest = {
    to: string,
    code: string | number,
    expiresIn: Date
}

export type TypePasswordResetConfirmationMail = {
    to: string
}

export interface MailHelperResponse {
    from: string,
    to: string,
    subject: string,
    body: string,
    text: string
    host: string,
    port: number,
    auth: {
        user: string,
        password: string
    }
}


export interface IUserMail {
    authMail(_options: AuthMailRequest): MailHelperResponse;
    resetPasswordMail({ to, code }: AuthMailRequest): MailHelperResponse
    passwordResetConfirmationMail({ to }: TypePasswordResetConfirmationMail): MailHelperResponse
}