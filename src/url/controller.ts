import {JsonController, Post, Put, HttpCode, Body, HttpError} from 'routing-controllers'
import Url from './entity'

// define custom existingUrl error
class UrlExistsError extends HttpError {
  public message: string
  public args: any[]
  constructor(message: string, args: any[] = []) {
    super(500)
    Object.setPrototypeOf(this, UrlExistsError.prototype)
    this.message = message
    this.args = args
  }
  toJSON() {
    return {
      statusCode: this.httpCode,
      message: this.message,
    }
  }
}

@JsonController()
export default class UrlController {
  @Post('/quizhook')
  @HttpCode(201)
  async createUrl(@Body() body: Url) {
    console.log(`Incoming POST body param:`, body)
    const url = await Url.findOne({quizz_id: body.quizz_id})

    if (url) {
      throw new UrlExistsError(`webhook URL is already existing for quizId ${body.quizz_id} - can't overwrite at quiz creation`)
    } else {
      await body.save()
      return {
        message: `webhook url saved for quiz ${body.quizz_id}`
      }
    }
  }

  @Put('/edithook')
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


