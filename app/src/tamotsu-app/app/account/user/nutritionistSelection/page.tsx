"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { nutritionistProfile } from '@/types/nutritionistProfile.type'
import InfiniteScroll from "react-infinite-scroll-component";

export default function NutritionistSelection() {
  const [nutritionists, setNutritionists] = useState<nutritionistProfile[]>([])
  const [selectedNutritionist, setSelectedNutritionist] = useState<nutritionistProfile|null>(null)
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [searchWords, setSearchWords] = useState("");
  
  useEffect(() => {
    setNutritionists([])
    setHasMore(true)
    setPage(0)
    fetchData()
    return
  }, [searchWords])

  const fetchMoreData = () => {
    fetchData()
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/account/user/searchNutritionists?query=${searchWords}&page=${page}`)
      const newItems = await response.json()
      console.log('newItems=>',newItems)
      setNutritionists(prevItems => [...prevItems, ...newItems]);
      if (newItems.length < 10) {
        setHasMore(false);
      }
      setPage(page + 1);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setHasMore(false);
    }
  };

  const items = (
    <>
      {nutritionists.map((nutritionist) => (
        <div
          key={nutritionist.id}
          className={`p-4 border rounded-lg cursor-pointer ${
            selectedNutritionist?.id === nutritionist.id ? 'border-primary' : 'border-gray-200'
          }`}
          onClick={() => handleSelect(nutritionist)}
        >
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={nutritionist.profileImageUrl} alt={nutritionist.name} />
              <AvatarFallback>{nutritionist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{nutritionist.name}</h3>
              <p className="text-sm text-gray-500">{nutritionist.specialty}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  )

  const handleSelect = (nutritionist: any) => {
    setSelectedNutritionist(nutritionist)
  }

  const handleConfirm = () => {
    if (selectedNutritionist) {
      // 確認処理をここに記述
      console.log('選択された管理栄養士:', selectedNutritionist)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>管理栄養士を選択</CardTitle>
        <CardDescription>あなたのニーズに最適な管理栄養士を選んでください</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <InfiniteScroll
            dataLength={nutritionists.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
          >
            {items}
          </InfiniteScroll>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleConfirm} disabled={!selectedNutritionist} className="w-full">
          選択を確定する
        </Button>
      </CardFooter>
    </Card>
  )
}