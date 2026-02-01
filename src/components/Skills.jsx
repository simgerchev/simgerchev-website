import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer
} from 'recharts';

const languageData = [
  { subject: "JavaScript", A: 50 },
  { subject: "Python", A: 50 },
  { subject: "C#", A: 35 },
  { subject: "PHP", A: 60 },
  { subject: "Go", A: 35 },
];

const frameworkData = [
  { subject: "React", A: 40 },
  { subject: "Django", A: 30 },
  { subject: "Laravel", A: 40 },
  { subject: "Symfony", A: 50 },
  { subject: "Unity", A: 35 },
];

const devopsData = [
  { subject: "Docker", A: 45 },
  { subject: "Git(Github,Gitlab)", A: 50 },
  { subject: "Linux", A: 45 },
  { subject: "Redis", A: 35 },
  { subject: "RabbitMQ", A: 35 },
  { subject: "Jenkins", A: 35 },
];

export default function Skills() {
  return (
    <section className="skills-section" id="skills">
      <h2 className="skills-title">Skills Overview</h2>
      <div className="skills-groups">
        <div className="skills-group">
          <h3>Languages</h3>
          <ul className="skills-tags">
            <li>PHP</li>
            <li>JavaScript</li>
            <li>Python</li>
            <li>C#</li>
            <li>Go</li>
            <li>MySQL</li>
            <li>MariaDB</li>
          </ul>
        </div>
        <div className="skills-group">
          <h3>Frameworks</h3>
          <ul className="skills-tags">
            <li>Symfony</li>
            <li>Laravel</li>
            <li>React</li>
            <li>Django</li>
            <li>Unity</li>
            <li>Bootstrap</li>
            <li>Wordpress</li>
          </ul>
        </div>
        <div className="skills-group">
          <h3>DevOps &amp; Tools</h3>
          <ul className="skills-tags">
            <li>Git (GitHub, GitLab)</li>
            <li>Docker</li>
            <li>Bash</li>
            <li>Redis</li>
            <li>RabbitMQ</li>
            <li>Jenkins</li>
          </ul>
        </div>
        <div className="skills-group">
          <h3>Operating &amp; Systems</h3>
          <ul className="skills-tags">
            <li>Linux (Kali Linux, Debian)</li>
            <li>MacOS</li>
            <li>Windows</li>
          </ul>
        </div>
      </div>
      <div className="currently-learning">
        <span role="img" aria-label="book">📖</span>
        <span className="currently-learning-text">
          Currently learning: <strong>React</strong>
        </span>
      </div>
    </section>
  );
}
