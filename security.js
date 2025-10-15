// Inicializar partículas
document.addEventListener('DOMContentLoaded', function() {
  // Configuração das partículas
  particlesJS('particles-js', {
    particles: {
      number: {
        value: 80,
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

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
 
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
   
    question.addEventListener('click', () => {
      // Fecha todos os outros itens
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
     
      // Alterna o item atual
      item.classList.toggle('active');
    });
  });

  // Animação de contagem para estatísticas
  function animateCounters() {
    const counters = document.querySelectorAll('.feature-stats .number');
   
    counters.forEach(counter => {
      const target = parseInt(counter.textContent);
      let current = 0;
      const increment = target / 50; // Duração da animação
     
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.textContent = Math.ceil(current);
          setTimeout(updateCounter, 30);
        } else {
          counter.textContent = target;
        }
      };
     
      updateCounter();
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
        if (entry.target.classList.contains('protection-features')) {
          animateCounters();
        }
       
        // Adiciona animação de entrada
        if (entry.target.classList.contains('feature-card') ||
            entry.target.classList.contains('compliance-card') ||
            entry.target.classList.contains('process-step')) {
          entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
        }
       
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar elementos para animação
  document.querySelectorAll('.feature-card, .compliance-card, .process-step, .protection-features').forEach(el => {
    observer.observe(el);
  });

  // Efeito de typing no título principal
  const heroTitle = document.querySelector('.hero-title');
  const originalText = heroTitle.innerHTML;
 
  // Remove temporariamente o conteúdo
  heroTitle.innerHTML = '';
  heroTitle.classList.add('typing-effect');
 
  // Restaura o conteúdo após a animação
  setTimeout(() => {
    heroTitle.innerHTML = originalText;
    heroTitle.classList.remove('typing-effect');
  }, 3500);

  // Efeito de hover nas camadas de segurança
  const layers = document.querySelectorAll('.layer');
 
  layers.forEach((layer, index) => {
    layer.addEventListener('mouseenter', () => {
      // Ativa todas as camadas até esta
      for (let i = 0; i <= index; i++) {
        layers[i].style.background = 'rgba(168, 46, 252, 0.2)';
        layers[i].style.borderColor = 'var(--primary)';
      }
    });
   
    layer.addEventListener('mouseleave', () => {
      // Restaura todas as camadas
      layers.forEach(l => {
        l.style.background = 'var(--card-bg)';
        l.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      });
    });
  });

  // Efeito de brilho interativo no escudo
  const shield = document.querySelector('.security-shield');
 
  shield.addEventListener('mouseenter', () => {
    const rings = document.querySelectorAll('.shield-ring');
    rings.forEach((ring, index) => {
      ring.style.animationDuration = `${10 - index * 2}s`;
    });
  });
 
  shield.addEventListener('mouseleave', () => {
    const rings = document.querySelectorAll('.shield-ring');
    rings.forEach(ring => {
      ring.style.animationDuration = '20s';
    });
  });

  // Simulação de verificação de segurança
  function simulateSecurityCheck() {
    const badges = document.querySelectorAll('.badge');
   
    badges.forEach((badge, index) => {
      setTimeout(() => {
        badge.style.transform = 'scale(1.1)';
        badge.style.boxShadow = '0 0 20px var(--accent)';
       
        setTimeout(() => {
          badge.style.transform = 'scale(1)';
          badge.style.boxShadow = 'none';
        }, 500);
      }, index * 300);
    });
  }

  // Executa a simulação após o carregamento
  setTimeout(simulateSecurityCheck, 2000);
});

// Efeito de parallax suave
window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.hero-visual, .architecture-visual');
 
  parallaxElements.forEach(element => {
    const speed = 0.5;
    element.style.transform = `translateY(${scrolled * speed}px)`;
  });
});
