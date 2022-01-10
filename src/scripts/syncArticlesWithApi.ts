import MailService from "../services/mail.service";

export function syncArticlesWithApi() {
  try {
    console.log('Executing script syncArticlesWithApi...')
    console.log('Finished script syncArticlesWithApi')
  } catch(error) {
    MailService.send({});
  }
}