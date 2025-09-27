"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { AuthPrompt } from "@/components/auth-prompt"
import { BookOpen, Heart, Clock, User } from "lucide-react"
import Link from "next/link"

const mockLibraryData = {
  following: [
    {
      id: "1",
      username: "maya_writes",
      storiesCount: 3,
      followersCount: 1250,
      latestStory: "The Last Library",
      avatar: null,
    },
    {
      id: "2",
      username: "starlight_pen",
      storiesCount: 7,
      followersCount: 890,
      latestStory: "Moonlight Academy",
      avatar: null,
    },
    {
      id: "3",
      username: "tech_romance",
      storiesCount: 2,
      followersCount: 456,
      latestStory: "Digital Hearts",
      avatar: null,
    },
  ],
  readingList: [
    {
      id: "1",
      title: "The Last Library",
      author: "maya_writes",
      progress: 75,
      lastRead: "2 days ago",
      coverImage: "/book-cover-dystopian-library.jpg",
      tags: ["dystopian", "romance"],
    },
    {
      id: "2",
      title: "Moonlight Academy",
      author: "starlight_pen",
      progress: 45,
      lastRead: "1 week ago",
      coverImage: "/fantasy-academy-moonlight-magic.jpg",
      tags: ["fantasy", "young adult"],
    },
    {
      id: "4",
      title: "The Quantum Café",
      author: "physics_writer",
      progress: 20,
      lastRead: "2 weeks ago",
      coverImage: "/minimal-sci-fi-book-cover-aesthetic.jpg",
      tags: ["sci-fi", "philosophy"],
    },
  ],
  recentActivity: [
    {
      id: "1",
      type: "upvote",
      story: "The Last Library",
      chapter: "Chapter 3: The Keeper",
      timeAgo: "2h ago",
    },
    {
      id: "2",
      type: "comment",
      story: "Moonlight Academy",
      chapter: "Chapter 5: First Lessons",
      timeAgo: "1d ago",
    },
    {
      id: "3",
      type: "follow",
      author: "maya_writes",
      timeAgo: "3d ago",
    },
  ],
}

export function LibraryPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<"reading" | "following" | "activity">("reading")

  if (!user) {
    return <AuthPrompt />
  }

  return (
    <div className="min-h-screen bg-background mini-app-nav-spacing safe-area-bottom">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="mini-app-padding py-6">
          <h1 className="text-2xl font-serif font-bold">Your Library</h1>
          <p className="text-sm text-muted-foreground mt-2">Your reading progress and followed authors</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mini-app-padding" style={{ marginTop: '48px' }}>
        {/* Tabs */}
        <div className="flex gap-2 mini-app-header-gap">
          <Button
            variant={activeTab === "reading" ? "default" : "outline"}
            onClick={() => setActiveTab("reading")}
            className="flex-1"
          >
            Reading List
          </Button>
          <Button
            variant={activeTab === "following" ? "default" : "outline"}
            onClick={() => setActiveTab("following")}
            className="flex-1"
          >
            Following
          </Button>
          <Button
            variant={activeTab === "activity" ? "default" : "outline"}
            onClick={() => setActiveTab("activity")}
            className="flex-1"
          >
            Activity
          </Button>
        </div>

        {/* Reading List Tab */}
        {activeTab === "reading" && (
          <div className="mini-app-element-gap">
            {mockLibraryData.readingList.map((story) => (
              <Card key={story.id}>
                <CardContent className="mini-app-padding">
                  <div className="flex gap-4">
                    <img
                      src={
                        story.coverImage ||
                        "/placeholder.svg?height=88&width=64&query=minimal elegant book cover design" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={story.title}
                      className="w-16 h-22 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-semibold text-balance mb-1">{story.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">by {story.author}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {story.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{story.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${story.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Last read {story.lastRead}</span>
                        <Link href={`/story/${story.id}`}>
                          <Button size="sm" variant="outline">
                            Continue Reading
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

        {/* Following Tab */}
        {activeTab === "following" && (
          <div className="mini-app-element-gap">
            {mockLibraryData.following.map((author) => (
              <Card key={author.id}>
                <CardContent className="mini-app-padding">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-balance mb-1">{author.username}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>{author.storiesCount} stories</span>
                        <span>{author.followersCount} followers</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Latest: {author.latestStory}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs">
                        Unfollow
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="mini-app-element-gap">
            {mockLibraryData.recentActivity.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="mini-app-padding">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      {activity.type === "upvote" && <Heart className="h-4 w-4 text-primary" />}
                      {activity.type === "comment" && <BookOpen className="h-4 w-4 text-primary" />}
                      {activity.type === "follow" && <User className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      {activity.type === "upvote" && (
                        <p className="text-sm">
                          You upvoted <span className="font-medium">{activity.chapter}</span> in{" "}
                          <span className="font-medium">{activity.story}</span>
                        </p>
                      )}
                      {activity.type === "comment" && (
                        <p className="text-sm">
                          You commented on <span className="font-medium">{activity.chapter}</span> in{" "}
                          <span className="font-medium">{activity.story}</span>
                        </p>
                      )}
                      {activity.type === "follow" && (
                        <p className="text-sm">
                          You started following <span className="font-medium">{activity.author}</span>
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{activity.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
