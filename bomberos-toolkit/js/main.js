// js/main.js - JavaScript Principal

// Configuración global
const CONFIG = {
    version: '1.0.0',
    lastUpdate: '2024-12-01',
    debug: false,
    searchDelay: 300,
    animationDelay: 100
};

// Estado global de la aplicación
const AppState = {
    currentSection: 'home',
    searchQuery: '',
    isLoading: false,
    isMobile: window.innerWidth < 768,
    isOffline: !navigator.onLine
};

// Utilidades principales
const Utils = {
    // Debounce para búsquedas
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Formatear texto para búsqueda
    normalizeText(text) {
        return text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remover acentos
            .trim();
    },

    // Mostrar/ocultar loading
    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('show');
        }
        AppState.isLoading = true;
    },

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('show');
        }
        AppState.isLoading = false;
    },

    // Mostrar notificación
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        // Estilos inline para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        document.body.appendChild(notification);

        // Auto-remover después del tiempo especificado
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    },

    // Scroll suave
    smoothScrollTo(element) {
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    // Detectar dispositivo móvil
    updateDeviceState() {
        AppState.isMobile = window.innerWidth < 768;
        document.body.classList.toggle('mobile', AppState.isMobile);
    },

    // Generar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Funciones de navegación
const Navigation = {
    // Abrir herramienta
    openTool(toolName) {
        if (AppState.isLoading) return;

        Utils.showLoading();
        
        // Simular carga y redireccionar
        setTimeout(() => {
            const toolUrls = {
                'claves': 'herramientas/claves/index.html',
                'rcp-timer': 'herramientas/rcp-timer/index.html',
                'conversor': 'herramientas/conversor/index.html'
            };

            const url = toolUrls[toolName];
            if (url) {
                window.location.href = url;
            } else {
                Utils.hideLoading();
                Utils.showNotification(`Herramienta "${toolName}" no encontrada`, 'error');
            }
        }, 500);

        // Analytics
        this.trackEvent('tool_access', { tool: toolName });
    },

    // Abrir módulo
    openModule(moduleName) {
        if (AppState.isLoading) return;

        Utils.showLoading();
        
        setTimeout(() => {
            const moduleUrls = {
                'atencion-prehospitalaria': 'modulos/atencion-prehospitalaria/index.html',
                'comportamiento-fuego': 'modulos/comportamiento-fuego/index.html',
                'equipos-materiales': 'modulos/equipos-materiales/index.html',
                'actividades-soporte': 'modulos/actividades-soporte/index.html',
                'combate-incendio': 'modulos/combate-incendio/index.html'
            };

            const url = moduleUrls[moduleName];
            if (url) {
                window.location.href = url;
            } else {
                Utils.hideLoading();
                Utils.showNotification(`Módulo "${moduleName}" en desarrollo`, 'info');
            }
        }, 500);

        // Analytics
        this.trackEvent('module_access', { module: moduleName });
    },

    // Tracking de eventos
    trackEvent(eventName, data = {}) {
        if (CONFIG.debug) {
            console.log(`📊 Event: ${eventName}`, data);
        }
        
        // Aquí se integraría Google Analytics o similar
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
    }
};

// Funciones de búsqueda
const Search = {
    // Datos para búsqueda (simplificado para ejemplo)
    searchData: [
        { title: 'Claves CGBVP', description: 'Códigos de comunicación', url: 'herramientas/claves/index.html', type: 'herramienta' },
        { title: 'Timer RCP', description: 'Cronómetro para reanimación', url: 'herramientas/rcp-timer/index.html', type: 'herramienta' },
        { title: 'Conversor de Unidades', description: 'Conversión de medidas', url: 'herramientas/conversor/index.html', type: 'herramienta' },
        { title: 'Atención Prehospitalaria', description: 'Protocolos médicos de emergencia', url: 'modulos/atencion-prehospitalaria/index.html', type: 'modulo' },
        { title: 'Comportamiento del Fuego', description: 'Fundamentos de la ciencia del fuego', url: 'modulos/comportamiento-fuego/index.html', type: 'modulo' },
        { title: 'Equipos y Materiales', description: 'EPP y herramientas', url: 'modulos/equipos-materiales/index.html', type: 'modulo' },
        { title: 'Actividades de Soporte', description: 'Comunicaciones y logística', url: 'modulos/actividades-soporte/index.html', type: 'modulo' },
        { title: 'Combate contra Incendio', description: 'Técnicas de supresión', url: 'modulos/combate-incendio/index.html', type: 'modulo' }
    ],

    // Buscar contenido
    performSearch(query) {
        const normalizedQuery = Utils.normalizeText(query);
        
        if (normalizedQuery.length < 2) {
            this.hideSearchResults();
            return;
        }

        const results = this.searchData.filter(item => {
            const normalizedTitle = Utils.normalizeText(item.title);
            const normalizedDescription = Utils.normalizeText(item.description);
            
            return normalizedTitle.includes(normalizedQuery) || 
                   normalizedDescription.includes(normalizedQuery);
        });

        this.showSearchResults(results, query);
        Navigation.trackEvent('search', { query, results: results.length });
    },

    // Mostrar resultados de búsqueda
    showSearchResults(results, originalQuery) {
        let existingResults = document.getElementById('searchResults');
        
        if (!existingResults) {
            existingResults = document.createElement('div');
            existingResults.id = 'searchResults';
            existingResults.className = 'search-results';
            existingResults.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border-radius: 8px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.15);
                max-height: 300px;
                overflow-y: auto;
                z-index: 1000;
                margin-top: 5px;
            `;
            
            document.querySelector('.search-container').style.position = 'relative';
            document.querySelector('.search-container').appendChild(existingResults);
        }

        if (results.length === 0) {
            existingResults.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #666;">
                    No se encontraron resultados para "${originalQuery}"
                </div>
            `;
        } else {
            existingResults.innerHTML = results.map(result => `
                <div class="search-result-item" style="
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    transition: background 0.2s ease;
                " onmouseover="this.style.background='#f8f9fa'" 
                   onmouseout="this.style.background='white'"
                   onclick="window.location.href='${result.url}'">
                    <div style="font-weight: bold; color: #e74c3c; margin-bottom: 5px;">
                        ${this.highlightMatch(result.title, originalQuery)}
                    </div>
                    <div style="color: #666; font-size: 0.9em;">
                        ${this.highlightMatch(result.description, originalQuery)}
                    </div>
                    <div style="color: #999; font-size: 0.8em; margin-top: 5px; text-transform: uppercase;">
                        ${result.type}
                    </div>
                </div>
            `).join('');
        }

        existingResults.style.display = 'block';
    },

    // Resaltar coincidencias en el texto
    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong style="background: #fff3cd;">$1</strong>');
    },

    // Ocultar resultados
    hideSearchResults() {
        const results = document.getElementById('searchResults');
        if (results) {
            results.style.display = 'none';
        }
    }
};

