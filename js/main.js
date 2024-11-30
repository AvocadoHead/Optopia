// Optopia Core Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DATA object
    window.DATA = {
        gallery: window.GALLERY_DATA || [],
        members: window.MEMBERS || [],
        courses: window.COURSES || []
    };
    
    // Always start in Hebrew
    const lang = 'he';
    document.documentElement.lang = lang;
    document.documentElement.dir = 'rtl';
    localStorage.setItem('optopia-lang', lang);
    
    // Page-specific initializations
    const pageInitializers = {
        'index.html': initHomePage,
        'members.html': initMembersPage,
        'gallery.html': initGalleryPage,
        'courses.html': initCoursesPage,
        'member.html': initMemberPage,
        'gallery-item.html': initGalleryItemPage
    };
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const initializer = pageInitializers[currentPage];
    
    if (initializer) initializer();
    
    // Toggle language button state
    const langButtons = document.querySelectorAll('[data-lang]');
    langButtons.forEach(el => {
        el.style.display = el.getAttribute('data-lang') === lang ? 'inline-block' : 'none';
    });
});

function initLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    
    // Toggle language button state
    const langButtons = document.querySelectorAll('[data-lang]');
    langButtons.forEach(el => {
        el.style.display = el.getAttribute('data-lang') === lang ? 'inline-block' : 'none';
    });
    
    // Rerender sections to update language
    const membersContainer = document.getElementById('members-grid');
    const galleryContainer = document.getElementById('gallery-preview');
    const coursesContainer = document.getElementById('courses-preview');
    
    if (membersContainer) {
        const currentMemberCount = membersContainer.children.length;
        membersContainer.innerHTML = '';
        renderMembers(membersContainer, currentMemberCount > 4 ? null : 4);
    }
    
    if (galleryContainer && window.DATA.gallery) {
        galleryContainer.innerHTML = '';
        renderGalleryPreview(galleryContainer, 4);
    }
    
    if (coursesContainer) {
        coursesContainer.innerHTML = '';
        renderCoursesPreview(coursesContainer, 3);
    }
    
    localStorage.setItem('optopia-lang', lang);
}

function toggleLanguage() {
    const currentLang = document.documentElement.lang;
    const newLang = currentLang === 'he' ? 'en' : 'he';
    
    // Update HTML lang and direction
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
    
    // Update button text
    const langButton = document.querySelector('.nav-btn[onclick="toggleLanguage()"]');
    if (langButton) {
        langButton.textContent = newLang === 'he' ? 'EN' : 'HE';
    }
    
    // Toggle language button state
    const langButtons = document.querySelectorAll('[data-lang]');
    langButtons.forEach(el => {
        el.style.display = el.getAttribute('data-lang') === newLang ? 'inline-block' : 'none';
    });
    
    // Rerender sections to update language
    const membersContainer = document.getElementById('members-grid');
    const galleryContainer = document.getElementById('gallery-preview');
    const coursesContainer = document.getElementById('courses-preview');
    
    if (membersContainer) {
        const currentMemberCount = membersContainer.children.length;
        membersContainer.innerHTML = '';
        renderMembers(membersContainer, currentMemberCount > 4 ? null : 4);
    }
    
    if (galleryContainer && window.DATA.gallery) {
        galleryContainer.innerHTML = '';
        renderGalleryPreview(galleryContainer, 4);
    }
    
    if (coursesContainer) {
        coursesContainer.innerHTML = '';
        renderCoursesPreview(coursesContainer, 3);
    }
    
    localStorage.setItem('optopia-lang', newLang);
}

// Track members expanded state globally
window.membersExpanded = false;

function renderMembers(container, limit = null) {
    if (!container || !window.MEMBERS) return;
    
    container.innerHTML = '';
    const lang = document.documentElement.lang;
    
    // Get all members and shuffle if showing limited amount
    let members = [...window.MEMBERS];
    if (limit) {
        // Fisher-Yates shuffle
        for (let i = members.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [members[i], members[j]] = [members[j], members[i]];
        }
        members = members.slice(0, limit);
    }
    
    members.forEach(member => {
        const memberCard = document.createElement('a');
        memberCard.className = 'member-card';
        memberCard.href = `member.html?id=${member.id}`;
        memberCard.innerHTML = `
            <img src="${member.image}" alt="${Utils.getLangText(member.name, lang)}" class="member-image">
            <h3>${Utils.getLangText(member.name, lang)}</h3>
            <p class="member-preview">${Utils.getLangText(member.role, lang)}</p>
        `;
        container.appendChild(memberCard);
    });
}

window.toggleMembers = function() {
    const container = document.getElementById('members-grid');
    const toggleBtn = document.getElementById('toggle-members');
    if (!container || !toggleBtn) return;
    
    window.membersExpanded = !window.membersExpanded;
    const lang = document.documentElement.lang;
    
    if (window.membersExpanded) {
        renderMembers(container, null);
        toggleBtn.textContent = lang === 'he' ? 'הראה פחות' : 'Show Less';
    } else {
        renderMembers(container, 15);
        toggleBtn.textContent = lang === 'he' ? 'הראה עוד' : 'Show More';
    }
};

