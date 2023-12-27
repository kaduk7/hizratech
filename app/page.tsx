import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/auth'; 

export default async function Home() {
  const session = await getServerSession(authOptions)
  return (
    <main>
      <h2 style={{ color: 'black' }}>Dashboard</h2>
      <pre>{JSON.stringify(session)}</pre>
    </main>

  )
}