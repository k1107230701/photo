let slideInterval;
let isSliding = false;
let isPaused = false; // 用于跟踪是否暂停
let currentPosition = 0; // 记录当前滑动位置
let slideSpeed = 0.1; // 调整滑动速度
let currentAlbum = "小野猫"; // 当前显示的相册

// 性能监控相关变量
let performanceMonitoring = {
    frameCount: 0,
    lastTime: 0,
    fps: 0,
    memoryUsage: 0
};

// 相册数据
const albums = {
    "小野猫": [
        "img/1.jpg17575802831_HD.jpeg",
        "img/1.jpg17575802882_HD.jpeg",
        "img/1.jpg17575802923_HD.jpeg",
        "img/1.jpg17575802964_HD.jpeg",
        "img/1.jpg17575803015_HD.jpeg",
        "img/1.jpg17575803056_HD.jpeg",
        "img/1.jpg17575803097_HD.jpeg",
        "img/1.jpg17575803138_HD.jpeg",
        "img/1.jpg17575803189_HD.jpeg",
        "img/1.jpg175758032210_HD.jpeg",
        "img/1.jpg175758032611_HD.jpeg",
        "img/1.jpg175758033112_HD.jpeg",
        "img/1.jpg175758033513_HD.jpeg",
        "img/1.jpg175758034014_HD.jpeg",
        "img/1.jpg175758034415_HD.jpeg",
        "img/1.jpg175758034916_HD.jpeg",
        "img/1.jpg175758035317_HD.jpeg",
        "img/1.jpg175758035818_HD.jpeg",
        "img/1.jpg175758036219_HD.jpeg",
        "img/1.jpg175758036720_HD.jpeg",
        "img/1.jpg175758037121_HD.jpeg",
        "img/1.jpg175758037622_HD.jpeg",
        "img/1.jpg175758038023_HD.jpeg",
        "img/1.jpg175758038424_HD.jpeg",
        "img/1.jpg175758038925_HD.jpeg",
        "img/1.jpg175758039326_HD.jpeg"
    ],
    "新春快乐": [
        "img2/1.jpg17575801252_HD.jpeg",
        "img2/1.jpg17575801283_HD.jpeg",
        "img2/1.jpg17575801355_HD.jpeg",
        "img2/1.jpg17575801386_HD.jpeg",
        "img2/1.jpg17575801417_HD.jpeg",
        "img2/1.jpg17575801458_HD.jpeg",
        "img2/1.jpg17575801489_HD.jpeg",
        "img2/1.jpg175758015210_HD.jpeg",
        "img2/1.jpg175758015511_HD.jpeg",
        "img2/1.jpg175758015912_HD.jpeg",
        "img2/1.jpg175758016213_HD.jpeg",
        "img2/1.jpg175758016614_HD.jpeg",
        "img2/1.jpg175758016915_HD.jpeg",
        "img2/1.jpg175758017316_HD.jpeg",
        "img2/1.jpg175758017617_HD.jpeg",
        "img2/1.jpg175758018018_HD.jpeg",
        "img2/1.jpg175758018319_HD.jpeg",
        "img2/1.jpg175758018720_HD.jpeg",
        "img2/1.jpg175758019121_HD.jpeg",
        "img2/1.jpg175758019422_HD.jpeg"
    ]
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM内容加载完成，开始初始化');
    setupCarousel();
    setupLatestPhotos();
    setupAlbumFeature();
    initializeAlbums(); // 初始化相册
    
    // 设置默认激活的按钮状态
    const setXiaoyemaoBtn = document.getElementById('set-xiaoyemao');
    if (setXiaoyemaoBtn) {
        setXiaoyemaoBtn.classList.add('active');
    }
    
    console.log('所有功能初始化完成');
});

// 窗口大小变化时重新调整轮播图
window.addEventListener('resize', function() {
    // 重新开始轮播图以适应新的窗口大小
    stopCarousel();
    setTimeout(() => {
        startCarousel();
    }, 100);
});

// 添加一个函数来重新绑定所有事件监听器
function rebindAllEventListeners() {
    console.log('重新绑定所有事件监听器');
    setupLatestPhotos();
    // 轮播图事件监听器会在createCarouselContent中重新绑定
    // 相册图片事件监听器会在showAlbumPhotos中重新绑定
}

// 添加一个全局变量来跟踪模态框状态
let isModalOpen = false;

