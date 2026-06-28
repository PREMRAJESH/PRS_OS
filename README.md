# PRS-OS

An AI-powered developer portfolio built as a fully interactive desktop operating system in the browser. Features a custom window manager, terminal emulator, runtime browser, AI assistant, and more — all running on Next.js.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (Turbopack) |
| Language | TypeScript |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 + CSS Variables |
| State | Zustand 5 |
| Animation | Framer Motion 12 |
| UI Primitives | shadcn/ui (Radix, New York style) |
| Icons | Lucide React |
| Email | Nodemailer (Gmail SMTP) |
| Analytics | Vercel Analytics |
| Fonts | Geist / Geist Mono (next/font) |

## Architecture

```
Boot Screen → Desktop (TopBar + Sidebar + Dock + CommandPalette)
               └── Window Manager (14 window types)
                     ├── Projects Explorer  (VS Code-style file browser)
                     ├── Terminal            (Full virtual filesystem)
                     ├── Runtime Browser     (Live iframe demos)
                     ├── AI Assistant        (Context-aware chat)
                     ├── GitHub Workspace    (Live profile viewer)
                     ├── Resume Viewer       (Embedded PDF)
                     └── Portfolio Windows   (About, Skills, Experience, etc.)
```

### Boot Flow

1. **BootScreen** — 4.5s animation sequence with boot messages and progress bar
2. **Desktop** — Session is cached via `sessionStorage` so boot only runs once per tab
3. **Work Area** — Dynamically calculated from TopBar + Sidebar constraints; all windows clamp to it

## Window Manager

All 14 window types are managed through a Zustand store with full OS-like behavior:

- **Drag** — Any title bar; cascading auto-center on open
- **Resize** — From any edge or corner
- **Minimize** — Animated toward Dock icon position (`dockRect`)
- **Maximize** — Fills the work area (respects sidebar + top bar)
- **Z-Index** — Automatic stacking; latest focus gets highest index
- **Bounds** — Clamped to work area on open, resize, and work area changes

### Window Types

| Type | Component | Purpose |
|---|---|---|
| `projects` | `project-explorer` | VS Code-style file tree + markdown viewer |
| `terminal` | `terminal-window` | Full shell emulator with virtual FS |
| `runtime` | `runtime-browser` | Tabbed iframe browser for live demos |
| `resume` | `resume-viewer` | Embedded PDF with zoom/download |
| `skills` | `skills-window` | Technical skills matrix |
| `timeline` | `timeline-window` | Academic + project history |
| `experience` | `experience-window` | Work experience cards |
| `certifications` | `certifications-window` | Verified credentials |
| `education` | `education-window` | Academic institutions |
| `about` | `about-window` | Personal profile |
| `ai-assistant` | `ai-assistant-window` | Contextual AI chat |
| `github` | `github-workspace` | Live GitHub profile data |
| `quick-links` | `quick-links-window` | Contact form + social links |
| `settings` | `settings-window` | Theme switcher (6 themes) |

## Terminal

A fully functional terminal emulator with:

- **Virtual filesystem** — `~` directory with nested project folders, each containing detailed markdown files
- **Commands** — `help`, `about`, `projects`, `skills`, `resume`, `contact`, `education`, `experience`, `certifications`, `github`, `neofetch`, `whoami`, `date`, `echo`, `pwd`, `ls`, `cd`, `cat`, `tree`, `history`, `clear`, `open`, `launch`, `theme`
- **Autocomplete** — Tab completion for commands, paths, app names, and themes
- **Command history** — Arrow key navigation, last 50 commands

## Runtime Browser

A live demo browser that loads portfolio projects in sandboxed iframes:

- Arc-style thin sidebar with tab management
- Navigation controls (back, forward, refresh, URL bar)
- 1440px virtual viewport scaled to container
- Loading states with animated pulse overlay
- Pre-configured tabs for NeuroScan AI, StudyFlow, and CodeViz

## Data Sources

| Source | Type | Details |
|---|---|---|
| **GitHub API** | Live | Fetches profile info for GitHub Workspace |
| **git log** | Live | `/api/commits` runs `git log` for recent history |
| **Nodemailer** | Live | `/api/send-mail` sends contact form via Gmail SMTP |
| **Projects** | Static | 4 projects with full file contents in `src/data/projects.ts` |
| **Terminal FS** | Static | Virtual filesystem in `src/data/terminal.ts` |
| **GitHub repos** | Static | Mock repo data in `src/data/github.ts` |
| **Dashboard** | Static | Activity feed and suggestions in `src/data/workspace.ts` |

## Themes

Six color themes switchable via Settings window or terminal (`theme <name>`):

- `ai-lab` — Default cyan/teal
- `matrix` — Green-on-black
- `minimal` — Clean neutral
- `cyber` — Neon magenta/cyan
- `synthwave` — Retro sunset
- `ubuntu` — Ubuntu-inspired orange

## Customization

### Adding a project

1. Add metadata to `src/data/projects.ts`
2. Add files to the virtual filesystem in `src/data/terminal.ts` under `~/projects/`
3. Add repository info to `src/data/github.ts`

### Adding an experience

1. Add card content in `src/components/windows/experience-window.tsx`
2. Add to terminal output in `src/components/terminal/terminal-window.tsx` (experience command)
3. Add milestone in `src/components/windows/timeline-window.tsx`
4. Add certification in `src/components/windows/certifications-window.tsx`
5. Update stats/milestones in `src/components/os/active-workspace.tsx`

### Adding a theme

1. Add CSS variables in `src/app/globals.css` under `.theme-<name>`
2. Add the name to the theme list in `src/store/os-store.ts`
3. Add to valid themes list in `src/components/terminal/terminal-window.tsx`

## Environment Variables

Create `.env.local` for the contact form:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
CONTACT_EMAIL=your-email@gmail.com
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```
