/* =========================================================
   BANCO DE DADOS EM MEMÓRIA (SIMULADO)
========================================================= */

// HERO SLIDER
let heroSlides = [
    {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1200',
        tag: 'Temporada 2026',
        title: 'Onde a infância vive aventuras inesquecíveis',
        subtitle: 'Inscrições abertas para todas as idades'
    },
    {
        type: 'video',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-camping-under-the-stars-8765-large.mp4',
        tag: 'Experiência Única',
        title: 'Noites Mágicas',
        subtitle: 'Acampamento sob as estrelas'
    }
];

// GALERIA
let galleryPhotos = [
    'https://images.unsplash.com/photo-1517164459100-2812051947a7?q=80&w=400',
    'https://images.unsplash.com/photo-1506484381205-f7945653044d?q=80&w=400',
    'https://images.unsplash.com/photo-1464347755392-8072ef923139?q=80&w=400'
];

// PACOTES
let packages = [
    {
        title: 'Semana Júnior',
        desc: '6 a 9 anos · Primeira experiência',
        price: 400,
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600',
        features: ['Atividades lúdicas', 'Segurança reforçada'],
        badge: 'NOVO'
    },
    {
        title: 'Semana Aventura',
        desc: '8 a 12 anos · Trilhas e esportes',
        price: 450,
        image: 'https://images.unsplash.com/photo-1533512930330-4ac257c86793?q=80&w=600',
        features: ['Trilhas', 'Jogos cooperativos'],
        badge: ''
    },
    {
        title: 'Semana Adolescente',
        desc: '13 a 17 anos · Integração',
        price: 550,
        image: 'https://images.unsplash.com/photo-1526721940322-14a19e508817?q=80&w=600',
        features: ['Gincanas', 'Noites temáticas'],
        badge: ''
    }
];

// INSCRIÇÃO
let selectedWeek = null;


/* =========================================================
   UTILS (ALERTS & LIGHTBOX)
========================================================= */
function showAlert(title, message, icon = '🎉') {
    document.getElementById('alert-title').innerText = title;
    document.getElementById('alert-message').innerText = message;
    document.getElementById('alert-icon').innerText = icon;
    document.getElementById('custom-alert').style.display = 'flex';
}

function closeAlert() {
    document.getElementById('custom-alert').style.display = 'none';
}

function openLightbox(url) {
    document.getElementById('lightbox-img').src = url;
    document.getElementById('lightbox').style.display = 'flex';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}


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

    // Atualiza textos do Hero (Baseado no slide atual)
    const currentData = heroSlides[currentSlide] || heroSlides[0];
    if (currentData) {
        document.getElementById('hero-tag').innerText = currentData.tag || '';
        document.getElementById('hero-title').innerText = currentData.title || '';
        document.getElementById('hero-subtitle').innerText = currentData.subtitle || '';
    } else {
        // Fallback
        document.getElementById('hero-tag').innerText = '';
        document.getElementById('hero-title').innerText = '';
        document.getElementById('hero-subtitle').innerText = '';
    }

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

        // Atualiza textos ao trocar slide
        const currentData = heroSlides[currentSlide];
        if (currentData) {
            document.getElementById('hero-tag').innerText = currentData.tag || '';
            document.getElementById('hero-title').innerText = currentData.title || '';
            document.getElementById('hero-subtitle').innerText = currentData.subtitle || '';
        }
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
        item.onclick = () => openLightbox(url); // Adiciona click para lightbox
        item.style.cursor = 'pointer';
        container.appendChild(item);
    });

    renderAdminGalleryList();
}


/* =========================================================
   PACOTES (RENDERIZAÇÃO NA HOME)
======================================================== */

