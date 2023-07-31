import { prismaClient } from "@/infra/database/prisma";
import { AuthToken } from "@/modules/domain";
import { IAuthTokenRepository } from "@/modules/repositories";


export class PrismaAuthTokenRepository implements IAuthTokenRepository {
    async create(data: AuthToken): Promise<void> {
        await prismaClient.authToken.create({ data: { ...data.props, id: data.id } })
    }
}