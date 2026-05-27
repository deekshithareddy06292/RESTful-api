const form = document.getElementById('postForm');
const postsList = document.getElementById('postsList');
async function loadPosts() {
    const response = await fetch('/api/posts');
    const posts = await response.json();
    postsList.innerHTML = '';
    for (const post of posts) {
        const div = document.createElement('div');
        div.className = 'post';
        div.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>
        `;
        postsList.appendChild(div);
    }
}
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    await fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
    });
    form.reset();
    loadPosts();
});
async function deletePost(id) {
    await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
    });
    loadPosts();
}
loadPosts();