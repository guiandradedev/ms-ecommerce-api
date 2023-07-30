import 'dotenv/config'
import { describe, it, expect } from 'vitest'
import 'reflect-metadata'
import { InMemoryUserRepository } from '@/modules/repositories/inMemory/InMemoryUserRepository'
import { CreateUserUseCase } from './createUserUseCase'
import { User } from '@/modules/domain'
import { ErrAlreadyExists, ErrInvalidParam } from '@/shared/errors'

describe('Create User', () => {

    const makeSut = async () => {
        const userRepository = new InMemoryUserRepository()
        const sut = new CreateUserUseCase(userRepository)

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

    it('should not create another user', async () => {
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

})