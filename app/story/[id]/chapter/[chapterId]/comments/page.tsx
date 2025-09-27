import { CommentsPage } from "@/components/comments-page"

interface Props {
  params: { id: string; chapterId: string }
}

export default function ChapterCommentsPage({ params }: Props) {
  return <CommentsPage storyId={params.id} chapterId={params.chapterId} />
}
