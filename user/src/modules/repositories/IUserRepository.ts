import { User } from "@/modules/domain";
import { IPhoneRepository } from "./IPhoneRepository";
import { IAddressRepository } from "./IAddressRepository";

export interface IUserRepository extends IPhoneRepository, IAddressRepository{
    create(data: User): Promise<void>;
    findByEmail(email: string): Promise<User>
    findByCpf(cpf: string): Promise<User>
}