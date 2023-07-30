import { IHashAdapter } from "@/modules/adapters/HashAdapter";
import { User } from "@/modules/domain";
import { AuthenticateUserRequest, UserAuthenticateResponse } from "@/modules/protocols/authenticateUserDTO";
import { IAuthTokenRepository, IUserRepository } from "@/modules/repositories";
import { ErrInvalidParam, ErrNotActive } from "@/shared/errors";
import { inject, injectable } from "tsyringe";

@injectable()
export class AuthenticateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUserRepository,

        @inject('HashAdapter')
        private hashAdapter: IHashAdapter,
    ) { }

    async execute({ email, password }: AuthenticateUserRequest): Promise<User> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) throw new ErrInvalidParam('email or password incorrect')

        const checkPassword = await this.hashAdapter.compare(password, user.props.password);
        if (!checkPassword) throw new ErrInvalidParam('email or password incorrect')

        if(!user.props.active) throw new ErrNotActive('user')

        const newUserInstance = User.create({...user.props}, user.id)

        return newUserInstance;
    }
}