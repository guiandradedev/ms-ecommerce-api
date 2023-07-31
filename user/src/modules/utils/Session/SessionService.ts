import 'reflect-metadata'

import { ErrServerError } from '@/shared/errors';
import { ITokens } from "@/types/token.types";
import { ISecurityAdapter } from '@/modules/adapters/SecurityAdapter/ISecurityAdapter';
import { TypeUserRoles } from '@/modules/domain';

export type CreateSessionRequest = {
    email: string,
    id: string,
    role: TypeUserRoles
}

class CreateSession {
    constructor(
        private securityAdapter: ISecurityAdapter
    ) { }
    async execute({ email, id, role }: CreateSessionRequest): Promise<ITokens> {
        try {
            const userDataPayload = { id, email, role }
            
            const accessToken = await this.securityAdapter.encrypt(userDataPayload, process.env.ACCESS_TOKEN, {
                subject: id,
                expiresIn: Number(process.env.EXPIRES_IN_TOKEN),
            })

            const refreshToken = await this.securityAdapter.encrypt({ email }, process.env.REFRESH_TOKEN, {
                subject: id,
                expiresIn: Number(process.env.EXPIRES_IN_REFRESH_TOKEN),
            });

            const refreshTokenExpiresDate = new Date(new Date().getTime() + Number(process.env.EXPIRES_IN_TOKEN))
            const accessTokenExpiresDate = new Date(new Date().getTime() + Number(process.env.EXPIRES_IN_REFRESH_TOKEN))

            return { accessToken, refreshToken, refreshTokenExpiresDate, accessTokenExpiresDate };

        } catch (error) {
            console.log(error)
            throw new ErrServerError()
        }
    }
}

export { CreateSession };