import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
	fullName: { type: String, min: 5, max: 255, required: true, },
	email: { type: String, min: 7, max: 255, required: true, },
	username: { type: String, min: 4, max: 20, required: false },
	password: { type: String, min: 7, max: 255, required: true, },
	role: { type: String, enum: ['admin', 'member', 'dev'], default: 'member' }
	// registered: { type: Date, default: Date.now }
})

// userSchema.methods.hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
userSchema.methods.comparePassword = (password, hash) => bcrypt.compareSync(password, hash)

userSchema.pre('save', async function (next) {
	if (!this.isModified("password")) return next()
	this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10))
	next()
})

export default mongoose.model('users', userSchema)
