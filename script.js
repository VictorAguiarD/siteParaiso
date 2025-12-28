/* =========================================================
   BANCO DE DADOS EM MEMÓRIA (SIMULADO)
========================================================= */

// HERO SLIDER
let heroSlides = [
    { type: 'image', url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1200' },
    { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-camping-under-the-stars-8765-large.mp4' }
];

// GALERIA
let galleryPhotos = [
    'https://images.unsplash.com/photo-1517164459100-2812051947a7?q=80&w=400',
    'https://images.unsplash.com/photo-1506484381205-f7945653044d?q=80&w=400',
    'https://images.unsplash.com/photo-1464347755392-8072ef923139?q=80&w=400'
];

// INSCRIÇÃO
let selectedWeek = null;


/* =========================================================
   HERO SLIDER
========================================================= */

let currentSlide = 0;
let sliderInterval;

function renderHero() {
    const container = document.getElementById('hero-slides-container');
    if (!container) return;

    container.innerHTML = '';

    heroSlides.forEach((slide, index) => {
        const div = document.createElement('div');
        div.className = `slide ${index === 0 ? 'active' : ''}`;

        if (slide.type === 'video') {
            div.innerHTML = `<video autoplay muted loop playsinline src="${slide.url}"></video>`;
        } else {
            div.innerHTML = `<img src="${slide.url}" alt="Acampamento Paraíso">`;
        }

        container.appendChild(div);
    });

    startSliderLogic();
    renderAdminHeroList();
}

function startSliderLogic() {
    clearInterval(sliderInterval);
    const slides = document.querySelectorAll('.slide');
    if (slides.length <= 1) return;

    currentSlide = 0;
    sliderInterval = setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000);
}


/* =========================================================
   GALERIA
========================================================= */

function renderGallery() {
    const container = document.getElementById('main-gallery');
    if (!container) return;

    container.innerHTML = '';

    galleryPhotos.forEach(url => {
        const item = document.createElement('div');
        item.className = 'feed-item';
        item.style.backgroundImage = `url(${url})`;
        container.appendChild(item);
    });

    renderAdminGalleryList();
}


/* =========================================================
   ADMIN - HERO
========================================================= */

function renderAdminHeroList() {
    const list = document.getElementById('admin-hero-list');
    if (!list) return;

    list.innerHTML = '';

    heroSlides.forEach((slide, index) => {
        list.innerHTML += `
            <div class="manage-item"
                style="background-image:${slide.type === 'image' ? `url(${slide.url})` : 'none'};
                background-color:#333">
                ${slide.type === 'video' ? '<small style="color:white;padding:10px">VÍDEO</small>' : ''}
                <button class="del-btn" onclick="deleteHeroSlide(${index})">×</button>
            </div>
        `;
    });
}

function deleteHeroSlide(index) {
    heroSlides.splice(index, 1);
    renderHero();
}

const heroUpload = document.getElementById('hero-upload');
if (heroUpload) {
    heroUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const type = file.type.startsWith('video') ? 'video' : 'image';
        const url = URL.createObjectURL(file);

        heroSlides.push({ type, url });
        renderHero();
    });
}


/* =========================================================
   ADMIN - GALERIA
========================================================= */

function renderAdminGalleryList() {
    const list = document.getElementById('admin-gallery-list');
    if (!list) return;

    list.innerHTML = '';

    galleryPhotos.forEach((url, index) => {
        list.innerHTML += `
            <div class="manage-item" style="background-image:url(${url})">
                <button class="del-btn" onclick="deleteGalleryPhoto(${index})">×</button>
            </div>
        `;
    });
}
function renderAdminHeroList() {
    const list = document.getElementById('admin-hero-list');
    if (!list) return;

    list.innerHTML = '';

    heroSlides.forEach((slide, index) => {
        list.innerHTML += `
            <div class="manage-item"
                 style="background-image:${slide.type === 'image' ? `url(${slide.url})` : 'none'};
                 background-color:#222">
                ${slide.type === 'video'
                    ? '<small>VÍDEO</small>'
                    : '<small>IMAGEM</small>'}
                <button class="del-btn" onclick="deleteHeroSlide(${index})">×</button>
            </div>
        `;
    });
}

function deleteGalleryPhoto(index) {
    galleryPhotos.splice(index, 1);
    renderGallery();
}

const galleryUpload = document.getElementById('gallery-upload');
if (galleryUpload) {
    galleryUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        galleryPhotos.unshift(url);
        renderGallery();
    });
}


/* =========================================================
   UI / ADMIN CONTROLS
========================================================= */

function toggleAdmin() {
    document.getElementById('admin-panel')?.classList.toggle('active');
}

function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tabs button').forEach(b => b.classList.remove('active'));

    document.getElementById(`admin-tab-${tab}`)?.classList.add('active');
    document.getElementById(`tab-btn-${tab}`)?.classList.add('active');
}


/* =========================================================
   INSCRIÇÃO / CHECKOUT (EVOLUÍDO)
========================================================= */

function selectWeek(nome, idade, preco) {
    selectedWeek = { nome, idade, preco };

    const cart = document.getElementById('cart-count');
    if (cart) cart.innerText = "1";

    document.getElementById('selected-summary').innerHTML = `
        <h3>${nome}</h3>
        <p><strong>Faixa etária:</strong> ${idade}</p>
        <p class="price">R$ ${preco},00</p>
    `;

    document.getElementById('checkout-overlay').style.display = 'block';
}

function closeCheckout() {
    document.getElementById('checkout-overlay').style.display = 'none';
}

function submitForm(event) {
    event.preventDefault();

    if (!selectedWeek) {
        alert('Selecione uma semana antes de continuar.');
        return;
    }

    alert(
        `Inscrição confirmada!\n\n` +
        `Semana: ${selectedWeek.nome}\n` +
        `Faixa etária: ${selectedWeek.idade}\n` +
        `Valor: R$ ${selectedWeek.preco},00`
    );

    closeCheckout();
}


/* =========================================================
   INIT
========================================================= */

window.onload = () => {
    renderHero();
    renderGallery();
};
