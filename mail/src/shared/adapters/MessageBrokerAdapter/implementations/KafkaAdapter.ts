import { kafkaInstance } from "@/infra/providers/kafka/client";
import { IMessageBrokerAdapter, IMessageBrokerConsumeRequest } from "../IMessageBrokerAdapter";
import { Consumer, Kafka } from "kafkajs";

export class KafkaAdapter implements IMessageBrokerAdapter {
    private readonly kafka: Kafka = null
    constructor() {
        this.kafka = kafkaInstance
    }

    private async consumer(topic: string, groupId: string): Promise<Consumer> {
        const consumer = this.kafka.consumer({ groupId })
        await consumer.connect().then(() => console.log(`${topic} is online`))

        await consumer.subscribe({ topic, fromBeginning: true })

        return consumer
    }

    async sendMessage(topic: string, payload: any): Promise<void> {
        const producer = this.kafka.producer({
            allowAutoTopicCreation: true,
        })

        await producer.connect()
        console.log(`Message sent to topic ${topic}`)
        await producer.send({
            topic,
            messages: [
                { value: JSON.stringify(payload) }
            ]
        })

        await producer.disconnect()
    }

    async consume({ topic, eachMessage, groupId }: IMessageBrokerConsumeRequest): Promise<void> {
        const consumer = await this.consumer(topic, groupId)
        await consumer.run({
            eachMessage
        })
    }
}