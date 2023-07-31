import { Address } from "../domain/address";

export interface IAddressRepository {
    createAddress(data: Address | Address[]): Promise<void>
}