/*"use client"
import { useSession, signIn, signOut } from "next-auth/react"

const LoginForm1 = () => {
    return (
<form
      action={async () => {
         await signIn("azure-ad")
      }}  >
      <button>Login</button>
    </form>
  );
};
*/
//export default LoginForm;


"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import styles from "./loginForm.module.css";

export default function LoginForm() {
  const { data: session } = useSession()
  console.log({session})
  if(session) {
    return <>
      Signed in as {session.user.email} <br/>
      <button onClick={() => signOut()}>Sign out</button>
    </>
  }
  return <>
    Not signed in <br/>
    <button className={styles.button} onClick={() => signIn('azure-ad',
      { callbackUrl: '/dashboard' },)}>Sign in </button>
  </>
}