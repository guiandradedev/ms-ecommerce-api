import { Phone } from "@/modules/domain";

export interface IPhoneRepository {
    createPhone(data: Phone | Phone[]): Promise<void>
}