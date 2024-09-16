import Link from "next/link";


export default function ChooseUserType() {
  return (
  <>
    <p><Link href="/register/registerUser">ユーザー</Link></p>
    <p><Link href="/register/registerNutritionist">管理栄養士</Link></p>
  </>);
};
