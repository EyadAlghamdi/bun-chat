import { useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate()

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const elements = new FormData(e.currentTarget)
    const usernameInput = elements.get("username")
    if (!usernameInput) return

    const res = await fetch("http://localhost:6969/login", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ username: usernameInput })
    })

    if (res.ok) {
      const json = await res.json()
      const username = json.username
      localStorage.setItem("username", username)
      return navigate("/chat")
    }
    // TODO: display error for the user



  }
  return (
    <div className="container">
      <form onSubmit={handleOnSubmit} className="flex flex-col gap-3 items-center justify-center bg-blue-800 text-center w-1/3 px-3 py-4 text-white mx-auto rounded">
        <input type="text" name="username" placeholder="username" className="w-full mx-auto text-sm rounded py-2 px-3 text-black" />
        <button type="submit" className="bg-blue text-white font-bold py-2 px-4 rounded border">Login</button>
      </form>
    </div>
  )
}
