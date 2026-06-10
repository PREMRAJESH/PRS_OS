import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

export async function GET() {
  try {
    // Get git commits from the local git repository
    const output = execSync('git log -n 50 --pretty=format:"%h|%s|%an|%ad" --date=short').toString()
    const commits = output.split('\n').filter(Boolean).map((line, index) => {
      const [hash, message, author, date] = line.split('|')
      
      let type: 'commit' | 'merge' | 'milestone' = 'commit'
      let tags: string[] = ['git']
      
      if (message.startsWith('feat')) {
        tags.push('feature')
      } else if (message.startsWith('fix')) {
        tags.push('bugfix')
      } else if (message.startsWith('chore') || message.startsWith('refactor')) {
        tags.push('refactor')
      } else if (message.toLowerCase().includes('release') || message.toLowerCase().includes('version')) {
        type = 'milestone'
        tags.push('release')
      }
      
      return {
        id: String(index + 1),
        hash,
        message,
        description: `Authored by ${author}`,
        date,
        type,
        tags
      }
    })
    return NextResponse.json(commits)
  } catch (error) {
    console.error('Error fetching git commits:', error)
    // Fallback if git is not installed or the directory is not a git repo (e.g., Vercel builds)
    return NextResponse.json([
      {
        id: '1',
        hash: '2b2eb0e',
        message: 'Remove stale pnpm-lock.yaml for Vercel deploy',
        description: 'Authored by PREMRAJESH',
        date: '2026-05-14',
        type: 'commit',
        tags: ['git', 'refactor']
      },
      {
        id: '2',
        hash: '92f3ee2',
        message: 'Initial commit',
        description: 'Authored by PREMRAJESH',
        date: '2026-05-14',
        type: 'milestone',
        tags: ['git', 'origin']
      }
    ])
  }
}
