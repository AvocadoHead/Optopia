// Language toggle function
function toggleLanguage() {
    const htmlElement = document.documentElement;
    const currentLang = htmlElement.lang;
    const newLang = currentLang === 'he' ? 'en' : 'he';
    
    htmlElement.lang = newLang;
    htmlElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
    
    // Update language-specific elements
    document.querySelectorAll('[data-lang="he"]').forEach(el => {
        el.style.display = newLang === 'he' ? 'block' : 'none';
    });
    document.querySelectorAll('[data-lang="en"]').forEach(el => {
        el.style.display = newLang === 'en' ? 'block' : 'none';
    });
}

// Function to render teachers
function renderTeachers(course, lang) {
    const teachersContainer = document.getElementById('teachers-container');
    if (!teachersContainer) return;

    teachersContainer.innerHTML = ''; // Clear existing content

    course.teachers.forEach(teacherId => {
        const teacher = window.MEMBERS.find(m => m.id === teacherId);
        if (teacher) {
            const teacherLink = document.createElement('a');
            teacherLink.href = `member.html?id=${teacherId}`;
            teacherLink.classList.add('teacher-link');
            
            const teacherImage = document.createElement('img');
            teacherImage.src = teacher.image || '/assets/default-profile.jpg';
            teacherImage.alt = Utils.getLangText(teacher.name, lang);
            teacherImage.classList.add('teacher-image');
            teacherImage.onerror = (e) => {
                console.error('Teacher image failed to load:', teacher.image);
                e.target.src = '/assets/default-profile.jpg';
            };
            
            const teacherName = document.createElement('span');
            teacherName.textContent = Utils.getLangText(teacher.name, lang);
            teacherName.classList.add('teacher-name');
            
            teacherLink.appendChild(teacherImage);
            teacherLink.appendChild(teacherName);
            teachersContainer.appendChild(teacherLink);
        }
    });

    // If no teachers found, add a message
    if (teachersContainer.children.length === 0) {
        const noTeachersMessage = document.createElement('p');
        noTeachersMessage.textContent = lang === 'he' ? 'אין מורים' : 'No teachers';
        noTeachersMessage.style.width = '100%';
        noTeachersMessage.style.textAlign = 'center';
        teachersContainer.appendChild(noTeachersMessage);
    }
}

// Initialize course item page
function initCoursePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    const lang = localStorage.getItem('language') || 'he';

    const course = window.COURSES.find(c => c.id === courseId);
    if (!course) {
        console.error('Course not found:', courseId);
        window.location.href = 'courses.html';
        return;
    }

    // Set course details
    document.getElementById('course-title').textContent = course.name[lang];
    document.getElementById('course-description').textContent = course.description[lang];
    
    // Render subtopics
    const subtopicsList = document.getElementById('subtopics-list');
    subtopicsList.innerHTML = course.subTopics[lang].map(topic => 
        `<li>${topic}</li>`
    ).join('');
    
    // Render teachers
    renderTeachers(course, lang);

    // Modify page title
    document.title = `Optopia - ${course.name[lang]}`;
    
    // Language toggle functionality
    document.addEventListener('languageToggled', function() {
        const newLang = document.documentElement.lang;
        
        // Update course details
        document.getElementById('course-title').textContent = course.name[newLang];
        document.getElementById('course-description').textContent = course.description[newLang];
        
        // Re-render subtopics
        subtopicsList.innerHTML = course.subTopics[newLang].map(topic => 
            `<li>${topic}</li>`
        ).join('');
        
        // Re-render teachers
        renderTeachers(course, newLang);
    });
}

// Update language toggle functionality
const originalToggleLanguage = window.toggleLanguage;
window.toggleLanguage = function() {
    // Remove existing event listener to prevent multiple calls
    document.removeEventListener('languageToggled', window.toggleLanguage);
    
    // Call original toggle language function
    originalToggleLanguage();
    
    // Get new language
    const newLang = document.documentElement.lang;
    
    // Re-render course details
    const courseTitle = document.getElementById('course-title');
    const courseDescription = document.getElementById('course-description');
    const subtopicsList = document.getElementById('subtopics-list');
    const teachersContainer = document.getElementById('teachers-container');
    
    if (course) {
        // Update course title and description
        courseTitle.textContent = Utils.getLangText(course.name, newLang);
        courseDescription.textContent = Utils.getLangText(course.description, newLang);
        
        // Re-render subtopics
        subtopicsList.innerHTML = '';
        course.subTopics[newLang].forEach(topic => {
            const li = document.createElement('li');
            li.textContent = topic;
            subtopicsList.appendChild(li);
        });
        
        // Re-render teachers
        renderTeachers(course, newLang);
    }
    
    // Re-add event listener
    document.addEventListener('languageToggled', window.toggleLanguage);
};

// Add image error handling function
function handleImageError(event) {
    const defaultProfileImage = '/assets/default-profile.jpg';
    event.target.src = defaultProfileImage;
    event.target.onerror = null; // Prevent infinite error loop
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initCoursePage);
