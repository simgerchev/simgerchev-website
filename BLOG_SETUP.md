# Blog System Setup Guide

This project now includes a complete blog system with admin authentication, backend API, and database.

## Features

- ✅ Admin authentication with JWT
- ✅ Create, edit, and delete blog posts
- ✅ Public blog viewing
- ✅ Draft/Published status for posts
- ✅ Tags and cover images
- ✅ Dockerized backend and database
- ✅ MongoDB for data storage

## Quick Start with Docker

1. **Start all services:**
   ```bash
   docker-compose up --build
   ```

   This will start:
   - Frontend (React) on http://localhost:5173
   - Backend (Express) on http://localhost:5000
   - MongoDB on port 27017

2. **Access the application:**
   - Main site: http://localhost:5173
   - Blog: http://localhost:5173/blog
   - Admin panel: http://localhost:5173/admin

3. **Default admin credentials:**
   - Email: `admin@simgerchev.com`
   - Password: `changeme123`
   
   ⚠️ **Important:** Change these credentials in production!

## Project Structure

```
.
├── frontend/                  # React frontend
│   ├── src/                  # Frontend source code
│   ├── public/               # Static assets
│   ├── Dockerfile            # Frontend Docker config
│   └── package.json          # Frontend dependencies
├── backend/                    # Express.js backend
│   ├── models/                # MongoDB models
│   │   ├── User.js           # User model
│   │   └── BlogPost.js       # Blog post model
│   ├── routes/               # API routes
│   │   ├── auth.js           # Authentication routes
│   │   └── blog.js           # Blog CRUD routes
│   ├── middleware/           # Express middleware
│   │   └── auth.js           # JWT authentication
│   ├── utils/                # Utility functions
│   │   └── initAdmin.js      # Admin initialization
│   ├── server.js             # Main server file
│   ├── Dockerfile            # Backend Docker config
│   └── package.json          # Backend dependencies
└── docker-compose.yml        # Multi-container setup
```

## API Endpoints

### Public Endpoints
- `GET /api/blog/posts` - Get all published posts
- `GET /api/blog/posts/:slug` - Get single post by slug

### Authentication
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/verify` - Verify JWT token

### Admin Endpoints (requires authentication)
- `GET /api/blog/admin/posts` - Get all posts (including drafts)
- `POST /api/blog/posts` - Create new post
- `PUT /api/blog/posts/:id` - Update post
- `DELETE /api/blog/posts/:id` - Delete post

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/simgerchev-blog
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
ADMIN_EMAIL=admin@simgerchev.com
ADMIN_PASSWORD=changeme123
```

### Frontend (frontend/.env.local)
```env
VITE_API_URL=http://localhost:5000
```

## Development

### Backend Only
```bash
cd backend
npm install
npm run dev
```

### Frontend Only
```bash
cd frontend
npm install
npm run dev
```

### Install Backend Dependencies
```bash
cd backend
npm install
```

## Database

MongoDB stores:
- User accounts (admin)
- Blog posts with metadata
- Tags and relationships

Data persists in Docker volume `mongodb_data`.

## Security Notes

1. **Change default admin credentials** in production
2. **Update JWT_SECRET** to a strong random string
3. **Enable HTTPS** in production
4. **Set up proper CORS** policies for production
5. **Add rate limiting** for authentication endpoints
6. **Implement input sanitization** for blog content

## Creating Your First Blog Post

1. Navigate to http://localhost:5173/admin
2. Login with admin credentials
3. Click "Create New Post"
4. Fill in:
   - Title (required)
   - Slug (auto-generated from title)
   - Content (required)
   - Excerpt (optional, shown in blog list)
   - Tags (comma-separated)
   - Cover Image URL (optional)
5. Check "Published" to make it public
6. Click "Create Post"

## Troubleshooting

### Backend not connecting to MongoDB
- Wait 10-15 seconds for MongoDB to fully start
- Check logs: `docker-compose logs mongodb`
- Verify connection string in backend/.env

### Frontend can't reach backend
- Ensure VITE_API_URL is set correctly
- Check if backend is running on port 5000
- Verify CORS is enabled in backend

### Admin login not working
- Check backend logs: `docker-compose logs backend`
- Verify admin user was created (check backend startup logs)
- Ensure JWT_SECRET matches between requests

## Production Deployment

1. Update environment variables
2. Change admin credentials
3. Set NODE_ENV=production
4. Enable HTTPS
5. Set up proper MongoDB instance (Atlas, etc.)
6. Configure reverse proxy (nginx)
7. Set up proper CORS origins
8. Enable rate limiting and security headers

## Additional Features to Consider

- Rich text editor for blog content (TinyMCE, Quill)
- Image upload functionality
- Comment system
- Search functionality
- Categories/filtering
- SEO metadata
- RSS feed
- Social sharing
