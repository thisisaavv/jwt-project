import { Router } from 'express'
import userControllers from '../controllers/user.controllers.js'
import isAuth from '../middlewares/auth.js'

const routes = Router()

routes
	.get('/users/', userControllers.getSeveral)
	.get('/users/:username', userControllers.getOne)
	.post('/users/', userControllers.createOne)
	.put('/users/:username', isAuth, userControllers.updateOne)
	.delete('/users/:username', userControllers.deleteOne)
	.delete('/users/', userControllers.deleteSeveral)

routes
	.post('/auth/login', userControllers.login)
	.post('/auth/logout', userControllers.logout)


export default routes
