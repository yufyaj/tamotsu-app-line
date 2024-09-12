import { signIn } from "../auth"

export default function Login() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("line")
      }}
    >
      <button type="submit">Signin with LINE</button>
    </form>
  )
} 