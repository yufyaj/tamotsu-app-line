'use client'

import { auth } from "@/lib/auth/auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { MouseEvent } from "react";

export default function tamotsuHeader() {
  const { data: session } = useSession();

  const signOutAction = (event: MouseEvent<HTMLButtonElement>) => {
    signOut()
  }

  const signInAction = (event: MouseEvent<HTMLButtonElement>) => {
    signIn("line")
  }

  return (
    <div className="bg-lime-500 flex">
      <Image src="/logo_only_logo.png" alt="logo" width={200} height={70} className="py-2 px-2" />
      {session ?
        <button className="bg-lime-600 h-8 my-2 px-2 right-1 text-white" onClick={signOutAction}>ログアウト</button>
        :
        <button className="bg-lime-600 h-8 my-2 px-2 right-1 text-white" onClick={signInAction}>ログイン</button>
      }
    </div>
  );
}