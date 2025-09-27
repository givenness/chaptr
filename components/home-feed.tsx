"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Clock, User, Search } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { AuthPrompt } from "@/components/auth-prompt"
import Link from "next/link"

const mockStories = [
  {
    id: "1",
    title: "The Last Library",
    author: "maya_writes",
    authorId: "maya_writes",
    excerpt:
      "In a world where books are forbidden, Maya discovers a hidden library that holds the key to humanity's forgotten past...",
    tags: ["dystopian", "romance", "adventure"],
    upvotes: 234,
    comments: 45,
    tips: 12.5,
    timeAgo: "2h ago",
    coverImage: "/minimalist-abstract-geometric-shapes-in-muted-eart.jpg",
  },
  {
    id: "2",
    title: "Moonlight Academy",
    author: "starlight_pen",
    authorId: "starlight_pen",
    excerpt:
      "When Elena receives her acceptance letter to the mysterious Moonlight Academy, she has no idea that her life is about to change forever...",
    tags: ["fantasy", "young adult", "magic"],
    upvotes: 189,
    comments: 67,
    tips: 8.3,
    timeAgo: "4h ago",
    coverImage: "/minimalist-crescent-moon-silhouette-in-deep-blue-g.jpg",
  },
  {
    id: "3",
    title: "Digital Hearts",
    author: "tech_romance",
    authorId: "tech_romance",
    excerpt:
      "In 2045, AI companion apps are the norm. But when Zoe's AI starts showing real emotions, the line between artificial and authentic blurs...",
    tags: ["sci-fi", "romance", "technology"],
    upvotes: 156,
    comments: 23,
    tips: 15.7,
    timeAgo: "6h ago",
    coverImage: "/minimalist-circuit-pattern-in-soft-pink-and-blue-t.jpg",
  },
  {
    id: "4",
    title: "Ocean's Whisper",
    author: "marine_storyteller",
    authorId: "marine_storyteller",
    excerpt:
      "Marine biologist Dr. Sarah Chen discovers an ancient underwater civilization that has been watching humanity for centuries...",
    tags: ["adventure", "mystery", "ocean"],
    upvotes: 98,
    comments: 34,
    tips: 6.2,
    timeAgo: "30m ago",
    coverImage: "/minimalist-ocean-waves-in-teal-and-navy-blue-gradi.jpg",
  },
  {
    id: "5",
    title: "The Memory Thief",
    author: "noir_writer",
    authorId: "noir_writer",
    excerpt:
      "In 1940s Chicago, detective Jack Morrison investigates a series of crimes where victims lose their most precious memories...",
    tags: ["noir", "thriller", "historical"],
    upvotes: 145,
    comments: 28,
    tips: 9.8,
    timeAgo: "1h ago",
    coverImage: "/minimalist-film-noir-shadows-in-black-and-white-gr.jpg",
  },
  {
    id: "6",
    title: "Quantum Café",
    author: "coffee_physicist",
    authorId: "coffee_physicist",
    excerpt:
      "Every morning at 7:23 AM, physicist Dr. Emma Rodriguez's coffee shop shifts between parallel dimensions...",
    tags: ["sci-fi", "slice of life", "physics"],
    upvotes: 203,
    comments: 52,
    tips: 11.4,
    timeAgo: "15m ago",
    coverImage: "/minimalist-coffee-cup-silhouette-with-geometric-pa.jpg",
  },
  {
    id: "7",
    title: "The Painter's Curse",
    author: "renaissance_tales",
    authorId: "renaissance_tales",
    excerpt:
      "In Renaissance Florence, young artist Lorenzo discovers that his paintings come to life at midnight, but each creation demands a price...",
    tags: ["historical", "fantasy", "art"],
    upvotes: 167,
    comments: 41,
    tips: 7.9,
    timeAgo: "3h ago",
    coverImage: "/minimalist-paintbrush-stroke-in-renaissance-gold-a.jpg",
  },
  {
    id: "8",
    title: "Neon Samurai",
    author: "cyberpunk_warrior",
    authorId: "cyberpunk_warrior",
    excerpt:
      "In Neo-Tokyo 2087, the last samurai uses ancient techniques to fight corporate overlords in a world of neon and chrome...",
    tags: ["cyberpunk", "action", "samurai"],
    upvotes: 278,
    comments: 89,
    tips: 18.3,
    timeAgo: "5h ago",
    coverImage: "/minimalist-katana-silhouette-with-neon-pink-and-cy.jpg",
  },
  {
    id: "9",
    title: "The Greenhouse Keeper",
    author: "botanical_dreams",
    authorId: "botanical_dreams",
    excerpt:
      "Elderly botanist Margaret tends to a magical greenhouse where each plant holds the dreams of sleeping children around the world...",
    tags: ["fantasy", "wholesome", "nature"],
    upvotes: 124,
    comments: 67,
    tips: 5.6,
    timeAgo: "45m ago",
    coverImage: "/minimalist-plant-leaf-silhouette-in-soft-green-gra.jpg",
  },
  {
    id: "10",
    title: "Code Red Hearts",
    author: "hacker_romance",
    authorId: "hacker_romance",
    excerpt:
      "Elite hacker Alex infiltrates a tech corporation to expose corruption, but falls for the CEO's daughter who's fighting the same battle...",
    tags: ["thriller", "romance", "hacking"],
    upvotes: 192,
    comments: 35,
    tips: 13.2,
    timeAgo: "7h ago",
    coverImage: "/minimalist-binary-code-pattern-in-red-and-black-gr.jpg",
  },
]

export function HomeFeed() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<"latest" | "trending">("trending")
  const [searchQuery, setSearchQuery] = useState("")

  if (!user) {
    return <AuthPrompt />
  }

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
    <div className="min-h-screen bg-background mini-app-nav-spacing safe-area-bottom">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="mini-app-padding py-6">
          <h1 className="text-2xl font-serif font-bold">Home</h1>
          <p className="text-sm text-muted-foreground mt-2">Stories by verified humans, for curious minds</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mini-app-padding mini-app-header-gap">
        <div className="relative mini-app-header-gap">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by genre (e.g., fantasy, sci-fi, romance)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
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
                <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="mini-app-padding">
                    <div className="flex gap-4">
                      <img
                        src={story.coverImage || "/placeholder.svg"}
                        alt={story.title}
                        className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-serif font-semibold text-lg leading-tight text-balance">{story.title}</h3>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-primary">{story.author}</span>
                          <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                          <span className="text-sm text-muted-foreground">{story.timeAgo}</span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 text-pretty">{story.excerpt}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {story.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Heart className="h-4 w-4" />
                            {story.upvotes}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MessageCircle className="h-4 w-4" />
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
