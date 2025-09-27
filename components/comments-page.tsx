"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { AuthPrompt } from "@/components/auth-prompt"
import { ArrowLeft, Heart, MessageCircle, Send, Flag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CommentsPageProps {
  storyId: string
  chapterId: string
}

const mockComments = [
  {
    id: "1",
    user: "bookworm_sarah",
    content:
      "This chapter gave me chills! The way you described the library was so vivid, I could almost smell the old books. Can't wait to see what Maya finds next!",
    timeAgo: "2h ago",
    likes: 12,
    isLiked: false,
  },
  {
    id: "2",
    user: "dystopian_fan",
    content:
      "The worldbuilding is incredible. The idea of the Great Burning really hits home in today's world. Maya is such a relatable protagonist.",
    timeAgo: "4h ago",
    likes: 8,
    isLiked: true,
  },
  {
    id: "3",
    user: "reader_alex",
    content:
      "That cliffhanger though! 😱 Who do you think is in the library with Maya? My theory is it's one of the Keepers mentioned in the note.",
    timeAgo: "6h ago",
    likes: 15,
    isLiked: false,
  },
  {
    id: "4",
    user: "story_lover",
    content:
      "Beautiful prose as always, maya_writes! The tension is building perfectly. I love how you're weaving in the themes of censorship and knowledge preservation.",
    timeAgo: "1d ago",
    likes: 6,
    isLiked: false,
  },
]

const mockChapter = {
  title: "Chapter 1: The Discovery",
  story: {
    title: "The Last Library",
    author: "maya_writes",
  },
}

export function CommentsPage({ storyId, chapterId }: CommentsPageProps) {
  const { user, verify } = useAuth()
  const router = useRouter()
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!user) {
    return <AuthPrompt />
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    if (!user.isVerified) {
      const nullifierHash = await verify("comment-post")
      if (!nullifierHash) {
        alert("Verification required to post comments")
        return
      }
    }

    setIsSubmitting(true)
    try {
      // In real app, this would call your API
      const comment = {
        id: Date.now().toString(),
        user: user.username,
        content: newComment.trim(),
        timeAgo: "now",
        likes: 0,
        isLiked: false,
      }

      setComments((prev) => [comment, ...prev])
      setNewComment("")
    } catch (error) {
      console.error("Failed to post comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <Link
            href={`/story/${storyId}/chapter/${chapterId}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Chapter</span>
          </Link>
          {/* Removed chaptr logo from header */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            {comments.length} comments
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Chapter Info */}
        <div className="mb-6">
          <h1 className="text-xl font-sans font-semibold text-balance mb-1">{mockChapter.title}</h1>
          <p className="text-sm text-muted-foreground">
            from {mockChapter.story.title} by {mockChapter.story.author}
          </p>
        </div>

        {/* Comment Form */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Textarea
                placeholder="Share your thoughts about this chapter..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{newComment.length}/500 characters</span>
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting || newComment.length > 500}
                  size="sm"
                >
                  {isSubmitting ? (
                    "Posting..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Post Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{comment.user.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{comment.user}</p>
                      <p className="text-xs text-muted-foreground">{comment.timeAgo}</p>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <Flag className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-sm leading-relaxed mb-4 text-pretty">{comment.content}</p>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      comment.isLiked ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${comment.isLiked ? "fill-current" : ""}`} />
                    {comment.likes}
                  </button>
                  <button className="text-sm text-muted-foreground hover:text-foreground">Reply</button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {comments.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline">Load More Comments</Button>
          </div>
        )}
      </div>
    </div>
  )
}
