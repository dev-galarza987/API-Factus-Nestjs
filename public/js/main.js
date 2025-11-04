// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add active class to nav links on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Copy endpoint path on click
document.querySelectorAll('.endpoint-path').forEach(element => {
  element.style.cursor = 'pointer';
  element.title = 'Click para copiar';
  
  element.addEventListener('click', function() {
    const text = this.textContent;
    navigator.clipboard.writeText(text).then(() => {
      // Show toast notification
      showToast('Endpoint copiado al portapapeles');
    });
  });
});

// Toast notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #28a745;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Log API info to console
console.log('%c🚀 API-Factus v1.0.0', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cAPI Endpoint: http://localhost:3000/api/v1', 'color: #764ba2; font-size: 14px;');
console.log('%cRepositorio: https://github.com/dev-galarza987/API-Factus-Nestjs', 'color: #764ba2; font-size: 14px;');
