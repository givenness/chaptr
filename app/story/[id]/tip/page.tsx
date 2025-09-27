import { TipPage } from "@/components/tip-page"

interface Props {
  params: { id: string }
}

export default function StoryTipPage({ params }: Props) {
  return <TipPage storyId={params.id} />
}
