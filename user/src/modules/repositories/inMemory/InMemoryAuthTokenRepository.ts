import { AuthToken } from "@/modules/domain";
import { IAuthTokenRepository } from "../IAuthTokenRepository";

export class InMemoryAuthTokenRepository implements IAuthTokenRepository {
    public codes: AuthToken[] = []

    async create(data: AuthToken): Promise<void> {
        this.codes.push(data)
    }

}
