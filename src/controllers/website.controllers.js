import userModel from '../models/user.model.js'


class Controllers {
	indexPage = (req, res, next) => res.status(200).render('index')
	loginPage = (req, res, next) => res.status(200).render('login')
	signUpPage = (req, res, next) => res.status(200).render('signup')
	homePage = (req, res, next) => res.status(200).render('home')
	adminPage = (req, res, next) => res.status(200).render('admin')
}


export default new Controllers
