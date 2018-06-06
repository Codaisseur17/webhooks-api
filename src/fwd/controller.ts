import {JsonController, Post, HttpCode, Body, HttpError} from 'routing-controllers'
import Fwd from './entity'
import * as request from 'superagent'

const testUrl = 'http://localhost:4040/incoming'

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
  @Post('/quizhook')
  @HttpCode(200)
  async sendQuizUpdate(@Body() quizResult: Fwd) {
    // init of err object outside of external API request
    // if external send fails, this will get updated with the err obj
    // used for checking successful send operation outside of catch
    let forwardErr

    // got quiz response

    // check if quiz exists in url db, get url from there if exists

    // send it to external API
    // have to be async for err check
    await request
      .post(testUrl)
      .send(quizResult)
      .then(res => {
        // incoming response from external API
        console.log(res.text)
      })
      .catch(err => {
        // incoming error from external API
        forwardErr = err
        //console.log(err)
      })

    // check for forwardErr, return based on that
    if (!forwardErr) {
      return {
        message: 'data successfully forwarded',
        quizResult,
      }
    } else {
      throw new ExtApiError('data forwarding to external API failed')
    }
  }
}
