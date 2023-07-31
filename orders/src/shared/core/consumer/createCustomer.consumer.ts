import { IMessageBrokerAdapter } from "@/shared/adapters/MessageBrokerAdapter";
import { injectable, inject } from "tsyringe";
import { Customer } from "@/modules/domain";
import { ICustomerRepository } from "@/modules/repositories/ICustomerRepository";

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
        @inject('CustomerRepository')
        private readonly consumerRepository: ICustomerRepository
    ) { }

    async execute() {
        await this.messageBrokerAdapter.consume({
            topic: 'CUSTOMER_CREATED', eachMessage: async ({ message }) => {
                const messageToString = message.value!.toString()
                const data = JSON.parse(messageToString) as CreateCustomerRequest
                
                const customer = Customer.create({
                    email: data.email,
                    externalId: data.id,
                    role: data.role,
                })

                console.log(customer)

                await this.consumerRepository.create(customer)
            }
        })
    }
}