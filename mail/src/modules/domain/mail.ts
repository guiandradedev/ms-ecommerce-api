import { Entity } from "@/shared/core/entity";

type MailProps = {
    from: string,
    subject: string,
    body: string,
    text: string,
    userMails?: string[], //mail
    tags?: string[] //tags id
}

export class Mail extends Entity<MailProps> {
    private constructor(props: MailProps, id?: string) {
        super(props, id)
    }

    public static create(props: MailProps, id?: string) {
        const mail = new Mail(props, id);

        return mail;
    }
}