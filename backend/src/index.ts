import { ServerWebSocket } from "bun";
import KSUID from "ksuid"

const openSockets: ServerWebSocket<{ id: string; }>[] = []
const PORT = 6969

function sendToEveryone(data: { message: string | Buffer, isAutomated: boolean }) {
  openSockets.forEach(ws => {
    ws.send(JSON.stringify(data))
  })
}

Bun.serve<{ id: string, username: string }>({
  port: PORT,
  async fetch(req, server) {
    // upgrade the request to websocket
    const uid = await KSUID.random()
    const url = new URL(req.url)
    const username = url.searchParams.get("username")
    if (server.upgrade(req, { data: { id: uid.string, username } })) {
      return
    }
    return new Response("Upgrade failed", { status: 500 })
  },
  websocket: {
    open(ws) {
      openSockets.push(ws)
      const msg = `${ws.data.username} has entered the chat`
      sendToEveryone({ message: msg, isAutomated: true })
      // retrieve previous unread messages from db
    },
    message(ws, message) {
      sendToEveryone({ message: `${ws.data.username}: ${message}`, isAutomated: false })
      // persist data in db
    },
    close(ws, code, message) {
      const msg = `${ws.data.username} has left the chat`
      const uid = ws.data?.id
      openSockets.splice(openSockets.findIndex(ws => ws.data.id === uid), 1)
      sendToEveryone({ message: msg, isAutomated: true })
    },
  },
})


console.log(`listeninig to port: ${PORT}`)