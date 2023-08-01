import { authMail } from "./mails";
import { AuthMailRequest, TypePasswordResetConfirmationMail, IUserMail, MailHelperResponse } from "./user-mail";


export class SendUserMail implements IUserMail {
    constructor(
    ) { }

    authMail({ to, code, expiresIn }: AuthMailRequest): MailHelperResponse {
        return {
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            auth: {
                user: process.env.MAIL_USER,
                password: process.env.MAIL_PASSWORD
            },
            body: `<h1>Your access code is ready!</h1><p>Insert the code <b>${code}</b> and enjoy!</p><p>Your code expires in ${expiresIn}</p>`,
            from: authMail,
            subject: "Authentication Code",
            text: `Your access code is ${code} and it's expires in ${expiresIn}!`,
            to
        }
    }

    resetPasswordMail({ to, code }: AuthMailRequest): MailHelperResponse {
        return {
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            auth: {
                user: process.env.MAIL_USER,
                password: process.env.MAIL_PASSWORD
            },
            body: `<h1>Your reset password code is ready!</h1><p>Insert the code <b>${code}</b> and enjoy!</p>`,
            from: authMail,
            subject: "Reset Password Code",
            text: `Your reset password code is ${code}`,
            to
        }
    }

    passwordResetConfirmationMail({ to }: TypePasswordResetConfirmationMail): MailHelperResponse {
        return {
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            auth: {
                user: process.env.MAIL_USER,
                password: process.env.MAIL_PASSWORD
            },
            body: `<h1>Your password has changed!</h1><h2>if you did not make this change, contact us at (19) 99999999</h2>`,
            from: authMail,
            subject: "Reset Password",
            text: `Your password changed!`,
            to
        }

    }
}