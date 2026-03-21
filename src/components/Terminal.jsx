import { useState, useRef, useEffect } from 'react'

const ART = [
  '██╗  ██╗ ██╗  ██╗',
  '██║ ██╔╝ ██║  ██║',
  '█████╔╝  ███████║',
  '██╔═██╗  ╚════██║',
  '██║  ██╗      ██║',
  '╚═╝  ╚═╝      ╚═╝',
]

const INFO = [
  { text: 'krali4a@website', hi: true },
  { text: '─────────────────────────────', hi: true },
  { text: 'name    : simeon gerchev' },
  { text: 'age     : 24' },
  { text: 'role    : backend dev · devops · it' },
  { text: 'os      : linux · macos · windows' },
  { text: 'langs   : php  js  python  c#  go' },
  { text: 'tools   : docker  k8s  git  bash' },
  { text: 'hobbies : gym  muay thai  drawing' },
  { text: 'github  : github.com/simgerchev' },
]

function buildNeofetch() {
  const len = Math.max(ART.length, INFO.length)
  const lines = Array.from({ length: len }, (_, i) => ({
    type: 'neofetch',
    art: ART[i] || '',
    info: INFO[i]?.text || '',
    hi: INFO[i]?.hi || false,
  }))
  lines.push({ type: 'output', text: '' })
  return lines
}

const WELCOME = [
  ...buildNeofetch(),
  { type: 'system', text: "type 'help' to see available commands" },
  { type: 'output', text: '' },
]

const COMMANDS = {
  help: () => [
    { type: 'output', text: 'commands:' },
    { type: 'output', text: '  whoami      who am i' },
    { type: 'output', text: '  about       more about me' },
    { type: 'output', text: '  skills      technical skills' },
    { type: 'output', text: "  projects    things i've built" },
    { type: 'output', text: '  contact     get in touch' },
    { type: 'output', text: '  neofetch    system info' },
    { type: 'output', text: '  ls          list files' },
    { type: 'output', text: '  cat <file>  read a file' },
    { type: 'output', text: '  clear       clear terminal' },
    { type: 'output', text: '' },
  ],
  whoami: () => [
    { type: 'output', text: 'simeon gerchev (krali4a)' },
    { type: 'output', text: 'backend developer · devops · it specialist' },
    { type: 'output', text: '24 years old' },
    { type: 'output', text: '' },
  ],
  about: () => [
    { type: 'output', text: "hey, i'm simeon — krali4a online." },
    { type: 'output', text: '' },
    { type: 'output', text: 'it specialist with two vocational certifications:' },
    { type: 'output', text: '  · it specialist — multimedia' },
    { type: 'output', text: '  · it specialist — application development' },
    { type: 'output', text: '' },
    { type: 'output', text: 'passionate about backend development, infrastructure,' },
    { type: 'output', text: 'cybersecurity, and devops.' },
    { type: 'output', text: '' },
    { type: 'output', text: 'outside the terminal:' },
    { type: 'output', text: '  · gym & muay thai' },
    { type: 'output', text: '  · graphic design & drawing' },
    { type: 'output', text: '  · reading' },
    { type: 'output', text: '  · game development (unity / c#)' },
    { type: 'output', text: '' },
  ],
  skills: () => [
    { type: 'label', text: 'languages' },
    { type: 'output', text: '  php  javascript  python  c#  go  sql' },
    { type: 'output', text: '' },
    { type: 'label', text: 'frameworks' },
    { type: 'output', text: '  symfony  laravel  react  django  unity  bootstrap' },
    { type: 'output', text: '' },
    { type: 'label', text: 'devops & tools' },
    { type: 'output', text: '  git  docker  bash  redis  rabbitmq  jenkins  k8s' },
    { type: 'output', text: '' },
    { type: 'label', text: 'operating systems' },
    { type: 'output', text: '  linux (kali, debian)  macos  windows' },
    { type: 'output', text: '' },
  ],
  projects: () => [
    { type: 'label', text: 'deserted' },
    { type: 'output', text: '  desert exploration game (metroidvania-style) · c# unity' },
    { type: 'link', text: '  → https://codelikeasir.itch.io/deserted', href: 'https://codelikeasir.itch.io/deserted' },
    { type: 'output', text: '' },
    { type: 'label', text: 'yggdrasil' },
    { type: 'output', text: '  norse mythology adventure game · c# unity' },
    { type: 'link', text: '  → https://luameyer.itch.io/yggdrasil', href: 'https://luameyer.itch.io/yggdrasil' },
    { type: 'output', text: '' },
    { type: 'label', text: 'gods fallen' },
    { type: 'output', text: '  god vs demons action game · c# unity' },
    { type: 'link', text: '  → https://clinc8686.itch.io/gods-fallen', href: 'https://clinc8686.itch.io/gods-fallen' },
    { type: 'output', text: '' },
  ],
  contact: () => [
    { type: 'link', text: 'linkedin  → linkedin.com/in/simeon-gerchev-2b70b122a', href: 'https://www.linkedin.com/in/simeon-gerchev-2b70b122a/' },
    { type: 'link', text: 'github   → github.com/simgerchev', href: 'https://github.com/simgerchev' },
    { type: 'link', text: 'gitlab   → gitlab.com/simgerchev', href: 'https://gitlab.com/simgerchev' },
    { type: 'output', text: '' },
  ],
  neofetch: () => [...buildNeofetch()],
  ls: () => [
    { type: 'output', text: 'about.txt  skills.txt  projects.txt  contact.txt' },
    { type: 'output', text: '' },
  ],
  pwd: () => [
    { type: 'output', text: '/home/krali4a/website' },
    { type: 'output', text: '' },
  ],
  sudo: () => [
    { type: 'error', text: 'nice try.' },
    { type: 'output', text: '' },
  ],
  ping: () => [
    { type: 'output', text: 'PING krali4a.com: 56 data bytes' },
    { type: 'output', text: '64 bytes from krali4a.com: icmp_seq=0 ttl=64 time=0.042 ms' },
    { type: 'success', text: '1 packet transmitted, 1 received, 0% packet loss' },
    { type: 'output', text: '' },
  ],
  uname: () => [
    { type: 'output', text: 'Linux website 6.1.0 #1 SMP x86_64 GNU/Linux' },
    { type: 'output', text: '' },
  ],
  date: () => [
    { type: 'output', text: new Date().toString() },
    { type: 'output', text: '' },
  ],
  uptime: () => [
    { type: 'output', text: 'uptime: always learning, never stopping' },
    { type: 'output', text: '' },
  ],
}

