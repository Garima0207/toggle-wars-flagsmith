import { useState, type FormEvent } from 'react'
import { LIMITS, type NewPost } from './posts'

export function PostForm({ onSubmit }: { onSubmit: (post: NewPost) => Promise<void> }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [idea, setIdea] = useState('')
  const [bio, setBio] = useState('')
  const [skills, setSkills] = useState('')
  const [contact, setContact] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) {
    return (
      <button className="primary" onClick={() => setOpen(true)}>
        + Post your project
      </button>
    )
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSubmit({
        name: name.trim(),
        idea: idea.trim(),
        bio: bio.trim(),
        skillsNeeded: skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, LIMITS.skills),
        contact: contact.trim(),
      })
      setName('')
      setIdea('')
      setBio('')
      setSkills('')
      setContact('')
      setOpen(false)
    } catch {
      setError("Couldn't save your post. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <input required maxLength={LIMITS.name} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <input
        required
        maxLength={LIMITS.idea}
        placeholder="What are you building?"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
      />
      <textarea
        required
        maxLength={LIMITS.bio}
        placeholder="A line or two about you"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <input
        required
        placeholder="Skills you need, comma-separated (e.g. React, Python)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />
      <input
        required
        maxLength={LIMITS.contact}
        placeholder="How to reach you (Discord, GitHub, etc.)"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />
      <p className="hint">Your post, including how to reach you, is visible to everyone.</p>
      {error && <p className="error">{error}</p>}
      <div className="row">
        <button type="submit" className="primary" disabled={saving}>
          {saving ? 'Posting…' : 'Post'}
        </button>
        <button type="button" onClick={() => setOpen(false)} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  )
}
