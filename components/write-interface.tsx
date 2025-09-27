"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { AuthPrompt } from "@/components/auth-prompt"
import { ArrowLeft, Plus, X, Eye, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const GENRE_OPTIONS = [
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
  "Contemporary",
]

const LANGUAGE_OPTIONS = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "th", name: "ไทย" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "tl", name: "Tagalog" },
]

interface Story {
  title: string
  description: string
  tags: string[]
  language: string
  coverImage?: string
}

interface Chapter {
  title: string
  content: string
  wordCount: number
}

export function WriteInterface() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"story" | "chapter">("story")
  const [isPublishing, setIsPublishing] = useState(false)

  // Story state
  const [story, setStory] = useState<Story>({
    title: "",
    description: "",
    tags: [],
    language: "en",
  })

  // Chapter state
  const [chapter, setChapter] = useState<Chapter>({
    title: "",
    content: "",
    wordCount: 0,
  })

  const [newTag, setNewTag] = useState("")

  if (!user) {
    return <AuthPrompt />
  }

  const addTag = () => {
    if (newTag.trim() && !story.tags.includes(newTag.trim()) && story.tags.length < 5) {
      setStory((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setStory((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const updateChapterContent = (content: string) => {
    const wordCount = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
    setChapter((prev) => ({
      ...prev,
      content,
      wordCount,
    }))
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      // In a real app, this would call your API
      console.log("Publishing story:", { story, chapter })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert("Story published successfully!")
      router.push("/")
    } catch (error) {
      console.error("Publishing failed:", error)
      alert("Failed to publish story")
    } finally {
      setIsPublishing(false)
    }
  }

  const canPublish =
    story.title.trim() &&
    story.description.trim() &&
    chapter.title.trim() &&
    chapter.content.trim() &&
    chapter.wordCount >= 100

  return (
    <div className="min-h-screen bg-background mini-app-nav-spacing safe-area-bottom">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
        <div className="mini-app-padding py-6">
          <h1 className="text-2xl font-serif font-bold">Write</h1>
          <p className="text-sm text-muted-foreground mt-2">Create and publish your stories</p>
        </div>
        <div className="flex items-center justify-between mini-app-padding pb-6">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <Button onClick={handlePublish} disabled={!canPublish || isPublishing} size="sm" className="mb-6">
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mini-app-padding mini-app-header-gap">
        {/* Tabs */}
        <div className="flex gap-2 mini-app-header-gap">
          <Button
            variant={activeTab === "story" ? "default" : "outline"}
            onClick={() => setActiveTab("story")}
            className="flex-1"
          >
            Story Details
          </Button>
          <Button
            variant={activeTab === "chapter" ? "default" : "outline"}
            onClick={() => setActiveTab("chapter")}
            className="flex-1"
          >
            First Chapter
          </Button>
        </div>

        {activeTab === "story" ? (
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Story Information</CardTitle>
            </CardHeader>
            <CardContent className="mini-app-padding mini-app-section-gap">
              {/* Title */}
              <div className="mini-app-element-gap">
                <Label htmlFor="title">Story Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter your story title"
                  value={story.title}
                  onChange={(e) => setStory((prev) => ({ ...prev, title: e.target.value }))}
                  className="text-lg font-serif"
                />
              </div>

              {/* Description */}
              <div className="mini-app-element-gap">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Write a compelling description that will hook readers..."
                  value={story.description}
                  onChange={(e) => setStory((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Language */}
              <div className="mini-app-element-gap">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  value={story.language}
                  onChange={(e) => setStory((prev) => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="mini-app-element-gap">
                <Label>Tags (up to 5)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {story.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                {story.tags.length < 5 && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTag()}
                      className="flex-1"
                    />
                    <Button onClick={addTag} size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 mt-2">
                  {GENRE_OPTIONS.filter((genre) => !story.tags.includes(genre))
                    .slice(0, 6)
                    .map((genre) => (
                      <button
                        key={genre}
                        onClick={() =>
                          story.tags.length < 5 &&
                          setStory((prev) => ({
                            ...prev,
                            tags: [...prev.tags, genre],
                          }))
                        }
                        className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
                        disabled={story.tags.length >= 5}
                      >
                        {genre}
                      </button>
                    ))}
                </div>
              </div>

              {/* Cover Image */}
              <div className="mini-app-element-gap">
                <Label>Cover Image (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Upload a cover image for your story</p>
                  <Button variant="outline" size="sm">
                    Choose File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">First Chapter</CardTitle>
            </CardHeader>
            <CardContent className="mini-app-padding mini-app-section-gap">
              {/* Chapter Title */}
              <div className="mini-app-element-gap">
                <Label htmlFor="chapter-title">Chapter Title *</Label>
                <Input
                  id="chapter-title"
                  placeholder="Chapter 1: The Beginning"
                  value={chapter.title}
                  onChange={(e) => setChapter((prev) => ({ ...prev, title: e.target.value }))}
                  className="font-serif"
                />
              </div>

              {/* Chapter Content */}
              <div className="mini-app-element-gap">
                <div className="flex items-center justify-between">
                  <Label htmlFor="chapter-content">Chapter Content *</Label>
                  <span className="text-sm text-muted-foreground">
                    {chapter.wordCount} words {chapter.wordCount < 100 && "(min 100)"}
                  </span>
                </div>
                <Textarea
                  id="chapter-content"
                  placeholder="Start writing your story here... Use markdown for formatting:

**bold text**
*italic text*
> blockquote

Remember: This is your first chapter, make it compelling!"
                  value={chapter.content}
                  onChange={(e) => updateChapterContent(e.target.value)}
                  rows={20}
                  className="resize-none font-serif leading-relaxed"
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Write at least 100 words for your first chapter. You can use basic markdown formatting.
                </p>
              </div>

              {/* Preview Button */}
              <Button variant="outline" className="w-full bg-transparent mb-6">
                <Eye className="h-4 w-4 mr-2" />
                Preview Chapter
              </Button>

              {/* Bottom padding for mobile navigation */}
              <div className="h-6"></div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
