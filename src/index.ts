import 'reflect-metadata'
import {createKoaServer} from "routing-controllers"
import setupDb from './db'
import FwdController from './fwd/controller'

const port = process.env.PORT || 4004

const app = createKoaServer({
  controllers: [
    FwdController,
  ]
})

setupDb()
  .then(_ => {
    app.listen(port, () => console.log(`Listening on port ${port}`))
  })
  .catch(err => console.error(err))
