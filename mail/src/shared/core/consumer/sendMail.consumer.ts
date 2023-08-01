import { injectable, inject } from "tsyringe";
import { IMessageBrokerAdapter } from "@/shared/adapters/MessageBrokerAdapter";
import { CreateMailConnectionRequest, IMailAdapter, SendMailRequest } from "@/shared/adapters/MailAdapter";

type CreateAddress = {
    from: string,
    subject: string,
    body: string,
    text: string,
    userMails: string
}

@injectable()
export class SendMailConsumer {
    constructor(
        @inject('MessageBrokerAdapter')
        private readonly messageBrokerAdapter: IMessageBrokerAdapter,
        @inject('MailAdapter')
        private readonly mailAdapter: IMailAdapter
    ) { }

    async execute() {
        await this.messageBrokerAdapter.consume({
            topic: 'SEND_MAIL', groupId: 'MAIL_SEND_MAIL', eachMessage: async ({ message }) => {
                const messageToString = message.value!.toString()
                const data = JSON.parse(messageToString)
                console.log(data)
                
            }
        })
    }
}
