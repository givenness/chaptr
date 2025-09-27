"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, MessageCircle, DollarSign, User, BookOpen, Share } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getStoryById, updateStoryStats, type StoredStory } from "@/lib/story-storage"
import { useAuth } from "@/components/auth-wrapper"

interface StoryPageProps {
  storyId: string
}

// Mock data - in real app this would come from API
const mockStories = {
  "1": {
    id: "1",
    title: "The Last Library",
    author: "maya_writes",
    authorId: "maya_writes",
    description:
      "In a world where books are forbidden, Maya discovers a hidden library that holds the key to humanity's forgotten past. As she delves deeper into the ancient texts, she uncovers a conspiracy that threatens not just her life, but the future of human knowledge itself.",
    tags: ["dystopian", "romance", "adventure"],
    language: "English",
    upvotes: 234,
    comments: 45,
    tips: 12.5,
    followers: 89,
    isFollowing: false,
    coverImage: "/minimalist-abstract-geometric-shapes-in-muted-eart.jpg",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    chapters: [
      {
        id: "1",
        title: "Chapter 1: The Discovery",
        wordCount: 1250,
        publishedAt: "2024-01-15",
        upvotes: 45,
        comments: 12,
      },
      {
        id: "2",
        title: "Chapter 2: Hidden Truths",
        wordCount: 1180,
        publishedAt: "2024-01-17",
        upvotes: 38,
        comments: 8,
      },
      {
        id: "3",
        title: "Chapter 3: The Keeper",
        wordCount: 1320,
        publishedAt: "2024-01-20",
        upvotes: 42,
        comments: 15,
      },
    ],
  },
  "2": {
    id: "2",
    title: "Moonlight Academy",
    author: "starlight_pen",
    authorId: "starlight_pen",
    description:
      "When Elena receives her acceptance letter to the mysterious Moonlight Academy, she has no idea that her life is about to change forever. Hidden in the mountains of Scotland, this school teaches more than just regular subjects - it's where young witches and wizards learn to harness their magical abilities.",
    tags: ["fantasy", "young adult", "magic"],
    language: "English",
    upvotes: 189,
    comments: 67,
    tips: 8.3,
    followers: 156,
    isFollowing: false,
    coverImage: "/minimalist-crescent-moon-silhouette-in-deep-blue-g.jpg",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    chapters: [
      {
        id: "1",
        title: "Chapter 1: The Letter",
        wordCount: 1100,
        publishedAt: "2024-01-10",
        upvotes: 67,
        comments: 23,
      },
      {
        id: "2",
        title: "Chapter 2: First Day",
        wordCount: 1350,
        publishedAt: "2024-01-12",
        upvotes: 54,
        comments: 18,
      },
    ],
  },
  "3": {
    id: "3",
    title: "Digital Hearts",
    author: "tech_romance",
    authorId: "tech_romance",
    description:
      "In 2045, AI companion apps are the norm. But when Zoe's AI starts showing real emotions, the line between artificial and authentic blurs. A story about love, technology, and what it means to be human in a digital age.",
    tags: ["sci-fi", "romance", "technology"],
    language: "English",
    upvotes: 156,
    comments: 23,
    tips: 15.7,
    followers: 78,
    isFollowing: false,
    coverImage: "/minimalist-circuit-pattern-in-soft-pink-and-blue-t.jpg",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-16",
    chapters: [
      {
        id: "1",
        title: "Chapter 1: Connection",
        wordCount: 1200,
        publishedAt: "2024-01-08",
        upvotes: 89,
        comments: 15,
      },
    ],
  },
  "4": {
    id: "4",
    title: "Ocean's Whisper",
    author: "marine_storyteller",
    authorId: "marine_storyteller",
    description:
      "Marine biologist Dr. Sarah Chen discovers an ancient underwater civilization that has been watching humanity for centuries. As she explores the depths of the ocean, she uncovers secrets that could change our understanding of life on Earth forever.",
    tags: ["adventure", "mystery", "ocean"],
    language: "English",
    upvotes: 98,
    comments: 34,
    tips: 6.2,
    followers: 45,
    isFollowing: false,
    coverImage: "/minimalist-ocean-waves-in-teal-and-navy-blue-gradi.jpg",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-19",
    chapters: [
      {
        id: "1",
        title: "Chapter 1: The Deep",
        wordCount: 1400,
        publishedAt: "2024-01-12",
        upvotes: 32,
        comments: 8,
      },
      {
        id: "2",
        title: "Chapter 2: Ancient Voices",
        wordCount: 1280,
        publishedAt: "2024-01-15",
        upvotes: 28,
        comments: 12,
      },
    ],
  },
  "5": {
    id: "5",
    title: "The Memory Thief",
    author: "noir_writer",
    authorId: "noir_writer",
    description:
      "In 1940s Chicago, detective Jack Morrison investigates a series of crimes where victims lose their most precious memories. As he delves deeper into the case, he discovers a conspiracy that reaches the highest levels of society.",
    tags: ["noir", "thriller", "historical"],
    language: "English",
    upvotes: 145,
    comments: 28,
    tips: 9.8,
    followers: 67,
    isFollowing: false,
    coverImage: "/minimalist-film-noir-shadows-in-black-and-white-gr.jpg",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-18",
    chapters: [
      {
        id: "1",
        title: "Chapter 1: The First Victim",
        wordCount: 1150,
        publishedAt: "2024-01-05",
        upvotes: 56,
        comments: 14,
      },
      {
        id: "2",
        title: "Chapter 2: Shadows and Smoke",
        wordCount: 1220,
        publishedAt: "2024-01-08",
        upvotes: 48,
        comments: 9,
      },
      {
        id: "3",
        title: "Chapter 3: The Pattern",
        wordCount: 1300,
        publishedAt: "2024-01-12",
        upvotes: 41,
        comments: 5,
      },
    ],
  },
  "6": {
    id: "6",
    title: "Quantum Café",
    author: "coffee_physicist",
    authorId: "coffee_physicist",
    description:
      "Every morning at 7:23 AM, physicist Dr. Emma Rodriguez's coffee shop shifts between parallel dimensions. As she serves customers from different realities, she begins to understand the true nature of the multiverse.",
    tags: ["sci-fi", "slice of life", "physics"],
    language: "English",
    upvotes: 203,
    comments: 52,
    tips: 11.4,
    followers: 92,
    isFollowing: false,
    coverImage: "/minimalist-coffee-cup-silhouette-with-geometric-pa.jpg",
    createdAt: "2024-01-03",
    updatedAt: "2024-01-17",
    chapters: [
      {
        id: "1",
        title: "Chapter 1: Morning Shift",
        wordCount: 1050,
        publishedAt: "2024-01-03",
        upvotes: 78,
        comments: 19,
      },
      {
        id: "2",
        title: "Chapter 2: Different Worlds",
        wordCount: 1180,
        publishedAt: "2024-01-06",
        upvotes: 65,
        comments: 16,
      },
      {
        id: "3",
        title: "Chapter 3: The Regular",
        wordCount: 1240,
        publishedAt: "2024-01-10",
        upvotes: 60,
        comments: 17,
      },
    ],
  },
  "7": {
    id: "7",
    title: "The Painter's Curse",
    author: "renaissance_tales",
    authorId: "renaissance_tales",
    description:
      "In Renaissance Florence, young artist Lorenzo discovers that his paintings come to life at midnight, but each creation demands a price. As his art becomes more powerful, he must choose between his gift and his soul.",
    tags: ["historical", "fantasy", "art"],
    language: "English",
    upvotes: 167,
    comments: 41,
    tips: 7.9,
    followers: 73,
    isFollowing: false,
    coverImage: "/minimalist-paintbrush-stroke-in-renaissance-gold-a.jpg",
    createdAt: "2024-01-07",
    updatedAt: "2024-01-16",
    chapters: [
      {
        id: "1",
        title: "Chapter 1: The Commission",
        wordCount: 1320,
        publishedAt: "2024-01-07",
        upvotes: 52,
        comments: 13,
      },
      {
        id: "2",
        title: "Chapter 2: Midnight Canvas",
        wordCount: 1280,
        publishedAt: "2024-01-11",
        upvotes: 48,
        comments: 15,
      },
      {
        id: "3",
        title: "Chapter 3: The Price of Art",
        wordCount: 1400,
        publishedAt: "2024-01-16",
        upvotes: 67,
        comments: 13,
      },
    ],
  },
  "8": {
    id: "8",
    title: "Neon Samurai",
    author: "cyberpunk_warrior",
    authorId: "cyberpunk_warrior",
    description:
      "In Neo-Tokyo 2087, the last samurai uses ancient techniques to fight corporate overlords in a world of neon and chrome. Kenji must balance honor with survival as he navigates the digital underworld.",
    tags: ["cyberpunk", "action", "samurai"],
    language: "English",
    upvotes: 278,
    comments: 89,
    tips: 18.3,
    followers: 134,
    isFollowing: false,
    coverImage: "/minimalist-katana-silhouette-with-neon-pink-and-cy.jpg",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-14",
    chapters: [
      {
        id: "1",
        title: "Chapter 1: Electric Honor",
        wordCount: 1450,
        publishedAt: "2024-01-01",
        upvotes: 98,
        comments: 32,
      },
      {
        id: "2",
        title: "Chapter 2: Corporate Shadows",
        wordCount: 1380,
        publishedAt: "2024-01-04",
        upvotes: 87,
        comments: 28,
      },
      {
        id: "3",
        title: "Chapter 3: Digital Duel",
        wordCount: 1520,
        publishedAt: "2024-01-08",
        upvotes: 93,
        comments: 29,
      },
    ],
  },
  "9": {
    id: "9",
    title: "The Greenhouse Keeper",
    author: "botanical_dreams",
    authorId: "botanical_dreams",
    description:
      "Elderly botanist Margaret tends to a magical greenhouse where each plant holds the dreams of sleeping children around the world. When the dreams begin to wither, she must find a way to restore hope to a generation.",
    tags: ["fantasy", "wholesome", "nature"],
    language: "English",
    upvotes: 124,
    comments: 67,
    tips: 5.6,
    followers: 58,
    isFollowing: false,
    coverImage: "/minimalist-plant-leaf-silhouette-in-soft-green-gra.jpg",
    createdAt: "2024-01-09",
    updatedAt: "2024-01-21",
    chapters: [
      {
        id: "1",
        title: "Chapter 1: The Garden of Dreams",
        wordCount: 1100,
        publishedAt: "2024-01-09",
        upvotes: 45,
        comments: 22,
      },
      {
        id: "2",
        title: "Chapter 2: Wilting Hope",
        wordCount: 1200,
        publishedAt: "2024-01-13",
        upvotes: 38,
        comments: 25,
      },
      {
        id: "3",
        title: "Chapter 3: Seeds of Tomorrow",
        wordCount: 1250,
        publishedAt: "2024-01-18",
        upvotes: 41,
        comments: 20,
      },
    ],
  },
  "10": {
    id: "10",
    title: "Code Red Hearts",
    author: "hacker_romance",
    authorId: "hacker_romance",
    description:
      "Elite hacker Alex infiltrates a tech corporation to expose corruption, but falls for the CEO's daughter who's fighting the same battle from the inside. Together, they must navigate corporate espionage and forbidden love.",
    tags: ["thriller", "romance", "hacking"],
    language: "English",
    upvotes: 192,
    comments: 35,
    tips: 13.2,
    followers: 81,
    isFollowing: false,
    coverImage: "/minimalist-binary-code-pattern-in-red-and-black-gr.jpg",
    createdAt: "2024-01-06",
    updatedAt: "2024-01-20",
    chapters: [
      {
        id: "1",
        title: "Chapter 1: System Breach",
        wordCount: 1350,
        publishedAt: "2024-01-06",
        upvotes: 67,
        comments: 12,
      },
      {
        id: "2",
        title: "Chapter 2: Inside Access",
        wordCount: 1420,
        publishedAt: "2024-01-10",
        upvotes: 58,
        comments: 11,
      },
      {
        id: "3",
        title: "Chapter 3: Double Agent",
        wordCount: 1380,
        publishedAt: "2024-01-15",
        upvotes: 67,
        comments: 12,
      },
    ],
  },
  "11": {
    id: "11",
    title: "Digital Nomad Chronicles",
    author: "worldapp_user",
    authorId: "worldapp_user",
    description:
      "Following the journey of a software developer who travels the world while building the next generation of decentralized applications. From co-working spaces in Bali to hackathons in Berlin, this is the story of building a startup while living the nomad dream.",
    tags: ["tech", "travel", "lifestyle"],
    language: "English",
    upvotes: 156,
    comments: 32,
    tips: 9.4,
    followers: 67,
    isFollowing: false,
    coverImage: "/minimalist-laptop-silhouette-with-world-map-backgr.jpg",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-21",
    chapters: [
      {
        id: "1",
        title: "Chapter 1: The Decision",
        wordCount: 1200,
        publishedAt: "2024-01-20",
        upvotes: 45,
        comments: 12,
      },
      {
        id: "2",
        title: "Chapter 2: First Flight",
        wordCount: 1350,
        publishedAt: "2024-01-21",
        upvotes: 38,
        comments: 8,
      },
      {
        id: "3",
        title: "Chapter 3: Bali Beginnings",
        wordCount: 1180,
        publishedAt: "2024-01-22",
        upvotes: 42,
        comments: 7,
      },
      {
        id: "4",
        title: "Chapter 4: Code and Coffee",
        wordCount: 1420,
        publishedAt: "2024-01-23",
        upvotes: 31,
        comments: 5,
      },
      {
        id: "5",
        title: "Chapter 5: Berlin Hackathon",
        wordCount: 1500,
        publishedAt: "2024-01-24",
        upvotes: 52,
        comments: 9,
      },
      {
        id: "6",
        title: "Chapter 6: Finding Balance",
        wordCount: 1280,
        publishedAt: "2024-01-25",
        upvotes: 48,
        comments: 6,
      },
      {
        id: "7",
        title: "Chapter 7: The Next Destination",
        wordCount: 1320,
        publishedAt: "2024-01-26",
        upvotes: 44,
        comments: 8,
      },
    ],
  },
  "12": {
    id: "12",
    title: "The Startup Diaries",
    author: "worldapp_user",
    authorId: "worldapp_user",
    description:
      "An honest look at the ups and downs of building a tech startup from idea to IPO, including all the failures along the way. This is the unfiltered story of late nights, failed pitches, breakthrough moments, and the people who make it all possible.",
    tags: ["business", "entrepreneurship", "tech"],
    language: "English",
    upvotes: 89,
    comments: 18,
    tips: 5.2,
    followers: 34,
    isFollowing: false,
    coverImage: "/minimalist-rocket-launch-silhouette-in-gradient-blu.jpg",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-18",
    chapters: [
      {
        id: "1",
        title: "Chapter 1: The Idea",
        wordCount: 1100,
        publishedAt: "2024-01-15",
        upvotes: 34,
        comments: 8,
      },
      {
        id: "2",
        title: "Chapter 2: First Pitch",
        wordCount: 1250,
        publishedAt: "2024-01-18",
        upvotes: 28,
        comments: 6,
      },
    ],
  },
}

