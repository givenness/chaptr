"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { AuthPrompt } from "@/components/auth-prompt"
import { ArrowLeft, User, Heart, MessageCircle, DollarSign, Shield, Share, BookOpen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatCurrencyShort } from "@/lib/currency"

interface AuthorProfileProps {
  authorId: string
}

// Mock author data
const mockAuthors = {
  maya_writes: {
    id: "maya_writes",
    username: "maya_writes",
    displayName: "Maya Chen",
    bio: "Passionate storyteller exploring themes of dystopia, hope, and human connection. Published author turned digital native. Coffee addict and book collector. Former librarian with a Master's in Literature from UC Berkeley.",
    isVerified: true,
    joinedDate: "2023-08-15",
    location: "San Francisco, CA",
    website: "https://mayawrites.com",
    stats: {
      followers: 1250,
      following: 89,
      stories: 3,
      totalUpvotes: 1456,
      totalComments: 234,
      totalTips: 67.8,
    },
    stories: [
      {
        id: "1",
        title: "The Last Library",
        description: "In a world where books are forbidden, Maya discovers a hidden library...",
        tags: ["dystopian", "romance", "adventure"],
        chapters: 3,
        upvotes: 234,
        comments: 45,
        tips: 12.5,
        status: "ongoing",
        lastUpdated: "2024-01-20",
        coverImage: "/minimalist-abstract-geometric-shapes-in-muted-eart.jpg",
      },
      {
        id: "2",
        title: "Echoes of Tomorrow",
        description: "A time traveler discovers that changing the past has unexpected consequences...",
        tags: ["sci-fi", "thriller", "time travel"],
        chapters: 1,
        upvotes: 89,
        comments: 23,
        tips: 8.2,
        status: "ongoing",
        lastUpdated: "2024-01-18",
        coverImage: "/minimalist-clock-spiral-in-silver-and-blue-gradien.jpg",
      },
      {
        id: "3",
        title: "The Memory Keeper",
        description: "In a society where memories can be extracted and stored...",
        tags: ["sci-fi", "drama", "psychological"],
        chapters: 5,
        upvotes: 345,
        comments: 78,
        tips: 23.1,
        status: "completed",
        lastUpdated: "2024-01-10",
        coverImage: "/minimalist-brain-silhouette-in-purple-and-teal-gra.jpg",
      },
    ],
  },
  starlight_pen: {
    id: "starlight_pen",
    username: "starlight_pen",
    displayName: "Luna Starweaver",
    bio: "Fantasy writer with a love for magical academies and coming-of-age stories. When I'm not writing, you can find me stargazing or reading tarot cards. PhD in Mythology and Folklore from Oxford University.",
    isVerified: true,
    joinedDate: "2023-09-20",
    location: "Edinburgh, Scotland",
    website: "https://starlightpen.co.uk",
    stats: {
      followers: 892,
      following: 156,
      stories: 2,
      totalUpvotes: 743,
      totalComments: 189,
      totalTips: 34.2,
    },
    stories: [
      {
        id: "2",
        title: "Moonlight Academy",
        description: "When Elena receives her acceptance letter to the mysterious Moonlight Academy...",
        tags: ["fantasy", "young adult", "magic"],
        chapters: 2,
        upvotes: 189,
        comments: 67,
        tips: 8.3,
        status: "ongoing",
        lastUpdated: "2024-01-18",
        coverImage: "/minimalist-crescent-moon-silhouette-in-deep-blue-g.jpg",
      },
    ],
  },
  tech_romance: {
    id: "tech_romance",
    username: "tech_romance",
    displayName: "Alex Rivera",
    bio: "Software engineer by day, romance writer by night. Exploring the intersection of technology and human connection in the digital age. MIT Computer Science graduate, currently working at a leading AI company in Silicon Valley.",
    isVerified: false,
    joinedDate: "2023-11-10",
    location: "Austin, TX",
    website: "https://alexrivera.dev",
    stats: {
      followers: 445,
      following: 78,
      stories: 1,
      totalUpvotes: 156,
      totalComments: 23,
      totalTips: 15.7,
    },
    stories: [
      {
        id: "3",
        title: "Digital Hearts",
        description: "In 2045, AI companion apps are the norm. But when Zoe's AI starts showing real emotions...",
        tags: ["sci-fi", "romance", "technology"],
        chapters: 1,
        upvotes: 156,
        comments: 23,
        tips: 15.7,
        status: "ongoing",
        lastUpdated: "2024-01-16",
        coverImage: "/minimalist-circuit-pattern-in-soft-pink-and-blue-t.jpg",
      },
    ],
  },
  marine_storyteller: {
    id: "marine_storyteller",
    username: "marine_storyteller",
    displayName: "Dr. Sarah Chen",
    bio: "Marine biologist turned storyteller, fascinated by the mysteries of the deep ocean. PhD in Marine Biology from Scripps Institution. Currently researching coral reef restoration while crafting tales of underwater worlds.",
    isVerified: true,
    joinedDate: "2023-07-12",
    location: "La Jolla, CA",
    website: "https://oceanstories.net",
    stats: {
      followers: 623,
      following: 134,
      stories: 2,
      totalUpvotes: 287,
      totalComments: 89,
      totalTips: 18.4,
    },
    stories: [
      {
        id: "4",
        title: "Ocean's Whisper",
        description: "Marine biologist Dr. Sarah Chen discovers an ancient underwater civilization...",
        tags: ["adventure", "mystery", "ocean"],
        chapters: 2,
        upvotes: 98,
        comments: 34,
        tips: 6.2,
        status: "ongoing",
        lastUpdated: "2024-01-19",
        coverImage: "/minimalist-ocean-waves-in-teal-and-navy-blue-gradi.jpg",
      },
    ],
  },
  noir_writer: {
    id: "noir_writer",
    username: "noir_writer",
    displayName: "Marcus Blackwood",
    bio: "Crime fiction enthusiast with a passion for 1940s noir aesthetics. Former private investigator turned full-time writer. Collector of vintage detective novels and classic film memorabilia.",
    isVerified: true,
    joinedDate: "2023-06-08",
    location: "Chicago, IL",
    website: "https://marcusblackwood.com",
    stats: {
      followers: 1089,
      following: 67,
      stories: 3,
      totalUpvotes: 892,
      totalComments: 156,
      totalTips: 45.6,
    },
    stories: [
      {
        id: "5",
        title: "The Memory Thief",
        description: "In 1940s Chicago, detective Jack Morrison investigates a series of crimes...",
        tags: ["noir", "thriller", "historical"],
        chapters: 4,
        upvotes: 145,
        comments: 28,
        tips: 9.8,
        status: "ongoing",
        lastUpdated: "2024-01-17",
        coverImage: "/minimalist-film-noir-shadows-in-black-and-white-gr.jpg",
      },
    ],
  },
  coffee_physicist: {
    id: "coffee_physicist",
    username: "coffee_physicist",
    displayName: "Dr. Emma Rodriguez",
    bio: "Theoretical physicist with a love for quantum mechanics and specialty coffee. PhD from CERN, currently researching parallel universe theories. Owns a small coffee shop that serves as inspiration for interdimensional stories.",
    isVerified: true,
    joinedDate: "2023-10-03",
    location: "Geneva, Switzerland",
    website: "https://quantumcafe.ch",
    stats: {
      followers: 756,
      following: 203,
      stories: 1,
      totalUpvotes: 203,
      totalComments: 52,
      totalTips: 11.4,
    },
    stories: [
      {
        id: "6",
        title: "Quantum Café",
        description:
          "Every morning at 7:23 AM, physicist Dr. Emma Rodriguez's coffee shop shifts between parallel dimensions...",
        tags: ["sci-fi", "slice of life", "physics"],
        chapters: 3,
        upvotes: 203,
        comments: 52,
        tips: 11.4,
        status: "ongoing",
        lastUpdated: "2024-01-21",
        coverImage: "/minimalist-coffee-cup-silhouette-with-geometric-pa.jpg",
      },
    ],
  },
  renaissance_tales: {
    id: "renaissance_tales",
    username: "renaissance_tales",
    displayName: "Isabella Medici",
    bio: "Art historian specializing in Renaissance period. Fluent in Italian, Latin, and ancient Greek. Currently curating exhibitions at the Uffizi Gallery while writing historical fantasy inspired by Renaissance masters.",
    isVerified: true,
    joinedDate: "2023-05-15",
    location: "Florence, Italy",
    website: "https://renaissancetales.it",
    stats: {
      followers: 934,
      following: 112,
      stories: 2,
      totalUpvotes: 456,
      totalComments: 98,
      totalTips: 28.7,
    },
    stories: [
      {
        id: "7",
        title: "The Painter's Curse",
        description:
          "In Renaissance Florence, young artist Lorenzo discovers that his paintings come to life at midnight...",
        tags: ["historical", "fantasy", "art"],
        chapters: 3,
        upvotes: 167,
        comments: 41,
        tips: 7.9,
        status: "ongoing",
        lastUpdated: "2024-01-15",
        coverImage: "/minimalist-paintbrush-stroke-in-renaissance-gold-a.jpg",
      },
    ],
  },
  cyberpunk_warrior: {
    id: "cyberpunk_warrior",
    username: "cyberpunk_warrior",
    displayName: "Kenji Nakamura",
    bio: "Cybersecurity expert and martial arts enthusiast. Black belt in Kendo, currently working in Tokyo's tech district. Fascinated by the intersection of ancient warrior traditions and futuristic technology.",
    isVerified: true,
    joinedDate: "2023-04-22",
    location: "Tokyo, Japan",
    website: "https://neonsamurai.jp",
    stats: {
      followers: 1456,
      following: 89,
      stories: 2,
      totalUpvotes: 567,
      totalComments: 134,
      totalTips: 42.8,
    },
    stories: [
      {
        id: "8",
        title: "Neon Samurai",
        description: "In Neo-Tokyo 2087, the last samurai uses ancient techniques to fight corporate overlords...",
        tags: ["cyberpunk", "action", "samurai"],
        chapters: 5,
        upvotes: 278,
        comments: 89,
        tips: 18.3,
        status: "ongoing",
        lastUpdated: "2024-01-20",
        coverImage: "/minimalist-katana-silhouette-with-neon-pink-and-cy.jpg",
      },
    ],
  },
  botanical_dreams: {
    id: "botanical_dreams",
    username: "botanical_dreams",
    displayName: "Margaret Thornfield",
    bio: "Retired botanist with 40 years of experience in rare plant conservation. Grandmother of seven, passionate about connecting children with nature through storytelling. Maintains a magical garden that inspires whimsical tales.",
    isVerified: true,
    joinedDate: "2023-09-01",
    location: "Cotswolds, England",
    website: "https://botanicaldreams.co.uk",
    stats: {
      followers: 678,
      following: 234,
      stories: 3,
      totalUpvotes: 389,
      totalComments: 156,
      totalTips: 22.1,
    },
    stories: [
      {
        id: "9",
        title: "The Greenhouse Keeper",
        description:
          "Elderly botanist Margaret tends to a magical greenhouse where each plant holds the dreams of sleeping children...",
        tags: ["fantasy", "wholesome", "nature"],
        chapters: 2,
        upvotes: 124,
        comments: 67,
        tips: 5.6,
        status: "ongoing",
        lastUpdated: "2024-01-18",
        coverImage: "/minimalist-plant-leaf-silhouette-in-soft-green-gra.jpg",
      },
    ],
  },
  hacker_romance: {
    id: "hacker_romance",
    username: "hacker_romance",
    displayName: "Phoenix Chen",
    bio: "Ethical hacker and cybersecurity consultant by day, romance thriller writer by night. Former NSA analyst turned freelance security expert. Passionate about exposing corporate corruption through both code and storytelling.",
    isVerified: false,
    joinedDate: "2023-12-05",
    location: "Seattle, WA",
    website: "https://phoenixchen.security",
    stats: {
      followers: 512,
      following: 156,
      stories: 1,
      totalUpvotes: 192,
      totalComments: 35,
      totalTips: 13.2,
    },
    stories: [
      {
        id: "10",
        title: "Code Red Hearts",
        description:
          "Elite hacker Alex infiltrates a tech corporation to expose corruption, but falls for the CEO's daughter...",
        tags: ["thriller", "romance", "hacking"],
        chapters: 2,
        upvotes: 192,
        comments: 35,
        tips: 13.2,
        status: "ongoing",
        lastUpdated: "2024-01-16",
        coverImage: "/minimalist-binary-code-pattern-in-red-and-black-gr.jpg",
      },
    ],
  },
}

