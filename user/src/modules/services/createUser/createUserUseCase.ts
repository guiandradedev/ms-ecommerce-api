import { IHashAdapter } from "@/modules/adapters/HashAdapter";
import { Code, User } from "@/modules/domain";
import { CreateUserRequest } from "@/modules/protocols";
import { ICodeRepository, IUserRepository } from "@/modules/repositories";
import { GenerateUserCode } from "@/modules/utils/GenerateUserCode";
import { IMessageBrokerAdapter } from "@/shared/adapters/MessageBrokerAdapter/IMessageBrokerAdapter";
import { ErrAlreadyExists } from "@/shared/errors";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateUserUseCase {
    constructor(
        @inject('UserRepository')
        private readonly userRepository: IUserRepository,
        @inject('CodeRepository')
        private readonly codeRepository: ICodeRepository,
        @inject('HashAdapter')
        private readonly hashAdapter: IHashAdapter,
        @inject('MessageBrokerAdapter')
        private readonly messageBrokerAdapter: IMessageBrokerAdapter
    ) { }

    async execute({ name, email, cpf, password, active, address, role, createdAt, phone }: CreateUserRequest): Promise<User> {
        const userMailExists = await this.userRepository.findByEmail(email)
        if (userMailExists) throw new ErrAlreadyExists('User')

        const userCpfExists = await this.userRepository.findByCpf(cpf)
        if (userCpfExists) throw new ErrAlreadyExists('User')

        const passwordHash = await this.hashAdapter.hash(password)
        password = passwordHash;

        const user = User.create({
            name,
            active: active ?? false,
            cpf,
            createdAt: createdAt ?? new Date(),
            email,
            password,
            role: role ?? "USER",
            address,
            phone
        })

        await this.userRepository.create(user)

        if (!active) {
            const generateUserCode = new GenerateUserCode()

            const date = new Date();
            date.setHours(date.getHours() + 3);

            const { code, expiresIn } = generateUserCode.execute({ type: "string", size: 6, expiresIn: date })

            const userCode = Code.create({
                active: true,
                code,
                expiresIn,
                createdAt: new Date(),
                userId: user.id,
                type: "ACTIVATE_ACCOUNT"
            })
            await this.codeRepository.create(userCode)

            // const sendUserMail = new SendUserMail(this.mailAdapter)
            // await sendUserMail.authMail({ to: email, code })
        }

        const userCreatedMessage = {
            id: user.id,
            email: user.props.email,
            role: user.props.role
        }

        await this.messageBrokerAdapter.sendMessage('CUSTOMER_CREATED', userCreatedMessage)

        if (address) {
            const userAddressCreated = {
                id: address.id,
                ...address.props
            }
            await this.messageBrokerAdapter.sendMessage('CUSTOMER_ADDRESS_CREATED', userAddressCreated)
        }

        return user
    }
}