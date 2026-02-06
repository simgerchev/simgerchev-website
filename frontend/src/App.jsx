import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Intro from './components/Intro';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';
import BrowserTerminal from './components/BrowserTerminal';
import CyberMonk from './components/CyberMonk';
import Podvigh from './components/Podvigh';
import { BlogList, BlogPost } from './components/Blog';
import Admin from './components/Admin';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Intro />
                </>
              }
            />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/browser-terminal" element={<BrowserTerminal />} />
            <Route path="/cyber-monk" element={<CyberMonk />} />
            <Route path="/podvigh" element={<Podvigh />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;