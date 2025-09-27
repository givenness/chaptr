"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { AuthPrompt } from "@/components/auth-prompt"
import { User, BookOpen, Heart, MessageCircle, DollarSign, Shield } from "lucide-react"
import Link from "next/link"
import { formatCurrencyShort } from "@/lib/currency"

const mockStories = [
  {
    id: "11",
    title: "Digital Nomad Chronicles",
    author: "worldapp_user",
    authorId: "worldapp_user",
    excerpt:
      "Following the journey of a software developer who travels the world while building the next generation of decentralized applications...",
    tags: ["tech", "travel", "lifestyle"],
    upvotes: 156,
    comments: 32,
    tips: 9.4,
    timeAgo: "1d ago",
    coverImage: "/minimalist-laptop-silhouette-with-world-map-backgr.jpg",
    chapters: 7,
    status: "ongoing",
    lastUpdated: "2024-01-21",
  },
  {
    id: "12",
    title: "The Startup Diaries",
    author: "worldapp_user",
    authorId: "worldapp_user",
    excerpt:
      "An honest look at the ups and downs of building a tech startup from idea to IPO, including all the failures along the way...",
    tags: ["business", "entrepreneurship", "tech"],
    upvotes: 89,
    comments: 18,
    tips: 5.2,
    timeAgo: "3d ago",
    coverImage: "/minimalist-rocket-launch-silhouette-in-gradient-blu.jpg",
    chapters: 2,
    status: "draft",
    lastUpdated: "2024-01-18",
  },
]

export function ProfilePage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<"stories" | "stats" | "settings">("stories")

  if (!user) {
    return <AuthPrompt />
  }

  const userStories = mockStories.filter((story) => story.authorId === user.username)

  const mockUserStats = {
    storiesPublished: userStories.length,
    totalUpvotes: userStories.reduce((sum, story) => sum + story.upvotes, 0),
    totalComments: userStories.reduce((sum, story) => sum + story.comments, 0),
    totalTips: userStories.reduce((sum, story) => sum + story.tips, 0),
    followers: 234,
    following: 67,
    joinedDate: "2024-01-10",
  }

  return (
    <div className="min-h-screen bg-background mini-app-nav-spacing safe-area-bottom">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between mini-app-padding py-6">
          <h1 className="text-2xl font-serif font-bold">Profile</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mini-app-padding mini-app-header-gap">
        {/* Profile Header */}
        <Card className="mini-app-header-gap">
          <CardContent className="mini-app-padding">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-serif font-semibold">{user.username}</h2>
                  {user.isVerified && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full">
                      <Shield className="h-3 w-3 text-primary" />
                      <span className="text-xs text-primary font-medium">Verified</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Joined {new Date(mockUserStats.joinedDate).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span>
                    <strong>{mockUserStats.followers}</strong> followers
                  </span>
                  <span>
                    <strong>{mockUserStats.following}</strong> following
                  </span>
                  <span>
                    <strong>{mockUserStats.storiesPublished}</strong> stories
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mini-app-header-gap">
          <Button
            variant={activeTab === "stories" ? "default" : "outline"}
            onClick={() => setActiveTab("stories")}
            className="flex-1"
          >
            My Stories
          </Button>
          <Button
            variant={activeTab === "stats" ? "default" : "outline"}
            onClick={() => setActiveTab("stats")}
            className="flex-1"
          >
            Stats
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "outline"}
            onClick={() => setActiveTab("settings")}
            className="flex-1"
          >
            Settings
          </Button>
        </div>

        {/* Stories Tab */}
        {activeTab === "stories" && (
          <div className="mini-app-element-gap">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-semibold">Published Stories</h3>
              <Link href="/write">
                <Button size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  New Story
                </Button>
              </Link>
            </div>

            {userStories.length === 0 ? (
              <Card className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-serif font-semibold mb-2">No stories yet</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Start writing your first story and share it with the world
                </p>
                <Link href="/write">
                  <Button>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Write Your First Story
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="mini-app-element-gap">
                {userStories.map((story) => (
                  <Link key={story.id} href={`/story/${story.id}`} className="block">
                    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="mini-app-padding">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={
                                story.coverImage ||
                                "/placeholder.svg?height=88&width=64&query=minimal elegant book cover design" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                              alt={story.title}
                              className="w-16 h-20 object-cover rounded-lg border border-border/50"
                            />
                          </div>
                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <h4 className="font-serif font-semibold text-lg leading-tight text-balance">
                                {story.title}
                              </h4>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 text-pretty">
                              {story.excerpt}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {story.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
                              <span className="font-medium">{story.chapters} chapters</span>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3.5 w-3.5" />
                                <span>{story.upvotes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-3.5 w-3.5" />
                                <span>{story.comments}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="mini-app-section-gap">
            <div className="grid grid-cols-2 gap-3">
              <Card className="mini-app-padding">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Upvotes</p>
                    <p className="text-2xl font-bold mt-1">{mockUserStats.totalUpvotes.toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </Card>

              <Card className="mini-app-padding">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Comments</p>
                    <p className="text-2xl font-bold mt-1">{mockUserStats.totalComments.toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="mini-app-padding">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tips Received</p>
                    <p className="text-2xl font-bold mt-1">{mockUserStats.totalTips.toFixed(1)} WLD</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="mini-app-padding">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Stories Published
                    </p>
                    <p className="text-2xl font-bold mt-1">{mockUserStats.storiesPublished}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </Card>
            </div>

            <Card className="mini-app-padding">
              <h3 className="font-serif font-semibold mb-4">Engagement Overview</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{mockUserStats.followers}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{mockUserStats.following}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {mockUserStats.totalUpvotes > 0
                      ? Math.round((mockUserStats.totalComments / mockUserStats.totalUpvotes) * 100)
                      : 0}
                    %
                  </p>
                  <p className="text-sm text-muted-foreground">Engagement Rate</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="mini-app-element-gap">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-serif">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="mini-app-element-gap">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">World ID Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      {user.isVerified ? "Your account is verified" : "Verify your humanity to publish stories"}
                    </p>
                  </div>
                  {!user.isVerified && <Button size="sm">Verify Now</Button>}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications</h4>
                    <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Privacy</h4>
                    <p className="text-sm text-muted-foreground">Control who can see your profile and stories</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-serif">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="mini-app-element-gap">
                <Button onClick={logout} variant="outline" className="w-full bg-transparent">
                  Sign Out
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
