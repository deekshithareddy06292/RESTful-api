const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3000;
let posts = [
  { id: 1, title: 'First Post', content: 'This is the first post.' },
  { id: 2, title: 'Second Post', content: 'This is the second post.' }
];
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && !req.url.startsWith('/api')) {
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css'
    };
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain');
      return res.end(fs.readFileSync(filePath));
    }
  }
  res.setHeader('Content-Type', 'application/json');
  if (req.method === 'GET' && req.url === '/api/posts') {
    res.statusCode = 200;
    res.end(JSON.stringify(posts));
  } 
  else if (req.method === 'GET' && req.url.startsWith('/api/posts/')) {
    const id = parseInt(req.url.split('/')[3]);
    const post = posts.find(p => p.id === id);
    if (!post) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Post not found' }));
    } else {
      res.statusCode = 200;
      res.end(JSON.stringify(post));
    }
  } 
  else if (req.method === 'POST' && req.url === '/api/posts') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { title, content } = JSON.parse(body || '{}');
        if (!title || !content) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ message: 'Title and content are required' }));
        }
        
        const newPost = {
          id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
          title,
          content
        };
        posts.push(newPost);
        res.statusCode = 201;
        res.end(JSON.stringify(newPost));
      } catch (e) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: 'Invalid JSON' }));
      }
    });
  } 
  else if (req.method === 'DELETE' && req.url.startsWith('/api/posts/')) {
    const id = parseInt(req.url.split('/')[3]);
    posts = posts.filter(p => p.id !== id);
    res.statusCode = 200;
    res.end(JSON.stringify({ message: 'Post deleted' }));
  } 
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
