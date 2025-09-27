import { CommentsPage } from "@/components/comments-page"
import { AuthProvider } from "@/components/auth-provider"

interface Props {
  params: { id: string; chapterId: string }
}

export default function ChapterCommentsPage({ params }: Props) {
  return (
    <AuthProvider>
      <CommentsPage storyId={params.id} chapterId={params.chapterId} />
    </AuthProvider>
  )
}