const CAT_FILES = {
  'about.txt': COMMANDS.about,
  'skills.txt': COMMANDS.skills,
  'projects.txt': COMMANDS.projects,
  'contact.txt': COMMANDS.contact,
}

function processCommand(raw) {
  const parts = raw.trim().split(/\s+/)
  const cmd = parts[0].toLowerCase()
  const arg = parts[1]

  if (cmd === 'cat') {
    if (!arg) return [{ type: 'error', text: 'usage: cat <file>' }, { type: 'output', text: '' }]
    if (CAT_FILES[arg]) return CAT_FILES[arg]()
    return [{ type: 'error', text: `cat: ${arg}: no such file or directory` }, { type: 'output', text: '' }]
  }

  if (COMMANDS[cmd]) return COMMANDS[cmd]()
  return [
    { type: 'error', text: `command not found: ${cmd}` },
    { type: 'output', text: "type 'help' for available commands." },
    { type: 'output', text: '' },
  ]
}

export default function Terminal() {
  const [lines, setLines] = useState(WELCOME)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [lines])

  function handleSubmit(e) {
    e.preventDefault()
    const cmd = input.trim()

    if (cmd === 'clear') {
      setLines([])
      setInput('')
      setHistory(prev => [cmd, ...prev])
      setHistoryIndex(-1)
      return
    }

    const output = cmd ? processCommand(cmd) : []
    setLines(prev => [
      ...prev,
      { type: 'command', text: cmd },
      ...output,
    ])
    if (cmd) setHistory(prev => [cmd, ...prev])
    setHistoryIndex(-1)
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const idx = historyIndex + 1
      if (idx < history.length) { setHistoryIndex(idx); setInput(history[idx]) }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = historyIndex - 1
      if (idx >= 0) { setHistoryIndex(idx); setInput(history[idx]) }
      else { setHistoryIndex(-1); setInput('') }
    }
  }

  function renderLine(line, i) {
    if (line.type === 'neofetch') {
      return (
        <div key={i} className="tline tline--nf">
          <span className="tline--nf-art">{line.art || '\u00a0'}</span>
          <span className={line.hi ? 'tline--nf-hi' : 'tline--nf-info'}>{line.info}</span>
        </div>
      )
    }
    if (line.type === 'command') {
      return (
        <div key={i} className="tline tline--command">
          <span className="tprompt">krali4a@website:~$&nbsp;</span>
          <span>{line.text}</span>
        </div>
      )
    }
    if (line.type === 'link') {
      return (
        <div key={i} className="tline tline--link">
          <a href={line.href} target="_blank" rel="noreferrer">{line.text}</a>
        </div>
      )
    }
    return (
      <div key={i} className={`tline tline--${line.type}`}>
        {line.text || '\u00a0'}
      </div>
    )
  }

  function handleWrapClick(e) {
    if (e.target === inputRef.current) return
    inputRef.current?.focus({ preventScroll: true })
  }

  return (
    <div className="terminal-wrap" onClick={handleWrapClick}>
      <div className="terminal-body">
        {lines.map(renderLine)}
        <div className="tline tline--command">
          <span className="tprompt">krali4a@website:~$&nbsp;</span>
          <form onSubmit={handleSubmit} style={{ display: 'inline' }}>
            <input
              ref={inputRef}
              className="tinput"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </form>
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
