import { SendMailController } from '@/modules/services/sendMail/sendMailController'
import { Router } from 'express'

const routes = Router()

routes.get("/", (req, res) => {
    res.send("Hello API")
})

routes.post('/mail', new SendMailController().handle)

export default routes;