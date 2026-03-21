const featured = [
  {
    title: 'krali4',
    desc: 'browser-based linux terminal sim. navigate a filesystem, solve ctf-style challenges. each session gets a randomly seeded world.',
    tech: ['python', 'fastapi', 'docker', 'git'],
    link: 'https://sandbox.krali4a.com/',
  },
]

const collabs = [
  {
    title: 'deserted',
    desc: 'desert exploration with a 6-legged lizard cat. metroidvania-inspired.',
    tech: ['c#', 'unity', 'git'],
    link: 'https://codelikeasir.itch.io/deserted',
  },
  {
    title: 'yggdrasil',
    desc: 'save the sacred tree from the frost giants. restore the flow of water.',
    tech: ['c#', 'unity', 'git'],
    link: 'https://luameyer.itch.io/yggdrasil',
  },
  {
    title: 'gods fallen',
    desc: 'a fallen god must ascend from the void to rid the heavens of evil.',
    tech: ['c#', 'unity', 'git'],
    link: 'https://clinc8686.itch.io/gods-fallen',
  },
]

function ProjectCard({ proj }) {
  return (
    <div className="cmd-section">
      <span className="cmd-section-label">{proj.title}</span>
      <div className="cmd-section-content">
        <p>{proj.desc}</p>
        <p className="cmd-tech">{proj.tech.join('  ')}</p>
        <a className="cmd-link" href={proj.link} target="_blank" rel="noopener noreferrer">
          → {proj.link}
        </a>
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <div className="cmd-page">
      <div className="cmd-page-body">
        <p className="cmd-page-prompt">krali4a@website:~$ cat projects.txt</p>

        <p className="cmd-group-label">── featured ─────────────────────────</p>
        {featured.map((proj, idx) => <ProjectCard proj={proj} key={idx} />)}

        <p className="cmd-group-label">── game dev / collabs ───────────────</p>
        {collabs.map((proj, idx) => <ProjectCard proj={proj} key={idx} />)}
      </div>
    </div>
  )
}
