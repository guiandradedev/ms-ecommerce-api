import 'reflect-metadata'
import 'dotenv/config'

import { describe, expect, it } from "vitest";
import { ErrNotActive, ErrInvalidParam } from '@/shared/errors';
import { InMemoryUserRepository } from '@/modules/repositories/inMemory/InMemoryUserRepository';
import { InMemoryCodeRepository } from '@/modules/repositories/inMemory/InMemoryCodeRepository';
import { InMemoryHashAdapter } from '@/modules/adapters/HashAdapter';
import { InMemoryMessageBrokerAdapter } from '@/shared/adapters/MessageBrokerAdapter';
import { CreateUserUseCase } from '../createUser/createUserUseCase';
import { AuthenticateUserUseCase } from './authenticateUserUseCase';
import { User } from '@/modules/domain';
import { InMemorySecurityAdapter } from '@/modules/adapters/SecurityAdapter/implementations/InMemorySecurityAdapter';
import { InMemoryAuthTokenRepository } from '@/modules/repositories/inMemory/InMemoryAuthTokenRepository';
import { UserTokenResponse } from '@/modules/protocols/authenticateUserDTO';
import { SecurityDecryptResponse } from '@/modules/adapters/SecurityAdapter/ISecurityAdapter';
import { JwtSecurityAdapter } from '@/modules/adapters/SecurityAdapter/implementations/JwtSecurityAdapter';

describe('Authentication', async () => {
    const makeSut = () => {
        const userRepository = new InMemoryUserRepository()
        const authTokenRepository = new InMemoryAuthTokenRepository()
        const codeRepository = new InMemoryCodeRepository()
        const hashAdapter = new InMemoryHashAdapter()
        const messageBrokerAdapter = new InMemoryMessageBrokerAdapter()
        // const securityAdapter = new JwtSecurityAdapter()
        const securityAdapter = new InMemorySecurityAdapter()
        const userAdapter = new CreateUserUseCase(userRepository, codeRepository, hashAdapter, messageBrokerAdapter)
        const sut = new AuthenticateUserUseCase(userRepository, authTokenRepository, hashAdapter, securityAdapter)

        return {
            userRepository,
            authTokenRepository,
            codeRepository,
            hashAdapter,
            messageBrokerAdapter,
            securityAdapter,
            userAdapter,
            sut
        }
    }
    it('Authenticate User', async () => {
        const { userAdapter, sut } = makeSut();

        await userAdapter.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123",
            active: true,
            cpf: "736.754.940-55"
        })

        const user = await sut.execute({
            email: "flaamer@gmail.com",
            password: "teste123"
        })

        expect(user).toBeInstanceOf(User)
    })

    // it('should throw an error if user is not active', async () => {
    //     const { userAdapter, sut } = makeSut();

    //     await userAdapter.execute({
    //         email: "flaamer@gmail.com",
    //         name: "flaamer",
    //         password: "teste123",
    //         cpf: "736.754.940-55"
    //     })

    //     const user = sut.execute({
    //         email: "flaamer@gmail.com",
    //         password: "teste123"
    //     })

    //     expect(user).rejects.toBeInstanceOf(ErrNotActive)
    // })

    it('Should throw an error if user does not exists', async () => {
        const { sut } = makeSut()

        const dataObj = {
            email: "fake_email@email.com",
            password: "fake_password"
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(User)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(ErrInvalidParam)
    })

    it('Should throw an error if password != user.password', async () => {
        const { sut, userAdapter } = makeSut()

        await userAdapter.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123",
            active: true,
            cpf: "736.754.940-55"
        })

        const dataObj = {
            email: "fake_email@email.com",
            password: "fake_password"
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(User)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(ErrInvalidParam)
    })

    it('should return an access and refresh token valids', async () => {
        const { userAdapter, sut, securityAdapter } = makeSut();

        await userAdapter.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123",
            active: true,
            cpf: "736.754.940-55"
        })

        const user = await sut.execute({
            email: "flaamer@gmail.com",
            password: "teste123"
        })

        expect(user.token).toMatchObject<UserTokenResponse>({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
        })

        const verifyAccess = await securityAdapter.decrypt(user.token.accessToken, process.env.ACCESS_TOKEN)

        expect(verifyAccess).toMatchObject<SecurityDecryptResponse>({
            expiresIn: expect.any(Date),
            issuedAt: expect.any(Date),
            subject: user.id,
            payload: {
                id: user.id,
                email: user.props.email,
                role: user.props.role
            }
        })
    })

})