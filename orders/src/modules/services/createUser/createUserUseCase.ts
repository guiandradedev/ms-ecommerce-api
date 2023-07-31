import { IHashAdapter } from "@/modules/adapters/HashAdapter";
import { Code, User } from "@/modules/domain";
import { CreateUserRequest } from "@/modules/protocols";
import { ICodeRepository, IUserRepository } from "@/modules/repositories";
import { GenerateUserCode } from "@/modules/utils/GenerateUserCode";
import { IMessageBrokerAdapter } from "@/shared/adapters/MessageBrokerAdapter/IMessageBrokerAdapter";
import { ErrAlreadyExists } from "@/shared/errors";

export class CreateUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly codeRepository: ICodeRepository,
        private readonly hashAdapter: IHashAdapter,
        private readonly messageBrokerAdapter: IMessageBrokerAdapter
        ) { }

    async execute({name, email, cpf, password, active, address, role, createdAt}: CreateUserRequest): Promise<User> {
        const userExists = await this.userRepository.findByEmail(email)
        if(userExists) throw new ErrAlreadyExists('User')

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
            // address
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

        // await this.messageBrokerAdapter.sendMessage('CONSUMER_CREATED', user)
        return user
    }
}