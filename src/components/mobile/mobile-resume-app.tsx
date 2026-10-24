'use client'

import {
  ArrowUpRight,
  Download,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
} from 'lucide-react'

const roles = [
  {
    role: 'AI Automation & Intelligent Solutions intern',
    company: 'CSRBOX × IBM SkillsBuild × AICTE',
    period: 'June 2026 — present',
    current: true,
    points: [
      'Agentic AI and workflow automation',
      'IBM SkillsBuild learning path',
      'Hands-on AI projects with industry mentorship',
    ],
  },
  {
    role: 'Web development intern',
    company: 'BrainyBeam Technologies',
    period: 'September 2022',
    points: [
      'Front-end development and website iteration',
      'Practical exposure to production web technologies',
    ],
  },
]

const education = [
  {
    title: 'B.E. Computer Engineering',
    place: 'Government Engineering College, Dahod',
    period: '2024 — 2027',
    note: 'Artificial intelligence, web applications, software engineering',
  },
  {
    title: 'Diploma in Computer Software Engineering',
    place: 'Government Polytechnic, Dahod',
    period: '2021 — 2024',
    note: 'CPI 8.33 · AICTE / Gujarat Technological University',
  },
]

const skills = [
  'Python',
  'TypeScript',
  'React',
  'Next.js',
  'Tailwind CSS',
  'Node.js',
  'FastAPI',
  'TensorFlow',
  'PyTorch',
  'ONNX',
  'Supabase',
  'Firebase',
  'Docker',
  'Git',
]

const links = [
  { label: 'GitHub', value: 'github.com/PREMRAJESH', href: 'https://github.com/PREMRAJESH', icon: Github },
  {
    label: 'LinkedIn',
    value: 'in/gecdhd-comp-prem-sargara',
    href: 'https://www.linkedin.com/in/gecdhd-comp-prem-sargara/',
    icon: Linkedin,
  },
  {
    label: 'Email',
    value: 'sargarapremrajesh@gmail.com',
    href: 'mailto:sargarapremrajesh@gmail.com',
    icon: Mail,
  },
]

export function MobileResumeApp() {
  return (
    <div className="h-full overflow-y-auto no-scrollbar overscroll-contain">
      <div className="px-5 pb-14 pt-5 md:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-eyebrow">Résumé</p>
          <h2 className="font-display mt-2 text-[2.6rem] leading-[0.92] tracking-[-0.025em]">
            Prem Rajesh
          </h2>
          <p className="mt-2.5 text-[12.5px] text-muted-foreground/70">
            Software engineering student · AI and full stack
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-mono text-muted-foreground/50">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              Gujarat, India
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-3 w-3" />
              GEC Dahod · 2027
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <a
              href="/Resume.pdf"
              download="P.R.S_Resume.pdf"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary text-[12px] font-medium text-primary-foreground active:bg-primary/90"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </a>
            <a
              href="mailto:sargarapremrajesh@gmail.com"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-hairline-strong text-[12px] text-foreground/75 active:bg-foreground/[0.05]"
            >
              <Mail className="h-3.5 w-3.5" />
              Email me
            </a>
          </div>

          <section className="mt-8 border-t border-hairline pt-6">
            <h3 className="text-eyebrow">Profile</h3>
            <p className="mt-3 text-[13px] leading-[1.75] text-muted-foreground/80">
              Computer Engineering student at Government Engineering College, Dahod, interested
              in artificial intelligence, machine learning, cloud computing and full stack
              development. I like building practical software that combines engineering
              fundamentals with real-world problem solving — training models, then making them
              feel simple enough to actually use.
            </p>
          </section>

          <section className="mt-7 border-t border-hairline pt-6">
            <h3 className="text-eyebrow">Experience</h3>
            <div className="mt-4 space-y-6">
              {roles.map((role) => (
                <div key={role.role}>
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-[13.5px] leading-snug text-foreground/90">{role.role}</h4>
                    {role.current && (
                      <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-[8.5px] font-mono uppercase tracking-[0.1em] text-accent">
                        <span className="h-1 w-1 rounded-full bg-accent" />
                        Now
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground/60">
                    {role.company}
                    <span className="mx-1.5 text-muted-foreground/25">·</span>
                    <span className="font-mono text-[10px]">{role.period}</span>
                  </p>
                  <ul className="mt-2.5 space-y-1.5">
                    {role.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-[11.5px] leading-relaxed text-muted-foreground/70"
                      >
                        <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-foreground/30" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-7 border-t border-hairline pt-6">
            <h3 className="text-eyebrow">Education</h3>
            <div className="mt-4 space-y-5">
              {education.map((item) => (
                <div key={item.title}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="text-[13px] leading-snug text-foreground/85">{item.title}</h4>
                    <span className="shrink-0 font-mono text-[9.5px] text-muted-foreground/40">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground/55">{item.place}</p>
                  <p className="mt-1 text-[10.5px] text-muted-foreground/40">{item.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-7 border-t border-hairline pt-6">
            <h3 className="text-eyebrow">Toolkit</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-hairline bg-foreground/[0.025] px-2.5 py-1 text-[10.5px] font-mono text-muted-foreground/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-7 border-t border-hairline pt-6">
            <h3 className="text-eyebrow">Links</h3>
            <div className="mt-2">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.label === 'Email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border-b border-hairline py-3 last:border-b-0 active:opacity-70"
                >
                  <link.icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                  <span className="w-16 shrink-0 text-[11.5px] text-foreground/75">
                    {link.label}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-muted-foreground/50">
                    {link.value}
                  </span>
                  <ArrowUpRight className="h-3 w-3 shrink-0 text-muted-foreground/25" />
                </a>
              ))}
            </div>
          </section>

          <p className="mt-8 text-center text-[9.5px] font-mono uppercase tracking-[0.1em] text-muted-foreground/25">
            Updated 2026 · PDF is the canonical version
          </p>
        </div>
      </div>
    </div>
  )
}
