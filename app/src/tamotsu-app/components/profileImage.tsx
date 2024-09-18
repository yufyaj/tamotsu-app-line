"use client"
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ProfileImageProps {
  onProfileImageChange: (newImageSrc: Blob | null) => void;
}

export default function profileImage({ onProfileImageChange }: ProfileImageProps) {
  const [profileImage, setProfileImage] = useState<Blob | null>(null);

  const onChangeProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const fileObject = e.target.files[0] as Blob;
    setProfileImage(fileObject);

    // 親コンポーネントに画像データを送る
    onProfileImageChange(fileObject); 
  }

  return (
    <div className="flex justify-center items-center mt-8 relative">
      {profileImage ? <img src={window.URL.createObjectURL(profileImage!)} className="h-32 w-32 rounded-full" /> : <img src="/default_account.png" className="h-32 w-32 rounded-full"/>}
      <Label htmlFor="profile-image" className="cursor-pointer absolute bottom-2">
        <div className="bg-primary text-primary-foreground px-1 py-1 rounded-md text-xs">
          画像を選択
        </div>
        <Input
          id="profile-image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChangeProfileImage}
        />
      </Label>
    </div>
  );
};