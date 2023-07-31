import { Address } from "@/modules/domain";

export interface IAddressRepository {
    createAddress(data: Address | Address[]): Promise<void>
}