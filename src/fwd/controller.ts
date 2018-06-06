import { JsonController, Post, Put, HttpCode, Body } from 'routing-controllers'
import Fwd from './entity'

@JsonController ()

export default class FwdController {

  @Post('/quizhook')
  @HttpCode(200)
  async sendQuizUpdate(
    @Body() quizResult: Fwd) {
      console.log(quizResult)
  }

}