export function AuthorProfile({ authorId }: AuthorProfileProps) {
  const { user } = useAuth()
  const router = useRouter()
  const author = mockAuthors[authorId as keyof typeof mockAuthors]
  const [isFollowing, setIsFollowing] = useState(false)

  if (!user) {
    return <AuthPrompt />
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-sans font-bold mb-2">Author Not Found</h1>
          <p className="text-muted-foreground mb-4">The author you're looking for doesn't exist.</p>
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
        title: `${author.displayName} on Chaptr`,
        text: `Check out stories by ${author.displayName}`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <button onClick={handleShare} className="p-2 text-muted-foreground hover:text-foreground">
            <Share className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Author Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-sans font-bold">{author.displayName}</h1>
                  {author.isVerified && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
                      <Shield className="h-3 w-3 text-primary" />
                      <span className="text-xs text-primary font-medium">Verified</span>
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-1">@{author.username}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {author.location} • Joined {new Date(author.joinedDate).toLocaleDateString()}
                </p>

                <div className="flex items-center gap-4 text-sm mb-4">
                  <span>
                    <strong>{author.stats.followers}</strong> followers
                  </span>
                  <span>
                    <strong>{author.stats.following}</strong> following
                  </span>
                  <span>
                    <strong>{author.stats.stories}</strong> stories
                  </span>
                </div>

                <Button onClick={handleFollow} variant={isFollowing ? "outline" : "default"} className="w-full">
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              </div>
            </div>

            {author.bio && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm leading-relaxed text-pretty">{author.bio}</p>
                {author.website && (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-2 inline-block"
                  >
                    {author.website}
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card>
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-lg font-semibold">{author.stats.totalUpvotes}</p>
                  <p className="text-xs text-muted-foreground">Total Upvotes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-lg font-semibold">{formatCurrencyShort(author.stats.totalTips)}</p>
                  <p className="text-xs text-muted-foreground">Tips Received</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stories */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-sans font-semibold text-lg">Published Stories</h2>
              <span className="text-sm text-muted-foreground">{author.stories.length} stories</span>
            </div>

            <div className="space-y-6">
              {author.stories.map((story) => (
                <div key={story.id} className="border-b border-border last:border-b-0 pb-6 last:pb-0">
                  <div className="flex gap-3">
                    <img
                      src={story.coverImage || "/placeholder.svg"}
                      alt={story.title}
                      className="w-14 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-sans font-semibold text-base leading-tight text-balance">{story.title}</h3>
                        <Badge
                          variant={story.status === "ongoing" ? "default" : "secondary"}
                          className="text-xs flex-shrink-0"
                        >
                          {story.status}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 text-pretty leading-relaxed">
                        {story.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {story.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {story.chapters}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {story.upvotes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {story.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {formatCurrencyShort(story.tips)}
                          </span>
                        </div>
                        <Link href={`/story/${story.id}`}>
                          <Button size="sm" variant="outline" className="text-xs px-3 py-1.5 bg-transparent">
                            Read
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
