export interface EmailTemplate {
  _id?: string,
  name: string,
  action: string,
  subject: string,
  body: string,
  active: boolean
}


export enum AllowedActions {
  QUOTE_ASSIGNED = 'For Quote Assignment',
  QUERY_RAISED_INTERNAL = 'For Query Raised - Internal',
  QUERY_REPLIED_INTERNAL = 'For Query Replied - Internal',
  QUERY_RAISED_EXTERNAL = 'For Query Raised - External',
  QUERY_REPLIED_EXTERNAL = 'For Query Replied - External',
  SENT_FOR_QCR_BY_INSURER = 'For Sent For QCR By Insurer',
  RESET_PASSWORD = 'For Reset Password',
  SEND_PAYMENT_LINK = 'For Sending Payment Link',
  LOGIN = 'For Login',
  POLICY_CREATED = 'For Policy Creation',
  QUOTE_REJECT = 'For Quote Rejection',
  USER_CREATION = 'For User Creation'
}