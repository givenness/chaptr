"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { AuthPrompt } from "@/components/auth-prompt"
import { Search, Filter, TrendingUp, Clock, Heart, MessageCircle, DollarSign, User } from "lucide-react"
import Link from "next/link"
import { formatCurrencyShort } from "@/lib/currency"

const GENRES = [
  "All",
  "Romance",
  "Fantasy",
  "Sci-Fi",
  "Mystery",
  "Thriller",
  "Young Adult",
  "Drama",
  "Adventure",
  "Horror",
  "Comedy",
  "Historical",
]

const LANGUAGES = [
  { code: "all", name: "All Languages" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "th", name: "ไทย" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "tl", name: "Tagalog" },
]

const mockDiscoverData = {
  trending: [
    {
      id: "1",
      title: "The Last Library",
      author: "maya_writes",
      excerpt: "In a world where books are forbidden, Maya discovers a hidden library...",
      tags: ["dystopian", "romance", "adventure"],
      upvotes: 234,
      comments: 45,
      tips: 12.5,
      language: "English",
      coverImage: "/book-cover-dystopian-library.jpg",
      trendingScore: 95,
    },
    {
      id: "2",
      title: "Moonlight Academy",
      author: "starlight_pen",
      excerpt: "When Elena receives her acceptance letter to the mysterious Moonlight Academy...",
      tags: ["fantasy", "young adult", "magic"],
      upvotes: 189,
      comments: 67,
      tips: 8.3,
      language: "English",
      coverImage: "/fantasy-academy-moonlight-magic.jpg",
      trendingScore: 87,
    },
    {
      id: "3",
      title: "Digital Hearts",
      author: "tech_romance",
      excerpt: "In 2045, AI companion apps are the norm. But when Zoe's AI starts showing real emotions...",
      tags: ["sci-fi", "romance", "technology"],
      upvotes: 156,
      comments: 23,
      tips: 15.7,
      language: "English",
      coverImage: "/futuristic-digital-romance-ai.jpg",
      trendingScore: 82,
    },
    {
      id: "4",
      title: "Corazones Perdidos",
      author: "escritora_luna",
      excerpt: "Una historia de amor que trasciende el tiempo y el espacio...",
      tags: ["romance", "drama", "historical"],
      upvotes: 98,
      comments: 34,
      tips: 6.2,
      language: "Español",
      coverImage: "/minimal-romantic-book-cover.jpg",
      trendingScore: 76,
    },
  ],
  featured: [
    {
      id: "5",
      title: "The Quantum Café",
      author: "physics_writer",
      excerpt: "A café where every cup of coffee opens a door to a parallel universe...",
      tags: ["sci-fi", "philosophy", "mystery"],
      upvotes: 145,
      comments: 28,
      tips: 9.4,
      language: "English",
      coverImage: "/minimal-sci-fi-book-cover-aesthetic.jpg",
    },
    {
      id: "6",
      title: "Shadows of Bangkok",
      author: "thai_storyteller",
      excerpt: "เรื่องราวลึกลับในซอกซอยของกรุงเทพฯ...",
      tags: ["mystery", "thriller", "urban"],
      upvotes: 87,
      comments: 19,
      tips: 4.8,
      language: "ไทย",
      coverImage: "/minimal-mystery-book-cover-design.jpg",
    },
  ],
}

