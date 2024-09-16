"use client"
import ProfileImageApp from "@/components/profileImageApp"
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function RegisterUser() {
  const [profileImage, setProfileImage] = useState<Blob | null>(null); // 画像のsrcを保持する状態
  const {data} = useSession();

  const handleProfileImageChange = (newImage: Blob | null) => {
    setProfileImage(newImage);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.append("profileImage", "");

    const reader = new FileReader();
    reader.onload= () => {
      formData.append("profileImage", reader.result as string);
      const jsonFormData = Object.fromEntries(formData.entries());
      console.log("formData=>", jsonFormData);
      const response = fetch("/api/profile", {
        method: "POST",
        body: JSON.stringify(jsonFormData),
      }
      )
    };

    if (profileImage) {
      await reader.readAsDataURL(profileImage!);
    } else {
      const jsonFormData = Object.fromEntries(formData.entries());
      console.log("formData=>", jsonFormData);
      const response = fetch("/api/profile", {
        method: "POST",
        body: JSON.stringify(jsonFormData),
      }
      )
    }
  }

  return <div className=''>
    <form onSubmit={handleSubmit}>
      <input type="text" name="name"></input>
      <input type="text" name="goal"></input>
      <ProfileImageApp onProfileImageChange={handleProfileImageChange} /> 
      <button type="submit">登録</button>
      <div>{JSON.stringify(data, null, 2)}</div>
    </form>
  </div>
};