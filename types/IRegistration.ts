export type IRegistrationErrors = {
 hasErrors?: string
}

export type RegistrationResponse = {
 hasErrors: boolean,
 errors?: IRegistrationErrors
}

export type RegistrationRequest = {
 firstName?: string,
 lastName?: string,
 phone?: string,
 username?: string
 email?: string
 password?: string
}