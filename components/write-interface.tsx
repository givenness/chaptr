"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Plus, X, Eye, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { saveStory, fileToBase64 } from "@/lib/story-storage"

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
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"story" | "chapter">("story")
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Mock user for writing functionality
  const mockUser = { id: "mock_user", username: "guest_writer" }

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
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)


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

  const renderMarkdown = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/\n/g, '<br />')
  }

  const getReadingTime = (wordCount: number) => {
    const wordsPerMinute = 200
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readingTime} min read`
  }

  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB')
        return
      }

      setCoverImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeCoverImage = () => {
    setCoverImageFile(null)
    setCoverImagePreview(null)
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      // Convert cover image to base64 if exists
      let coverImageBase64: string | undefined
      if (coverImageFile) {
        coverImageBase64 = await fileToBase64(coverImageFile)
      }

      // Save the story using our storage utility with mock user
      const savedStory = saveStory({
        title: story.title,
        description: story.description,
        tags: story.tags,
        language: story.language,
        coverImage: coverImageBase64,
        authorId: mockUser.id,
        authorName: mockUser.username,
        chapterTitle: chapter.title,
        chapterContent: chapter.content,
        wordCount: chapter.wordCount
      })

      console.log("Story published successfully:", savedStory)
      alert("Story published successfully!")

      // Reset form
      setStory({
        title: "",
        description: "",
        tags: [],
        language: "en",
      })
      setChapter({
        title: "",
        content: "",
        wordCount: 0,
      })
      setCoverImageFile(null)
      setCoverImagePreview(null)

      router.push("/profile")
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
      <div className="max-w-2xl mx-auto mini-app-padding pt-6">
        {/* Action buttons */}
        <div className="flex items-center justify-between mini-app-header-gap">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <Button onClick={handlePublish} disabled={!canPublish || isPublishing} size="sm">
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
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
              <CardTitle className="font-sans">Story Information</CardTitle>
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
                  className="text-lg font-sans"
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
                {coverImagePreview ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={coverImagePreview}
                        alt="Cover preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        onClick={removeCoverImage}
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setCoverImageFile(null)}>
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Upload a cover image for your story</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                      className="hidden"
                      id="cover-upload"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="cover-upload" className="cursor-pointer">
                        Choose File
                      </label>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported: JPG, PNG, GIF (max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="font-sans">First Chapter</CardTitle>
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
                  className="font-sans"
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
                  className="resize-none font-sans leading-relaxed"
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Write at least 100 words for your first chapter. You can use basic markdown formatting.
                </p>
              </div>

              {/* Preview Button */}
              <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent mb-6"
                    disabled={!chapter.content.trim()}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Chapter
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-sans text-xl">
                      {chapter.title || "Chapter Preview"}
                    </DialogTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{chapter.wordCount} words</span>
                      <span>{getReadingTime(chapter.wordCount)}</span>
                    </div>
                  </DialogHeader>
                  <div className="mt-6">
                    <div
                      className="prose prose-lg font-sans leading-relaxed max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(chapter.content)
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>

              {/* Bottom padding for mobile navigation */}
              <div className="h-6"></div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