// Animaciones y efectos
const Animations = {
    // Animar números en estadísticas
    animateNumbers() {
        const numbers = [
            { element: document.getElementById('totalTools'), target: 3, suffix: '' },
            { element: document.getElementById('totalModules'), target: 5, suffix: '' },
            { element: document.getElementById('totalTopics'), target: 25, suffix: '+' }
        ];

        numbers.forEach(item => {
            if (item.element) {
                this.animateNumber(item.element, item.target, 2000, item.suffix);
            }
        });
    },

    // Animar un número específico
    animateNumber(element, target, duration, suffix = '') {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + suffix;
            }
        }, 16);
    },

    // Animación de entrada para elementos
    observeElements() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.herramienta-card, .modulo-card').forEach(card => {
                observer.observe(card);
            });
        }
    }
};

// Gestión de estado offline
const OfflineManager = {
    init() {
        window.addEventListener('online', this.handleOnline.bind(this));
        window.addEventListener('offline', this.handleOffline.bind(this));
        this.updateStatus();
    },

    handleOnline() {
        AppState.isOffline = false;
        Utils.showNotification('Conexión restaurada', 'success');
        this.updateStatus();
    },

    handleOffline() {
        AppState.isOffline = true;
        Utils.showNotification('Modo sin conexión - Contenido disponible en caché', 'info');
        this.updateStatus();
    },

    updateStatus() {
        document.body.classList.toggle('offline', AppState.isOffline);
    }
};

// Funciones de modal/overlay
const Modal = {
    show(title, content, actions = []) {
        const existingModal = document.getElementById('dynamicModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'dynamicModal';
        modal.className = 'modal-overlay show';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close" onclick="Modal.hide()">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    ${actions.map(action => `
                        <button class="btn ${action.class || 'btn-primary'}" 
                                onclick="${action.onclick}">
                            ${action.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Cerrar con click fuera del modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hide();
            }
        });

        // Cerrar con ESC
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.hide();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    },

    hide() {
        const modal = document.getElementById('dynamicModal');
        if (modal) {
            modal.remove();
        }
    }
};

// Atajos de teclado
const KeyboardShortcuts = {
    init() {
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    },

    handleKeydown(e) {
        // Ctrl/Cmd + F: Enfocar búsqueda
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('globalSearch');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }

        // ESC: Cerrar búsqueda/modales
        if (e.key === 'Escape') {
            Search.hideSearchResults();
            Modal.hide();
            document.getElementById('globalSearch').blur();
        }

        // Atajos numéricos con Ctrl
        if (e.ctrlKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    Navigation.openTool('claves');
                    break;
                case '2':
                    e.preventDefault();
                    Navigation.openTool('rcp-timer');
                    break;
                case '3':
                    e.preventDefault();
                    Navigation.openTool('conversor');
                    break;
            }
        }

        // F1: Ayuda
        if (e.key === 'F1') {
            e.preventDefault();
            showHelp();
        }
    }
};

