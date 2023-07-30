import { Entity } from "@/shared/core/entity";
import { Address } from "./address";

export type TypeUserRoles = 'USER' | 'ADMIN'

type UserProps = {
    name: string,
    email: string,
    cpf: string,
    password: string,
    role: TypeUserRoles,
    address?: Address | Address[],
    active: boolean,
    createdAt: Date
}

export class User extends Entity<UserProps> {
    private constructor(props: UserProps, id?: string) {
        super(props, id)
    }

    public static create(props: UserProps, id?: string) {
        const user = new User(props, id);

        return user;
    }
}