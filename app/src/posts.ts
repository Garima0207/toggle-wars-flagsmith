// Post storage. Uses Supabase when configured so every visitor sees the same
// board; otherwise falls back to this browser's localStorage (handy for local dev).

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export interface Post {
  id: string
  name: string
  idea: string
  bio: string
  skillsNeeded: string[]
  contact: string
  createdAt: number
}

export type NewPost = Omit<Post, 'id' | 'createdAt'>

// Input limits, kept in step with the checks in supabase/schema.sql.
export const LIMITS = { name: 60, idea: 200, bio: 300, contact: 100, skills: 8 }

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null

export const isShared = supabase !== null

// Example cards so the board (and both experiment variants) never look empty.
export const EXAMPLES: Post[] = [
  {
    id: 'example-1',
    name: 'Example: Asha',
    idea: 'An agent that turns a PR description into a Flagsmith experiment',
    bio: 'Backend dev, mostly Python. Built two CLI tools, never shipped a UI.',
    skillsNeeded: ['React', 'UI design'],
    contact: 'discord: asha#0000',
    createdAt: 0,
  },
  {
    id: 'example-2',
    name: 'Example: Rohan',
    idea: 'Self-hosted Flagsmith starter with ClickHouse and Grafana',
    bio: 'DevOps person who loves Docker Compose a little too much.',
    skillsNeeded: ['Frontend', 'Demo video'],
    contact: 'github.com/example',
    createdAt: 0,
  },
]

interface PostRow {
  id: string
  name: string
  idea: string
  bio: string
  skills_needed: string[]
  contact: string
  created_at: string
}

const fromRow = (r: PostRow): Post => ({
  id: r.id,
  name: r.name,
  idea: r.idea,
  bio: r.bio,
  skillsNeeded: r.skills_needed ?? [],
  contact: r.contact,
  createdAt: Date.parse(r.created_at),
})

const LOCAL_KEY = 'tw_posts_local'

function readLocal(): Post[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    return raw ? (JSON.parse(raw) as Post[]) : []
  } catch {
    return []
  }
}

function writeLocal(posts: Post[]): void {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(posts))
  } catch {
    // storage unavailable: posts live in memory for this session
  }
}

export async function fetchPosts(): Promise<Post[]> {
  if (!supabase) return readLocal()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) throw error
  return (data as PostRow[]).map(fromRow)
}

export async function createPost(input: NewPost): Promise<Post> {
  if (!supabase) {
    const post: Post = { ...input, id: crypto.randomUUID(), createdAt: Date.now() }
    writeLocal([post, ...readLocal()])
    return post
  }
  const { data, error } = await supabase
    .from('posts')
    .insert({
      name: input.name,
      idea: input.idea,
      bio: input.bio,
      skills_needed: input.skillsNeeded,
      contact: input.contact,
    })
    .select()
    .single()
  if (error) throw error
  return fromRow(data as PostRow)
}
