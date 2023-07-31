import { AuthenticateUserController } from '@/modules/services/authenticateUser/authenticateUserController'
import { CreateUserController } from '@/modules/services/createUser/createUserController'
import { Router } from 'express'

const routes = Router()

routes.get("/", (req, res) => {
    res.send("Hello API")
})

routes.post('/auth', new CreateUserController().handle)
routes.post('/auth/login', new AuthenticateUserController().handle)

export default routes;