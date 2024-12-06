// Optopia Core Functionality
function initPage() {
    // Set initial language from localStorage or default to Hebrew
    const savedLanguage = localStorage.getItem('optopiaLanguage') || 'he';
    document.documentElement.lang = savedLanguage;

    // Update language-dependent elements
    updateLanguageElements();

    // Initialize page-specific components
    const pagePath = window.location.pathname;
    
    if (pagePath.includes('index.html')) {
        initHomePage();
    } else if (pagePath.includes('member.html')) {
        initMemberPage();
    } else if (pagePath.includes('gallery.html')) {
        initGalleryPage();
    } else if (pagePath.includes('courses.html')) {
        initCoursesPage();
    }

    // Attach language toggle event listener
    const toggleLanguageBtn = document.getElementById('toggle-language');
    if (toggleLanguageBtn) {
        toggleLanguageBtn.addEventListener('click', toggleLanguage);
    }
}

// Call initPage when the DOM is fully loaded
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
    localStorage.setItem('optopiaLanguage', lang);
    
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
        renderGalleryPreview(galleryContainer, 10);
    }
    
    if (coursesContainer) {
        coursesContainer.innerHTML = '';
        renderCoursesPreview(coursesContainer, 3);
    }
    
    localStorage.setItem('optopia-lang', lang);
}

function toggleLanguage() {
    const currentLang = document.documentElement.lang === 'he' ? 'en' : 'he';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'he' ? 'rtl' : 'ltr';
    localStorage.setItem('optopiaLanguage', currentLang);

    // Re-render components that need language update
    const membersContainer = document.getElementById('members-grid');
    const galleryPreviewContainer = document.getElementById('gallery-preview');
    const coursesPreviewContainer = document.getElementById('courses-preview');
    const galleryGridContainer = document.getElementById('gallery-grid');
    const coursesGridContainer = document.getElementById('courses-grid');

    // Re-render members if container exists
    if (membersContainer) {
        renderMembers(membersContainer, 
            membersContainer.children.length > 15 ? null : 15
        );
    }

    // Re-render gallery preview if container exists
    if (galleryPreviewContainer) {
        renderGalleryPreview(galleryPreviewContainer);
    }

    // Re-render courses preview if container exists
    if (coursesPreviewContainer) {
        renderCoursesPreview(coursesPreviewContainer);
    }

    // Re-render full gallery grid if on gallery page
    if (galleryGridContainer) {
        renderGallery(galleryGridContainer);
    }

    // Re-render full courses grid if on courses page
    if (coursesGridContainer) {
        renderCourses(coursesGridContainer);
    }

    // Update toggle button text
    const toggleBtn = document.getElementById('toggle-language');
    if (toggleBtn) {
        toggleBtn.textContent = currentLang === 'he' ? 'EN' : 'HE';
    }

    // Update other language-dependent elements
    updateLanguageElements();
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
        renderGalleryPreview(galleryContainer, 10);
    }
    
    // Ensure courses render on main page
    if (coursesContainer) {
        console.log('Courses container found:', coursesContainer);
        console.log('Total courses:', window.COURSES ? window.COURSES.length : 'No courses');
        
        // Ensure COURSES is defined globally
        if (typeof window.COURSES === 'undefined') {
            window.COURSES = [];
        }
        
        renderCoursesPreview(coursesContainer, 9);
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
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
        renderGallery(galleryGrid);
    }
}

function initCoursesPage() {
    const coursesGridContainer = document.getElementById('courses-grid');
    const searchInput = document.getElementById('courses-search-input');

    if (coursesGridContainer) {
        renderCourses(coursesGridContainer);
    }

    if (searchInput && coursesGridContainer) {
        setupCoursesSearch(searchInput, coursesGridContainer);
    }
}

