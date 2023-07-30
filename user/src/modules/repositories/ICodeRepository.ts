import { Code } from '@/modules/domain'

export interface ICodeRepository {
    create(data: Code): Promise<void>
}