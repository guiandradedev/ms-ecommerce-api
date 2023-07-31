import { Address, Customer } from "@/modules/domain";
import { ICustomerRepository } from "../ICustomerRepository";

export class InMemoryCustomerRepository implements ICustomerRepository {
    private customers: Customer[] = [];
    private address: Address[] = [];

    async create(data: Customer): Promise<void> {
        this.customers.push(data)
        if(data.props.address) {
            await this.createAddress(data.props.address)
        }
    }

    async createAddress(data: Address | Address[]): Promise<void> {
        if (Array.isArray(data)) {
            data.forEach(address => this.address.push(address))
        } else {
            this.address.push(data)
        }
    }
}