import { getServerSession } from 'next-auth/next';
// import { authOptions } from './api/auth/[...nextauth]/route';
import handler from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(handler)
  return (
    <main>
      <h2 style={{ color: 'black' }}>Dashboard</h2>
      <pre>{JSON.stringify(session)}</pre>
    </main>

  )
}