function initHomePage() {
    const membersContainer = document.getElementById('members-grid');
    const galleryContainer = document.getElementById('gallery-preview');
    const coursesContainer = document.getElementById('courses-preview');
    const toggleMembersBtn = document.getElementById('toggle-members');
    
    // Start with 15 random members
    window.membersExpanded = false;
    renderMembers(membersContainer, 15);
    
    if (galleryContainer && window.DATA.gallery) {
        renderGalleryPreview(galleryContainer, 4);
    }
    
    // Ensure courses render on main page
    if (coursesContainer) {
        console.log('Courses container found:', coursesContainer);
        console.log('Total courses:', window.COURSES ? window.COURSES.length : 'No courses');
        
        // Ensure COURSES is defined globally
        if (typeof window.COURSES === 'undefined') {
            window.COURSES = [];
        }
        
        renderCoursesPreview(coursesContainer, 3);
    } else {
        console.error('Courses preview container not found');
    }
    
    // Toggle members functionality
    if (toggleMembersBtn) {
        toggleMembersBtn.onclick = window.toggleMembers;
    }
}

function initMembersPage() {
    renderMembers(document.getElementById('members-grid'));
}

function initGalleryPage() {
    const galleryContainer = document.getElementById('gallery-grid');
    if (galleryContainer && window.DATA.gallery) {
        renderGallery(galleryContainer);
    }
}

function initCoursesPage() {
    // Safeguard to ensure Utils and COURSES are loaded
    if (typeof window.Utils === 'undefined' || typeof window.COURSES === 'undefined') {
        console.error('Required scripts not loaded');
        return;
    }

    const coursesGrid = document.getElementById('courses-grid');
    
    if (coursesGrid) {
        renderCourses(coursesGrid);
    }
}

function initMemberPage() {
    const memberContainer = document.getElementById('member-details');
    const memberCoursesContainer = document.querySelector('.member-courses');
    
    if (!memberContainer) {
        console.error('Member details container not found');
        return;
    }
    
    // Render member details
    const memberId = new URLSearchParams(window.location.search).get('id');
    const member = window.MEMBERS.find(m => m.id === memberId);
    
    if (!member) {
        console.error('Member not found');
        return;
    }
    
    // Render member details
    const lang = document.documentElement.lang || 'he';
    memberContainer.innerHTML = `
        <div class="member-image">
            <img src="${member.profilePicture}" alt="${member.name}" loading="lazy">
        </div>
        <div class="member-info">
            <h1>${member.name}</h1>
            <p>${member.description}</p>
        </div>
    `;
    
    // Render member's courses if container exists
    if (memberCoursesContainer) {
        const memberCourses = window.COURSES.filter(course => 
            course.teachers.includes(memberId)
        );
        
        // Create courses grid if it doesn't exist
        let coursesGrid = memberCoursesContainer.querySelector('.grid');
        if (!coursesGrid) {
            coursesGrid = document.createElement('div');
            coursesGrid.className = 'grid';
            memberCoursesContainer.appendChild(coursesGrid);
        }
        
        // Clear existing courses
        coursesGrid.innerHTML = '';
        
        // Render courses
        memberCourses.forEach(course => {
            const courseCard = window.Utils.createCourseCard(course);
            coursesGrid.appendChild(courseCard);
        });
    }
}

function initGalleryItemPage() {
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('id');
    const item = window.DATA.gallery.find(g => g.id === itemId);
    
    if (!item) {
        window.location.href = 'gallery.html';
        return;
    }
    
    const lang = document.documentElement.lang;
    const artist = window.MEMBERS.find(m => m.id === item.artist);
    
    document.getElementById('gallery-item-image').src = item.src;
    document.getElementById('gallery-item-title').textContent = Utils.getLangText(item.title, lang);
    const artistElement = document.getElementById('gallery-item-artist');
    artistElement.innerHTML = `<a href="member.html?id=${artist.id}" class="artist-link">${Utils.getLangText(artist.name, lang)}</a>`;
    document.getElementById('gallery-item-description').textContent = Utils.getLangText(item.description, lang);
}

function renderGalleryPreview(container, limit = null) {
    if (!container || !window.DATA.gallery) return;
    
    container.innerHTML = '';
    const lang = document.documentElement.lang;
    const items = limit ? window.DATA.gallery.slice(0, limit) : window.DATA.gallery;
    
    items.forEach(item => {
        const artist = window.MEMBERS.find(m => m.id === item.artist);
        if (!artist) {
            console.warn(`Artist not found for gallery item: ${item.id}`);
            return;
        }
        
        const galleryCard = document.createElement('a');
        galleryCard.className = 'gallery-card';
        galleryCard.href = `gallery-item.html?id=${item.id}`;
        galleryCard.innerHTML = `
            <div class="gallery-image">
                <img src="${item.src}" alt="${Utils.getLangText(item.title, lang)}" loading="lazy">
            </div>
            <div class="gallery-info">
                <h3>${Utils.getLangText(item.title, lang)}</h3>
                <p class="artist">${Utils.getLangText(artist.name, lang)}</p>
                <p class="description">${Utils.getLangText(item.description, lang)}</p>
            </div>
        `;
        
        container.appendChild(galleryCard);
    });
}

