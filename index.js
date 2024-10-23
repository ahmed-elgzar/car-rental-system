import express from 'express'
import { connectionDB } from './DB/connection.js'
import customerRouter from './src/modules/Customer/customer.routes.js'
import carRouter from './src/modules/Car/car.routes.js'
import rentalRouter from './src/modules/Rental/rental.routes.js'
const app = express()
const port = 3000

app.use(express.json())

app.use('/user', customerRouter)
app.use('/car', carRouter)
app.use('/rental', rentalRouter)
connectionDB()

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))