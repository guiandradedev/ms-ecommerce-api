import { IMessageBrokerAdapter, IMessageBrokerConsumeRequest } from "../IMessageBrokerAdapter";
import { Consumer, EachMessageHandler, Kafka } from "kafkajs";

export class KafkaAdapter implements IMessageBrokerAdapter {
    private readonly kafka: Kafka = null
    constructor() {
        this.kafka = new Kafka({
            brokers: process.env.KAFKA_BROKERS,
            sasl: {
                mechanism: 'scram-sha-256',
                username: process.env.KAFKA_USERNAME,
                password: process.env.KAFKA_PASSWORD
            },
            ssl: true,
        })
    }

    private async consumer(topic: string): Promise<Consumer> {
        const consumer = this.kafka.consumer({ groupId: 'ORDER_APP' })
        await consumer.connect()

        await consumer.subscribe({ topic, fromBeginning: true })

        return consumer
    }

    async sendMessage(topic: string, payload: any): Promise<void> {
        const producer = this.kafka.producer({
            allowAutoTopicCreation: true,
        })

        await producer.connect()
        console.log(`Message sent to topic ${topic}`)
        console.log(payload)
        await producer.send({
            topic,
            messages: [
                { value: JSON.stringify(payload) }
            ]
        })

        await producer.disconnect()
    }

    async consume({topic, eachMessage}: IMessageBrokerConsumeRequest): Promise<void> {
        const consumer = await this.consumer(topic)
        await consumer.run({
            eachMessage
        })
    }
}