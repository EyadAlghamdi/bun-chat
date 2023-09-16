import { headers } from "./conts/headers"

export default class AuthenticationController {

  static async login(req: Request) {
    const reqJson = await req.json() as { username: string | undefined }
    const username = reqJson.username
    if (!username) {
      return new Response("authentication failed", {
        status: 401,
        headers: headers
      })
    }

    return new Response(JSON.stringify({ success: true, username }), {
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "Set-Cookie": `username=${username}`
      },

    })
  }

  static async logout(req: Request) {
    return new Response("you are logged out", {
      headers: {
        ...headers,
        "Set-Cookie": `username=""; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      }
    })
  }
}