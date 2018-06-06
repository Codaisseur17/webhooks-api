
import { JsonController, Post, Put, HttpCode, Body } from 'routing-controllers'
import Url from './entity'

@JsonController ()

export default class UrlController {

@Post('/....')
@HttpCode(201)
createUrl(
    @Body() body: Url): 
    Url {
    console.log(`Incoming POST body param:`, body)
    return body
}

@Put('/.....')
@HttpCode(200)
async updateWebhook(
@Body() body: Url){

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