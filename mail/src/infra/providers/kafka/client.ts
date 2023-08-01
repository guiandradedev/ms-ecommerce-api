import { Kafka } from "kafkajs";

export const kafkaInstance = new Kafka({
    brokers: [process.env.KAFKA_BROKERS],
    clientId: "MAIL_APP"
    // sasl: {
    //     mechanism: 'scram-sha-256',
    //     username: process.env.KAFKA_USERNAME,
    //     password: process.env.KAFKA_PASSWORD
    // },
    // ssl: true,
})