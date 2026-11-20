import type { CardLayout } from './flagsmith'
import type { Post } from './posts'

interface Props {
  post: Post
  layout: CardLayout
  onConnect: (post: Post) => void
  connected: boolean
}

// The two versions under test:
//   bio    (control): a short bio paragraph
//   skills (variant): "skills needed" badges instead of the bio
export function PostCard({ post, layout, onConnect, connected }: Props) {
  return (
    <article className="card">
      <header>
        <h3>{post.name}</h3>
        <p className="idea">{post.idea}</p>
      </header>

      {layout === 'skills' ? (
        <div className="skills">
          <span className="skills-label">Looking for</span>
          {post.skillsNeeded.map((s) => (
            <span key={s} className="badge">
              {s}
            </span>
          ))}
        </div>
      ) : (
        <p className="bio">{post.bio}</p>
      )}

      {connected ? (
        <p className="contact">Reach out: {post.contact}</p>
      ) : (
        <button className="connect" onClick={() => onConnect(post)}>
          Connect
        </button>
      )}
    </article>
  )
}
