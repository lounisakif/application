

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const adminRoutes = require('./routes/adminRoutes')
const UsersRoutes = require('./routes/UsersRoutes')

const auth = require('./middlewares/auth')

const cookieParser = require('cookie-parser')
const app = express()

const port = process.env.PORT || 3000
app.use(bodyParser.json())
app.use(cookieParser())

// app.use(
//   cors({
//     origin: [
//         `${process.env.FRONT_OFFICE_URL}`,`${process.env.BACK_OFFICE_URL}`,
//         'http://localhost:3000','http://localhost:3006','http://localhost:3001','http://localhost:3002'
//     ],
//     credentials: true,
//     allowedHeaders: ['Authorization', 'content-type']
//   })
// )

app.listen(port, () => console.log(`listening at port ${port}`))
app.use(UsersRoutes)
// app.use(auth,adminRoutes)
