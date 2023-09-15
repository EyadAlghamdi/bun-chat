import { useEffect, useRef, useState } from "react"

interface MessageData {
  message: string,
  isAutomated: boolean
}

export default function useWebSocket(username?: string) {
  const ws = useRef<WebSocket>()
  const [messages, setMessages] = useState<MessageData[]>()

  useEffect(() => {
    if (!username) return;
    ws.current = new WebSocket(`ws://localhost:6969?username=${username}`)
    ws.current.onopen = () => { console.log("socket opened") }
    ws.current.onclose = () => { console.log("socket closed") }
    ws.current.onmessage = (ev: MessageEvent<string>) => {
      const data: MessageData = JSON.parse(ev.data)
      setMessages(prev => [...prev ?? [], data])
    }
    return () => {
      ws.current?.close()
    }
  }, [username])



  return {
    ws: ws.current,
    messages
  }
}
