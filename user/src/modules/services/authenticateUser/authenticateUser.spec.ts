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

describe('Authentication', async () => {
    const makeSup = () => {
        const userRepository = new InMemoryUserRepository()
        const codeRepository = new InMemoryCodeRepository()
        const hashAdapter = new InMemoryHashAdapter()
        const messageBrokerAdapter = new InMemoryMessageBrokerAdapter()
        const userAdapter = new CreateUserUseCase(userRepository, codeRepository, hashAdapter, messageBrokerAdapter)
        const sut = new AuthenticateUserUseCase(userRepository, hashAdapter)

        return { sut, userAdapter }
    }
    it('Authenticate User', async () => {
        const { userAdapter, sut } = makeSup();

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

    it('should throw an error if user is not active', async () => {
        const { userAdapter, sut } = makeSup();

        await userAdapter.execute({
            email: "flaamer@gmail.com",
            name: "flaamer",
            password: "teste123",
            cpf: "736.754.940-55"
        })

        const user = sut.execute({
            email: "flaamer@gmail.com",
            password: "teste123"
        })

        expect(user).rejects.toBeInstanceOf(ErrNotActive)
    })

    it('Should throw an error if user does not exists', async () => {
        const { sut } = makeSup()

        const dataObj = {
            email: "fake_email@email.com",
            password: "fake_password"
        }

        expect(async () => await sut.execute(dataObj)).not.toBeInstanceOf(User)
        expect(async () => await sut.execute(dataObj)).rejects.toBeInstanceOf(ErrInvalidParam)
    })

    it('Should throw an error if password != user.password', async () => {
        const { sut, userAdapter } = makeSup()

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

    // it('should return an access and refresh token', async () => {
    //     const { userAdapter, sut } = makeSup();

    //     await userAdapter.execute({
    //         email: "flaamer@gmail.com",
    //         name: "flaamer",
    //         password: "teste123",
    //         active: true,
    //         cpf: "736.754.940-55"
    //     })

    //     const user = await sut.execute({
    //         email: "flaamer@gmail.com",
    //         password: "teste123"
    //     })

    //     expect(user.token).toMatchObject<UserTokenResponse>({
    //         accessToken: expect.any(String),
    //         refreshToken: expect.any(String)
    //     })
    // })

    // it('should return an access and refresh token VALIDS', async () => {
    //     const { userAdapter, sut, securityAdapter } = makeSup();

    //     await userAdapter.execute({
    //         email: "flaamer@gmail.com",
    //         name: "flaamer",
    //         password: "teste123",
    //         active: true,
    //         cpf: "736.754.940-55"
    //     })

    //     const user = await sut.execute({
    //         email: "flaamer@gmail.com",
    //         password: "teste123"
    //     })

    //     const verifyAccess = securityAdapter.decrypt(user.token.accessToken, process.env.ACCESS_TOKEN)

    //     expect(verifyAccess).toMatchObject<SecurityDecryptResponse>({
    //         expiresIn: expect.any(Date),
    //         issuedAt: expect.any(Date),
    //         subject: user.id
    //     })
    //     expect(verifyAccess.issuedAt.getTime()).toBeGreaterThanOrEqual(Date.now() - 100);
    //     expect(verifyAccess.expiresIn.getTime()).toBeLessThanOrEqual(Date.now() + Number(process.env.EXPIRES_IN_TOKEN));

    //     const verifyRefresh = securityAdapter.decrypt(user.token.refreshToken, process.env.REFRESH_TOKEN)
    //     expect(verifyRefresh).toMatchObject<SecurityDecryptResponse>({
    //         expiresIn: expect.any(Date),
    //         issuedAt: expect.any(Date),
    //         subject: user.id
    //     })
    //     expect(verifyAccess.issuedAt.getTime()).toBeGreaterThanOrEqual(Date.now() - 100);
    //     expect(verifyAccess.expiresIn.getTime()).toBeLessThanOrEqual(Date.now() + Number(process.env.EXPIRES_IN_TOKEN));
    // })

})