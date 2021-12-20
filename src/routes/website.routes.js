import { Router } from 'express'
import controllers from '../controllers/website.controllers.js'
import isAuth from '../middlewares/auth.js'

const routes = Router()

routes
	.get('/', controllers.indexPage)
	.get('/login', controllers.loginPage)
	.get('/signup', controllers.signUpPage)
	.get('/home', controllers.homePage) // Solo si se encuentra autenticado
	.get('/admin', controllers.adminPage)


export default routes
