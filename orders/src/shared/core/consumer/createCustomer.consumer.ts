import { IMessageBrokerAdapter, KafkaAdapter } from "@/shared/adapters/MessageBrokerAdapter";
import { prismaClient } from "../database/prisma";
import { ICustomerRepository } from "@/modules/repositories/ICustomerRepository";
import { InMemoryCustomerRepository } from "@/modules/repositories/inMemory/InMemoryCustomerRepository";
import { injectable, inject } from "tsyringe";

type CustomerConsumer = {
    email: string,
    id: string
}

@injectable()
export class createCustomerConsumer {
    constructor(
        @inject('MessageBrokerAdapter')
        private readonly messageBrokerAdapter: IMessageBrokerAdapter,
        @inject('CustomerRepository')
        private readonly consumerRepository: ICustomerRepository
    ) {}

    async execute() {
        await this.messageBrokerAdapter.consume({topic: 'CUSTOMER_CREATED', eachMessage: async ({message}) => {
            const messageToString = message.value!.toString()
            const data = JSON.parse(messageToString) as CustomerConsumer
            
            // await this.consumerRepository
        }})
    }
}