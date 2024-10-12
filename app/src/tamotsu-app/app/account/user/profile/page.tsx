"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import ProfileImage from "@/components/profileImage"
import { useRouter } from 'next/navigation'

export default function UserProfileRegistration() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'none',
    height: '',
    weight: '',
    goal: '',
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
    console.log("formData=>", formData)
    const response = fetch("/api/account/user/profile", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        profileImage
      }),
    })

    // TODO: responseがokだったら、選択した管理栄養士がいるかどうかで遷移先を変更
    router.push("/account/user/nutritionistSelection")
  }

  useEffect(() => {
    fetch("/api/account/user/profile").then(async (res: Response) => {
      try {
        const profile = await res.json()
        if (profile !== null) {
          setFormData({
            name: profile.name,
            age: profile.age,
            gender: profile.gender,
            height: profile.height,
            weight: profile.weight,
            goal: profile.goal ?? ""
          })
        }  
      } catch (error) {
        console.log(error)
      }
    })
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
            <Select name="gender" value={formData.gender} onValueChange={(value: string) => setFormData(prevState => ({ ...prevState, gender: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">指定しない</SelectItem>
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
            <Label htmlFor="goal">目標</Label>
            <Textarea id="goal" name="goal" value={formData.goal} onChange={handleChangeTextArea} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">登録する</Button>
        </CardFooter>
      </form>
    </Card>
  )
}