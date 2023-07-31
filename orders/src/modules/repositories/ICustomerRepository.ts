import { Customer } from "../domain"
import { IAddressRepository } from "./IAddressRepository"

export interface ICustomerRepository extends IAddressRepository{
    create(data: Customer): Promise<void>
}