function renderPackages() {
    const container = document.getElementById('packages-grid');
    if (!container) return;

    container.innerHTML = '';

    packages.forEach((pkg, index) => {
        // Cria lista de features
        const featuresHtml = pkg.features.map(f => `<li>✓ ${f}</li>`).join('');

        // Badge opcional
        const badgeHtml = pkg.badge ? `<span class="badge">${pkg.badge}</span>` : '';

        const div = document.createElement('div');
        div.className = `premium-card ${index === 0 ? 'destaque' : ''}`;

        div.innerHTML = `
            <div class="card-image" style="background-image:url('${pkg.image}')"></div>
            <div class="card-body">
                ${badgeHtml}
                <h3>${pkg.title}</h3>
                <p>${pkg.desc}</p>
                <ul class="card-list">
                    ${featuresHtml}
                </ul>
                <div class="card-footer">
                    <span class="price">R$ ${pkg.price}</span>
                    <button onclick="selectWeek('${pkg.title}','${pkg.desc}',${pkg.price})">Reservar</button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });

    renderAdminPackagesList();
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

        const type = file ? (file.type.startsWith('video') ? 'video' : 'image') : 'image';
        const url = file ? URL.createObjectURL(file) : '';

        const title = document.getElementById('hero-title-input').value;
        const subtitle = document.getElementById('hero-subtitle-input').value;
        const tag = document.getElementById('hero-tag-input').value;

        if (!url && !title) {
            showAlert('Erro', 'Selecione uma imagem ou preencha os textos.', '⚠️');
            return;
        }

        heroSlides.push({
            type,
            url: url || 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1200', // fallback se não tiver imagem nova
            tag,
            title,
            subtitle
        });

        renderHero();
        showAlert('Sucesso', 'Novo slide adicionado!');

        // Limpar inputs
        document.getElementById('hero-title-input').value = '';
        document.getElementById('hero-subtitle-input').value = '';
        document.getElementById('hero-tag-input').value = '';
        e.target.value = ''; // reset file input
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
// Remove duplicate renderAdminHeroList


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
   ADMIN - PACOTES
======================================================== */

function renderAdminPackagesList() {
    const list = document.getElementById('admin-packages-list');
    if (!list) return;

    list.innerHTML = '';

    packages.forEach((pkg, index) => {
        list.innerHTML += `
            <div class="manage-item" style="display:flex; flex-direction:column; align-items:flex-start; height:auto; padding:10px;">
                <div style="font-weight:bold; font-size:14px">${pkg.title}</div>
                <div style="font-size:12px; opacity:0.7">${pkg.desc}</div>
                <div style="font-size:12px; margin-top:4px">R$ ${pkg.price}</div>
                
                <button class="del-btn" onclick="deletePackage(${index})" style="top:5px; right:5px">×</button>
            </div>
        `;
    });
}

function deletePackage(index) {
    if (confirm('Tem certeza que deseja remover este pacote?')) {
        packages.splice(index, 1);
        renderPackages();
    }
}

// Handler para adicionar pacote
function handleAddPackage(e) {
    e.preventDefault();

    const title = document.getElementById('pkg-title').value;
    const desc = document.getElementById('pkg-desc').value;
    const price = document.getElementById('pkg-price').value;

    const fileInput = document.getElementById('pkg-image-file');
    const file = fileInput.files[0];
    const image = file ? URL.createObjectURL(file) : 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600';

    // Tratando features (separadas por vírgula no input ou apenas 1 por simplicidade)
    // Vamos assumir que o usuário digita features separadas por vírgula
    const featuresInput = document.getElementById('pkg-features').value;
    const features = featuresInput ? featuresInput.split(',').map(s => s.trim()) : [];

    const newPkg = {
        title,
        desc,
        price,
        image,
        features,
        badge: '' // Simples por enquanto
    };

    packages.push(newPkg);
    renderPackages();

    // Limpar form
    e.target.reset();
    showAlert('Sucesso', 'Pacote adicionado com sucesso!');
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
        showAlert('Atenção', 'Selecione uma semana antes de continuar.', '⚠️');
        return;
    }

    showAlert('Sucesso',
        `Inscrição confirmada!\n` +
        `Semana: ${selectedWeek.nome}\n` +
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
    renderPackages();

};
