const projects = [
  {
    title: "deserted",
    desc: "explore an unknown desert world with your 6-legged lizard cat while mastering obstacles, traps and many other dangers. find new abilities, fight enemies and uncover hidden treasures. metroidvania-inspired.",
    tech: ["c#", "unity", "git"],
    link: "https://codelikeasir.itch.io/deserted",
  },
  {
    title: "yggdrasil",
    desc: "go on an adventure to save the sacred tree yggdrasil. the frost giants have frozen hvergelmir, the spring to all rivers. restore the flow of water in the world.",
    tech: ["c#", "unity", "git"],
    link: "https://luameyer.itch.io/yggdrasil",
  },
  {
    title: "gods fallen",
    desc: "an eternal conflict between gods and demons. one god remains, overwhelmed and cast into the void. regaining his power, he must ascend to the heavens to rid it of evil.",
    tech: ["c#", "unity", "git"],
    link: "https://clinc8686.itch.io/gods-fallen",
  },
];

export default function Projects() {
  return (
    <div className="cmd-page">
      <div className="cmd-page-body">
        <p className="cmd-page-prompt">krali4a@website:~$ cat projects.txt</p>

        {projects.map((proj, idx) => (
          <div className="cmd-section" key={idx}>
            <span className="cmd-section-label">{proj.title}</span>
            <p>{proj.desc}</p>
            <p className="cmd-tech">{proj.tech.join('  ')}</p>
            <a className="cmd-link" href={proj.link} target="_blank" rel="noopener noreferrer">
              → {proj.link}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
