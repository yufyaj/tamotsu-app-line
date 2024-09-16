"use client"
import { useState } from "react";

interface ProfileImageAppProps {
  onProfileImageChange: (newImageSrc: Blob | null) => void;
}

export default function profileImageApp({ onProfileImageChange }: ProfileImageAppProps) {
  const [profileImage, setProfileImage] = useState<Blob | null>(null);

  const onChangeProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const fileObject = e.target.files[0] as Blob;
    setProfileImage(fileObject);

    // 親コンポーネントに画像データを送る
    onProfileImageChange(fileObject); 
  }

  return (
    <div className="flex justify-center items-center mt-8">
      {profileImage ? <img src={window.URL.createObjectURL(profileImage!)} className="h-32 w-32 rounded-full" /> : <></>}
      <input type="file" accept="image/*" onChange={onChangeProfileImage} className="pl-4" />
    </div>
  );
};