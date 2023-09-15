import { useState } from "react"
import useWebSocket from "../hooks/useWebSocket"


export default function Index() {
  const [username, setUsername] = useState<string>()
  const [message, setMessage] = useState<string>()

  const { ws, messages } = useWebSocket(username)

  const handleStartChat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const elements = new FormData(e.currentTarget)
    const usernameInput = elements.get("username")
    if (!usernameInput) return
    setUsername(usernameInput.toString())
  }

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message || !ws) {
      return
    }
    ws?.send(message)
    setMessage(undefined)
  }

  if (!username) {
    return (
      <main className="flex justify-center text-3xl">
        <form onSubmit={handleStartChat} className="my-5">
          <label>
            Enter a username
            <input
              name="username"
              type="text"
              className="border"
            />
          </label>
          <button type="submit">Start chat</button>
        </form>
      </main>
    )
  }

  return (
    <main className="flex justify-center flex-col items-center text-3xl">
      <div id="messages" className="font-bold underline">
        {!messages?.length && (
          <p>No Messages yet</p>
        )}
        {messages?.map((msgData, i) => {
          return <p key={i} className={msgData.isAutomated ? "text-slate-500" : ""}>{msgData.message}</p>
        })}
      </div>


      <form onSubmit={handleOnSubmit} className="my-5">
        <input type="text" className="border" value={message ?? ""} onChange={(e) => setMessage(e.target.value)} />
        <button type="submit" disabled={!message}>Send</button>
      </form>
    </main>
  )
}
