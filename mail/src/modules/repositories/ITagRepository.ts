import { Tag } from "../domain";

export interface ITagRepository {
    create(data: Tag): Promise<void>;
    // findTagOrCreate(data: string | string[]): Promise<Tag | Tag[]>
    // findUserTags(user: string | string[]): Promise<Tag[]>
    // findMailTags(mail: string | string[]): Promise<Tag[]>
}