function initMemberPage() {
    // Get member ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const memberId = urlParams.get('id');
    
    if (!memberId) {
        console.error('No member ID provided');
        return;
    }
    
    // Find the member
    const member = window.MEMBERS.find(m => m.id === memberId);
    if (!member) {
        console.error('Member not found', memberId);
        return;
    }

    // Set current language
    const currentLang = document.documentElement.lang || 'he';

    // Set profile image
    const memberImage = document.getElementById('member-image');
    if (memberImage) {
        memberImage.src = member.image;
        memberImage.alt = Utils.getLangText(member.name, currentLang);
        memberImage.onerror = (e) => {
            console.error('Member image failed to load:', member.image);
            e.target.src = '/assets/default-profile.jpg';
        };
    }

    // Render member details
    const memberNameElement = document.getElementById('member-name');
    const memberDescriptionElement = document.getElementById('member-description');
    const memberRoleElement = document.getElementById('member-role');
    
    if (memberNameElement) {
        memberNameElement.textContent = Utils.getLangText(member.name, currentLang);
    }
    
    if (memberDescriptionElement) {
        memberDescriptionElement.textContent = Utils.getLangText(member.bio || member.role, currentLang);
    }
    
    if (memberRoleElement) {
        memberRoleElement.textContent = Utils.getLangText(member.role, currentLang);
    }

    // Render member's courses
    renderMemberCourses(memberId);

    // Render member's teachers
    renderMemberTeachers(memberId);

    // Render member's gallery
    renderMemberGallery(memberId);

    // Modify global toggleLanguage to work with this page
    const originalToggleLanguage = window.toggleLanguage;
    window.toggleLanguage = function() {
        // Prevent multiple event listeners
        document.removeEventListener('languageToggled', window.toggleLanguage);
        
        // Call original toggle language function
        originalToggleLanguage();
        
        // Re-render with new language
        const newLang = document.documentElement.lang;
        
        // Update profile image alt text
        const memberImage = document.getElementById('member-image');
        if (memberImage) {
            memberImage.alt = Utils.getLangText(member.name, newLang);
        }
        
        // Update member name and description
        const memberNameElement = document.getElementById('member-name');
        const memberDescriptionElement = document.getElementById('member-description');
        const memberRoleElement = document.getElementById('member-role');
        
        if (memberNameElement) {
            memberNameElement.textContent = Utils.getLangText(member.name, newLang);
        }
        
        if (memberDescriptionElement) {
            memberDescriptionElement.textContent = Utils.getLangText(member.bio || member.role, newLang);
        }
        
        if (memberRoleElement) {
            memberRoleElement.textContent = Utils.getLangText(member.role, newLang);
        }
        
        // Re-render courses
        renderMemberCourses(memberId);

        // Re-render teachers
        renderMemberTeachers(memberId);

        // Re-render gallery
        renderMemberGallery(memberId);
        
        // Re-add event listener
        document.addEventListener('languageToggled', window.toggleLanguage);
    };

    // Prevent multiple event listeners
    document.removeEventListener('languageToggled', window.toggleLanguage);
    document.addEventListener('languageToggled', window.toggleLanguage);
}

