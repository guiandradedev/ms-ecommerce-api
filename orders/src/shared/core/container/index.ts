import { ICustomerRepository } from "@/modules/repositories/ICustomerRepository";
import { InMemoryCustomerRepository } from "@/modules/repositories/inMemory/InMemoryCustomerRepository";
import { IMessageBrokerAdapter, KafkaAdapter } from "@/shared/adapters/MessageBrokerAdapter";
import { container } from "tsyringe";

//Repositories
container.registerSingleton<ICustomerRepository>(
    "CustomerRepository",
    InMemoryCustomerRepository
)

container.registerSingleton<IMessageBrokerAdapter>(
    "MessageBrokerAdapter",
    KafkaAdapter
)