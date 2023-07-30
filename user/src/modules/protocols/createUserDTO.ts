import { Address, TypeUserRoles } from "../domain"

export type CreateUserRequest = {
    name: string,
    email: string,
    cpf: string,
    password: string,
    role?: TypeUserRoles,
    address?: Address | Address[],
    active?: boolean,
    createdAt?: Date
}