export type IMessageBrokerConsumeRequest = {
    topic: string;
    groupId: string;
    eachMessage: (data: any)=>Promise<void>;
}

export interface IMessageBrokerAdapter {
    sendMessage(topic: string, payload: any): Promise<void>
    consume(data: IMessageBrokerConsumeRequest): Promise<void>
}