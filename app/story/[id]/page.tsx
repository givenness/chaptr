import { StoryPage } from "@/components/story-page"

interface Props {
  params: { id: string }
}

export default function StoryDetailPage({ params }: Props) {
  return <StoryPage storyId={params.id} />
}
