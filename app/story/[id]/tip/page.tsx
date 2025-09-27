import { TipPage } from "@/components/tip-page"
import { AuthProvider } from "@/components/auth-provider"

interface Props {
  params: { id: string }
}

export default function StoryTipPage({ params }: Props) {
  return (
    <AuthProvider>
      <TipPage storyId={params.id} />
    </AuthProvider>
  )
}
