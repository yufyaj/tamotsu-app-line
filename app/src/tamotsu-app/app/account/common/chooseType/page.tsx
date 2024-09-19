"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { User, Utensils } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function UserTypeSelection() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<'user' | 'nutritionist' | null>(null)

  const handleSelect = (type: 'user' | 'nutritionist') => {
    setSelectedType(type)
  }

  const handleConfirm = () => {
    if (selectedType) {
      console.log('選択されたユーザータイプ:', selectedType)
      if (selectedType == "user") {
        router.push("/account/user/profile")
      } else if (selectedType == "nutritionist") {
        router.push("/account/nutritionist/profile")        
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">ユーザー区分の選択</CardTitle>
        <CardDescription className="text-center">あなたの区分を選択してください</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant={selectedType === 'user' ? 'default' : 'outline'}
          className="w-full h-20 text-lg justify-start px-4"
          onClick={() => handleSelect('user')}
        >
          <User className="mr-2 h-6 w-6" />
          ユーザー
        </Button>
        <Button
          variant={selectedType === 'nutritionist' ? 'default' : 'outline'}
          className="w-full h-20 text-lg justify-start px-4"
          onClick={() => handleSelect('nutritionist')}
        >
          <Utensils className="mr-2 h-6 w-6" />
          管理栄養士
        </Button>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleConfirm} 
          disabled={!selectedType} 
          className="w-full"
        >
          選択を確定する
        </Button>
      </CardFooter>
    </Card>
  )
}