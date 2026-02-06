import { useState, useEffect } from 'react';
import './AdminPanel.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminPanel = ({ user, onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    tags: '',
    coverImage: '',
    published: false
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/blog/admin/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from title
    if (name === 'title' && !editingPost) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('adminToken');
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    try {
      const url = editingPost 
        ? `${API_URL}/api/blog/posts/${editingPost._id}`
        : `${API_URL}/api/blog/posts`;
      
      const response = await fetch(url, {
        method: editingPost ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        await fetchPosts();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      tags: post.tags.join(', '),
      coverImage: post.coverImage || '',
      published: post.published
    });
    setShowEditor(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/blog/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      tags: '',
      coverImage: '',
      published: false
    });
    setEditingPost(null);
    setShowEditor(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    onLogout();
  };

  if (loading) {
    return <div className="admin-panel loading">Loading...</div>;
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Blog Admin Panel</h1>
        <div className="admin-user-info">
          <span>{user.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowEditor(!showEditor)}
          >
            {showEditor ? 'Cancel' : 'Create New Post'}
          </button>
        </div>

        {showEditor && (
          <div className="post-editor">
            <h2>{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Excerpt</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="15"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="react, javascript, tutorial"
                />
              </div>

              <div className="form-group">
                <label>Cover Image URL</label>
                <input
                  type="text"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleInputChange}
                  />
                  Published
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="posts-list">
          <h2>All Posts ({posts.length})</h2>
          {posts.length === 0 ? (
            <p className="no-posts">No posts yet. Create your first post!</p>
          ) : (
            <div className="posts-grid">
              {posts.map(post => (
                <div key={post._id} className="post-card">
                  <div className="post-status">
                    <span className={`badge ${post.published ? 'published' : 'draft'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <h3>{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt || 'No excerpt'}</p>
                  <div className="post-meta">
                    <span className="post-date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    {post.tags.length > 0 && (
                      <div className="post-tags">
                        {post.tags.map((tag, idx) => (
                          <span key={idx} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="post-actions">
                    <button onClick={() => handleEdit(post)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(post._id)} className="btn-delete">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
