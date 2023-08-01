import { IMailRepository, ITagRepository, IUserRepository } from "@/modules/repositories";
import { InMemoryMailRepository, InMemoryTagRepository, InMemoryUserRepository } from "@/modules/repositories/inMemory";
import { IMailAdapter, NodemailerMailAdapter } from "@/shared/adapters/MailAdapter";
import { IMessageBrokerAdapter, KafkaAdapter } from "@/shared/adapters/MessageBrokerAdapter";
import { container } from "tsyringe";

container.registerSingleton<IUserRepository>(
    "UserRepository",
    InMemoryUserRepository
)

container.registerSingleton<ITagRepository>(
    "UserRepository",
    InMemoryTagRepository
)

container.registerSingleton<IMailRepository>(
    "UserRepository",
    InMemoryMailRepository
)

container.registerSingleton<IMessageBrokerAdapter>(
    "MessageBrokerAdapter",
    KafkaAdapter
)

container.registerInstance<IMailAdapter>(
    "MailAdapter",
    new NodemailerMailAdapter()
)