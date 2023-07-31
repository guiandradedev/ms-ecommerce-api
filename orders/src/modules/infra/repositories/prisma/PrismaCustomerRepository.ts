import { prismaClient } from "@/shared/core/database/prisma";
import { Address, Customer } from "@/modules/domain";
import { ICustomerRepository } from "@/modules/repositories/ICustomerRepository";

export class PrismaCustomerRepository implements ICustomerRepository {

    async create(data: Customer): Promise<void> {
        const {address, ...rest} = data.props

        await prismaClient.customer.create({ data: { ...rest, id: data.id } })
        if(address) await this.createAddress(address)
    }

    async createAddress(data: Address | Address[]): Promise<void> {
        if (Array.isArray(data)) {
            for (const address of data) {
                await prismaClient.address.create({ data: { ...address.props, id: address.id } })
            }
        } else {
            await prismaClient.address.create({ data: { ...data.props, id: data.id } })
        }
    }
}