function renderCourses(coursesGrid) {
    console.log('Debugging renderCourses', {
        coursesGrid: !!coursesGrid,
        windowUtils: window.Utils,
        createCourseCardExists: typeof window.Utils?.createCourseCard === 'function',
        createCourseCardMethod: window.Utils?.createCourseCard ? window.Utils.createCourseCard.toString() : 'Not a function'
    });

    // Defensive checks
    if (!coursesGrid) {
        console.error('Courses grid not provided');
        return;
    }

    if (!window.COURSES || window.COURSES.length === 0) {
        console.error('No courses data available');
        return;
    }

    if (!window.Utils || typeof window.Utils.createCourseCard !== 'function') {
        console.error('Utils.createCourseCard is not a function', {
            Utils: window.Utils,
            createCourseCardType: typeof window.Utils?.createCourseCard
        });
        return;
    }

    // Clear existing content
    coursesGrid.innerHTML = '';

    // Render courses
    window.COURSES.forEach(course => {
        try {
            const courseCard = window.Utils.createCourseCard(course);
            if (courseCard) {
                coursesGrid.appendChild(courseCard);
            }
        } catch (error) {
            console.error('Error rendering course card:', error, course);
        }
    });

    console.log(`Rendered ${window.COURSES.length} courses`);
}

function renderCoursesPreview(container, limit = null) {
    if (!container) {
        console.error('Courses preview container not found');
        return;
    }
    
    // Ensure COURSES is defined
    if (!window.COURSES) {
        window.COURSES = [];
    }
    
    if (window.COURSES.length === 0) {
        console.error('No courses data available');
        return;
    }
    
    container.innerHTML = '';
    const coursesToRender = limit ? window.COURSES.slice(0, limit) : window.COURSES;
    
    if (coursesToRender.length === 0) {
        console.error('No courses to render');
        return;
    }
    
    coursesToRender.forEach(course => {
        const courseCard = window.Utils.createCourseCard(course, true);
        container.appendChild(courseCard);
    });
    
    console.log(`Rendered ${coursesToRender.length} courses`);
}

function renderGallery(container, courses = null) {
    if (!container) return;
    
    container.innerHTML = '';
    const coursesToRender = courses || window.DATA.gallery;
    
    coursesToRender.forEach(item => {
        const artist = window.MEMBERS.find(m => m.id === item.artist);
        if (!artist) {
            console.warn(`Artist not found for gallery item: ${item.id}`);
            return;
        }
        
        const galleryCard = document.createElement('a');
        galleryCard.className = 'gallery-card';
        galleryCard.href = `gallery-item.html?id=${item.id}`;
        galleryCard.innerHTML = `
            <div class="gallery-image">
                <img src="${item.src}" alt="${Utils.getLangText(item.title, document.documentElement.lang)}" loading="lazy">
            </div>
            <div class="gallery-info">
                <h3>${Utils.getLangText(item.title, document.documentElement.lang)}</h3>
                <p class="artist">${Utils.getLangText(artist.name, document.documentElement.lang)}</p>
                <p class="description">${Utils.getLangText(item.description, document.documentElement.lang)}</p>
            </div>
        `;
        
        container.appendChild(galleryCard);
    });
}

function handleImageError(event) {
    const defaultProfileImage = '/assets/default-profile.jpg';
    event.target.src = defaultProfileImage;
    event.target.onerror = null; // Prevent infinite error loop
}

function createMemberCard(member, isPreview = false) {
    const card = document.createElement('div');
    card.className = 'member-card';
    
    // Create image element with error handling
    const memberImage = document.createElement('img');
    memberImage.src = member.profilePicture || '/assets/default-profile.jpg';
    memberImage.alt = member.name;
    memberImage.loading = 'lazy';
    memberImage.onerror = handleImageError;
    
    card.innerHTML = `
        <div class="member-image"></div>
        <h3>${member.name}</h3>
        ${isPreview ? `<p class="member-preview">${member.shortDescription}</p>` 
                   : `<p class="member-description">${member.description}</p>`}
        ${!isPreview ? `
            <div class="member-courses">
                <h4>Courses</h4>
                <ul>
                    ${member.courses.map(course => `
                        <li><a href="/courses/${course.id}" data-course-id="${course.id}">${course.title}</a></li>
                    `).join('')}
                </ul>
            </div>
        ` : ''}
    `;

    // Add image to the member-image div
    const memberImageContainer = card.querySelector('.member-image');
    memberImageContainer.appendChild(memberImage);

    // Add click handler for preview cards
    if (isPreview) {
        card.addEventListener('click', () => {
            window.location.href = `/members/${member.id}`;
        });
    }

    return card;
}

// Expose global functions
window.toggleLanguage = toggleLanguage;
