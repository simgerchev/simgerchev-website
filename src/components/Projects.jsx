const projects = [
  {
    title: 'linux sandbox',
    badge: 'featured',
    desc: 'browser-based linux terminal sim. navigate a fake filesystem, solve ctf-style challenges, escalate to root. each session gets a randomly seeded world.',
    tech: ['python', 'fastapi', 'docker', 'git'],
    link: 'https://sandbox.krali4a.com/',
  },
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

export default function Projects() {
  return (
    <div className="cmd-page">
      <div className="cmd-page-body">
        <p className="cmd-page-prompt">krali4a@website:~$ cat projects.txt</p>

        <pre className="cmd-art">{` __      __             __        .__
/  \\    /  \\___________|  | __ __ |  |__   ____ ______
\\   \\/\\/   /  _ \\_  __ \\  |/ // ___/|  |  \\ /  _ \\\\____ \\
 \\        (  <_> )  | \\/    < \\___ \\|   Y  (  <_> )  |_> >
  \\__/\\  / \\____/|__|  |__|_ \\/____  >___|  /\\____/|   __/
       \\/                   \\/     \\/     \\/       |__|`}</pre>

        {projects.map((proj, idx) => (
          <div className="cmd-section" key={idx}>
            <span className="cmd-section-label">
              {proj.title}{proj.badge ? <span className="cmd-badge"> [{proj.badge}]</span> : null}
            </span>
            <div className="cmd-section-content">
              <p>{proj.desc}</p>
              <p className="cmd-tech">{proj.tech.join('  ')}</p>
              <a className="cmd-link" href={proj.link} target="_blank" rel="noopener noreferrer">
                → {proj.link}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
