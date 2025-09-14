// 相册数据结构
let albums = [
    { id: 1, name: "科幻风景", photos: ["img/1.jpg17575802831_HD.jpeg", "img/1.jpg17575802882_HD.jpeg", "img/1.jpg17575802923_HD.jpeg"] },
    { id: 2, name: "未来城市", photos: ["img/1.jpg17575802964_HD.jpeg", "img/1.jpg17575803015_HD.jpeg", "img/1.jpg17575803056_HD.jpeg"] },
    { id: 3, name: "太空探索", photos: ["img/1.jpg17575803097_HD.jpeg", "img/1.jpg17575803138_HD.jpeg", "img/1.jpg17575803189_HD.jpeg"] }
];

let currentAlbumId = null;
let currentSlideIndex = 0;

// 从本地存储加载相册数据
function loadAlbumsFromStorage() {
    const storedAlbums = localStorage.getItem('albums');
    if (storedAlbums) {
        albums = JSON.parse(storedAlbums);
    }
}

// 将相册数据保存到本地存储
function saveAlbumsToStorage() {
    localStorage.setItem('albums', JSON.stringify(albums));
}

// DOM元素
let openAlbumModalBtn, albumModal, closeModal, addAlbumBtn, albumNameInput, albumsContainer, prevBtn, nextBtn, carouselSlides;

// 初始化DOM元素
function initDOMElements() {
    openAlbumModalBtn = document.getElementById('openAlbumModal');
    albumModal = document.getElementById('albumModal');
    closeModal = document.querySelector('.close');
    addAlbumBtn = document.getElementById('addAlbum');
    albumNameInput = document.getElementById('albumName');
    albumsContainer = document.getElementById('albumsContainer');
    prevBtn = document.querySelector('.prev-btn');
    nextBtn = document.querySelector('.next-btn');
    carouselSlides = document.querySelectorAll('.carousel-slide');
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initDOMElements();
    loadAlbumsFromStorage();
    renderAlbums();
    setupCarousel();
});

// 打开相册管理弹窗
openAlbumModalBtn.addEventListener('click', function() {
    albumModal.style.display = 'block';
});

// 关闭相册管理弹窗
closeModal.addEventListener('click', function() {
    albumModal.style.display = 'none';
});

// 点击弹窗外部关闭
window.addEventListener('click', function(event) {
    if (event.target === albumModal) {
        albumModal.style.display = 'none';
    }
});

// 添加相册
addAlbumBtn.addEventListener('click', function() {
    const name = albumNameInput.value.trim();
    if (name) {
        const newAlbum = {
            id: Date.now(),
            name: name,
            photos: []
        };
        albums.push(newAlbum);
        saveAlbumsToStorage();
        renderAlbums();
        albumNameInput.value = '';
        
        // 添加成功提示
        showMessage(`相册 "${name}" 创建成功！`, 'success');
    } else {
        showMessage('请输入相册名称！', 'error');
    }
});

// 渲染相册列表
function renderAlbums() {
    albumsContainer.innerHTML = '';
    albums.forEach(album => {
        const albumItem = document.createElement('li');
        albumItem.className = 'album-item';
        albumItem.innerHTML = `
            <span>${album.name} (${album.photos.length} 张照片)</span>
            <div>
                <button class="view-btn" data-id="${album.id}">查看</button>
                <button class="edit-btn" data-id="${album.id}">编辑</button>
                <button class="delete-btn" data-id="${album.id}">删除</button>
            </div>
        `;
        albumsContainer.appendChild(albumItem);
    });
    
    // 绑定事件
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            viewAlbum(id);
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            editAlbum(id);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            deleteAlbum(id);
        });
    });
}

