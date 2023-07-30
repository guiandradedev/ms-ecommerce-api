import { User } from "@/modules/domain";
import { CreateUserRequest } from "@/modules/protocols";
import { IUserRepository } from "@/modules/repositories";
import { ErrAlreadyExists } from "@/shared/errors";

export class CreateUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository
    ) { }

    async execute({name, email, cpf, password, active, address, role, createdAt}: CreateUserRequest): Promise<User> {
        const userExists = await this.userRepository.findByEmail(email)
        if(userExists) throw new ErrAlreadyExists('User')

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
        return user
    }
}