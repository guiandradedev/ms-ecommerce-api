import { Mail } from "@/modules/domain";
import { IMailRepository } from "../IMailRepository";

export class InMemoryMailRepository implements IMailRepository {
    private readonly mails: Mail[] = []

    async create(data: Mail): Promise<void> {
        this.mails.push(data)
    }
}