// ===============================
// SMOOTH SCROLLING
// ===============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===============================
// ACTIVE NAVIGATION
// ===============================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===============================
// HEADER BACKGROUND ON SCROLL
// ===============================
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.background = 'rgba(26, 31, 58, 0.98)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#1a1f3a';
        header.style.backdropFilter = 'none';
    }
    
    lastScroll = currentScroll;
});

// ===============================
// SCROLL ANIMATIONS
// ===============================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ===============================
// STATS COUNTER ANIMATION
// ===============================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach((stat, index) => {
                const targets = [500, 20, 50];
                if (index < targets.length) {
                    animateCounter(stat, targets[index]);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===============================
// FORM SUBMISSION
// ===============================
const contactForm = document.getElementById('contactForm');
const modal = document.getElementById('successModal');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toLocaleString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    // Save to sessionStorage
    const submissions = JSON.parse(sessionStorage.getItem('autocare_submissions') || '[]');
    submissions.push(formData);
    sessionStorage.setItem('autocare_submissions', JSON.stringify(submissions));

    // Display in modal
    const formDataDiv = document.getElementById('formData');
    formDataDiv.innerHTML = `
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Service:</strong> ${formData.service}</p>
        <p><strong>Date:</strong> ${formData.timestamp}</p>
    `;

    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Reset form
    contactForm.reset();

    // Console log
    console.log('═══════════════════════════════════════');
    console.log('✅ NEW SERVICE REQUEST RECEIVED');
    console.log('═══════════════════════════════════════');
    console.log('📋 Customer Details:');
    console.table(formData);
    console.log('═══════════════════════════════════════');
    console.log('📊 Total Requests:', submissions.length);
    console.log('═══════════════════════════════════════');
});

// ===============================
// MODAL FUNCTIONS
// ===============================
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal on outside click
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Close modal with ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// ===============================
// FORM VALIDATION
// ===============================
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');

formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() === '' && this.hasAttribute('required')) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '#2a3150';
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.borderColor = '#FDB714';
    });
    
    input.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            this.style.borderColor = '#2a3150';
        }
    });
});

// ===============================
// SERVICE CARDS ANIMATION
// ===============================
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.service-icon');
        icon.style.transform = 'scale(1.2) rotate(360deg)';
        icon.style.transition = 'transform 0.6s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.service-icon');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// ===============================
// GALLERY HOVER EFFECTS
// ===============================
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 15px 40px rgba(253, 183, 20, 0.3)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
    });
});

// ===============================
// PARALLAX EFFECT (FIXED)
// ===============================
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    const heroHeight = hero ? hero.offsetHeight : 0;
    
    // Solo aplicar parallax cuando estamos en el área del hero
    if (hero && scrolled < heroHeight) {
        const parallaxValue = scrolled * 0.3;
        hero.style.backgroundPosition = `center ${parallaxValue}px`;
    }
});

// ===============================
// LOADING ANIMATION
// ===============================
window.addEventListener('load', () => {
    console.log('🚗 AutoCare Website Loaded Successfully');
    console.log('💾 Storage System Active');
    console.log('📝 Contact Form Ready');
    
    const savedSubmissions = JSON.parse(sessionStorage.getItem('autocare_submissions') || '[]');
    if (savedSubmissions.length > 0) {
        console.log(`📊 ${savedSubmissions.length} saved request(s) found`);
    }
    
    // Add visible class to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
});

// ===============================
// UTILITY FUNCTIONS
// ===============================
window.autocareFunctions = {
    getAllSubmissions: () => {
        return JSON.parse(sessionStorage.getItem('autocare_submissions') || '[]');
    },
    
    clearAllSubmissions: () => {
        sessionStorage.removeItem('autocare_submissions');
        console.log('🗑️ All submissions cleared');
    },
    
    exportSubmissions: () => {
        const submissions = JSON.parse(sessionStorage.getItem('autocare_submissions') || '[]');
        const dataStr = JSON.stringify(submissions, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `autocare_requests_${Date.now()}.json`;
        link.click();
        console.log('📥 Submissions exported successfully');
    },
    
    getSubmissionCount: () => {
        const submissions = JSON.parse(sessionStorage.getItem('autocare_submissions') || '[]');
        console.log(`📊 Total submissions: ${submissions.length}`);
        return submissions.length;
    }
};

// Log available functions
console.log('%c💡 Developer Functions Available:', 'color: #FDB714; font-weight: bold; font-size: 14px;');
console.log('%c   autocareFunctions.getAllSubmissions()', 'color: #b8b8b8;');
console.log('%c   autocareFunctions.clearAllSubmissions()', 'color: #b8b8b8;');
console.log('%c   autocareFunctions.exportSubmissions()', 'color: #b8b8b8;');
console.log('%c   autocareFunctions.getSubmissionCount()', 'color: #b8b8b8;');