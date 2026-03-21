export default function Skills() {
  return (
    <div className="cmd-page">
      <div className="cmd-page-body">
        <p className="cmd-page-prompt">krali4a@website:~$ cat skills.txt</p>

        <div className="cmd-section">
          <span className="cmd-section-label">languages</span>
          <p>php &nbsp; javascript &nbsp; python &nbsp; c# &nbsp; go &nbsp; mysql &nbsp; mariadb</p>
        </div>

        <div className="cmd-section">
          <span className="cmd-section-label">frameworks</span>
          <p>symfony &nbsp; laravel &nbsp; react &nbsp; django &nbsp; unity &nbsp; bootstrap &nbsp; wordpress</p>
        </div>

        <div className="cmd-section">
          <span className="cmd-section-label">devops & tools</span>
          <p>git (github, gitlab) &nbsp; docker &nbsp; bash &nbsp; redis &nbsp; rabbitmq &nbsp; jenkins &nbsp; k8s</p>
        </div>

        <div className="cmd-section">
          <span className="cmd-section-label">operating systems</span>
          <p>linux (kali, debian) &nbsp; macos &nbsp; windows</p>
        </div>

        <div className="cmd-section">
          <span className="cmd-section-label">currently learning</span>
          <p>react</p>
        </div>
      </div>
    </div>
  );
}
