import { ErrServerError } from '@/shared/errors'
import { Request, Response, NextFunction } from 'express'
import { container } from 'tsyringe'
import { SendMailUseCase } from './sendMailUseCase'
import { SendMailRequest } from '@/modules/protocols'

export class SendMailController {
    async handle(req: Request, res: Response, next: NextFunction) {
        const { body, from, subject, text, userMails, tags }: SendMailRequest = req.body
        try {
            const sendMailUseCase = container.resolve(SendMailUseCase)
            const mail = await sendMailUseCase.execute({ body, from, subject, text, userMails, tags })

            return res.status(201).json({ mail })
        } catch (error) {
            return res.status(new ErrServerError().status).json({ errors: [new ErrServerError()] })
        }
    }
}