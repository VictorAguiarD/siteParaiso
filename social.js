/* =========================================================
   SOCIAL NETWORK LOGIC
========================================================= */

// Mock Data
let socialPosts = [
    {
        id: 1,
        user: { name: 'Mariana Silva', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150' },
        image: 'https://images.unsplash.com/photo-1517164459100-2812051947a7?q=80&w=600',
        caption: 'Meu filho amou a semana de aventuras! Já quer voltar ano que vem! 🏕️',
        likes: 24,
        comments: [
            { user: 'Equipe Paraíso', text: 'Que alegria ler isso, Mariana! Esperamos vocês!' }
        ],
        likedByMe: false
    },
    {
        id: 2,
        user: { name: 'João Pedro', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150' },
        image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?q=80&w=600',
        caption: 'Pôr do sol incrível no acampamento. #Natureza #Paz',
        likes: 45,
        comments: [],
        likedByMe: false
    }
];

// We need to ensure currentUser is available. 
// script.js runs first, so it initializes currentUser from localStorage.
// We can access it globally if both scripts are loaded.

// FEED FUNCTIONS
function renderFeed() {
    const list = document.getElementById('social-feed');
    if (!list) return;

    list.innerHTML = '';

    socialPosts.forEach(post => {
        // Comments HTML
        const commentsHtml = post.comments.map((c, i) => `
            <div class="comment-item">
                <span><strong>${c.user}:</strong> ${c.text}</span>
                ${currentUser && currentUser.isAdmin ?
                `<button onclick="deleteComment(${post.id}, ${i})" style="color:red;border:none;background:none;cursor:pointer">×</button>`
                : ''}
            </div>
        `).join('');

        // Admin Delete Post Btn
        const deletePostBtn = currentUser && currentUser.isAdmin ?
            `<button class="admin-del-btn" onclick="deletePost(${post.id})" title="Remover Post"><i data-lucide="trash-2"></i></button>`
            : '';

        // Like Button Class
        const likeClass = post.likedByMe ? 'liked' : '';

        const card = document.createElement('div');
        card.className = 'social-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="user-info">
                    <img src="${post.user.avatar}" class="user-avatar">
                    <div class="user-meta">
                        <h4>${post.user.name}</h4>
                        <span>Colônia de Férias</span>
                    </div>
                </div>
                ${deletePostBtn}
            </div>
            
            <div class="card-image-box">
                <img src="${post.image}" ondblclick="toggleLike(${post.id})">
            </div>

            <div class="card-actions">
                <button class="action-btn ${likeClass}" onclick="toggleLike(${post.id})">
                    <i data-lucide="heart"></i>
                </button>
                <button class="action-btn" onclick="document.getElementById('comment-input-${post.id}').focus()">
                    <i data-lucide="message-circle"></i>
                </button>
            </div>

            <div class="card-content">
                <span class="likes-count">${post.likes} curtidas</span>
                <p class="caption"><strong>${post.user.name}</strong> ${post.caption}</p>

                <div class="comments-list">
                    ${commentsHtml}
                </div>

                <div class="comment-form">
                    <input type="text" id="comment-input-${post.id}" class="comment-input" placeholder="Adicione um comentário...">
                    <button class="comment-post-btn" onclick="addComment(${post.id})">Publicar</button>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
    lucide.createIcons();
}

// INTERACTIONS
function toggleLike(postId) {
    if (!currentUser) {
        openLoginModal();
        return;
    }

    const post = socialPosts.find(p => p.id === postId);
    if (post) {
        if (post.likedByMe) {
            post.likes--;
            post.likedByMe = false;
        } else {
            post.likes++;
            post.likedByMe = true;
        }
        renderFeed();
    }
}

function addComment(postId) {
    if (!currentUser) {
        openLoginModal();
        return;
    }

    const input = document.getElementById(`comment-input-${postId}`);
    const text = input.value;
    if (!text.trim()) return;

    const post = socialPosts.find(p => p.id === postId);
    if (post) {
        post.comments.push({
            user: currentUser.name,
            text: text
        });
        renderFeed();
    }
}

function deletePost(postId) {
    if (confirm('ADM: Remover este post?')) {
        socialPosts = socialPosts.filter(p => p.id !== postId);
        renderFeed();
        showAlert('Admin', 'Post removido com sucesso!');
    }
}

function deleteComment(postId, commentIndex) {
    if (confirm('ADM: Remover este comentário?')) {
        const post = socialPosts.find(p => p.id === postId);
        if (post) {
            post.comments.splice(commentIndex, 1);
            renderFeed();
        }
    }
}


// NEW POST
function openPostModal() {
    document.getElementById('post-modal').style.display = 'flex';
}

function closePostModal() {
    document.getElementById('post-modal').style.display = 'none';
}

function previewPostImage(event) {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        document.getElementById('post-preview-img').src = url;
        document.getElementById('post-preview-img').style.display = 'block';
    }
}

function handleNewPost(e) {
    e.preventDefault();

    if (!currentUser) return;

    const caption = document.getElementById('post-caption').value;
    const fileInput = document.getElementById('post-image');
    const file = fileInput.files[0];
    const image = file ? URL.createObjectURL(file) : 'https://images.unsplash.com/photo-1596464716127-f9a085960430?q=80&w=600'; // Default backup

    const newPost = {
        id: Date.now(),
        user: { name: currentUser.name, avatar: currentUser.avatar },
        image: image,
        caption: caption,
        likes: 0,
        comments: [],
        likedByMe: false
    };

    socialPosts.unshift(newPost); // Add to top
    renderFeed();
    closePostModal();

    // Reset form
    e.target.reset();
    document.getElementById('post-preview-img').style.display = 'none';

    showAlert('Sucesso', 'Sua foto foi publicada!');
}

// Ensure Feed is rendered on load
window.addEventListener('load', () => {
    // Only if social-feed exists (we are on social page)
    if (document.getElementById('social-feed')) {
        renderFeed();
    }
});
