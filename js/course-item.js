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

// Initialize course item page
function initCoursePage() {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('id');
    
    if (!courseId) {
        window.location.href = 'courses.html';
        return;
    }
    
    const course = window.COURSES.find(c => c.id === courseId);
    if (!course) {
        window.location.href = 'courses.html';
        return;
    }
    
    const lang = document.documentElement.lang;
    
    // Set course details
    document.getElementById('course-title').textContent = course.name[lang];
    document.getElementById('course-description').textContent = course.description[lang];
    
    // Render subtopics
    const subtopicsList = document.getElementById('subtopics-list');
    subtopicsList.innerHTML = course.subTopics[lang].map(topic => 
        `<li>${topic}</li>`
    ).join('');
    
    // Render teachers
    const teachersContainer = document.getElementById('teachers-container');
    teachersContainer.innerHTML = '';
    
    course.teachers.forEach(teacherId => {
        const teacher = window.MEMBERS.find(m => m.id === teacherId);
        if (teacher) {
            const teacherCard = document.createElement('a');
            teacherCard.href = `member.html?id=${teacher.id}`;
            teacherCard.className = 'teacher-card';
            teacherCard.innerHTML = `
                <img src="${teacher.image}" alt="${teacher.name[lang]}" loading="lazy">
                <h3>${teacher.name[lang]}</h3>
            `;
            teachersContainer.appendChild(teacherCard);
        }
    });
    
    // Update page title
    document.title = `Optopia - ${course.name[lang]}`;
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initCoursePage);
