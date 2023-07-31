import { Entity } from "@/shared/core/entity";
import { Address } from "./address";

type CustomerProps = {
    externalId: string,
    email: string,
    role: string,
    address?: Address | Address[]
}

export class Customer extends Entity<CustomerProps> {
    private constructor(props: CustomerProps, id?: string) {
        super(props, id)
    }

    public static create(props: CustomerProps, id?: string) {
        const customer = new Customer(props, id);

        return customer;
    }
}