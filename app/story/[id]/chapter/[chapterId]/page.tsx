import { ChapterReader } from "@/components/chapter-reader"
import { AuthProvider } from "@/components/auth-provider"

interface Props {
  params: { id: string; chapterId: string }
}

export default function ChapterPage({ params }: Props) {
  return (
    <AuthProvider>
      <ChapterReader storyId={params.id} chapterId={params.chapterId} />
    </AuthProvider>
  )
}
