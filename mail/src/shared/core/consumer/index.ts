import { container } from 'tsyringe'
import { createCustomerConsumer } from './createUser.consumer'
import { SendMailConsumer } from './sendMail.consumer'
import { kafkaInstance } from '@/shared/adapters/MessageBrokerAdapter'

const consumer = async () => {
    await container.resolve(createCustomerConsumer).execute()
    await container.resolve(SendMailConsumer).execute()

    // const topic = `SEND_MAIL`
    // const consumer = kafkaInstance.consumer({groupId:"a"})
    // await consumer.connect().then(() => console.log(`${topic} is online`))

    // await consumer.subscribe({ topic , fromBeginning: true })

    // await consumer.run({
    //     eachMessage: async (dataa) => {
    //         const {message} = dataa
    //         // console.log(dataa)
    //         const messageToString = message.value!.toString()
    //         const data = JSON.parse(messageToString)
    //         console.log(data)
    //     }
    // })

    // console.log('passou aqui')

    // const topic2 = `CUSTOMER_CREATED`
    // const consumer2 = kafkaInstance.consumer({groupId: "b"})
    // await consumer2.connect().then(() => console.log(`${topic} is online`))

    // await consumer2.subscribe({ topic: topic2, fromBeginning: true })

    // await consumer2.run({
    //     eachMessage: async ({ message }) => {
    //         const messageToString = message.value!.toString()
    //         const data = JSON.parse(messageToString)
    //         console.log(data)
    //     }
    // })
}

consumer()

