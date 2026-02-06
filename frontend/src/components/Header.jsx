import WhiteLogo from '../assets/website-logo-second.png';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <div className="container">
        <img src={WhiteLogo} alt="Logo" className="logo-img" />
        <nav>
          <Link to="/" className="nav-link">HOME</Link>
          <Link to="/skills" className="nav-link">SKILLS</Link>
          <Link to="/projects" className="nav-link">WORKSHOP⚙︎</Link>
          <Link to="#" className="nav-link">LIBRARY</Link>
          <Link to="#" className="nav-link">BLOG</Link>
        </nav>
      </div>
    </header>
  );
}