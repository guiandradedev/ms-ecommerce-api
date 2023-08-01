import { Mail, User } from "@/modules/domain";
import { SendMailRequest } from "@/modules/protocols";
import { IMailRepository, ITagRepository, IUserRepository } from "@/modules/repositories/";
import { CreateMailConnectionRequest, SendMailRequest as MailRequest, IMailAdapter } from "@/shared/adapters/MailAdapter";
import { ErrInvalidParam } from "@/shared/errors";

export class SendMailUseCase {
    constructor(
        private readonly mailRepository: IMailRepository,
        private readonly mailAdapter: IMailAdapter,
        private readonly userRepository: IUserRepository,
        private readonly tagRepository: ITagRepository
    ) { }

    /*
     * In MVP, I will accept only one mail
     */

    async execute({ body, from, subject, text, tags, userMails }: SendMailRequest): Promise<Mail> {

        const validateMail = User.validateMail(userMails)
        if(!validateMail) throw new ErrInvalidParam('userMails')

        const mail = Mail.create({ body, from, subject, text, tags, userMails })

        await this.mailRepository.create(mail)

        const mailOptions: MailRequest & CreateMailConnectionRequest = {
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            auth: {
                user: process.env.MAIL_USER,
                password: process.env.MAIL_PASSWORD
            },
            body,
            from,
            subject,
            text,
            to: userMails[0]
        }

        await this.mailAdapter.sendMail(mailOptions)

        return mail
    }
}