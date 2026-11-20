import { useState, type FormEvent } from 'react'
import type { Post } from './posts'

export function PostForm({ onSubmit }: { onSubmit: (post: Post) => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [idea, setIdea] = useState('')
  const [bio, setBio] = useState('')
  const [skills, setSkills] = useState('')
  const [contact, setContact] = useState('')

  if (!open) {
    return (
      <button className="primary" onClick={() => setOpen(true)}>
        + Post your project
      </button>
    )
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: crypto.randomUUID(),
      name: name.trim(),
      idea: idea.trim(),
      bio: bio.trim(),
      skillsNeeded: skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      contact: contact.trim(),
      createdAt: Date.now(),
    })
    setName('')
    setIdea('')
    setBio('')
    setSkills('')
    setContact('')
    setOpen(false)
  }

  return (
    <form className="form" onSubmit={submit}>
      <input required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <input required placeholder="What are you building?" value={idea} onChange={(e) => setIdea(e.target.value)} />
      <textarea required placeholder="A line or two about you" value={bio} onChange={(e) => setBio(e.target.value)} />
      <input
        required
        placeholder="Skills you need, comma-separated (e.g. React, Python)"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />
      <input
        required
        placeholder="How to reach you (Discord, GitHub, etc.)"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />
      <div className="row">
        <button type="submit" className="primary">
          Post
        </button>
        <button type="button" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  )
}
