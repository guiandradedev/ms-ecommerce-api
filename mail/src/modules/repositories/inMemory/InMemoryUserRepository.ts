import { User } from "@/modules/domain";
import { IUserRepository } from "../IUserRepository";

export class InMemoryUserRepository implements IUserRepository {
    private readonly users: User[] = []
    async create(data: User): Promise<void> {
        this.users.push(data)
    }
}