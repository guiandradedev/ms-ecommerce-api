import { InMemoryMailRepository, InMemoryTagRepository, InMemoryUserRepository } from '@/modules/repositories/inMemory'
import { InMemoryMailAdapter } from '@/shared/adapters/MailAdapter'
import { describe, expect, it } from 'vitest'
import { SendMailUseCase } from './sendMailUseCase'
import { Mail } from '@/modules/domain'
import { ErrInvalidParam } from '@/shared/errors'

describe('Send Mail', () => {
    const makeSut = async () => {
        const mailRepository = new InMemoryMailRepository()
        const mailAdapter = new InMemoryMailAdapter()
        const userRepository = new InMemoryUserRepository()
        const tagRepository = new InMemoryTagRepository()
        const sut = new SendMailUseCase(mailRepository, mailAdapter, userRepository, tagRepository)

        return {
            mailRepository,
            mailAdapter,
            userRepository,
            tagRepository,
            sut
        }
    }
    it('should send an email', async () => {
        const {sut} = await makeSut()

        const mail = await sut.execute({
            body: "",
            from: "",
            subject: "",
            text: "",
            userMails: ["teste@teste.com"]
        })

        console.log(mail)

        expect(mail).toBeInstanceOf(Mail)
    })

    it('should throw an error if email is invalid', async () => {
        const {sut} = await makeSut()

        const mail = sut.execute({
            body: "",
            from: "",
            subject: "",
            text: "",
            userMails: ['teste']
        })

        expect(mail).rejects.toBeInstanceOf(ErrInvalidParam)
    })

})