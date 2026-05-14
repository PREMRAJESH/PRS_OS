'use client'

import { motion } from 'framer-motion'
import {
  Cpu,
  Database,
  Brain,
  Code,
  Server,
  CheckCircle2,
  Wrench,
  Palette,
} from 'lucide-react'

interface SkillModule {
  name: string
  version: string
  category: string
  icon: typeof Cpu
  status: 'installed' | 'updating' | 'available'
  level: number // 1-5
}

const modules: SkillModule[] = [
  // Frontend
  { name: 'React', version: '19.0.0', category: 'Frontend', icon: Code, status: 'installed', level: 5 },
  { name: 'Next.js', version: '16.0.0', category: 'Frontend', icon: Code, status: 'installed', level: 5 },
  { name: 'TypeScript', version: '5.7.0', category: 'Frontend', icon: Code, status: 'installed', level: 5 },
  { name: 'Tailwind CSS', version: '4.0.0', category: 'Frontend', icon: Code, status: 'installed', level: 5 },
  { name: 'Framer Motion', version: '12.0.0', category: 'Frontend', icon: Code, status: 'installed', level: 4 },
  
  // Backend
  { name: 'Node.js', version: '22.0.0', category: 'Backend', icon: Server, status: 'installed', level: 5 },
  { name: 'Express', version: '5.0.0', category: 'Backend', icon: Server, status: 'installed', level: 5 },
  { name: 'Firebase', version: '11.0.0', category: 'Backend', icon: Server, status: 'installed', level: 5 },
  { name: 'Supabase', version: '2.0.0', category: 'Backend', icon: Server, status: 'installed', level: 4 },
  { name: 'Flask', version: '3.1.0', category: 'Backend', icon: Server, status: 'installed', level: 4 },
  
  // AI/ML
  { name: 'TensorFlow', version: '2.18.0', category: 'AI/ML', icon: Brain, status: 'installed', level: 4 },
  { name: 'PyTorch', version: '2.5.0', category: 'AI/ML', icon: Brain, status: 'installed', level: 4 },
  { name: 'OpenAI APIs', version: '1.55.0', category: 'AI/ML', icon: Brain, status: 'installed', level: 5 },
  { name: 'CNNs', version: 'core', category: 'AI/ML', icon: Brain, status: 'installed', level: 4 },
  { name: 'RAG Systems', version: 'core', category: 'AI/ML', icon: Brain, status: 'installed', level: 4 },
  
  // Database
  { name: 'PostgreSQL', version: '17.0', category: 'Database', icon: Database, status: 'installed', level: 5 },
  { name: 'MongoDB', version: '8.0', category: 'Database', icon: Database, status: 'installed', level: 4 },
  { name: 'Firebase Firestore', version: '11.0', category: 'Database', icon: Database, status: 'installed', level: 5 },
  { name: 'MySQL', version: '9.0', category: 'Database', icon: Database, status: 'installed', level: 4 },

  // Tools
  { name: 'Git', version: '2.47.0', category: 'Tools', icon: Wrench, status: 'installed', level: 5 },
  { name: 'GitHub', version: 'Pro', category: 'Tools', icon: Wrench, status: 'installed', level: 5 },
  { name: 'VS Code', version: '1.96.0', category: 'Tools', icon: Wrench, status: 'installed', level: 5 },
  { name: 'Vercel', version: 'Pro', category: 'Tools', icon: Wrench, status: 'installed', level: 5 },
  { name: 'Linux', version: 'core', category: 'Tools', icon: Wrench, status: 'installed', level: 4 },

  // Design
  { name: 'Figma', version: 'Pro', category: 'Design', icon: Palette, status: 'installed', level: 4 },
  { name: 'Motion Design', version: 'core', category: 'Design', icon: Palette, status: 'installed', level: 5 },
  { name: 'UI Systems', version: 'core', category: 'Design', icon: Palette, status: 'installed', level: 5 },
  { name: 'UX Architecture', version: 'core', category: 'Design', icon: Palette, status: 'installed', level: 4 },
]

const categories = ['Frontend', 'Backend', 'AI/ML', 'Database', 'Tools', 'Design']

export function SkillsWindow() {
  return (
    <div className="h-full flex flex-col bg-background/50">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Cpu className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">System Modules</h2>
            <p className="text-xs text-muted-foreground">
              {modules.filter(m => m.status === 'installed').length} modules installed
            </p>
          </div>
        </div>
      </div>

      {/* Module list */}
      <div className="flex-1 overflow-y-auto p-4">
        {categories.map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              {getCategoryIcon(category)}
              {category}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {modules
                .filter(m => m.category === category)
                .map((module, index) => (
                  <motion.div
                    key={module.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors group"
                  >
                    <div className="p-1.5 rounded bg-secondary">
                      <module.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{module.name}</span>
                        <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground font-mono">
                          v{module.version}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                i < module.level ? 'bg-primary' : 'bg-border'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 bg-secondary/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>All modules up to date</span>
          <span className="font-mono">Last sync: just now</span>
        </div>
      </div>
    </div>
  )
}

function getCategoryIcon(category: string) {
  const icons: Record<string, JSX.Element> = {
    Frontend: <Code className="w-3 h-3" />,
    Backend: <Server className="w-3 h-3" />,
    'AI/ML': <Brain className="w-3 h-3" />,
    Database: <Database className="w-3 h-3" />,
    Tools: <Wrench className="w-3 h-3" />,
    Design: <Palette className="w-3 h-3" />,
  }
  return icons[category] || <Cpu className="w-3 h-3" />
}
