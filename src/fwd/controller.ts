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



const quizzesUrl = process.env.QUIZZES_URL || 'http://quizzes:4001'

@JsonController()
export default class FwdController {
  @Post('/reshook')
  @HttpCode(200)
  async sendQuizUpdate(@Body() quizResult: Fwd) {
    // init of err object outside of external API request
    // if external send fails, this will get updated with the err obj
    // used for checking successful send operation outside of catch
    let forwardErr

    //
    // request all quizzes
    const allQuizJSON = await request.get(`${quizzesUrl}/quizzes/`).set('X-User-id', '1').set('X-User-isTeacher', 'true')
    const allQuiz = JSON.parse(allQuizJSON.res.text).quizzes
    console.log(allQuiz)
    //
    // filter result for getting quizID based on name
    const resolveName = allQuiz.find(item => item.id === parseInt(quizResult.quizId) )
    if (!resolveName) {
      return {
        message: `Quiz ${quizResult.quizId} does not exist in Quiz database.`
      }
    }
    console.log(resolveName.title)

    const extApi = await Url.findOne({quizName: resolveName.title})
    if (!extApi || extApi.url === null) {
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
