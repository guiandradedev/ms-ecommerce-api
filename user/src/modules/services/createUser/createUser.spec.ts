import 'dotenv/config'
import { describe, it, expect } from 'vitest'
import 'reflect-metadata'
import { InMemoryUserRepository } from '@/modules/repositories/inMemory/InMemoryUserRepository'
import { CreateUserUseCase } from './createUserUseCase'
import { User } from '@/modules/domain'
import { ErrAlreadyExists, ErrInvalidParam } from '@/shared/errors'
import { InMemoryHashAdapter } from '@/modules/adapters/HashAdapter'
import { InMemoryCodeRepository } from '@/modules/repositories/inMemory/InMemoryCodeRepository'
import { InMemoryMessageBrokerAdapter } from '@/shared/adapters/MessageBrokerAdapter'

describe('Create User', () => {

    const makeSut = async () => {
        const userRepository = new InMemoryUserRepository()
        const codeRepository = new InMemoryCodeRepository()
        const hashAdapter = new InMemoryHashAdapter()
        const messageBrokerAdapter = new InMemoryMessageBrokerAdapter()
        const sut = new CreateUserUseCase(userRepository, codeRepository, hashAdapter, messageBrokerAdapter)

        return { userRepository, sut }
    }

    it('should create an user', async () => {
        const { sut } = await makeSut()

        const user = await sut.execute({
            name: "valid name",
            email: "valid_email@mail.com",
            cpf: "valid_cpf",
            password: "teste123"
        })

        expect(user).toBeInstanceOf(User)
    })

    it('should not create another user (email)', async () => {
        const { sut } = await makeSut()

        await sut.execute({
            name: "valid name",
            email: "valid_email@mail.com",
            cpf: "valid_cpf",
            password: "teste123"
        })

        const user = sut.execute({
            name: "valid name",
            email: "valid_email@mail.com",
            cpf: "valid_cpf",
            password: "teste123"
        })

        expect(user).rejects.toBeInstanceOf(ErrAlreadyExists)
    })

    it('should not create another user (cpf)', async () => {
        const { sut } = await makeSut()

        await sut.execute({
            name: "valid name",
            email: "valid_email@mail.com",
            cpf: "valid_cpf",
            password: "teste123"
        })

        const user = sut.execute({
            name: "valid name",
            email: "valid_email2@mail.com",
            cpf: "valid_cpf",
            password: "teste123"
        })
        expect(user).rejects.toBeInstanceOf(ErrAlreadyExists)
    })
})