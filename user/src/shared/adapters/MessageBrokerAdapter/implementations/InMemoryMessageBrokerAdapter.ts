import { IMessageBrokerAdapter, IMessageBrokerConsumeRequest } from "../IMessageBrokerAdapter";

export class InMemoryMessageBrokerAdapter implements IMessageBrokerAdapter {
    constructor() {    }

    async sendMessage(topic: string, payload: any): Promise<void> {
        
    }

    async consume({topic, eachMessage}: IMessageBrokerConsumeRequest): Promise<void> {
        
    }
}