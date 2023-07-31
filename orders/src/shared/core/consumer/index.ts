import { container } from 'tsyringe'
import { createCustomerConsumer } from './createCustomer.consumer'

const consumer = async () => {
    await container.resolve(createCustomerConsumer).execute()
}

consumer()