import jwt from 'jsonwebtoken'
import config from '../config.js'

const createToken = (username, email, role) => {
	return jwt.sign({ username, email, role }, config.secret, { expiresIn: "24h" })
}


export default createToken
