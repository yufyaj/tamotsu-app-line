"use client"

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      <button onClick={() => router.push('/account/common/chooseType')}>選択画面</button>
      <button onClick={() => router.push('/account/nutritionist/chat/list')}>チャット一覧画面</button>
      </div>
    </main> 
  );
}
