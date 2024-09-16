"use client"

import ProfileImageApp from "@/components/profileImageApp";
import { FormEvent, useState } from "react";

export default function RegisterNutritionist() {
  const [profileImage, setProfileImage] = useState<Blob | null>(null);

  const handleProfileImageChange = (image: Blob | null) => {
    setProfileImage(image);
  }

  const handleSubmit =(event: FormEvent) => {
    event.preventDefault();
    console.log("event=>", event);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name"></input>
        <input type="text" name="category"></input>
        <input type="text" name="introduction"></input>
        <ProfileImageApp onProfileImageChange={handleProfileImageChange}/>
        <button type="submit">登録</button>
      </form>
    </>
  );
}
