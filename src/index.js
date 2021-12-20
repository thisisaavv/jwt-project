// Temporal, para no configurar un transpilador de ES6
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import config from './config.js'
import apiRoutes from './routes/api.routes.js'
import websiteRoutes from './routes/website.routes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

app.use('/', websiteRoutes)
app.use('/api', apiRoutes)
app.use((req, res, next) => res.status(404).render('404'))

mongoose
	.connect(`mongodb+srv://${config.user}:${config.pass}@cluster0.lyi1c.mongodb.net/${config.dbname}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => app.listen(config.port, () => console.log(`Servidor en el puerto ${config.port}`)))
	.catch(e => console.log('error db:', e))
