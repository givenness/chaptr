import { ChapterReader } from "@/components/chapter-reader"

interface Props {
  params: { id: string; chapterId: string }
}

export default function ChapterPage({ params }: Props) {
  return <ChapterReader storyId={params.id} chapterId={params.chapterId} />
}
