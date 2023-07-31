import { Code } from "@/modules/domain";
import { ActivateUserRequest } from "@/modules/protocols/activateUserDTO";
import { ICodeRepository, IUserRepository } from "@/modules/repositories";
import { GenerateUserCode } from "@/modules/utils/GenerateUserCode";
import { IMailAdapter } from "@/shared/adapters/MailAdapter";
import { IMessageBrokerAdapter } from "@/shared/adapters/MessageBrokerAdapter";
import { ErrAlreadyActive, ErrInvalidParam, ErrNotFound } from "@/shared/errors";
import { ErrExpired } from "@/shared/errors/ErrExpired";
import { SendUserMail } from "@/shared/helpers/mail";
import { inject, injectable } from "tsyringe";

@injectable()
export class ActivateUserUseCase {
    constructor(
        @inject('UserRepository')
        private userRepository: IUserRepository,

        @inject('CodeRepository')
        private codeRepository: ICodeRepository,

        @inject('MailAdapter')
        private mailAdapter: IMailAdapter,

        @inject('MessageBrokerAdapter')
        private readonly messageBrokerAdapter: IMessageBrokerAdapter,
    ) { }

    async execute({ code, userId }: ActivateUserRequest) {
        const userExists = await this.userRepository.findById(userId)
        if (!userExists) throw new ErrNotFound('user')

        if (userExists.props.active) throw new ErrAlreadyActive('user')

        const codeExists = await this.codeRepository.findByCodeAndUserId({ code, userId, type: 'ACTIVATE_ACCOUNT' })
        if (!codeExists) throw new ErrInvalidParam('code')


        if (codeExists.props.expiresIn < new Date() || codeExists.props.active == false) {
            await this.codeRepository.changeCodeStatus(codeExists.id)
            const generateUserCode = new GenerateUserCode()
            const { code, expiresIn } = generateUserCode.execute({ type: "string", size: 6 })

            const activateCode = Code.create({
                active: true,
                code,
                expiresIn,
                createdAt: new Date(),
                userId: userId,
                type: "ACTIVATE_ACCOUNT"
            })
            await this.codeRepository.create(activateCode)

            const sendUserMail = new SendUserMail(this.mailAdapter)
            sendUserMail.authMail({ to: userExists.props.email, code, expiresIn })

            throw new ErrExpired('code')
        }

        await this.codeRepository.changeCodeStatus(codeExists.id)
        await this.userRepository.changeStatus(userExists.id)

        const userCreatedMessage = {
            id: userExists.id,
            email: userExists.props.email,
            role: userExists.props.role
        }

        await this.messageBrokerAdapter.sendMessage('CUSTOMER_CREATED', userCreatedMessage)

        // if (address) {
        //     const userAddressCreated = {
        //         id: address.id,
        //         ...address.props
        //     }
        //     await this.messageBrokerAdapter.sendMessage('CUSTOMER_ADDRESS_CREATED', userAddressCreated)
        // }

        return codeExists

    }
}