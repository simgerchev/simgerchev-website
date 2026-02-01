import projectFirst from '../assets/project-pictures/project-first.png';
import projectSecond from '../assets/project-pictures/project-second.jpg';
import projectThird from '../assets/project-pictures/project-third.png';
import projectFourth from '../assets/project-pictures/project-fourth.png';
import projectFifth from '../assets/project-pictures/project-fifth.png';
import projectSixth from '../assets/project-pictures/project-sixth.png';
import projectSeventh from '../assets/project-pictures/project-seventh.png';
import { Link } from 'react-router-dom';

const projects = [
    {
    img: projectSixth,
    title: "Podvigh(🛠)",
    desc: "Podvigh is a web-based ASCII Rogue Lite game about a monk wandering through different zones, praying to grow his faith, and ultimately finding the Sanctuary.",
    tech: ["JavaScript", "React", "CSS"],
    link: "/podvigh",
    showButton: true
  },
  {
    img: projectFourth,
    title: "Browser Terminal",
    desc: "A web-based terminal emulator that runs in the browser, allowing users to interact with a simulated command line interface. Similar to the Overthewire Wargames.",
    tech: ["JavaScript", "React", "CSS"],
    link: "/browser-terminal",
    showButton: true
  },
  {
    img: projectFifth,
    title: "CyberMonk(🛠)",
    desc: "CyberMonk is a web-based terminal emulator game about a monk exploring a fantasy world through command-line commands. Similar to Terminus.",
    tech: ["JavaScript", "React", "CSS"],
    link: "/cyber-monk",
    showButton: true
  },
  {
    img: projectFirst,
    title: "Babel's Room(🛠)",
    desc: "A chat application where you can temporary chat sessions with an end to end encryption.",
    tech: ["React Vite", "Django", "Docker", "Git"],
    link: "https://github.com/simgerchev/chat-app",
    showButton: true
  },
  {
    img: projectSecond,
    title: "Deserted",
    desc: "Explore an unknown desert world with your 6-legged lizzard cat while mastering obstacles, traps and many other dangers. Find new abilities, fight enemies and uncover hidden treasures in this Metroidvanice-inspired.",
    tech: ["C#", "Unity","Git"],
    link: "https://codelikeasir.itch.io/deserted",
    showButton: true
  },
  {
    img: projectThird,
    title: "Yggdrasil",
    desc: "Go on an adventure to save the sacred tree Yggdrasil! The frost giants have frozen Hvergelmir, the spring to all rivers. But Yggdrasil needs water to survive and thrive. You must restore Hvergelmir and the flow of water in the world.",
    tech: ["C#", "Unity","Git"],
    link: "https://luameyer.itch.io/yggdrasil",
    showButton: true
  },
  {
    img: projectSeventh,
    title: "Gods Fallen",
    desc: "There was an eternal conflict between the gods and the demons. Many gods fell in battle, other gods were captured. In the end, only one brave god remained. Facing a powerful foe, he was soon overwhelmed by the demon's power and fell from the sky into the void. Regaining his power, he must ascend to the heavens to rid it of the evil that plagues.",
    tech: ["C#", "Unity","Git"],
    link: "https://clinc8686.itch.io/gods-fallen",
    showButton: true
  },
];

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <h2 style={{ width: "100%", textAlign: "center" }}>My Projects / More on Github</h2>
      <div className="project-grid">
        {projects.map((proj, idx) => (
          <div className="project-card" key={idx}>
            <img src={proj.img} alt={proj.title} className="project-img" />
            <h3 className="project-title">{proj.title}</h3>
            <p className="project-desc">{proj.desc}</p>
            <div className="project-techstack">
              {proj.tech.map((tech, i) => (
                <span className="tech-badge" key={i}>{tech}</span>
              ))}
            </div>
            {proj.showButton !== false && (
              proj.link.startsWith('/') ? (
                <Link className="btn" to={proj.link}>View Project</Link>
              ) : (
                <a className="btn" href={proj.link} target="_blank" rel="noopener noreferrer">View Project</a>
              )
            )}
          </div>
        ))}
      </div>
    </section>
  );
}