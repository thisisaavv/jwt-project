import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Joi from '@hapi/joi'
import User from '../models/user.model.js'
import { Router } from 'express'

const routes = Router()
let token_unico;

// Register
const schemaRegister = Joi.object({
	name: Joi.string().min(5).max(255).required(),
	email: Joi.string().min(7).max(255).required().email(),
	password: Joi.string().min(7).max(255).required()
})

routes.post('/register', async (req, res) => {
	console.log(req.body)

	// Validar datos del formulario
	const { validaciones, error } = schemaRegister.validate(req.body)
	if (error) return res.status(400).json({ error: error.details[0].message, mensaje: error.details[0].message })

	// Comprobar si existe
	const existeUser = await User.findOne({ email: req.body.email })
	if (existeUser) return res.status(400).json({ error: true, mensaje: "Ese email ya esta registrado." })

	// Ashear contrasena
	const saltos = await bcrypt.genSalt(10);
	const password = await bcrypt.hash(req.body.password, saltos);

	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password
	})

	try {
		// Almacenar los datos
		const userDB = await user.save();

		res.json({
			error: null,
			data: userDB,
			mensaje: 'Registrado con exito.'
		})

	} catch (error) {
		console.log(error)
	}
})


// Verificar Token
const verifytoken = (req, res, next) => {
	const token = token_unico;
	// console.log('POR ACA ', req.headers)
	if (!token) return res.status(404).json({ error: "Acceso Denegado" })
	try {
		const verificar = jwt.verify(token, process.env.TOKEN_SECRET);
		req.user = verificar;
		// token_unico = null;
		// console.log(req.user)
		next();
	} catch (error) {
		console.log(error)
		res.status(400).json({ error: "Token no valido" })
	}
}


routes.get('/admin', verifytoken, (req, res) => {
	res.render('admin', {
		user: req.user
	})
})



// Login

const schemaLogin = Joi.object({
	email: Joi.string().min(7).max(255).required().email(),
	password: Joi.string().min(7).max(255).required()
})

routes.post('/login', async (req, res) => {
	// Validar datos
	const { error } = schemaLogin.validate(req.body)
	if (error) return res.status(400).json({ error: error.details[0].message, mensaje: error.details[0].message })

	// Comprobar si existe
	const siExiste = await User.findOne({ email: req.body.email })
	if (!siExiste) return res.status(400).json({ error: true, mensaje: "Este usuario no existe." })

	// Comprobar contrasena
	const validate = await bcrypt.compare(req.body.password, siExiste.password)
	if (!validate) return res.status(400).json({ error: true, mensaje: "Datos no validos" })

	// Generar Token
	const token = jwt.sign({
		name: siExiste.name,
		id: siExiste._id
	}, process.env.TOKEN_SECRET)
	// console.log(typeof token)

	token_unico = token;

	res.json({
		error: null,
		token
	})

})


export default routes
