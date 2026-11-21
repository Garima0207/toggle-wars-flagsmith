import { useEffect, useState } from 'react'
import { useExperiment, useFlagsmith, useFlagsmithLoading } from '@flagsmith/flagsmith/react'
import { CONTROL, CONVERSION_EVENT, FLAG_KEY, toLayout, type CardLayout } from './flagsmith'
import { createPost, EXAMPLES, fetchPosts, isShared, type NewPost, type Post } from './posts'
import { PostCard } from './PostCard'
import { PostForm } from './PostForm'

export default function App({ flagsmithReady }: { flagsmithReady: boolean }) {
  return flagsmithReady ? <ExperimentBoard /> : <Board layout={CONTROL} onConversion={() => {}} offline />
}

// Reads the experiment flag (recording one exposure for enrolled visitors)
// and reports conversions back to Flagsmith.
// Cards stay hidden until Flagsmith answers, so nobody glimpses the other
// variant first. If Flagsmith is slow or down, fall back to control.
const FLAG_TIMEOUT_MS = 3000

function ExperimentBoard() {
  const flagsmith = useFlagsmith()
  const flag = useExperiment(FLAG_KEY)
  const loadingState = useFlagsmithLoading()
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), FLAG_TIMEOUT_MS)
    return () => clearTimeout(t)
  }, [])

  const flagsReady = !!loadingState && (!loadingState.isLoading || !!loadingState.error)
  const layout = flagsReady || timedOut ? toLayout(flag?.enabled ? flag.value : undefined) : null

  return (
    <Board
      layout={layout}
      onConversion={(post) => flagsmith.trackEvent(CONVERSION_EVENT, { metadata: { postId: post.id } })}
    />
  )
}

interface BoardProps {
  layout: CardLayout | null // null while the variant is still being decided
  onConversion: (post: Post) => void
  offline?: boolean
}

function Board({ layout, onConversion, offline }: BoardProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [connected, setConnected] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false))
  }, [])

  const addPost = async (input: NewPost) => {
    const post = await createPost(input)
    setPosts((prev) => [post, ...prev])
  }

  // Real posts first; example cards fill the board until there are a few.
  const shown = posts.length >= 4 ? posts : [...posts, ...EXAMPLES]

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

      {!isShared && (
        <p className="notice">Posts are saved only in this browser (no <code>VITE_SUPABASE_URL</code> set).</p>
      )}
      {loadError && <p className="notice">Couldn't load posts right now. Showing examples.</p>}

      {layout === null || loading ? (
        <section className="grid" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="card skeleton" />
          ))}
        </section>
      ) : (
        <section className="grid">
          {shown.map((p) => (
            <PostCard key={p.id} post={p} layout={layout} onConnect={connect} connected={connected.has(p.id)} />
          ))}
        </section>
      )}

      <footer>
        Built with Flagsmith feature flags + Experimentation · <span className="muted">variant: {layout ?? '…'}</span>
      </footer>
    </main>
  )
}
