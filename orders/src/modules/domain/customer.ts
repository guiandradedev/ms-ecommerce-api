import { Entity } from "@/shared/core/entity";

type CustomerProps = {
    id: string,
    externalId: string,
    email: string
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