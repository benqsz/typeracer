export const dynamic = 'force-dynamic'

export async function GET() {
  const res = await fetch(`http://api.quotable.io/quotes/random`)
  const data = await res.json()
  return Response.json({ data })
}
