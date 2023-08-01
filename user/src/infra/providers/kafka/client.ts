import { Kafka } from "kafkajs";

export const kafkaInstance = new Kafka({
    brokers: [process.env.KAFKA_BROKERS],
    clientId: "USER_APP"
})