// Funciones globales para uso en HTML
window.openTool = Navigation.openTool.bind(Navigation);
window.openModule = Navigation.openModule.bind(Navigation);

// Funciones de información
window.showAbout = function() {
    Modal.show(
        'Acerca de Bomberos Toolkit',
        `<p>Desarrollado por bomberos activos del CGBVP para proporcionar acceso rápido a información crítica durante emergencias.</p>
         <p><strong>Versión:</strong> ${CONFIG.version}<br>
         <strong>Última actualización:</strong> ${CONFIG.lastUpdate}</p>
         <p>Todo el contenido es gratuito y estará disponible siempre.</p>`,
        [{ text: 'Cerrar', onclick: 'Modal.hide()' }]
    );
};

window.showContact = function() {
    Modal.show(
        'Contacto',
        `<p><strong>Email:</strong> contacto@bomberostoolkit.com</p>
         <p><strong>GitHub:</strong> github.com/bomberos-toolkit</p>
         <p><strong>Reportar bugs:</strong> Utiliza GitHub Issues</p>
         <p>¿Sugerencias? ¡Nos encanta escuchar a la comunidad!</p>`,
        [{ text: 'Cerrar', onclick: 'Modal.hide()' }]
    );
};

window.showContribute = function() {
    Modal.show(
        'Contribuir al Proyecto',
        `<p>Puedes ayudar de varias maneras:</p>
         <ul>
            <li>Reportar errores o sugerir mejoras</li>
            <li>Enviar procedimientos actualizados</li>
            <li>Compartir experiencias de campo</li>
            <li>Traducir contenido</li>
            <li>Difundir entre otros bomberos</li>
         </ul>
         <p><strong>¡Tu conocimiento puede salvar vidas!</strong></p>`,
        [{ text: 'Cerrar', onclick: 'Modal.hide()' }]
    );
};

window.showHelp = function() {
    Modal.show(
        'Ayuda Rápida',
        `<h4>🔥 Atajos de Teclado:</h4>
         <ul>
            <li><strong>Ctrl+F:</strong> Buscar</li>
            <li><strong>Ctrl+1:</strong> Abrir Claves</li>
            <li><strong>Ctrl+2:</strong> Abrir Timer RCP</li>
            <li><strong>Ctrl+3:</strong> Abrir Conversor</li>
            <li><strong>F1:</strong> Mostrar esta ayuda</li>
            <li><strong>ESC:</strong> Cerrar ventanas</li>
         </ul>
         <h4>📱 Características:</h4>
         <ul>
            <li>Funciona offline una vez cargado</li>
            <li>Optimizado para uso móvil</li>
            <li>Búsqueda inteligente</li>
            <li>Siempre actualizado</li>
         </ul>`,
        [{ text: 'Entendido', onclick: 'Modal.hide()' }]
    );
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚒 Bomberos Toolkit inicializando...');

    // Inicializar módulos
    OfflineManager.init();
    KeyboardShortcuts.init();
    
    // Configurar navegación móvil
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }

    // Configurar búsqueda
    const searchInput = document.getElementById('globalSearch');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        const debouncedSearch = Utils.debounce((query) => {
            Search.performSearch(query);
        }, CONFIG.searchDelay);

        searchInput.addEventListener('input', (e) => {
            AppState.searchQuery = e.target.value;
            debouncedSearch(e.target.value);
        });

        searchInput.addEventListener('focus', () => {
            if (AppState.searchQuery) {
                Search.performSearch(AppState.searchQuery);
            }
        });

        // Cerrar resultados al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !document.getElementById('searchResults')?.contains(e.target)) {
                Search.hideSearchResults();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            if (AppState.searchQuery) {
                Search.performSearch(AppState.searchQuery);
            }
        });
    }

    // Actualizar estado del dispositivo
    Utils.updateDeviceState();
    window.addEventListener('resize', Utils.debounce(Utils.updateDeviceState, 250));

    // Iniciar animaciones con delay
    setTimeout(() => {
        Animations.animateNumbers();
        Animations.observeElements();
    }, 500);

    // Auto-focus en búsqueda en desktop
    if (!AppState.isMobile && searchInput) {
        setTimeout(() => {
            searchInput.focus();
        }, 1000);
    }

    console.log('✅ Bomberos Toolkit iniciado correctamente');
    
    // Evento personalizado para indicar que la app está lista
    window.dispatchEvent(new CustomEvent('bomberosToolkitReady', {
        detail: { version: CONFIG.version }
    }));
});