// 轮播图相关变量
let carouselInterval;
let animationId; // 用于取消动画帧
let currentTranslateX = 0; // 当前的translateX值
let lastTimestamp = 0; // 上一帧的时间戳
let isMouseOverCarousel = false; // 鼠标是否在轮播图上
let isMouseDownOnImage = false; // 是否在图片上按下鼠标
let lastImageCloseTime = 0; // 上次关闭图片的时间
const IMAGE_CLOSE_INTERVAL = 0; // 关闭图片后的间隔时间（毫秒），设置为0表示无间隔

// 创建轮播图内容
function createCarouselContent() {
    const wrapper = document.querySelector('.carousel-wrapper');
    const albumPhotos = albums[currentAlbum];
    const totalPhotos = albumPhotos.length;
    
    // 检查元素是否存在
    if (!wrapper) {
        console.error('轮播图容器不存在');
        return;
    }
    
    // 清空现有的内容
    wrapper.innerHTML = '';
    
    // 创建足够多的图片以支持无限滚动
    // 创建三倍数量的图片来实现无缝循环
    const totalImagesToCreate = totalPhotos * 3;
    
    for (let i = 0; i < totalImagesToCreate; i++) {
        const photoIndex = i % totalPhotos;
        const img = document.createElement('img');
        img.src = albumPhotos[photoIndex];
        img.alt = `${currentAlbum}${photoIndex + 1}`;
        img.loading = "lazy";
        img.dataset.index = i; // 添加索引属性，用于调试
        
        // 添加错误处理
        img.addEventListener('error', function() {
            console.warn(`图片加载失败: ${this.src}`);
            this.style.display = 'none';
        });
        
        // 添加单击事件处理逻辑
        // 使用命名函数以便于调试和避免重复绑定
        img.addEventListener('click', handleCarouselImageClick);
        
        wrapper.appendChild(img);
    }
    
    // 重置位置
    currentTranslateX = 0;
    wrapper.style.transform = `translateX(0px)`;
    
    console.log('轮播图内容创建完成，共创建了', totalImagesToCreate, '张图片');
}

// 轮播图图片点击处理函数
function handleCarouselImageClick(e) {
    console.log('轮播图图片被点击:', this.src);
    // 阻止事件冒泡，避免影响轮播图
    e.stopPropagation();
    // 暂停轮播图
    isPaused = true;
    // 显示大图
    showLargeImage(this.src, this.alt);
}

// 开始轮播 - 使用requestAnimationFrame
function startCarousel() {
    const wrapper = document.querySelector('.carousel-wrapper');
    if (!wrapper) return;
    
    // 取消之前的动画
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    const albumPhotos = albums[currentAlbum];
    const totalPhotos = albumPhotos.length;
    const photoWidth = wrapper.querySelector('img') ? wrapper.querySelector('img').offsetWidth + 20 : 300; // 图片宽度+间距
    const totalWidth = totalPhotos * photoWidth;
    
    // 开始动画
    function animate(timestamp) {
        // 只有当鼠标不在轮播图上按下且模态框未打开时才移动
        if (!isMouseOverCarousel && !isMouseDownOnImage && !isModalOpen) {
            if (!lastTimestamp) {
                lastTimestamp = timestamp;
            }
            
            const deltaTime = timestamp - lastTimestamp;
            lastTimestamp = timestamp;
            
            // 计算移动距离（加快十倍）
            const moveDistance = slideSpeed * 10 * deltaTime * 0.1;
            currentTranslateX -= moveDistance;
            
            // 实现无限循环：当移动距离超过总宽度时，重置位置
            if (Math.abs(currentTranslateX) >= totalWidth) {
                currentTranslateX += totalWidth;
            }
            
            // 应用变换
            wrapper.style.transform = `translateX(${currentTranslateX}px)`;
        } else {
            // 即使暂停也要更新时间戳，避免恢复时跳动
            lastTimestamp = timestamp;
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    animationId = requestAnimationFrame(animate);
}

// 暂停轮播
function pauseCarousel() {
    isPaused = true;
}

// 恢复轮播
function resumeCarousel() {
    isPaused = false;
    isImageClicked = false;
    startCarousel();
}

// 停止轮播
function stopCarousel() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    lastTimestamp = 0;
}

// 轮播图功能
function setupCarousel() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const wrapper = document.querySelector('.carousel-wrapper');
    const container = document.querySelector('.carousel-container');
    
    // 检查必要元素是否存在
    if (!prevBtn || !nextBtn || !wrapper || !container) {
        console.error('轮播图必要元素不存在');
        return;
    }
    
    // 创建轮播图内容
    createCarouselContent();
    
    // 开始轮播
    startCarousel();
    
    console.log('轮播图设置完成');
    
    // 上一张
    prevBtn.addEventListener('click', () => {
        if (!isSliding) {
            isSliding = true;
            // 暂停轮播并移动
            const tempPaused = isPaused;
            isPaused = true;
            prevSlide();
            setTimeout(() => {
                isPaused = tempPaused;
                if (!isPaused) {
                    startCarousel();
                }
                isSliding = false;
            }, 1000);
        }
    });
    
    // 下一张
    nextBtn.addEventListener('click', () => {
        if (!isSliding) {
            isSliding = true;
            // 暂停轮播并移动
            const tempPaused = isPaused;
            isPaused = true;
            nextSlide();
            setTimeout(() => {
                isPaused = tempPaused;
                if (!isPaused) {
                    startCarousel();
                }
                isSliding = false;
            }, 1000);
        }
    });
    
    // 鼠标悬停时暂停滑动
    container.addEventListener('mouseenter', () => {
        isMouseOverCarousel = true;
    });
    
    container.addEventListener('mouseleave', () => {
        isMouseOverCarousel = false;
    });
    
    console.log('轮播图按钮事件绑定完成');
}

