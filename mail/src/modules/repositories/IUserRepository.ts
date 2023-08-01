import { User } from "../domain";

export interface IUserRepository {
    create(data: User): Promise<void>;
}