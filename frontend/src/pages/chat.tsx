import { useMemo, useState } from "react"
import useWebSocket from "../hooks/useWebSocket"
import { useNavigate } from "react-router-dom"

export default function Chat() {
  const navigate = useNavigate()
  const { ws, messages } = useWebSocket()
  const username = useMemo(() => {
    return localStorage.getItem("username")
  }, [])

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const elements = new FormData(e.currentTarget)
    const messageInput = elements.get("message")
    if (!messageInput || !ws) return
    ws?.send(messageInput)
  }

  const handleLogout = async () => {
    const res = await fetch("http://localhost:6969/logout", {
      method: "POST",
      credentials: "include",
    })
    if (res.ok) {
      localStorage.removeItem("username")
      navigate("/login")
    }

  }

  return (
    <div className="flex h-screen">
      {/* SIDEBAR */}
      <div className="flex flex-col py-8 pr-2 w-64 bg-white flex-shrink-0">
        {/* title */}
        <div className="flex flex-row items-center justify-center h-12 w-full">
          <div className="ml-2 font-bold text-2xl">Bun Chat</div>
        </div>
        {/* personal card */}
        <div className="flex flex-col item-center bg-indigo-300 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
          <div className="text-xs text-gray-500">User</div>
          <div className="text-sm font-semibold mt-2">{username}</div>
        </div>
        {/* list of chats */}
        <div className="flex flex-col mt-8">
          <div className="font-bol text-xs">Chats</div>
        </div>
        <div className="flex flex-col mt-4">
          <button className="flex item-center justify-between hover:bg-gray-100 rounded p-2">
            <div className="ml-2 text-sm font-semibold">General</div>
            <div className="h-4 w-4 bg-red-300 rounded-full text-xs">3</div>
          </button>
          <button className="flex item-center justify-between hover:bg-gray-100 rounded p-2">
            <div className="ml-2 text-sm font-semibold">Discussion</div>
            <div className="h-4 w-4 bg-red-300 rounded-full text-xs">2</div>
          </button>
          <button className="flex item-center justify-between hover:bg-gray-100 rounded p-2">
            <div className="ml-2 text-sm font-semibold">Party</div>
            <div className="h-4 w-4 bg-red-300 rounded-full text-xs">1</div>
          </button>

        </div>
        <div className="flex justify-center mt-auto">
          <button className="bg-blue-400 rounded px-4 py-2 text-sm" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      {/* MAIN CHAT */}
      <div className="flex flex-col justify-between flex-auto h-full p-6 bg-gray-100">
        <div className="grid grid-cols-12 gap-y-2">
          {/* receipt  */}
          <div className="col-start-1 col-end-8 flex flex-row items-center p-3 rounded-lg">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-500 flex-shrink-0 ">U</div>
            <div className="mx-3 text-sm bg-white rounded-xl py-2 px-4">Hello and welcome to the chat</div>
          </div>
          {/* sent */}
          <div className="col-start-6 col-end-13 flex flex-row-reverse items-center p-3 rounded-lg">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-500 flex-shrink-0 ">U</div>
            <div className="mx-3 text-sm bg-white rounded-xl py-2 px-4">Hello and welcome to the chat</div>
          </div>

        </div>

        {/* Input form */}
        <form className="flex items-center h-16 rounded-xl bg-white px-4" onSubmit={handleOnSubmit}>
          <div className="w-full">
            <input
              type="text"
              name="message"
              className="flex w-full border rounded-xl focus:outline-none focus:border-sky-500 pl-4 h-10"
            />
          </div>
          <button
            type="submit"
            className="ml-2 flex items-center justify-center bg-blue-600 hover:bg-blue-900 rounded-xl text-white px-4 py-1"
          >
            Send
          </button>
        </form>

      </div>
    </div>)
}