export function StoryPage({ storyId }: StoryPageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [story, setStory] = useState<StoredStory | any>(null)
  const [isStoredStory, setIsStoredStory] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  // Determine if current user is the author of this story
  const currentUserId = user?.address || "demo_user"
  const isOwnStory = story && story.authorId === currentUserId
  const backUrl = isOwnStory ? "/profile" : "/"

  useEffect(() => {
    // First try to get from localStorage (user published stories)
    const storedStory = getStoryById(storyId)
    if (storedStory) {
      setStory(storedStory)
      setIsStoredStory(true)
      // Increment view count when story is loaded
      updateStoryStats(storyId, { views: storedStory.stats.views + 1 })
    } else {
      // Fall back to mock stories
      const mockStory = mockStories[storyId as keyof typeof mockStories]
      if (mockStory) {
        setStory(mockStory)
        setIsStoredStory(false)
        setIsFollowing(mockStory.isFollowing || false)
      }
    }
  }, [storyId])


  if (!story) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center page-transition">
        <div className="text-center">
          <h1 className="text-2xl font-sans font-bold mb-2">Story Not Found</h1>
          <p className="text-muted-foreground mb-4">The story you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleFollow = async () => {
    // In real app, this would call your API
    setIsFollowing(!isFollowing)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: story.title,
        text: story.description,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background page-transition">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <Link href={backUrl} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <button onClick={handleShare} className="p-2 text-muted-foreground hover:text-foreground">
            <Share className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 content-fade-in">
        {/* Story Header */}
        <div className="flex gap-4 mb-6">
          {story.coverImage ? (
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-32 h-44 object-cover rounded-lg flex-shrink-0"
            />
          ) : (
            <div className="w-32 h-44 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-sans font-bold text-balance mb-2">{story.title}</h1>

            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <Link href={`/author/${story.authorId}`} className="text-sm font-medium text-primary hover:underline">
                {isStoredStory ? story.authorName : story.author}
              </Link>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {story.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {isStoredStory ? story.stats.likes : story.upvotes}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {isStoredStory ? story.stats.views : story.comments}
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {isStoredStory ? `${story.stats.tips.toFixed(1)} WLD` : `${story.tips.toFixed(1)} WLD`}
              </div>
            </div>

            <Button onClick={handleFollow} variant={isFollowing ? "outline" : "default"} className="w-full">
              {isFollowing ? "Following" : "Follow Author"}
            </Button>
          </div>
        </div>

        {/* Description */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="font-sans font-semibold mb-3">About This Story</h3>
            <p className="text-muted-foreground leading-relaxed text-pretty">{story.description}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span>Language: {isStoredStory ? (story.language === 'en' ? 'English' : story.language) : story.language}</span>
              {isStoredStory ? (
                <span>{story.stats.totalWords} words</span>
              ) : (
                <span>{story.followers} followers</span>
              )}
              <span>Started {new Date(story.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Chapters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sans font-semibold">Chapters</h3>
              <span className="text-sm text-muted-foreground">{story.chapters.length} chapters</span>
            </div>

            <div className="space-y-3">
              {story.chapters.map((chapter: any, index: number) => (
                <Link key={chapter.id} href={`/story/${storyId}/chapter/${chapter.id}`} className="block">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-balance mb-1">{chapter.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{chapter.wordCount} words</span>
                        <span>{new Date(isStoredStory ? chapter.createdAt : chapter.publishedAt).toLocaleDateString()}</span>
                        {isStoredStory && <span>Chapter {chapter.chapterNumber}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {!isStoredStory && (
                        <>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {chapter.upvotes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {chapter.comments}
                          </div>
                        </>
                      )}
                      <BookOpen className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
