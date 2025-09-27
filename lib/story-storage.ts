export interface StoredStory {
  id: string
  title: string
  description: string
  tags: string[]
  language: string
  coverImage?: string // Base64 encoded image or URL
  authorId: string
  authorName: string
  createdAt: string
  updatedAt: string
  chapters: StoredChapter[]
  stats: {
    views: number
    likes: number
    tips: number
    totalWords: number
  }
}

export interface StoredChapter {
  id: string
  title: string
  content: string
  wordCount: number
  createdAt: string
  chapterNumber: number
}

const STORIES_KEY = 'chaptr_stories'
const USER_STORIES_KEY = 'chaptr_user_stories'

// Utility function to convert File to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// Get all stories from localStorage
export const getAllStories = (): StoredStory[] => {
  try {
    const stories = localStorage.getItem(STORIES_KEY)
    return stories ? JSON.parse(stories) : []
  } catch (error) {
    console.error('Error reading stories:', error)
    return []
  }
}

// Get stories for a specific user
export const getUserStories = (userId: string): StoredStory[] => {
  try {
    const allStories = getAllStories()
    return allStories.filter(story => story.authorId === userId)
  } catch (error) {
    console.error('Error reading user stories:', error)
    return []
  }
}

// Get a single story by ID
export const getStoryById = (storyId: string): StoredStory | null => {
  try {
    const allStories = getAllStories()
    return allStories.find(story => story.id === storyId) || null
  } catch (error) {
    console.error('Error reading story:', error)
    return null
  }
}

// Save a new story
export const saveStory = (storyData: {
  title: string
  description: string
  tags: string[]
  language: string
  coverImage?: string
  authorId: string
  authorName: string
  chapterTitle: string
  chapterContent: string
  wordCount: number
}): StoredStory => {
  try {
    const stories = getAllStories()
    const now = new Date().toISOString()
    const storyId = `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const chapterId = `chapter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const newStory: StoredStory = {
      id: storyId,
      title: storyData.title,
      description: storyData.description,
      tags: storyData.tags,
      language: storyData.language,
      coverImage: storyData.coverImage,
      authorId: storyData.authorId,
      authorName: storyData.authorName,
      createdAt: now,
      updatedAt: now,
      chapters: [
        {
          id: chapterId,
          title: storyData.chapterTitle,
          content: storyData.chapterContent,
          wordCount: storyData.wordCount,
          createdAt: now,
          chapterNumber: 1
        }
      ],
      stats: {
        views: 0,
        likes: 0,
        tips: 0,
        totalWords: storyData.wordCount
      }
    }

    stories.push(newStory)
    localStorage.setItem(STORIES_KEY, JSON.stringify(stories))

    console.log('Story saved successfully:', newStory)
    return newStory
  } catch (error) {
    console.error('Error saving story:', error)
    throw new Error('Failed to save story')
  }
}

// Update story stats (views, likes, tips)
export const updateStoryStats = (storyId: string, updates: Partial<StoredStory['stats']>): void => {
  try {
    const stories = getAllStories()
    const storyIndex = stories.findIndex(story => story.id === storyId)

    if (storyIndex !== -1) {
      stories[storyIndex].stats = { ...stories[storyIndex].stats, ...updates }
      stories[storyIndex].updatedAt = new Date().toISOString()
      localStorage.setItem(STORIES_KEY, JSON.stringify(stories))
    }
  } catch (error) {
    console.error('Error updating story stats:', error)
  }
}

// Add a new chapter to an existing story
export const addChapter = (storyId: string, chapterData: {
  title: string
  content: string
  wordCount: number
}): StoredChapter | null => {
  try {
    const stories = getAllStories()
    const storyIndex = stories.findIndex(story => story.id === storyId)

    if (storyIndex !== -1) {
      const story = stories[storyIndex]
      const now = new Date().toISOString()
      const chapterId = `chapter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const newChapter: StoredChapter = {
        id: chapterId,
        title: chapterData.title,
        content: chapterData.content,
        wordCount: chapterData.wordCount,
        createdAt: now,
        chapterNumber: story.chapters.length + 1
      }

      story.chapters.push(newChapter)
      story.stats.totalWords += chapterData.wordCount
      story.updatedAt = now

      localStorage.setItem(STORIES_KEY, JSON.stringify(stories))
      return newChapter
    }

    return null
  } catch (error) {
    console.error('Error adding chapter:', error)
    return null
  }
}

// Delete a story
export const deleteStory = (storyId: string): boolean => {
  try {
    const stories = getAllStories()
    const filteredStories = stories.filter(story => story.id !== storyId)

    if (filteredStories.length !== stories.length) {
      localStorage.setItem(STORIES_KEY, JSON.stringify(filteredStories))
      return true
    }

    return false
  } catch (error) {
    console.error('Error deleting story:', error)
    return false
  }
}

// Clear all stories (for testing/reset)
export const clearAllStories = (): void => {
  try {
    localStorage.removeItem(STORIES_KEY)
    localStorage.removeItem(USER_STORIES_KEY)
  } catch (error) {
    console.error('Error clearing stories:', error)
  }
}

// Get popular/featured stories (for home feed)
export const getFeaturedStories = (limit: number = 10): StoredStory[] => {
  try {
    const allStories = getAllStories()
    // Sort by views + likes for featured stories
    return allStories
      .sort((a, b) => (b.stats.views + b.stats.likes) - (a.stats.views + a.stats.likes))
      .slice(0, limit)
  } catch (error) {
    console.error('Error getting featured stories:', error)
    return []
  }
}