export interface NewsletterSubscription {
  email: string
  consent: true
  source: 'website-footer'
  consentVersion: '2027-01'
}

export type SubscriptionStatus = 'pending' | 'subscribed' | 'unsubscribed'

export interface Subscriber extends NewsletterSubscription {
  id: string
  status: SubscriptionStatus
  createdAt: string
}

export type SubscriptionRequest = Pick<NewsletterSubscription, 'email'>
