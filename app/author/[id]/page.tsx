import { AuthorProfile } from "@/components/author-profile"

interface Props {
  params: { id: string }
}

export default function AuthorPage({ params }: Props) {
  return <AuthorProfile authorId={params.id} />
}
