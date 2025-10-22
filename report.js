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

    reportForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar formulário
        if (!validateForm()) {
            return;
        }

        // Mostrar loading
        submitBtn.classList.add('loading');

        try {
            // Processar reporte
            await processReport();
            
            // Mostrar modal de sucesso
            setTimeout(() => {
                document.getElementById('successModal').style.display = 'block';
                submitBtn.classList.remove('loading');
            }, 2000);

        } catch (error) {
            alert('Erro ao enviar reporte: ' + error.message);
            submitBtn.classList.remove('loading');
        }
    });

    function validateForm() {
        const requiredFields = reportForm.querySelectorAll('[required]');
        let isValid = true;

        // Validar campos obrigatórios
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ff6b6b';
                isValid = false;
                
                // Remover o estilo após um tempo
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

    function processReport() {
        return new Promise((resolve) => {
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
                timestamp: new Date().toISOString(),
                status: 'pendente'
            };

            // Simular envio para o servidor
            setTimeout(() => {
                // Salvar no localStorage
                const reports = JSON.parse(localStorage.getItem('reports') || '[]');
                reports.push(formData);
                localStorage.setItem('reports', JSON.stringify(reports));
                
                console.log('Reporte enviado:', formData);
                
                // Enviar email de confirmação (simulação)
                if (formData.email) {
                    sendConfirmationEmail(formData);
                }
                
                resolve(formData);
            }, 1500);
        });
    }

    function sendConfirmationEmail(formData) {
        // Simulação de envio de email
        console.log(`Email enviado para: ${formData.email}`);
        console.log('Assunto: Confirmação de Reporte - VOXSane');
        console.log(`Conteúdo: Obrigado por reportar o problema de ${formData.problemType} no endereço ${formData.street}, ${formData.neighborhood}.`);
    }

   
    });

    // Adicionar indicadores visuais nos cards de urgência
    const urgencyIndicators = document.querySelectorAll('.urgency-indicator');
    urgencyIndicators.forEach(indicator => {
        if (indicator.classList.contains('low')) indicator.textContent = '!';
        if (indicator.classList.contains('medium')) indicator.textContent = '!!';
        if (indicator.classList.contains('high')) indicator.textContent = '!!!';
        if (indicator.classList.contains('emergency')) indicator.textContent = '!!!!';
    });
});

// CSS adicional para loading
const additionalCSS = `
    .loading-text {
        color: var(--primary);
        font-size: 0.8rem;
        margin-top: 5px;
        animation: pulse 1.5s infinite;
    }

    .problem-option input:checked + .problem-card::before {
        content: '✓';
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--primary);
        color: white;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
    }

    .urgency-option input:checked + .urgency-card::before {
        content: '✓';
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--primary);
        color: white;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
    }
`;

const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);
// Adicionar texto nos indicadores de urgência
document.addEventListener('DOMContentLoaded', function() {
    const urgencyIndicators = document.querySelectorAll('.urgency-indicator');
    urgencyIndicators.forEach(indicator => {
        if (indicator.classList.contains('low')) indicator.textContent = '!';
        if (indicator.classList.contains('medium')) indicator.textContent = '!!';
        if (indicator.classList.contains('high')) indicator.textContent = '!!!';
        if (indicator.classList.contains('emergency')) indicator.textContent = '!!!!';
    });
// Envio do formulário - VERSÃO CORRIGIDA
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
        await new Promise(resolve => setTimeout(resolve, 2000));
        
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
        
        console.log('Reporte salvo:', formData);
        
        // Mostrar modal de sucesso
        showSuccessModal(formData);
        
    } catch (error) {
        console.error('Erro:', error);
        showErrorModal('Erro ao enviar reporte. Tente novamente.');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

// FUNÇÃO PARA MOSTRAR MODAL DE SUCESSO
function showSuccessModal(formData) {
    const modal = document.getElementById('successModal');
    const modalContent = modal.querySelector('.modal-content');
    
    // Atualizar conteúdo do modal com os dados
    const problemTypes = {
        'agua': 'Falta de Água',
        'esgoto': 'Esgoto a Céu Aberto', 
        'lixo': 'Acúmulo de Lixo',
        'drenagem': 'Problema de Drenagem',
        'outro': 'Outro Problema'
    };
    
    const urgencyLevels = {
        'baixa': 'Baixa Urgência',
        'media': 'Média Urgência',
        'alta': 'Alta Urgência',
        'emergencia': 'Emergência'
    };
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <div class="modal-icon success">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Reporte Enviado com Sucesso! ✅</h3>
        </div>
        
        <div class="modal-body">
            <div class="confirmation-details">
                <div class="detail-item">
                    <span class="detail-label">📧 Email:</span>
                    <span class="detail-value">${formData.email}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">📍 Local:</span>
                    <span class="detail-value">${formData.street}, ${formData.neighborhood}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">🔧 Problema:</span>
                    <span class="detail-value">${problemTypes[formData.problemType]}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">⚠️ Urgência:</span>
                    <span class="detail-value urgency-${formData.urgency}">${urgencyLevels[formData.urgency]}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">📷 Fotos:</span>
                    <span class="detail-value">${formData.photos} foto(s) anexada(s)</span>
                </div>
            </div>
            
            <div class="status-message">
                <p>🎉 <strong>Obrigado por sua contribuição!</strong></p>
                <p>Seu reporte foi registrado e entraremos em contato em até <strong>48 horas</strong>.</p>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="btn-primary" onclick="closeModalAndRedirect()">
                <i class="fas fa-home"></i> Voltar para Home
            </button>
            <button class="btn-secondary" onclick="closeModal()">
                <i class="fas fa-plus"></i> Fazer Novo Reporte
            </button>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// FUNÇÃO PARA FECHAR MODAL
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
    // Limpar formulário se quiser
    // reportForm.reset();
}

function closeModalAndRedirect() {
    closeModal();
    window.location.href = 'index.html';
}

// Fechar modal clicando fora
document.getElementById('successModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});


