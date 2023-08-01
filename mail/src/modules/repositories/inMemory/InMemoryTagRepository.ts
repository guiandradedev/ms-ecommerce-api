import { Tag } from "@/modules/domain";
import { ITagRepository } from "../ITagRepository";

export class InMemoryTagRepository implements ITagRepository {
    private readonly tags: Tag[] = []
    async create(data: Tag): Promise<void> {
        this.tags.push(data)
    }
    // async findUserTags(user: string | string[]): Promise<Tag[]> {
    //     return [Tag.create({title: ''})]
    // }
    // async findTagOrCreate(data: string | string[]): Promise<Tag | Tag[]> {
    //     return [Tag.create({title: ''})]
    // }
    // async findMailTags(mail: string | string[]): Promise<Tag[]> {
    //     return [Tag.create({title: ''})]
    // }
}