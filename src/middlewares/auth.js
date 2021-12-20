import jwt from 'jsonwebtoken'
import config from '../config.js'

const isAuthenticated = (req, res, next) => {
	const token = req.headers.authorization

	if (!token) {
		res.status(500).send({
			mensaje: 'Token no proveída.'
		})
	}

	try {
		jwt.verify(token, config.secret, (err, decoded) => {
			if (err) return res.json({ mensaje: 'Token inválida' })
			req.decoded = decoded
			next()
		})
	} catch (error) {
		res.status(500).send({ error: "Se ha producido un error dentro del servidor." })
	}
}


export default isAuthenticated
