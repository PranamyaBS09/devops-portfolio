// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(link => {
    link.style.color = '#8b949e';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = '#58a6ff';
    }
  });
});

// ===== SKILL BAR ANIMATION =====
// Animate skill bars when they scroll into view
const skillFills = document.querySelectorAll('.skill-fill');

const animateSkills = () => {
  skillFills.forEach(fill => {
    const rect = fill.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      const targetWidth = fill.getAttribute('data-width');
      fill.style.width = targetWidth;
    }
  });
};

window.addEventListener('scroll', animateSkills);
// Run once on load in case skills section is visible
animateSkills();

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
const formMsg = document.getElementById('form-msg');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    formMsg.style.color = '#f85149';
    formMsg.textContent = 'Please fill in all fields.';
    return;
  }

  // Simulate sending (no backend needed for demo)
  formMsg.style.color = '#3fb950';
  formMsg.textContent = `Thanks ${name}! Your message has been received.`;

  // Clear form
  form.reset();

  // Clear message after 4 seconds
  setTimeout(() => {
    formMsg.textContent = '';
  }, 4000);
});

// ===== SCROLL FADE-IN ANIMATION =====
// Simple fade-in for cards when they appear on screen
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-card, .project-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(card);
});
