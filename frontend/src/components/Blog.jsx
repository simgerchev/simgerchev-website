import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Blog.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blog/posts`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="blog-loading">Loading posts...</div>;
  }

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1 className="blog-title">Blog</h1>
        <Link to="/admin" className="btn blog-login-btn">Admin Login</Link>
      </div>
      {posts.length === 0 ? (
        <p className="no-posts">No blog posts yet. Check back soon!</p>
      ) : (
        <div className="blog-grid">
          {posts.map(post => (
            <article key={post._id} className="blog-card">
              {post.coverImage && (
                <div className="blog-card-image">
                  <img src={post.coverImage} alt={post.title} />
                </div>
              )}
              <div className="blog-card-content">
                <h2>
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <div className="blog-card-meta">
                  <time>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  {post.tags && post.tags.length > 0 && (
                    <div className="blog-card-tags">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="blog-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <Link to={`/blog/${post.slug}`} className="read-more">
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blog/posts/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        setError('Post not found');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="blog-loading">Loading post...</div>;
  }

  if (error) {
    return (
      <div className="blog-container">
        <div className="blog-error">{error}</div>
        <Link to="/blog" className="back-link">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <article className="blog-post">
        <Link to="/blog" className="back-link">← Back to Blog</Link>
        
        {post.coverImage && (
          <div className="blog-post-image">
            <img src={post.coverImage} alt={post.title} />
          </div>
        )}
        
        <header className="blog-post-header">
          <h1>{post.title}</h1>
          <div className="blog-post-meta">
            <time>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {post.author && <span className="author">By {post.author.email}</span>}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="blog-post-tags">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="blog-tag">{tag}</span>
              ))}
            </div>
          )}
        </header>

        <div 
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
        />
      </article>
    </div>
  );
};
