import { PrismaCustomerRepository } from "@/modules/infra/repositories/prisma/PrismaCustomerRepository";
import { ICustomerRepository } from "@/modules/repositories/ICustomerRepository";
import { IMessageBrokerAdapter, KafkaAdapter } from "@/shared/adapters/MessageBrokerAdapter";
import { container } from "tsyringe";

//Repositories
container.registerSingleton<ICustomerRepository>(
    "CustomerRepository",
    PrismaCustomerRepository
)

container.registerSingleton<IMessageBrokerAdapter>(
    "MessageBrokerAdapter",
    KafkaAdapter
)