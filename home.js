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

  // Adicionar ícone ao botão CTA
  const ctaButton = document.querySelector('.cta-button');
  ctaButton.innerHTML = '<i class="fas fa-map-marker-alt"></i> Reportar Local';

  // Adicionar efeito de digitação ao título (opcional)
  const title = document.querySelector('h1');
  const originalText = title.textContent;
  title.textContent = '';
 
  let i = 0;
  const typeWriter = () => {
    if (i < originalText.length) {
      title.textContent += originalText.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  };
 
  // Iniciar efeito de digitação após um breve delay
  setTimeout(typeWriter, 1000);
});