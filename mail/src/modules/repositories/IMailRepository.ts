import { Mail } from "../domain";

export interface IMailRepository {
    create(data: Mail): Promise<void>;
}