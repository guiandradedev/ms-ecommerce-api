import { injectable, inject } from "tsyringe";
import { IMessageBrokerAdapter } from "@/shared/adapters/MessageBrokerAdapter";
import { Address, FromSharedDomains } from "@/modules/domain/address";
import { ICustomerRepository } from "@/modules/repositories/ICustomerRepository";

type CreateAddress = {
    id: string,
    city: string,
    street: string,
    country: string,
    state: string,
    number: number,
    zipcode: string,
    from: FromSharedDomains,
    ownerId: string,
    createdAt: Date
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
            topic: 'CUSTOMER_ADDRESS_CREATED', groupId: "ORDER_CUSTOMER_ADDRESS_CREATED", eachMessage: async ({ message }) => {
                const messageToString = message.value!.toString()
                const data = JSON.parse(messageToString) as CreateAddress
                console.log(data)
                // const address = Address.create({externalId: data.id, ...data})

                // console.log(address)

                // await this.consumerRepository.createAddress(address)
            }
        })
    }
}
