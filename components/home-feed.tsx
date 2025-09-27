"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Clock, User, Search } from "lucide-react"
import Link from "next/link"

import { mockStories } from "@/data/mock-stories"

export function HomeFeed() {
  const [activeTab, setActiveTab] = useState<"latest" | "trending">("trending")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredStories = mockStories.filter((story) => {
    if (!searchQuery) return true
    return story.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  })

  const sortedStories = [...filteredStories].sort((a, b) => {
    if (activeTab === "latest") {
      const getMinutes = (timeStr: string) => {
        const num = Number.parseInt(timeStr)
        if (timeStr.includes("h")) return num * 60
        if (timeStr.includes("m")) return num
        return 0
      }
      return getMinutes(a.timeAgo) - getMinutes(b.timeAgo)
    } else {
      return b.upvotes - a.upvotes
    }
  })

  return (
    <div className="min-h-screen bg-background mini-app-nav-spacing safe-area-bottom page-transition">
      <div className="max-w-2xl mx-auto mini-app-padding pt-6 content-fade-in">
        <div className="relative mini-app-header-gap">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by genre (e.g., fantasy, sci-fi, romance)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-2 border-border bg-card shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex gap-2 mini-app-header-gap">
          <Button
            variant={activeTab === "trending" ? "default" : "outline"}
            onClick={() => setActiveTab("trending")}
            className="flex-1"
          >
            Trending
          </Button>
          <Button
            variant={activeTab === "latest" ? "default" : "outline"}
            onClick={() => setActiveTab("latest")}
            className="flex-1"
          >
            Latest
          </Button>
        </div>

        <div className="mini-app-element-gap">
          {sortedStories.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No stories found matching "{searchQuery}"</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try searching for genres like fantasy, sci-fi, romance, thriller, or historical
              </p>
            </Card>
          ) : (
            sortedStories.map((story) => (
              <Link key={story.id} href={`/story/${story.id}`} className="block">
                <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer gradient-card hover-lift">
                  <CardContent className="p-3">
                    <div className="flex gap-2">
                      <img
                        src={story.coverImage || "/placeholder.svg"}
                        alt={story.title}
                        className="w-16 h-20 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-sans font-semibold text-base leading-tight text-balance mb-0.5">{story.title}</h3>

                        <div className="flex items-center gap-1 mb-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-primary">{story.author}</span>
                          <Clock className="h-3 w-3 text-muted-foreground ml-1" />
                          <span className="text-xs text-muted-foreground">{story.timeAgo}</span>
                        </div>

                        <p className="text-xs text-muted-foreground mb-1.5 line-clamp-2 text-pretty">{story.excerpt}</p>

                        <div className="flex flex-wrap gap-0.5 mb-1.5">
                          {story.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0.5">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Heart className="h-3 w-3" />
                            {story.upvotes}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MessageCircle className="h-3 w-3" />
                            {story.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
