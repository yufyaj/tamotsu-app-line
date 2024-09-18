"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import ProfileImage from "@/components/profileImage"

export default function UserProfileRegistration() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    goals: '',
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // フォーム送信の処理をここに記述
    console.log(formData)
  }

  useEffect(() => {
    const get = async () => {
      const profile = await fetch("/api/account/user/getProfile")
      console.log("profile=>",profile.body)

      if (!profile) {
        setFormData({
          name: profile.name,
          age: profile.age,
          gender: profile.gender,
          height: profile.header,
          weight: profile.weight,
          goals: profile.goal
        })
      }
    }
    get()
  }, [])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>ユーザープロフィール登録</CardTitle>
        <CardDescription>あなたの情報を入力してください</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="name">氏名</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <ProfileImage onProfileImageChange={(newImage) => {setProfileImage(newImage)}} />
          <div className="space-y-2">
            <Label htmlFor="age">年齢</Label>
            <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">性別</Label>
            <Select name="gender" onValueChange={(value: string) => setFormData(prevState => ({ ...prevState, gender: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="性別を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">男性</SelectItem>
                <SelectItem value="female">女性</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">身長 (cm)</Label>
            <Input id="height" name="height" type="number" value={formData.height} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">体重 (kg)</Label>
            <Input id="weight" name="weight" type="number" value={formData.weight} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goals">目標</Label>
            <Textarea id="goals" name="goals" value={formData.goals} onChange={handleChangeTextArea} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">登録する</Button>
        </CardFooter>
      </form>
    </Card>
  )
}