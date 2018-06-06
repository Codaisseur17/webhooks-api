import {JsonController, Post, Put, HttpCode, Body} from 'routing-controllers'
import Url from './entity'

@JsonController()
export default class UrlController {
  @Post('/newquizhook')
  @HttpCode(201)
  async createUrl(@Body() body: Url) {
    console.log(`Incoming POST body param:`, body)
    await body.save()
    return `webhook url saved for quiz ${body.quizz_id}`
  }

  @Put('/editquizhook')
  @HttpCode(200)
  async updateWebhook(@Body() body: Url) {
    const url = await Url.findOne({quizz_id: body.quizz_id})
    if (url) {
      url.quizz_id = body.quizz_id
      url.url = body.url
      url.save()
      return 'Saved'
    }
    return 'Something went wrong'
  }
}
