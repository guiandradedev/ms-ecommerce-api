import { container } from "tsyringe";

import { IAuthTokenRepository, ICodeRepository, IUserRepository } from "@/modules/repositories";

import { PrismaAuthTokenRepository } from "@/modules/infra/repositories/prisma/PrismaAuthTokenRepository";
import { PrismaCodeRepository } from "@/modules/infra/repositories/prisma/PrismaCodeRepository";
import { PrismaUserRepository } from "@/modules/infra/repositories/prisma/PrismaUserRepository";

import { BcryptHashAdapter, IHashAdapter } from "@/modules/adapters/HashAdapter";
import { IMailAdapter, NodemailerMailAdapter } from "@/shared/adapters/MailAdapter";
import { IMessageBrokerAdapter, KafkaAdapter } from "@/shared/adapters/MessageBrokerAdapter";

container.registerSingleton<IUserRepository>(
    "UserRepository",
    PrismaUserRepository
)

container.registerInstance<IHashAdapter>(
    "HashAdapter",
    new BcryptHashAdapter(12)
)

container.registerSingleton<IMessageBrokerAdapter>(
    "MessageBrokerAdapter",
    KafkaAdapter
)

container.registerSingleton<ICodeRepository>(
    "CodeRepository",
    PrismaCodeRepository
)

container.registerSingleton<IAuthTokenRepository>(
    "AuthTokenRepository",
    PrismaAuthTokenRepository
)


container.registerInstance<IMailAdapter>(
    "MailAdapter",
    new NodemailerMailAdapter()
)