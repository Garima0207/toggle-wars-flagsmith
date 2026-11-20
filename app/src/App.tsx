import { useState } from 'react'
import { useExperiment, useFlagsmith } from '@flagsmith/flagsmith/react'
import { CONTROL, CONVERSION_EVENT, FLAG_KEY, toLayout, type CardLayout } from './flagsmith'
import { loadPosts, savePosts, type Post } from './posts'
import { PostCard } from './PostCard'
import { PostForm } from './PostForm'

export default function App({ flagsmithReady }: { flagsmithReady: boolean }) {
  return flagsmithReady ? <ExperimentBoard /> : <Board layout={CONTROL} onConversion={() => {}} offline />
}

// Reads the experiment flag (recording one exposure for enrolled visitors)
// and reports conversions back to Flagsmith.
function ExperimentBoard() {
  const flagsmith = useFlagsmith()
  const flag = useExperiment(FLAG_KEY)
  const layout = toLayout(flag?.enabled ? flag.value : undefined)

  return (
    <Board
      layout={layout}
      onConversion={(post) => flagsmith.trackEvent(CONVERSION_EVENT, { metadata: { postId: post.id } })}
    />
  )
}

interface BoardProps {
  layout: CardLayout
  onConversion: (post: Post) => void
  offline?: boolean
}

function Board({ layout, onConversion, offline }: BoardProps) {
  const [posts, setPosts] = useState<Post[]>(loadPosts)
  const [connected, setConnected] = useState<Set<string>>(new Set())

  const addPost = (post: Post) => {
    const next = [post, ...posts]
    setPosts(next)
    savePosts(next)
  }

  const connect = (post: Post) => {
    if (connected.has(post.id)) return
    setConnected(new Set(connected).add(post.id))
    onConversion(post)
  }

  return (
    <main>
      <header className="hero">
        <h1>Find your Toggle Wars team</h1>
        <p>Post what you're building and who you need. Hit Connect to see how to reach someone.</p>
      </header>

      {offline && (
        <p className="notice">
          Flagsmith isn't configured (no <code>VITE_FLAGSMITH_ENVIRONMENT_KEY</code>), so everyone sees the
          control version.
        </p>
      )}

      <PostForm onSubmit={addPost} />

      <section className="grid">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} layout={layout} onConnect={connect} connected={connected.has(p.id)} />
        ))}
      </section>

      <footer>
        Built with Flagsmith feature flags + Experimentation · <span className="muted">variant: {layout}</span>
      </footer>
    </main>
  )
}
