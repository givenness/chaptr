"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { User, BookOpen, Heart, MessageCircle, DollarSign, Trash2 } from "lucide-react"
import Link from "next/link"
import { getUserStories, deleteStory, type StoredStory } from "@/lib/story-storage"
import { useAuth } from "@/components/auth-wrapper"


export function ProfilePage() {
  const { user } = useAuth()

  // Use authenticated user data
  const currentUser = {
    id: user?.address || "demo_user",
    username: user?.username || "demo_writer",
    isVerified: true // All World App users are verified
  }

  const [activeTab, setActiveTab] = useState<"stories" | "stats" | "settings">("stories")
  const [userStories, setUserStories] = useState<StoredStory[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [storyToDelete, setStoryToDelete] = useState<{id: string, title: string} | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const stories = getUserStories(currentUser.id)
    setUserStories(stories)
  }, [currentUser.id])

  const handleDeleteStory = (storyId: string, storyTitle: string) => {
    setStoryToDelete({ id: storyId, title: storyTitle })
    setDeleteDialogOpen(true)
  }

  const confirmDeleteStory = async () => {
    if (!storyToDelete) return

    setIsDeleting(true)
    try {
      const success = deleteStory(storyToDelete.id)
      if (success) {
        // Refresh the stories list
        const updatedStories = getUserStories(currentUser.id)
        setUserStories(updatedStories)
        console.log(`Story "${storyToDelete.title}" deleted successfully`)
      } else {
        console.error('Failed to delete story')
        alert('Failed to delete story. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting story:', error)
      alert('An error occurred while deleting the story. Please try again.')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setStoryToDelete(null)
    }
  }

  const userStats = {
    storiesPublished: userStories.length,
    totalUpvotes: userStories.reduce((sum, story) => sum + story.stats.likes, 0),
    totalComments: userStories.reduce((sum, story) => sum + story.stats.views, 0), // Using views as proxy for engagement
    totalTips: userStories.reduce((sum, story) => sum + story.stats.tips, 0),
    totalWords: userStories.reduce((sum, story) => sum + story.stats.totalWords, 0),
    followers: 234, // Keep as mock for now
    following: 67,   // Keep as mock for now
    joinedDate: "2024-01-10", // Keep as mock for now
  }

  return (
    <div className="min-h-screen bg-background mini-app-nav-spacing safe-area-bottom">
      <div className="max-w-2xl mx-auto mini-app-padding pt-6">
        {/* Profile Header */}
        <Card className="mini-app-header-gap">
          <CardContent className="mini-app-padding">
            <div className="flex items-start gap-4">
              {user?.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt={currentUser.username}
                  className="h-16 w-16 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-8 w-8 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-sans font-semibold">{currentUser.username}</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Joined {new Date(userStats.joinedDate).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span>
                    <strong>{userStats.followers}</strong> followers
                  </span>
                  <span>
                    <strong>{userStats.following}</strong> following
                  </span>
                  <span>
                    <strong>{userStats.storiesPublished}</strong> stories
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
              <h3 className="font-sans font-semibold">Published Stories</h3>
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
                <h4 className="font-sans font-semibold mb-2">No stories yet</h4>
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
                  <Card key={story.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer gradient-card hover-lift">
                    <CardContent className="p-3">
                      <div className="flex gap-2">
                        <Link href={`/story/${story.id}`} className="contents">
                          {story.coverImage ? (
                            <img
                              src={story.coverImage}
                              alt={story.title}
                              className="w-16 h-20 object-cover rounded-md flex-shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-20 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                              <BookOpen className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-0.5">
                            <Link href={`/story/${story.id}`} className="flex-1">
                              <h3 className="font-sans font-semibold text-base leading-tight text-balance">
                                {story.title}
                              </h3>
                            </Link>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleDeleteStory(story.id, story.title)
                              }}
                              className="text-muted-foreground hover:text-destructive transition-colors p-0.5"
                              title="Delete story"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>

                          <Link href={`/story/${story.id}`} className="block">
                            <p className="text-xs text-muted-foreground mb-1.5 line-clamp-2 text-pretty">
                              {story.description}
                            </p>

                            <div className="flex flex-wrap gap-0.5 mb-1.5">
                              {story.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0.5">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-medium">
                                {story.chapters.length} {story.chapters.length === 1 ? 'chapter' : 'chapters'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {story.stats.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {story.stats.views}
                              </span>
                              <span>{story.stats.totalWords} words</span>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
                    <p className="text-2xl font-bold mt-1">{userStats.totalUpvotes.toLocaleString()}</p>
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
                    <p className="text-2xl font-bold mt-1">{userStats.totalComments.toLocaleString()}</p>
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
                    <p className="text-2xl font-bold mt-1">{userStats.totalTips.toFixed(1)} WLD</p>
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
                    <p className="text-2xl font-bold mt-1">{userStats.storiesPublished}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </Card>
            </div>

            <Card className="mini-app-padding">
              <h3 className="font-sans font-semibold mb-4">Engagement Overview</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{userStats.followers}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{userStats.following}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {userStats.totalWords.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Words</p>
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
                <CardTitle className="text-lg font-sans">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="mini-app-element-gap">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">World ID Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      {currentUser.isVerified ? "Your account is verified" : "Verify your humanity to publish stories"}
                    </p>
                  </div>
                  {!currentUser.isVerified && <Button size="sm">Verify Now</Button>}
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
                <CardTitle className="text-lg font-sans">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="mini-app-element-gap">
                <Button variant="outline" className="w-full bg-transparent" disabled>
                  Sign Out (Demo Mode)
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-sans">Delete Story</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong>"{storyToDelete?.title}"</strong>?
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              This action cannot be undone. The story and all its chapters will be permanently removed.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteStory}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Story'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
