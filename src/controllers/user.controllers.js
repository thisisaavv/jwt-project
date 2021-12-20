import userModel from '../models/user.model.js'
import createToken from '../lib/token.js'


class Controllers {
	async getSeveral(req, res, next) {
		try {
			await userModel.find()
				.then(users => res.status(200).json({ "data": users }))
		} catch (error) {
			res.status(500).send({
				error: {
					message: "Internal Server Error.",
					status: 500
				}
			})
		}
	}

	async getOne(req, res, next) {
		const { username } = req.params

		try {
			await userModel.findOne({ username })
				.then(user => {
					if (!user) {
						return res.status(404).send({
							error: {
								message: "User Not found.",
								status: 404
							}
						})
					}
					res.status(200).json({ "data": user })
				})
		} catch (error) {
			res.status(500).send({
				error: {
					message: "Internal Server Error.",
					status: 500
				}
			})
		}
	}

	async createOne(req, res, next) {
		const { fullName, email, username, password, role } = req.body
		const newUser = new userModel({ fullName, email, username, password, role })

		try {
			await userModel.findOne({ username })
				.then(user => {
					if (user) {
						return res.status(409).send({
							error: {
								message: "User already exists.",
								status: 409
							}
						})
					}
					newUser.save(err => res.status(200).json({ message: "User was created successfully." }))
				})
		} catch (error) {
			res.status(500).send({
				error: {
					message: "Internal Server Error.",
					status: 500
				}
			})
		}
	}

	async updateOne(req, res, next) {
		const { fullName, email, username, password, role } = req.body
		const usernameParam = req.params.username

		try {
			await userModel.findOne({ username: usernameParam })
				.then(user => {
					if (!user) {
						return res.status(404).send({
							error: {
								message: "User Not found.",
								status: 404
							}
						})
					}

					user.fullName = fullName != undefined ? fullName : user.fullName
					user.email = email != undefined ? email : user.email
					user.username = username != undefined ? username : user.username
					user.password = password != undefined ? password : user.password
					user.role = role != undefined ? role : user.role

					user.save(err => res.status(200).json({ message: "User was updated successfully.", data: user }))
				})
		} catch {
			res.status(500).send({
				error: {
					message: "Internal Server Error.",
					status: 500
				}
			})
		}
	}

	async deleteOne(req, res) {
		const { username } = req.params

		try {
			await userModel.deleteOne({ username })
				.then(user => {
					if (!user) {
						return res.status(404).send({
							error: {
								message: "User Not found.",
								status: 404
							}
						})
					}
					res.status(200).send({ message: "User was deleted." })
				})
		} catch (error) {
			res.status(500).send({
				error: {
					message: "Internal Server Error.",
					status: 500
				}
			})
		}
	}

	async deleteSeveral(req, res) {
		try {
			await userModel.deleteMany({})
				.then(() => res.status(200).send({ message: "All users were deleted." }))
		} catch (error) {
			res.status(500).send({
				error: {
					message: "Internal Server Error.",
					status: 500
				}
			})
		}
	}

	async login(req, res) {
		const { username, password } = req.body

		try {
			userModel.findOne({ username })
				.then((user) => {
					if (!user) return res.status(404).send({ message: "User Not found." })

					let isValid = user.comparePassword(password, user.password)
					if (!isValid) {
						return res.status(401).send({
							error: {
								message: "Invalid Password",
								code: 401
							},
							accessToken: null
						})
					}

					let token = createToken(user.username, user.email, user.role)
					res.status(200).json({
						user: {
							fullName: user.fullName,
							username: user.username,
							email: user.email,
							role: user.role
						},
						accessToken: token
					})
				})
		} catch (error) {
			res.status(500).send({
				error: {
					message: "Internal Server Error.",
					status: 500
				}
			})
		}
	}

	async logout(req, res) {
		try {
			res.status(200).send({ message: "Logout successful." })
		} catch (error) {
			res.status(500).send({
				error: {
					message: "Internal Server Error.",
					status: 500
				}
			})
		}
	}
}


(async () => {
	const adminUser = new userModel({
		fullName: "Administrador Principal",
		email: "admin@admin.com",
		username: "admin",
		password: "	admin123",
		role: "admin"
	})

	await userModel.findOne({ username: adminUser.username })
		.then(user => {
			if (!user) return adminUser.save()
			console.log("El usuario admin ya se encuentra disponible (usuario: admin, contraseña: admin123)")
		})
})()


export default new Controllers