function initGalleryItemPage() {
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('id');
    const item = window.DATA.gallery.find(g => g.id === itemId);
    
    if (!item) {
        console.error('No gallery item found for ID:', itemId);
        window.location.href = 'gallery.html';
        return;
    }
    
    const lang = document.documentElement.lang;
    const artist = window.MEMBERS.find(m => m.id === item.artist);
    
    const galleryItemImage = document.getElementById('gallery-item-image');
    if (!galleryItemImage) {
        console.error('Gallery item image element not found');
        return;
    }
    
    console.log('Original thumbnail URL:', item.src);
    
    // Direct conversion of thumbnail to full-res image
    const highResImageSrc = item.src.replace('thumbnail?id=', 'uc?export=view&id=');
    
    // Set image source directly
    galleryItemImage.src = highResImageSrc;
    
    // Add error handling
    galleryItemImage.onerror = function() {
        console.warn('Failed to load high-res image, falling back to original');
        galleryItemImage.src = item.src;
    };
    
    document.getElementById('gallery-item-title').textContent = Utils.getLangText(item.title, lang);
    
    // Create artist section with teacher-card styling
    const artistContainer = document.getElementById('gallery-item-artist-container');
    artistContainer.innerHTML = ''; // Clear existing content
    
    if (artist) {
        const teacherLink = document.createElement('a');
        teacherLink.href = `member.html?id=${artist.id}`;
        teacherLink.classList.add('teacher-link');
        
        const teacherImage = document.createElement('img');
        teacherImage.src = artist.image;
        teacherImage.alt = Utils.getLangText(artist.name, lang);
        teacherImage.classList.add('teacher-image');
        teacherImage.style.width = '100px';
        teacherImage.style.height = '100px';
        teacherImage.style.objectFit = 'cover';
        teacherImage.style.borderRadius = '50%';
        teacherImage.onerror = handleImageError;
        
        const teacherName = document.createElement('h3');
        teacherName.textContent = Utils.getLangText(artist.name, lang);
        teacherName.classList.add('teacher-name');
        
        teacherLink.appendChild(teacherImage);
        teacherLink.appendChild(teacherName);
        
        const teacherCard = document.createElement('div');
        teacherCard.classList.add('teacher-card');
        teacherCard.appendChild(teacherLink);
        
        artistContainer.appendChild(teacherCard);
    }
    
    document.getElementById('gallery-item-description').textContent = Utils.getLangText(item.description, lang);
}

