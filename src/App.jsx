import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Terminal from './components/Terminal';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';

function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Terminal />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </main>
      {!isHome && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Layout />
    </Router>
  );
}

export default App;
