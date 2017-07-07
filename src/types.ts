export interface Options {
  params?: { [key: string]: any }
}

export interface Variables {
  [key: string]: any
}

export interface AbsintheRequest {
  query: any,
  variables: Variables,
  [key: string]: any
}

export interface GraphQLError {
  message: string
  locations: { line: number, column: number }[]
  path: string[]
}

export interface AbsintheResponse {
  data?: any
  errors?: GraphQLError[]
  [key: string]: any
}

export interface SubscriptionPayload {
  subscriptionId: string,
  result: AbsintheResponse
}

export type SubscriptionCallback =
  (result: AbsintheResponse) => void;

export interface SubscriptionRegistry {
  [key: string]: SubscriptionCallback
}