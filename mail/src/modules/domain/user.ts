import { Entity } from "@/shared/core/entity";
import { validate } from 'email-validator'
type UserProps = {
    externalId: string,
    email: string,
    role: string,
    tags?: string[] //tag id
}

export class User extends Entity<UserProps> {
    private constructor(props: UserProps, id?: string) {
        super(props, id)
    }

    public static create(props: UserProps, id?: string) {
        const user = new User(props, id);

        return user;
    }

    public static validateMail(email: string | string[]): Boolean {
        if(Array.isArray(email)) {
            let valid = true;
            for(const mail of email) {
                if(!validate(mail)) {
                    valid = false;
                    return;
                }
            }
            return valid
        }
        return validate(email)
    }
}