import { User } from "@/modules/domain";
import { IUserRepository } from "@/modules/repositories";
import { IMessageBrokerAdapter } from "@/shared/adapters/MessageBrokerAdapter";
import { injectable, inject } from "tsyringe";

export type CreateCustomerRequest = {
    id: string,
    email: string,
    role: string
}

@injectable()
export class createCustomerConsumer {
    constructor(
        @inject('MessageBrokerAdapter')
        private readonly messageBrokerAdapter: IMessageBrokerAdapter,
        @inject('UserRepository')
        private readonly userRepository: IUserRepository
    ) { }

    async execute() {
        await this.messageBrokerAdapter.consume({
            topic: 'CUSTOMER_CREATED', groupId: 'MAIL_CUSTOMER_CREATED', eachMessage: async ({ message }) => {
                const messageToString = message.value!.toString()
                const data = JSON.parse(messageToString)
                console.log(data)
                
                // const user = User.create({
                //     email: data.email,
                //     externalId: data.id,
                //     role: data.role,
                // })

                // console.log(user)

                // await this.userRepository.create(user)
            }
        })
    }
}