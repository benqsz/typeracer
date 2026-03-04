import Lobby from '@/components/lobby'
import MainInput from '@/components/main-input'
import Stage from '@/components/stage'
import { Separator } from '@/components/ui/separator'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl p-4 space-y-4">
      <Stage />
      <Separator />
      <MainInput />
      <Separator />
      <Lobby />
    </div>
  )
}