function getGoogleDriveFileId(url) {
    // Extract file ID from various Google Drive URL formats
    const thumbnailMatch = url.match(/thumbnail\?id=([^&]+)/);
    const previewMatch = url.match(/\/d\/([^/]+)\//);
    
    return (thumbnailMatch && thumbnailMatch[1]) || 
           (previewMatch && previewMatch[1]) || 
           null;
}

function getHighResGoogleDriveImage(thumbnailUrl) {
    // Direct conversion of thumbnail to full-res image
    return thumbnailUrl.replace('thumbnail?id=', 'uc?export=view&id=');
}

function renderGalleryPreview(container, count = 10) {
    if (!window.DATA.gallery || window.DATA.gallery.length === 0) {
        console.error('No gallery data available');
        return;
    }
    
    container.innerHTML = '';
    const lang = document.documentElement.lang || 'he';
    
    // Shuffle the gallery items to get a random selection
    const shuffledItems = window.DATA.gallery.sort(() => 0.5 - Math.random());
    
    // Take the first 'count' items
    const selectedItems = shuffledItems.slice(0, count);
    
    container.innerHTML = '';
    
    // Create gallery items
    selectedItems.forEach(item => {
        const artist = window.MEMBERS.find(m => m.id === item.artist);
        if (!artist) {
            console.warn(`Artist not found for gallery item: ${item.id}`);
            return;
        }
        
        const galleryCard = document.createElement('a');
        galleryCard.className = 'gallery-card';
        galleryCard.href = `gallery-item.html?id=${item.id}`;
        
        const artistName = Utils.getLangText(artist.name, lang);
        const itemTitle = Utils.getLangText(item.title, lang);
        const itemDescription = Utils.getLangText(item.description, lang);
        
        galleryCard.innerHTML = `
            <div class="gallery-image">
                <img src="${item.src}" alt="${itemTitle}" loading="lazy">
            </div>
            <div class="gallery-info">
                <h3>${itemTitle}</h3>
                <p class="artist">${artistName}</p>
                <p class="description">${itemDescription}</p>
            </div>
        `;
        
        container.appendChild(galleryCard);
    });
}

function renderCourses(container, courses = null) {
    if (!window.COURSES || window.COURSES.length === 0) {
        console.error('No courses data available');
        return;
    }
    
    container.innerHTML = '';
    const lang = document.documentElement.lang || 'he';
    
    // Create courses container
    const coursesContainer = document.createElement('div');
    coursesContainer.className = 'courses-container';
    
    // Use all courses or provided subset
    const coursesToRender = courses || window.COURSES;
    
    coursesToRender.forEach(course => {
        const courseItem = document.createElement('div');
        courseItem.className = 'course-item';
        
        // Get multilingual content
        const courseName = Utils.getLangText(course.name, lang);
        const courseDescription = Utils.getLangText(course.description, lang);
        
        courseItem.innerHTML = `
            <a href="course-item.html?id=${course.id}" class="course-link">
                <div class="course-details">
                    <h3>${courseName}</h3>
                    <p>${courseDescription}</p>
                </div>
            </a>
        `;
        
        coursesContainer.appendChild(courseItem);
    });
    
    container.appendChild(coursesContainer);
}

function renderCoursesPreview(container, count = 9) {
    if (!window.COURSES || window.COURSES.length === 0) {
        console.error('No courses data available');
        return;
    }
    
    container.innerHTML = '';
    const lang = document.documentElement.lang || 'he';
    
    // Create courses container
    const coursesContainer = document.createElement('div');
    coursesContainer.className = 'courses-container';
    
    // Shuffle courses and take first 'count' items
    const shuffledCourses = [...window.COURSES].sort(() => 0.5 - Math.random());
    const coursesToRender = shuffledCourses.slice(0, count);
    
    coursesToRender.forEach(course => {
        const courseItem = document.createElement('div');
        courseItem.className = 'course-item';
        
        // Get multilingual content
        const courseName = Utils.getLangText(course.name, lang);
        const courseDescription = Utils.getLangText(course.description, lang);
        
        courseItem.innerHTML = `
            <a href="course-item.html?id=${course.id}" class="course-link">
                <div class="course-details">
                    <h3>${courseName}</h3>
                    <p>${courseDescription}</p>
                </div>
            </a>
        `;
        
        coursesContainer.appendChild(courseItem);
    });
    
    container.appendChild(coursesContainer);
}

function renderGallery(container, courses = null) {
    const lang = document.documentElement.lang || 'he';
    const galleryItems = courses || window.DATA.gallery;
    
    container.innerHTML = '';
    
    galleryItems.forEach(item => {
        const artist = window.MEMBERS.find(m => m.id === item.artist);
        if (!artist) {
            console.warn(`Artist not found for gallery item: ${item.id}`);
            return;
        }
        
        const galleryCard = document.createElement('a');
        galleryCard.className = 'gallery-card';
        galleryCard.href = `gallery-item.html?id=${item.id}`;
        
        const artistName = Utils.getLangText(artist.name, lang);
        const itemTitle = Utils.getLangText(item.title, lang);
        const itemDescription = Utils.getLangText(item.description, lang);
        
        galleryCard.innerHTML = `
            <div class="gallery-image">
                <img src="${item.src}" alt="${itemTitle}" loading="lazy">
            </div>
            <div class="gallery-info">
                <h3>${itemTitle}</h3>
                <p class="artist">${artistName}</p>
                <p class="description">${itemDescription}</p>
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

function updateLanguageElements() {
    const lang = document.documentElement.lang;

    // Toggle visibility of language-specific elements
    const langElements = document.querySelectorAll('[data-lang]');
    langElements.forEach(el => {
        const elLang = el.getAttribute('data-lang');
        el.style.display = elLang === lang ? 'inline' : 'none';
    });

    // Update toggle button text
    const langToggleButton = document.querySelector('.nav-btn:last-child');
    if (langToggleButton) {
        langToggleButton.textContent = lang === 'he' ? 'EN' : 'HE';
    }
}

// Expose global functions
window.toggleLanguage = toggleLanguage;

function createCourseCard(course) {
    // Create course card element
    const courseCard = document.createElement('div');
    courseCard.className = 'course-card';
    
    // Get multilingual content
    const courseName = Utils.getLangText(course.name, document.documentElement.lang);
    const courseDescription = Utils.getLangText(course.description, document.documentElement.lang);
    
    courseCard.innerHTML = `
        <a href="course-item.html?id=${course.id}" class="course-link">
            <div class="course-details">
                <h3>${courseName}</h3>
                <p>${courseDescription}</p>
            </div>
        </a>
    `;
    
    return courseCard;
}

function createMemberCourseCard(course, lang) {
    const courseCard = document.createElement('a');
    courseCard.classList.add('course-item');
    courseCard.href = `course-item.html?id=${course.id}`;
    
    const courseTitle = document.createElement('h3');
    courseTitle.textContent = course.name && course.name[lang] 
        ? course.name[lang] 
        : 'Untitled Course';
    
    const courseDescription = document.createElement('p');
    courseDescription.textContent = course.description && course.description[lang] 
        ? course.description[lang] 
        : (course.shortDescription && course.shortDescription[lang] 
            ? course.shortDescription[lang] 
            : 'No description available');
    
    courseCard.appendChild(courseTitle);
    courseCard.appendChild(courseDescription);
    
    return courseCard;
}

function createMemberGalleryItem(item, lang) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('data-item-id', item.id);
    
    // Get multilingual content
    const itemTitle = Utils.getLangText(item.title, lang);
    const artistName = Utils.getLangText(item.artist.name, lang);
    
    galleryItem.innerHTML = `
        <div class="gallery-item-media">
            ${item.type === 'video' 
                ? `<video src="${item.url}" poster="${item.thumbnail}" preload="none"></video>`
                : `<img src="${item.url}" alt="${itemTitle}" loading="lazy">`
            }
        </div>
        <div class="gallery-item-overlay">
            <h3>${itemTitle}</h3>
            <p>By <a href="/members/${item.artist.id}">${artistName}</a></p>
            ${item.forSale ? `<span class="price">₪${item.price}</span>` : ''}
        </div>
    `;

    // Add click handler to open item detail view
    galleryItem.addEventListener('click', () => {
        window.location.href = `/gallery/${item.id}`;
    });

    return galleryItem;
}

function renderMemberGallery(memberId) {
    const memberGalleryContainer = document.getElementById('member-gallery');
    if (!memberGalleryContainer) return;

    // Clear existing gallery items
    memberGalleryContainer.innerHTML = '';
    memberGalleryContainer.classList.add('grid-gallery');

    // Find gallery items for this specific member
    const memberGalleryItems = window.GALLERY_DATA.filter(item => 
        item.artist === memberId
    );

    // If no gallery items, hide the gallery section
    if (memberGalleryItems.length === 0) {
        memberGalleryContainer.style.display = 'none';
        return;
    }

    // Show gallery section
    memberGalleryContainer.style.display = 'grid';
    const lang = document.documentElement.lang || 'he';

    // Render gallery items
    memberGalleryItems.forEach(item => {
        const artist = window.MEMBERS.find(m => m.id === item.artist);
        if (!artist) {
            console.warn(`Artist not found for gallery item: ${item.id}`);
            return;
        }

        const galleryCard = document.createElement('a');
        galleryCard.className = 'gallery-card';
        galleryCard.href = `gallery-item.html?id=${item.id}`;
        
        const artistName = Utils.getLangText(artist.name, lang);
        const itemTitle = Utils.getLangText(item.title, lang);
        const itemDescription = Utils.getLangText(item.description, lang);
        
        galleryCard.innerHTML = `
            <div class="gallery-image">
                <img src="${item.src}" alt="${itemTitle}" loading="lazy">
            </div>
            <div class="gallery-info">
                <h3>${itemTitle}</h3>
                <p class="artist">${artistName}</p>
                <p class="description">${itemDescription}</p>
            </div>
        `;
        
        memberGalleryContainer.appendChild(galleryCard);
    });
}

function updateLanguageToggle() {
    // Existing language toggle logic...
    
    // Re-render member gallery with new language
    if (member) {
        renderMemberGallery(member.id);
    }
}

function renderMemberCourses(memberId) {
    const memberCoursesContainer = document.getElementById('member-courses-grid');
    if (!memberCoursesContainer) return;

    // Clear existing courses
    memberCoursesContainer.innerHTML = '';

    const memberCourses = window.COURSES.filter(course => {
        const isTeacherCourse = course.teachers && course.teachers.includes(memberId);
        console.log(`Course ${course.id}: Is teacher course? ${isTeacherCourse}`);
        return isTeacherCourse;
    });
    
    if (memberCourses.length > 0) {
        memberCourses.forEach(course => {
            const courseCard = createMemberCourseCard(course, document.documentElement.lang);
            memberCoursesContainer.appendChild(courseCard);
        });
    } else {
        console.warn('No courses found for member');
        const memberCoursesSection = document.querySelector('.member-courses');
        if (memberCoursesSection) {
            memberCoursesSection.style.display = 'none';
        }
    }
}

function renderMemberTeachers(memberId) {
    const teachersContainer = document.getElementById('teachers-container');
    if (!teachersContainer) return;

    teachersContainer.innerHTML = ''; // Clear existing content

    const teacherCourses = window.COURSES.filter(course => 
        course.teachers.includes(memberId)
    );
    
    const teacherIds = new Set();
    teacherCourses.forEach(course => {
        course.teachers.forEach(teacherId => {
            if (teacherId !== memberId) {
                teacherIds.add(teacherId);
            }
        });
    });

    const currentLang = document.documentElement.lang || 'he';

    teacherIds.forEach(teacherId => {
        const teacher = window.MEMBERS.find(m => m.id === teacherId);
        if (teacher) {
            const teacherLink = document.createElement('a');
            teacherLink.href = `member.html?id=${teacherId}`;
            teacherLink.classList.add('teacher-link');
            
            const teacherImage = document.createElement('img');
            teacherImage.src = teacher.image || '/assets/default-profile.jpg';
            teacherImage.alt = Utils.getLangText(teacher.name, currentLang);
            teacherImage.classList.add('teacher-image');
            teacherImage.onerror = (e) => {
                e.target.src = '/assets/default-profile.jpg';
            };
            
            const teacherName = document.createElement('span');
            teacherName.textContent = Utils.getLangText(teacher.name, currentLang);
            teacherName.classList.add('teacher-name');
            
            teacherLink.appendChild(teacherImage);
            teacherLink.appendChild(teacherName);
            teachersContainer.appendChild(teacherLink);
        }
    });

    // If no teachers found, add a message
    if (teachersContainer.children.length === 0) {
        const noTeachersMessage = document.createElement('p');
        noTeachersMessage.textContent = currentLang === 'he' ? 'אין מורים נוספים' : 'No additional teachers';
        noTeachersMessage.style.width = '100%';
        noTeachersMessage.style.textAlign = 'center';
        teachersContainer.appendChild(noTeachersMessage);
    }
}

function setupCoursesSearch(searchInput, coursesGridContainer) {
    const lang = document.documentElement.lang || 'he';

    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        
        // If query is empty, show all courses
        if (!query) {
            renderCourses(coursesGridContainer);
            return;
        }

        // Filter courses based on multiple criteria
        const filteredCourses = window.COURSES.filter(course => {
            const courseName = Utils.getLangText(course.name, lang).toLowerCase();
            const courseDescription = Utils.getLangText(course.description, lang).toLowerCase();
            const courseCategories = course.category[lang].map(cat => cat.toLowerCase());
            
            // Check if any teacher's name matches
            const teacherMatches = course.teachers.some(teacherId => {
                const teacher = window.MEMBERS.find(m => m.id === teacherId);
                return teacher && 
                    Utils.getLangText(teacher.name, lang).toLowerCase().includes(query);
            });

            return (
                courseName.includes(query) ||
                courseDescription.includes(query) ||
                courseCategories.some(cat => cat.includes(query)) ||
                teacherMatches
            );
        });

        // Re-render courses with filtered results
        renderCourses(coursesGridContainer, filteredCourses);
    });
}
