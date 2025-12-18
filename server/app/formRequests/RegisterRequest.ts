import { z, parseBodyAs, } from "@sidebase/nuxt-parse"
import { H3Event } from "h3"

const bodySchema = z.object({
    username: z.string({
        required_error: 'username required',
    })
        .min(1, { message: 'username required' }),

    firstName: z.string({
        required_error: 'firstName required',
    })
        .min(1, { message: 'firstName required' }),
     lastName: z.string({
        required_error: 'lastName required',
    })
        .min(1, { message: 'lastName required' }),
phone: z.string({
        required_error: 'phone required',
    })
        .min(1, { message: 'phone required' }),
    email: z.string({
        required_error: 'valid email required',
    }).email({ message: 'valid email required' }),

    password: z.string({
        required_error: 'password required',
    })
        .min(8, { message: 'password must be at least 8 characters' })
})

export default async function registerRequest(event: H3Event) {
    return await parseBodyAs(event, bodySchema)
}