function nextSlide() {
    const wrapper = document.querySelector('.carousel-wrapper');
    if (!wrapper) return;
    
    wrapper.style.transition = 'transform 0.5s ease';
    wrapper.style.transform = 'translateX(-100%)';
    
    setTimeout(() => {
        wrapper.style.transition = '';
        if (!isPaused) {
            startCarousel();
        }
    }, 500);
}

function prevSlide() {
    const wrapper = document.querySelector('.carousel-wrapper');
    if (!wrapper) return;
    
    wrapper.style.transition = 'transform 0.5s ease';
    wrapper.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
        wrapper.style.transition = '';
        if (!isPaused) {
            startCarousel();
        }
    }, 500);
}

// 最新照片功能
function setupLatestPhotos() {
    const photoItems = document.querySelectorAll('.photo-item img');
    
    photoItems.forEach(img => {
        // 移除可能存在的旧事件监听器
        img.removeEventListener('click', handleLatestPhotoClick);
        // 添加新的事件监听器
        img.addEventListener('click', handleLatestPhotoClick);
    });
    
    console.log('最新照片事件监听器绑定完成，共绑定了', photoItems.length, '个监听器');
}

// 最新照片点击处理函数
function handleLatestPhotoClick() {
    console.log('最新照片被点击:', this.src);
    // 创建模态框显示大图
    showLargeImage(this.src, this.alt);
}