export function DiscoverPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [activeTab, setActiveTab] = useState<"trending" | "featured" | "search">("trending")
  const [showFilters, setShowFilters] = useState(false)

  if (!user) {
    return <AuthPrompt />
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setActiveTab("search")
    }
  }

  const filteredStories = [...mockDiscoverData.trending, ...mockDiscoverData.featured].filter((story) => {
    const matchesSearch =
      !searchQuery ||
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesGenre =
      selectedGenre === "All" || story.tags.some((tag) => tag.toLowerCase() === selectedGenre.toLowerCase())

    const matchesLanguage =
      selectedLanguage === "all" ||
      story.language
        .toLowerCase()
        .includes(LANGUAGES.find((l) => l.code === selectedLanguage)?.name.toLowerCase() || "")

    return matchesSearch && matchesGenre && matchesLanguage
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="p-4">
          <h1 className="text-2xl font-sans font-bold mb-4">Discover Stories</h1>

          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stories, authors, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} size="sm">
              Search
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="space-y-4 p-4 bg-card rounded-lg border">
              <div>
                <label className="text-sm font-medium mb-2 block">Genre</label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      className={`px-3 py-1 rounded-full text-xs transition-colors ${
                        selectedGenre === genre
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={activeTab === "trending" ? "default" : "outline"}
              onClick={() => setActiveTab("trending")}
              size="sm"
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Trending
            </Button>
            <Button
              variant={activeTab === "featured" ? "default" : "outline"}
              onClick={() => setActiveTab("featured")}
              size="sm"
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Featured
            </Button>
            {searchQuery && (
              <Button
                variant={activeTab === "search" ? "default" : "outline"}
                onClick={() => setActiveTab("search")}
                size="sm"
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search Results
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Trending Tab */}
        {activeTab === "trending" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="font-sans font-semibold text-lg">Trending Now</h2>
            </div>
            {mockDiscoverData.trending.map((story, index) => (
              <Card key={story.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={
                          story.coverImage ||
                          "/placeholder.svg?height=112&width=80&query=minimal elegant book cover design" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={story.title}
                        className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-sans font-semibold text-lg leading-tight text-balance mb-1">
                        {story.title}
                      </h3>

                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <Link href={`/author/${story.author}`} className="text-sm text-primary hover:underline">
                          {story.author}
                        </Link>
                        <span className="text-xs text-muted-foreground">• {story.language}</span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 text-pretty">{story.excerpt}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {story.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {story.upvotes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {story.comments}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {formatCurrencyShort(story.tips)}
                          </div>
                        </div>
                        <Link href={`/story/${story.id}`}>
                          <Button size="sm" variant="outline">
                            Read
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Featured Tab */}
        {activeTab === "featured" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="font-sans font-semibold text-lg">Editor's Picks</h2>
            </div>
            {mockDiscoverData.featured.map((story) => (
              <Card key={story.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={
                        story.coverImage ||
                        "/placeholder.svg?height=112&width=80&query=minimal elegant book cover design" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={story.title}
                      className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-sans font-semibold text-lg leading-tight text-balance mb-1">
                        {story.title}
                      </h3>

                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <Link href={`/author/${story.author}`} className="text-sm text-primary hover:underline">
                          {story.author}
                        </Link>
                        <span className="text-xs text-muted-foreground">• {story.language}</span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 text-pretty">{story.excerpt}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {story.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {story.upvotes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {story.comments}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {formatCurrencyShort(story.tips)}
                          </div>
                        </div>
                        <Link href={`/story/${story.id}`}>
                          <Button size="sm" variant="outline">
                            Read
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Search Results Tab */}
        {activeTab === "search" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-primary" />
              <h2 className="font-sans font-semibold text-lg">Search Results for "{searchQuery}"</h2>
              <span className="text-sm text-muted-foreground">({filteredStories.length} found)</span>
            </div>

            {filteredStories.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">No stories found matching your search criteria.</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedGenre("All")
                      setSelectedLanguage("all")
                      setActiveTab("trending")
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredStories.map((story) => (
                <Card key={story.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={
                          story.coverImage ||
                          "/placeholder.svg?height=112&width=80&query=minimal elegant book cover design" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={story.title}
                        className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-sans font-semibold text-lg leading-tight text-balance mb-1">
                          {story.title}
                        </h3>

                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <Link href={`/author/${story.author}`} className="text-sm text-primary hover:underline">
                            {story.author}
                          </Link>
                          <span className="text-xs text-muted-foreground">• {story.language}</span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 text-pretty">{story.excerpt}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {story.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {story.upvotes}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {story.comments}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {formatCurrencyShort(story.tips)}
                            </div>
                          </div>
                          <Link href={`/story/${story.id}`}>
                            <Button size="sm" variant="outline">
                              Read
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
