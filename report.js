document.addEventListener('DOMContentLoaded', function() {
    // Configuração das partículas
    particlesJS('particles-js', {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 }},
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
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
                random: true
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" }
            }
        }
    });

    // Máscara para CEP
    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.substring(0,5) + '-' + value.substring(5,8);
        }
        e.target.value = value;
    });

    // Buscar endereço pelo CEP
    cepInput.addEventListener('blur', function() {
        const cep = this.value.replace(/\D/g, '');
        if (cep.length === 8) {
            buscarEnderecoPorCEP(cep);
        }
    });

    // Upload de fotos
    const uploadArea = document.getElementById('uploadArea');
    const photoUpload = document.getElementById('photoUpload');
    const previewGrid = document.getElementById('previewGrid');
    let uploadedFiles = [];

    // Click no upload area
    uploadArea.addEventListener('click', function() {
        photoUpload.click();
    });

    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // Input file change
    photoUpload.addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        const maxFiles = 5;
        const remainingSlots = maxFiles - uploadedFiles.length;
        
        if (files.length > remainingSlots) {
            alert(`Você só pode adicionar mais ${remainingSlots} foto(s)`);
            return;
        }

        for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
            const file = files[i];
            
            // Validar tipo de arquivo
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecione apenas imagens');
                continue;
            }

            // Validar tamanho (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('A imagem deve ter no máximo 5MB');
                continue;
            }

            uploadedFiles.push(file);
            createPreview(file);
        }

        updateUploadArea();
    }

    function createPreview(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button type="button" class="remove-btn" data-filename="${file.name}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            previewGrid.appendChild(previewItem);

            // Adicionar evento de remoção
            const removeBtn = previewItem.querySelector('.remove-btn');
            removeBtn.addEventListener('click', function() {
                const filename = this.getAttribute('data-filename');
                uploadedFiles = uploadedFiles.filter(f => f.name !== filename);
                previewItem.remove();
                updateUploadArea();
            });
        };
        
        reader.readAsDataURL(file);
    }

    function updateUploadArea() {
        const remaining = 5 - uploadedFiles.length;
        if (remaining === 0) {
            uploadArea.style.display = 'none';
        } else {
            uploadArea.style.display = 'block';
            uploadArea.querySelector('p').textContent = 
                `Arraste fotos aqui ou clique para selecionar (${remaining} restante(s))`;
        }
    }

    // Buscar endereço por CEP
    async function buscarEnderecoPorCEP(cep) {
        try {
            const loadingText = document.createElement('div');
            loadingText.className = 'loading-text';
            loadingText.textContent = 'Buscando endereço...';
            cepInput.parentNode.appendChild(loadingText);

            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            
            loadingText.remove();

            if (!data.erro) {
                document.getElementById('street').value = data.logradouro || '';
                document.getElementById('neighborhood').value = data.bairro || '';
                document.getElementById('city').value = data.localidade || '';
            } else {
                alert('CEP não encontrado. Por favor, verifique o CEP digitado.');
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            alert('Erro ao buscar CEP. Tente novamente.');
        }
    }

    // Envio do formulário
    const reportForm = document.getElementById('reportForm');
    const submitBtn = reportForm.querySelector('.btn-primary');
    const successModal = document.getElementById('successModal');

    reportForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar formulário
        if (!validateForm()) {
            return;
        }

        // Mostrar loading
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Simular processamento
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Coletar dados do formulário
            const formData = {
                email: document.getElementById('email').value,
                street: document.getElementById('street').value,
                neighborhood: document.getElementById('neighborhood').value,
                cep: document.getElementById('cep').value,
                city: document.getElementById('city').value,
                problemType: document.querySelector('input[name="problemType"]:checked').value,
                urgency: document.querySelector('input[name="urgency"]:checked').value,
                description: document.getElementById('description').value,
                photos: uploadedFiles.length,
                timestamp: new Date().toLocaleString('pt-BR'),
                status: 'pendente'
            };

            // Salvar no localStorage
            const reports = JSON.parse(localStorage.getItem('reports') || '[]');
            reports.push(formData);
            localStorage.setItem('reports', JSON.stringify(reports));
            
            console.log('Reporte enviado:', formData);
            
            // Mostrar modal de sucesso
            successModal.style.display = 'flex';
            
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao enviar reporte. Tente novamente.');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    function validateForm() {
        const requiredFields = reportForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ff6b6b';
                isValid = false;
                setTimeout(() => {
                    field.style.borderColor = '';
                }, 3000);
            }
        });

        // Validar email
        const email = document.getElementById('email').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            alert('Por favor, insira um email válido.');
            isValid = false;
        }

        // Validar fotos
        if (uploadedFiles.length === 0) {
            alert('Por favor, adicione pelo menos uma foto do local');
            isValid = false;
        }

        // Validar tipo de problema selecionado
        const problemTypeSelected = document.querySelector('input[name="problemType"]:checked');
        if (!problemTypeSelected) {
            alert('Por favor, selecione o tipo de problema');
            isValid = false;
        }

        // Validar urgência selecionada
        const urgencySelected = document.querySelector('input[name="urgency"]:checked');
        if (!urgencySelected) {
            alert('Por favor, selecione o nível de urgência');
            isValid = false;
        }

        return isValid;
    }

    // Fechar modal ao clicar fora
    successModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });

    // Adicionar texto nos indicadores de urgência
    const urgencyIndicators = document.querySelectorAll('.urgency-indicator');
    urgencyIndicators.forEach(indicator => {
        if (indicator.classList.contains('low')) indicator.textContent = '!';
        if (indicator.classList.contains('medium')) indicator.textContent = '!!';
        if (indicator.classList.contains('high')) indicator.textContent = '!!!';
        if (indicator.classList.contains('emergency')) indicator.textContent = '!!!!';
    });
});
