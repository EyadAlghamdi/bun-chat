import KSUID from "ksuid"
import AuthenticationController from "./AuthenticationController"
import { headers } from "./conts/headers"
import { getCookieByName } from "./utils/getCookieByName"

const PORT = 6969

const server = Bun.serve<{ id: string, username: string }>({
  port: PORT,
  async fetch(req, server) {
    const url = new URL(req.url)
    if (req.method === "OPTIONS") {
      return new Response("", {
        headers: headers
      })
    }

    if (url.pathname === "/login" && req.method === "POST") {
      return AuthenticationController.login(req)
    }
    if (url.pathname === "/logout" && req.method === "POST") {
      return AuthenticationController.logout(req)
    }

    // upgrade the request to websocket
    const uid = await KSUID.random()
    const cookie = req.headers.get("cookie")
    const username = getCookieByName(cookie ?? "", "username")

    if (server.upgrade(req, { data: { id: uid.string, username } })) {
      return
    }
    return new Response("Upgrade failed", { status: 500, headers })
  },
  websocket: {
    open(ws) {
      const username = ws.data.username
      if (!username) ws.close(4001, "Authroization failed")
      ws.subscribe("general")
      const payload = JSON.stringify({
        message: `${ws.data.username} has entered the chat`,
        isAutomated: true
      })
      server.publish("general", payload)
      // retrieve previous unread messages from db
    },
    message(ws, msg) {
      const payload = JSON.stringify({
        message: `${ws.data.username}: ${msg}`,
        isAutomated: false
      })
      server.publish("general", payload)
      // persist data in db
    },
    close(ws, code, message) {
      ws.unsubscribe("general")
      const payload = JSON.stringify({
        message: `${ws.data.username} has left the chat`,
        isAutomated: true
      })
      server.publish("general", payload)
    },
  },
})

console.log(`listeninig to port: ${PORT}`)