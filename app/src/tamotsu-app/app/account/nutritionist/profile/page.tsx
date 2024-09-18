"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import ProfileImage from "@/components/profileImage"

export default function NutritionistProfileRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    license: '',
    specialty: '',
    experience: '',
    education: '',
    bio: '',
  })

  const [profileImage, setProfileImage] = useState<Blob|null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    // フォーム送信の処理をここに記述
    console.log(formData)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>管理栄養士プロフィール登録</CardTitle>
        <CardDescription>あなたの専門情報を入力してください</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">氏名</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <ProfileImage onProfileImageChange={(newImage) => {setProfileImage(newImage)}} />
          <div className="space-y-2">
            <Label htmlFor="license">資格番号</Label>
            <Input id="license" name="license" value={formData.license} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty">専門分野</Label>
            <Input id="specialty" name="specialty" value={formData.specialty} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">経験年数</Label>
            <Input id="experience" name="experience" type="number" value={formData.experience} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="education">学歴</Label>
            <Input id="education" name="education" value={formData.education} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">自己紹介</Label>
            <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChangeTextArea} />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full">登録する</Button>
      </CardFooter>
    </Card>
  )
}