import { Address, Phone, User } from "@/modules/domain";
import { IUserRepository } from "@/modules/repositories";

export class InMemoryUserRepository implements IUserRepository {
    private users: User[] = [];
    private phones: Phone[] = [];
    private address: Address[] = [];

    async create(data: User): Promise<void> {
        const { address, phone } = data.props
        this.users.push(data)
        await this.createAddress(address)
        await this.createPhone(phone)
    }
    async createAddress(data: Address | Address[]): Promise<void> {
        if (Array.isArray(data)) {
            data.forEach(address => this.address.push(address))
        } else {
            this.address.push(data)
        }
    }
    async createPhone(data: Phone | Phone[]): Promise<void> {
        if (Array.isArray(data)) {
            data.forEach(phone => this.phones.push(phone))
        } else {
            this.phones.push(data)
        }
    }

    async findByEmail(email: string): Promise<User> {
        const user = this.users.find(user => user.props.email == email)
        if (!user) return null;
        return user;
    }

    async findByCpf(cpf: string): Promise<User> {
        const user = this.users.find(user => user.props.cpf == cpf)
        if (!user) return null;
        return user;
    }
}