// 查看相册
function viewAlbum(id) {
    const album = albums.find(a => a.id === id);
    if (album) {
        // 创建查看相册的弹窗
        const viewModal = document.createElement('div');
        viewModal.className = 'modal';
        viewModal.id = 'viewAlbumModal';
        viewModal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>${album.name}</h2>
                <div class="album-photos" id="albumPhotosContainer">
                    ${album.photos.map((photo, index) => `
                        <div class="photo-item" data-index="${index}">
                            <img src="${photo}" alt="相册照片" class="clickable-photo" data-src="${photo}">
                            <button class="delete-photo-btn" data-index="${index}">×</button>
                        </div>
                    `).join('')}
                </div>
                <div class="photo-actions">
                    <input type="text" id="photoUrl" placeholder="输入照片URL">
                    <button id="addPhoto" class="btn-secondary">添加照片</button>
                </div>
                <div class="batch-add-container">
                    <h3>批量添加照片</h3>
                    <textarea id="batchPhotoUrls" placeholder="每行输入一个照片URL"></textarea>
                    <button id="addBatchPhotos" class="btn-secondary">批量添加</button>
                </div>
            </div>
        `;
        document.body.appendChild(viewModal);
        
        // 显示弹窗
        viewModal.style.display = 'block';
        
        // 绑定关闭事件
        const closeBtn = viewModal.querySelector('.close');
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(viewModal);
        });
        
        // 点击弹窗外部关闭
        viewModal.addEventListener('click', function(event) {
            if (event.target === viewModal) {
                document.body.removeChild(viewModal);
            }
        });
        
        // 添加单张照片功能
        const addPhotoBtn = viewModal.querySelector('#addPhoto');
        addPhotoBtn.addEventListener('click', function() {
            const photoUrl = viewModal.querySelector('#photoUrl').value.trim();
            if (photoUrl) {
                album.photos.push(photoUrl);
                saveAlbumsToStorage();
                // 重新渲染照片
                renderAlbumPhotos(album, viewModal);
                viewModal.querySelector('#photoUrl').value = '';
            }
        });
        
        // 批量添加照片功能
        const addBatchPhotosBtn = viewModal.querySelector('#addBatchPhotos');
        addBatchPhotosBtn.addEventListener('click', function() {
            const batchUrls = viewModal.querySelector('#batchPhotoUrls').value.trim();
            if (batchUrls) {
                const urls = batchUrls.split('\n').map(url => url.trim()).filter(url => url);
                if (urls.length > 0) {
                    album.photos.push(...urls);
                    saveAlbumsToStorage();
                    // 重新渲染照片
                    renderAlbumPhotos(album, viewModal);
                    viewModal.querySelector('#batchPhotoUrls').value = '';
                    showMessage(`成功添加 ${urls.length} 张照片！`, 'success');
                }
            } else {
                showMessage('请输入至少一个照片URL！', 'error');
            }
        });
        
        // 删除照片功能
        const photoContainer = viewModal.querySelector('#albumPhotosContainer');
        photoContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('delete-photo-btn')) {
                const index = parseInt(event.target.getAttribute('data-index'));
                if (confirm('确定要删除这张照片吗？')) {
                    album.photos.splice(index, 1);
                    saveAlbumsToStorage();
                    // 重新渲染照片
                    renderAlbumPhotos(album, viewModal);
                }
            }
        });
        
        // 照片点击放大功能
        photoContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('clickable-photo')) {
                const photoSrc = event.target.getAttribute('data-src');
                showPhotoModal(photoSrc);
            }
        });
    }
}

// 显示照片放大模态框
function showPhotoModal(photoSrc) {
    // 创建照片放大模态框
    const photoModal = document.createElement('div');
    photoModal.className = 'photo-modal';
    photoModal.id = 'photoModal';
    photoModal.innerHTML = `
        <span class="close-photo-modal">&times;</span>
        <div class="photo-modal-content">
            <img src="${photoSrc}" alt="放大照片">
        </div>
    `;
    document.body.appendChild(photoModal);
    
    // 显示模态框
    photoModal.style.display = 'block';
    
    // 绑定关闭事件
    const closeBtn = photoModal.querySelector('.close-photo-modal');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(photoModal);
    });
    
    // 点击模态框外部关闭
    photoModal.addEventListener('click', function(event) {
        if (event.target === photoModal) {
            document.body.removeChild(photoModal);
        }
    });
    
    // ESC键关闭
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape' && document.getElementById('photoModal')) {
            document.body.removeChild(photoModal);
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

// 渲染相册照片
function renderAlbumPhotos(album, modal) {
    const photoContainer = modal.querySelector('#albumPhotosContainer');
    photoContainer.innerHTML = album.photos.map((photo, index) => `
        <div class="photo-item" data-index="${index}">
            <img src="${photo}" alt="相册照片">
            <button class="delete-photo-btn" data-index="${index}">×</button>
        </div>
    `).join('');
}

// 编辑相册
function editAlbum(id) {
    const album = albums.find(a => a.id === id);
    if (album) {
        const newName = prompt('请输入新的相册名称:', album.name);
        if (newName && newName.trim() !== '') {
            const oldName = album.name;
            album.name = newName.trim();
            saveAlbumsToStorage();
            renderAlbums();
            showMessage(`相册 "${oldName}" 已重命名为 "${newName}"！`, 'success');
        }
    }
}

// 删除相册
function deleteAlbum(id) {
    const album = albums.find(a => a.id === id);
    if (album && confirm(`确定要删除相册 "${album.name}" 吗？`)) {
        albums = albums.filter(album => album.id !== id);
        saveAlbumsToStorage();
        renderAlbums();
        showMessage(`相册 "${album.name}" 已删除！`, 'success');
    }
}

// 显示消息提示
function showMessage(message, type) {
    // 创建消息元素
    const messageEl = document.createElement('div');
    messageEl.className = `message ${type}`;
    messageEl.textContent = message;
    
    // 添加样式
    messageEl.style.position = 'fixed';
    messageEl.style.top = '20px';
    messageEl.style.right = '20px';
    messageEl.style.padding = '15px 20px';
    messageEl.style.borderRadius = '5px';
    messageEl.style.color = 'white';
    messageEl.style.fontWeight = 'bold';
    messageEl.style.zIndex = '9999';
    messageEl.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    
    if (type === 'success') {
        messageEl.style.background = 'linear-gradient(45deg, #00c9ff, #92fe9d)';
    } else {
        messageEl.style.background = 'linear-gradient(45deg, #ff416c, #ff4b2b)';
    }
    
    // 添加到页面
    document.body.appendChild(messageEl);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
        }
    }, 3000);
}

// 轮播图功能
function setupCarousel() {
    showSlide(currentSlideIndex);
    
    // 自动播放
    setInterval(() => {
        nextSlide();
    }, 5000);
    
    // 上一张
    prevBtn.addEventListener('click', () => {
        prevSlide();
    });
    
    // 下一张
    nextBtn.addEventListener('click', () => {
        nextSlide();
    });
}

function showSlide(index) {
    const wrapper = document.querySelector('.carousel-wrapper');
    wrapper.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % carouselSlides.length;
    showSlide(currentSlideIndex);
}

function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + carouselSlides.length) % carouselSlides.length;
    showSlide(currentSlideIndex);
}

// 照片管理功能（可以在查看相册时使用）
function addPhotoToAlbum(albumId, photoUrl) {
    const album = albums.find(a => a.id === albumId);
    if (album) {
        album.photos.push(photoUrl);
        return true;
    }
    return false;
}

function removePhotoFromAlbum(albumId, photoIndex) {
    const album = albums.find(a => a.id === albumId);
    if (album && album.photos[photoIndex]) {
        album.photos.splice(photoIndex, 1);
        return true;
    }
    return false;
}

// 导出函数供其他地方使用
window.albumSystem = {
    albums,
    addPhotoToAlbum,
    removePhotoFromAlbum
};