import {JsonController, Post, HttpCode, Body, HttpError} from 'routing-controllers'
import Fwd from './entity'
import Url from '../url/entity'
import * as request from 'superagent'

// define custom external API error
class ExtApiError extends HttpError {
  public message: string
  public args: any[]
  constructor(message: string, args: any[] = []) {
    super(503)
    Object.setPrototypeOf(this, ExtApiError.prototype)
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
export default class FwdController {
  @Post('/reshook')
  @HttpCode(200)
  async sendQuizUpdate(@Body() quizResult: Fwd) {
    // init of err object outside of external API request
    // if external send fails, this will get updated with the err obj
    // used for checking successful send operation outside of catch
    let forwardErr

    // check if quiz exists in url db, get url from there if exists
    const extApi = await Url.findOne({quizz_id: quizResult.quizId})
    if (!extApi) {
      return {
        message: `Quiz${quizResult.quizId} is without webhook URL - nothing to do here.`,
      }
    }

    // send it to external API
    // have to be async for err check
    await request
      .post(extApi.url)
      .send(quizResult)
      .then(res => {
        // incoming response from external API
        console.log(res.text)
      })
      .catch(err => {
        // incoming error from external API
        forwardErr = err
        console.log(err)
      })

    // check for forwardErr, return based on that
    if (!forwardErr) {
      return {
        message: `data successfully forwarded`,
        sentTo: extApi.url,
        quizResult,
      }
    } else {
      throw new ExtApiError('data forwarding to external API failed')
    }
  }

  @Post('/mockExtApi')
  @HttpCode(200)
  async receiveUpdate(@Body() update: any) {
    //console.log(update)
    return {
      message: 'mock external API received update',
      update
    }
  }
}
