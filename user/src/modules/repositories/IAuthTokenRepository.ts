import { AuthToken } from '@/modules/domain'

export interface IAuthTokenRepository {
    create(data: AuthToken): Promise<void>
}