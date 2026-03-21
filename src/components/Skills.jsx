const sections = [
  {
    label: 'languages',
    content: 'php  javascript  python  c#  go  mysql  mariadb',
  },
  {
    label: 'frameworks',
    content: 'symfony  laravel  react  django  unity  bootstrap  wordpress',
  },
  {
    label: 'devops & tools',
    content: 'git (github, gitlab)  docker  bash  redis  rabbitmq  jenkins  k8s',
  },
  {
    label: 'operating systems',
    content: 'linux (kali, debian)  macos  windows',
  },
  {
    label: 'currently learning',
    content: 'react',
  },
]

export default function Skills() {
  return (
    <div className="cmd-page">
      <div className="cmd-page-body">
        <p className="cmd-page-prompt">krali4a@website:~$ cat skills.txt</p>

        {sections.map((s, i) => (
          <div className="cmd-section" key={i}>
            <span className="cmd-section-label">{s.label}</span>
            <div className="cmd-section-content">
              <p>{s.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