// 显示大图
function showLargeImage(src, alt) {
    console.log('尝试显示大图:', src);
    // 设置模态框状态为打开
    isModalOpen = true;
    
    // 移除了间隔时间检查，允许连续单击
    
    // 检查是否已经存在模态框
    let modal = document.querySelector('.photo-modal');
    
    if (modal) {
        console.log('更新现有模态框内容');
        // 如果模态框已存在，更新图片内容
        const img = modal.querySelector('.modal-content img');
        img.src = src;
        img.alt = alt;
    } else {
        console.log('创建新的模态框');
        // 创建新的模态框
        modal = document.createElement('div');
        modal.className = 'photo-modal';
        modal.innerHTML = `
            <span class="close-btn">&times;</span>
            <div class="modal-content">
                <img src="${src}" alt="${alt}">
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(modal);
        
        // 绑定关闭事件
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            console.log('点击关闭按钮，移除模态框');
            document.body.removeChild(modal);
            // 恢复轮播图播放
            isModalOpen = false;
            isPaused = false;
            startCarousel();
        });
        
        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                console.log('点击模态框外部，移除模态框');
                document.body.removeChild(modal);
                // 恢复轮播图播放
                isModalOpen = false;
                isPaused = false;
                startCarousel();
            }
        });
        
        // ESC键关闭
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape' && document.querySelector('.photo-modal')) {
                const existingModal = document.querySelector('.photo-modal');
                if (existingModal) {
                    console.log('按ESC键，移除模态框');
                    document.body.removeChild(existingModal);
                    // 恢复轮播图播放
                    isModalOpen = false;
                    isPaused = false;
                    startCarousel();
                }
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }
    
    // 不再暂停轮播图滑动，允许用户继续与轮播图交互
    // 模态框显示时轮播图仍然运行，用户可以继续点击其他图片
}

// 初始化相册功能
function initializeAlbums() {
    // 页面加载时自动显示默认相册（小野猫）
    // 可以在这里添加其他初始化逻辑
    console.log("相册系统初始化完成");
}

// 设置相册功能
function setupAlbumFeature() {
    const albumBtn = document.getElementById('album-list-btn');
    const albumModal = document.getElementById('album-modal');
    const albumCloseBtn = document.querySelector('.album-close-btn');
    const albumItems = document.querySelectorAll('.album-item');
    const photosModal = document.getElementById('photos-modal');
    const backToAlbumsBtn = document.querySelector('.back-to-albums-btn');
    const albumTitle = document.getElementById('current-album-name'); // 获取标题元素

    // 点击标题切换相册（直接切换轮播图）
    if (albumTitle) {
        albumTitle.addEventListener('click', () => {
            // 切换到下一个相册
            const albumNames = Object.keys(albums);
            const currentIndex = albumNames.indexOf(currentAlbum);
            const nextIndex = (currentIndex + 1) % albumNames.length;
            const nextAlbum = albumNames[nextIndex];
            
            // 设置当前相册并更新轮播图
            setCurrentAlbum(nextAlbum);
        });
        
        // 添加触摸事件支持
        albumTitle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            // 切换到下一个相册
            const albumNames = Object.keys(albums);
            const currentIndex = albumNames.indexOf(currentAlbum);
            const nextIndex = (currentIndex + 1) % albumNames.length;
            const nextAlbum = albumNames[nextIndex];
            
            // 设置当前相册并更新轮播图
            setCurrentAlbum(nextAlbum);
        });
    }
    
    // 打开相册列表
    if (albumBtn) {
        albumBtn.addEventListener('click', () => {
            albumModal.style.display = 'flex';
            // 暂停轮播图滑动
            isPaused = true;
            stopCarousel();
        });
        
        // 添加触摸事件支持
        albumBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            albumModal.style.display = 'flex';
            // 暂停轮播图滑动
            isPaused = true;
            stopCarousel();
        });
    }
    
    // 关闭相册列表
    if (albumCloseBtn) {
        albumCloseBtn.addEventListener('click', () => {
            albumModal.style.display = 'none';
            // 恢复轮播图滑动
            isPaused = false;
            startCarousel();
        });
        
        // 添加触摸事件支持
        albumCloseBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            albumModal.style.display = 'none';
            // 恢复轮播图滑动
            isPaused = false;
            startCarousel();
        });
    }
    
    // 点击模态框外部关闭相册列表
    if (albumModal) {
        albumModal.addEventListener('click', (e) => {
            if (e.target === albumModal) {
                albumModal.style.display = 'none';
                // 恢复轮播图滑动
                isPaused = false;
                startCarousel();
            }
        });
    }
    
    // ESC键关闭相册列表
    document.addEventListener('keydown', function closeAlbumOnEscape(e) {
        if (e.key === 'Escape' && albumModal && albumModal.style.display === 'flex') {
            albumModal.style.display = 'none';
            // 恢复轮播图滑动
            isPaused = false;
            startCarousel();
        }
    });
    
    // 点击相册项显示相册照片
    if (albumItems) {
        albumItems.forEach(item => {
            item.addEventListener('click', () => {
                const albumName = item.getAttribute('data-album');
                showAlbumPhotos(albumName);
            });
            
            // 添加触摸事件支持
            item.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const albumName = item.getAttribute('data-album');
                showAlbumPhotos(albumName);
            });
        });
    }
    
    // 返回相册列表按钮
    if (backToAlbumsBtn) {
        backToAlbumsBtn.addEventListener('click', () => {
            if (photosModal) photosModal.style.display = 'none';
            if (albumModal) albumModal.style.display = 'flex'; // 返回相册列表
            // 恢复轮播图滑动
            isPaused = false;
            startCarousel();
        });
        
        // 添加触摸事件支持
        backToAlbumsBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (photosModal) photosModal.style.display = 'none';
            if (albumModal) albumModal.style.display = 'flex'; // 返回相册列表
            // 恢复轮播图滑动
            isPaused = false;
            startCarousel();
        });
    }
    
    // ESC键关闭照片模态框
    document.addEventListener('keydown', function closePhotosOnEscape(e) {
        if (e.key === 'Escape' && photosModal && photosModal.style.display === 'flex') {
            if (photosModal) photosModal.style.display = 'none';
            if (albumModal) albumModal.style.display = 'flex'; // 返回相册列表
            // 恢复轮播图滑动
            isPaused = false;
            startCarousel();
        }
    });
}

// 设置当前相册
function setCurrentAlbum(albumName) {
    currentAlbum = albumName;
    
    // 更新页面上显示的相册名称
    const albumNameElement = document.getElementById('current-album-name');
    if (albumNameElement) {
        albumNameElement.textContent = albumName;
    }
    
    // 重新创建轮播图内容
    createCarouselContent();
    
    // 重新开始滑动
    stopCarousel();
    startCarousel();
}

// 显示相册照片
function showAlbumPhotos(albumName) {
    const photosModal = document.getElementById('photos-modal');
    const albumTitle = document.getElementById('album-title');
    const photosContainer = document.querySelector('.album-photos-container');
    
    // 设置标题
    albumTitle.textContent = `${albumName} 相册`;
    
    // 清空容器
    photosContainer.innerHTML = '';
    
    // 添加照片
    const photos = albums[albumName];
    photos.forEach((photo, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'album-photo-item';
        photoItem.innerHTML = `
            <img src="${photo}" alt="${albumName} ${index + 1}" data-index="${index}" loading="lazy">
        `;
        
        // 为照片添加点击事件
        const img = photoItem.querySelector('img');
        // 移除可能存在的旧事件监听器
        img.removeEventListener('click', handleAlbumImageClick);
        // 添加新的事件监听器
        img.addEventListener('click', handleAlbumImageClick);
        
        photosContainer.appendChild(photoItem);
    });
    
    // 隐藏相册列表，显示照片模态框
    document.getElementById('album-modal').style.display = 'none';
    photosModal.style.display = 'flex';
    
    // 等待图片加载完成后统一高度
    setTimeout(() => {
        uniformAlbumPhotoHeights(photosContainer);
    }, 100);
    
    console.log('相册照片显示完成，共显示了', photos.length, '张图片');
}

// 相册图片点击处理函数
function handleAlbumImageClick() {
    console.log('相册图片被点击:', this.src);
    // 在相册界面内放大显示图片
    showLargeImageInAlbum(this.src, this.alt, this.closest('.album-photos-container'));
}

// 统一相册内图片高度
function uniformAlbumPhotoHeights(container) {
    const photoItems = container.querySelectorAll('.album-photo-item');
    let maxHeight = 0;
    
    // 重置所有图片的高度
    photoItems.forEach(item => {
        const img = item.querySelector('img');
        img.style.height = 'auto';
        item.classList.remove('uniform-height');
    });
    
    // 获取最高的图片高度
    photoItems.forEach(item => {
        const img = item.querySelector('img');
        if (img.offsetHeight > maxHeight) {
            maxHeight = img.offsetHeight;
        }
    });
    
    // 设置所有图片为统一高度
    if (maxHeight > 0) {
        photoItems.forEach(item => {
            const img = item.querySelector('img');
            img.style.height = `${maxHeight}px`;
            item.classList.add('uniform-height');
        });
    }
}

// 在相册界面内放大显示图片
function showLargeImageInAlbum(src, alt, container) {
    console.log('尝试在相册内显示大图:', src);
    // 获取所有相册照片项
    const photoItems = container.querySelectorAll('.album-photo-item');
    
    // 隐藏所有照片项
    photoItems.forEach(item => {
        item.style.display = 'none';
    });
    
    // 检查是否已经存在覆盖层
    let existingOverlay = container.querySelector('.album-image-overlay');
    if (existingOverlay) {
        console.log('更新现有覆盖层内容');
        // 如果存在，更新图片内容
        const img = existingOverlay.querySelector('img');
        img.src = src;
        img.alt = alt;
        return;
    }
    
    // 创建覆盖层
    const overlay = document.createElement('div');
    overlay.className = 'album-image-overlay';
    overlay.innerHTML = `
        <div class="album-image-overlay-content">
            <img src="${src}" alt="${alt}">
        </div>
    `;
    
    // 添加到容器
    container.appendChild(overlay);
    
    // 点击覆盖层关闭
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            console.log('点击覆盖层，移除覆盖层并显示照片项');
            // 移除覆盖层
            container.removeChild(overlay);
            
            // 显示所有照片项
            photoItems.forEach(item => {
                item.style.display = 'block';
            });
        }
    });
}
