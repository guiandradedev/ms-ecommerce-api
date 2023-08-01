import { Entity } from "@/shared/core/entity";

type TagProps = {
    title: string
}

export class Tag extends Entity<TagProps> {
    private constructor(props: TagProps, id?: string) {
        super(props, id)
    }

    public static create(props: TagProps, id?: string) {
        const tag = new Tag(props, id);

        return tag;
    }
}