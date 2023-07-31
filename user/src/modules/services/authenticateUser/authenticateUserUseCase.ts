import { IHashAdapter } from "@/modules/adapters/HashAdapter";
import { ISecurityAdapter } from "@/modules/adapters/SecurityAdapter/ISecurityAdapter";
import { AuthToken, User } from "@/modules/domain";
import { AuthenticateUserRequest, UserAuthenticateResponse, UserTokenResponse } from "@/modules/protocols/authenticateUserDTO";
import { IAuthTokenRepository, IUserRepository } from "@/modules/repositories";
import { CreateSession } from "@/modules/utils/Session/SessionService";
import { ErrInvalidParam, ErrNotActive } from "@/shared/errors";
import { inject, injectable } from "tsyringe";

@injectable()
export class AuthenticateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private userRepository: IUserRepository,

        @inject('AuthTokenRepository')
        private authTokenRepository: IAuthTokenRepository,

        @inject('HashAdapter')
        private hashAdapter: IHashAdapter,

        @inject('SecurityAdapter')
        private securityAdapter: ISecurityAdapter,
    ) { }

    async execute({ email, password }: AuthenticateUserRequest): Promise<UserAuthenticateResponse> {
        const user = await this.userRepository.findByEmail(email)

        if (!user) throw new ErrInvalidParam('email or password incorrect')

        const checkPassword = await this.hashAdapter.compare(password, user.props.password);
        if (!checkPassword) throw new ErrInvalidParam('email or password incorrect')

        // if(!user.props.active) throw new ErrNotActive('user')

        const newUserInstance = User.create({...user.props}, user.id)

        const sessionService = new CreateSession(this.securityAdapter)
        const { accessToken, refreshToken, refreshTokenExpiresDate } = await sessionService.execute({email, id: user.id, role: user.props.role})

        const userToken = AuthToken.create({
            createdAt: new Date(),
            refreshTokenExpiresDate,
            refreshToken,
            userId: user.id
        })
        await this.authTokenRepository.create(userToken)


        const tokenData: UserTokenResponse = {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
        
        const userAuthenticated: UserAuthenticateResponse = Object.assign(newUserInstance, {token: tokenData})

        return userAuthenticated;
    }
}