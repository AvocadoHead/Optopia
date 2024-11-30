// Utility functions for the Optopia website

// Facebook profile picture fetcher
async function getFacebookProfilePicture(userId) {
    try {
        const response = await fetch(`https://graph.facebook.com/${userId}/picture?type=large`);
        if (response.ok) {
            return response.url;
        }
        throw new Error('Failed to fetch Facebook profile picture');
    } catch (error) {
        console.error('Error fetching Facebook profile picture:', error);
        return 'path/to/default/profile-picture.jpg';
    }
}

// Create member card component
function createMemberCard(member, isPreview = false) {
    const card = document.createElement('div');
    card.className = 'member-card';
    
    card.innerHTML = `
        <div class="member-image">
            <img src="${member.profilePicture}" alt="${member.name}" loading="lazy">
        </div>
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

    // Add click handler for preview cards
    if (isPreview) {
        card.addEventListener('click', () => {
            window.location.href = `/members/${member.id}`;
        });
    }

    return card;
}

// Create gallery item component
function createGalleryItem(item) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('data-item-id', item.id);
    
    galleryItem.innerHTML = `
        <div class="gallery-item-media">
            ${item.type === 'video' 
                ? `<video src="${item.url}" poster="${item.thumbnail}" preload="none"></video>`
                : `<img src="${item.url}" alt="${item.title}" loading="lazy">`
            }
        </div>
        <div class="gallery-item-overlay">
            <h3>${item.title}</h3>
            <p>By <a href="/members/${item.artist.id}">${item.artist.name}</a></p>
            ${item.forSale ? `<span class="price">₪${item.price}</span>` : ''}
        </div>
    `;

    // Add click handler to open item detail view
    galleryItem.addEventListener('click', () => {
        window.location.href = `/gallery/${item.id}`;
    });

    return galleryItem;
}

// Ensure Utils is defined globally
window.Utils = window.Utils || {};

// Fallback method to get text in a specific language
window.Utils.getLangText = function(obj, lang) {
    if (!obj) return '';
    return obj[lang] || obj['he'] || obj['en'] || '';
};

// Create course card component
window.Utils.createCourseCard = function(course, isPreview = false) {
    console.log('Creating course card', { course, isPreview });
    
    const lang = document.documentElement.lang || 'he';
    const card = document.createElement('div');
    card.className = 'course-card' + (isPreview ? ' preview' : '');
    
    // Safely get course name and description
    const courseName = this.getLangText(course.name, lang);
    const courseDescription = this.getLangText(course.description, lang);
    
    // Get teacher names
    const teacherNames = (course.teachers || [])
        .map(teacherId => {
            const teacher = window.MEMBERS ? 
                window.MEMBERS.find(m => m.id === teacherId) : 
                null;
            return teacher ? this.getLangText(teacher.name, lang) : '';
        })
        .filter(name => name)
        .join(', ');

    // Create card content
    card.innerHTML = `
        <div class="course-info">
            <h3>${courseName || 'Untitled Course'}</h3>
            <p class="description">${courseDescription || 'No description available'}</p>
            ${teacherNames ? `<p class="teachers">${lang === 'he' ? 'מרצים: ' : 'Teachers: '}${teacherNames}</p>` : ''}
            ${course.difficulty ? `<p class="difficulty">${this.getLangText(course.difficulty, lang)}</p>` : ''}
        </div>
    `;

    // Add click handler to navigate to course details
    card.addEventListener('click', () => {
        window.location.href = `course-item.html?id=${course.id}`;
    });
    
    return card;
};

// Extend Utils with other methods
window.Utils = {
    ...window.Utils,
    loadContent(containerId, items, createComponent, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const { limit, filter } = options;
        let displayItems = items;

        if (filter) {
            displayItems = items.filter(filter);
        }

        if (limit) {
            displayItems = displayItems.slice(0, limit);
        }

        displayItems.forEach(item => {
            container.appendChild(createComponent(item));
        });
    }
};

// Handle dynamic content loading
function loadContent(containerId, items, createComponent, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { limit, filter } = options;
    let displayItems = items;

    if (filter) {
        displayItems = items.filter(filter);
    }

    if (limit) {
        displayItems = displayItems.slice(0, limit);
    }

    displayItems.forEach(item => {
        container.appendChild(createComponent(item));
    });
}
