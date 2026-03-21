import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="cmd-header">
      <span className="cmd-header-title">krali4a@website:~#</span>
      <nav className="cmd-nav">
        <Link to="/" className="cmd-nav-link">home</Link>
        <Link to="/skills" className="cmd-nav-link">skills</Link>
        <Link to="/projects" className="cmd-nav-link">projects</Link>
      </nav>
    </header>
  );
}
