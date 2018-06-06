import { JsonController, Post, Put, HttpCode, Body } from 'routing-controllers'

@JsonController ()

export default class FwdController {

  @Post('/quizhook')
  @HttpCode(200)
  async sendQuizUpdate(
    @Body quizResult: QuizResult ) {

  }

}
