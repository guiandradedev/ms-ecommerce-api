import { IHashAdapter, InMemoryHashAdapter } from "@/modules/adapters/HashAdapter";
import { ICodeRepository, IUserRepository } from "@/modules/repositories";
import { InMemoryCodeRepository } from "@/modules/repositories/inMemory/InMemoryCodeRepository";
import { InMemoryUserRepository } from "@/modules/repositories/inMemory/InMemoryUserRepository";
import { IMailAdapter, NodemailerMailAdapter } from "@/shared/adapters/MailAdapter";
import { IMessageBrokerAdapter, KafkaAdapter } from "@/shared/adapters/MessageBrokerAdapter";
import { container } from "tsyringe";

//Repositories
container.registerSingleton<IUserRepository>(
    "UserRepository",
    InMemoryUserRepository
)

container.registerInstance<IHashAdapter>(
    "HashAdapter",
    new InMemoryHashAdapter()
)

container.registerSingleton<IMessageBrokerAdapter>(
    "MessageBrokerAdapter",
    KafkaAdapter
)

container.registerSingleton<ICodeRepository>(
    "CodeRepository",
    InMemoryCodeRepository
)

container.registerInstance<IMailAdapter>(
    "MailAdapter",
    new NodemailerMailAdapter()
)