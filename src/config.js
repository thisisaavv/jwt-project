import dotenv from 'dotenv'
dotenv.config()

export default {
    port: process.env.JWT_PROJECT_NODEJS_PORT,
    user: process.env.JWTPROJECT_MONGODB_DBUSER,
    dbname: process.env.JWTPROJECT_MONGODB_DBNAME,
    pass: process.env.JWTPROJECT_MONGODB_DBPASSWORD,
	secret: process.env.JWTPROJECT_SECRET_KEY,
    // uri: `mongodb+srv://${this.user}:${this.pass}@cluster0.lyi1c.mongodb.net/${this.dbname}?retryWrites=true&w=majority`
}
