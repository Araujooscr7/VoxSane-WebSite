// Inicializar partículas
document.addEventListener('DOMContentLoaded', function() {
  // Configuração das partículas
  particlesJS('particles-js', {
    particles: {
      number: {
        value: 70,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#ffffff"
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000"
        }
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#a82efc",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  });

  // Efeito de scroll no header
  window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Animação das barras de habilidades
  function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
   
    skillBars.forEach(bar => {
      const level = bar.getAttribute('data-level');
      bar.style.width = '0%';
     
      setTimeout(() => {
        bar.style.width = level + '%';
      }, 500);
    });
  }

  // Animação dos números estatísticos
  function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
   
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      const duration = 2000; // 2 segundos
      const step = target / (duration / 16); // 60fps
      let current = 0;
     
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = Math.floor(current);
      }, 16);
    });
  }

  // Observador de interseção para animações
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('skills-categories')) {
          animateSkillBars();
        }
        if (entry.target.classList.contains('stats-section')) {
          animateStats();
        }
        entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar elementos para animação
  document.querySelectorAll('.category-card, .stats-section, .tech-section').forEach(el => {
    observer.observe(el);
  });

  // Adicionar ícone de drone (se não estiver disponível)
  const style = document.createElement('style');
  style.textContent = `
    .fa-drone:before {
      content: "\\f0";
      font-family: 'Font Awesome 5 Free';
      font-weight: 900;
    }
    .fa-drone:before {
      content: "\\f085";
    }
  `;
  document.head.appendChild(style);
});