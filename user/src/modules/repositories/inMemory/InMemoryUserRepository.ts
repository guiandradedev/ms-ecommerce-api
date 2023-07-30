import { Address, Phone, User } from "@/modules/domain";
import { IUserRepository } from "@/modules/repositories";

export class InMemoryUserRepository implements IUserRepository {
    private users: User[] = [];
    private phones: Phone[] = [];
    private address: Address[] = [];

    async create(data: User): Promise<void> {
        this.users.push(data)
    }
    async createAddress(data: Address): Promise<void> {
        this.address.push(data)
    }
    async createPhone(data: Phone): Promise<void> {
        this.phones.push(data)
    }

    async findByEmail(email: string): Promise<User> {
        const user = this.users.find(user=>user.props.email == email)
        if(!user) return null;
        return user;
    }
}