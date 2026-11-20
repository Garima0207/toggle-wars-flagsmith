// Post storage. Day 1 TODO: replace localStorage with a shared backend
// (e.g. Supabase) so every visitor sees the same board.

export interface Post {
  id: string
  name: string
  idea: string
  bio: string
  skillsNeeded: string[]
  contact: string
  createdAt: number
}

const STORAGE_KEY = 'tw_posts'

const SEED: Post[] = [
  {
    id: 'seed-1',
    name: 'Example: Asha',
    idea: 'An agent that turns a PR description into a Flagsmith experiment',
    bio: 'Backend dev, mostly Python. Built two CLI tools, never shipped a UI.',
    skillsNeeded: ['React', 'UI design'],
    contact: 'discord: asha#0000',
    createdAt: Date.now() - 3600_000,
  },
  {
    id: 'seed-2',
    name: 'Example: Rohan',
    idea: 'Self-hosted Flagsmith starter with ClickHouse and Grafana',
    bio: 'DevOps person who loves Docker Compose a little too much.',
    skillsNeeded: ['Frontend', 'Demo video'],
    contact: 'github.com/example',
    createdAt: Date.now() - 7200_000,
  },
]

export function loadPosts(): Post[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Post[]
  } catch {
    // ignore and fall back to seed data
  }
  return SEED
}

export function savePosts(posts: Post[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  } catch {
    // storage unavailable: posts live in memory for this session
  }
}
