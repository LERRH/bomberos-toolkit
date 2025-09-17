// js/navigation.js - Sistema de Navegación

// Router simple para SPA (Single Page Application)
const Router = {
    routes: {
        '/': 'home',
        '/herramientas': 'herramientas',
        '/modulos': 'modulos',
        '/about': 'about'
    },

    currentRoute: '/',
    
    init() {
        // Manejar cambios de URL
        window.addEventListener('popstate', this.handleRouteChange.bind(this));
        
        // Interceptar enlaces internos
        document.addEventListener('click', this.handleLinkClick.bind(this));
        
        // Cargar ruta inicial
        this.handleRouteChange();
    },

    handleLinkClick(e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        
        // Solo manejar enlaces internos que empiecen con #
        if (href && href.startsWith('#')) {
            e.preventDefault();
            this.navigateTo(href);
        }
    },

    navigateTo(path) {
        if (path.startsWith('#')) {
            const element = document.querySelector(path);
            if (element) {
                Utils.smoothScrollTo(element);
                
                // Actualizar URL sin recargar
                history.pushState(null, '', path);
                this.currentRoute = path;
            }
        }
    },

    handleRouteChange() {
        const path = window.location.hash || '/';
        this.currentRoute = path;
        
        // Actualizar navegación activa
        this.updateActiveNavigation();
    },

    updateActiveNavigation() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === this.currentRoute) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
};

// Breadcrumb Manager
const BreadcrumbManager = {
    container: null,
    
    init() {
        this.container = document.getElementById('breadcrumb');
        if (!this.container) {
            // Crear contenedor si no existe
            this.createBreadcrumbContainer();
        }
    },

    createBreadcrumbContainer() {
        const container = document.createElement('nav');
        container.id = 'breadcrumb';
        container.className = 'breadcrumb';
        container.setAttribute('aria-label', 'Navegación de ruta');
        
        // Insertar después del header
        const header = document.querySelector('.main-header');
        if (header) {
            header.insertAdjacentElement('afterend', container);
            this.container = container;
        }
    },

    update(breadcrumbs) {
        if (!this.container) return;
        
        const breadcrumbList = document.createElement('ol');
        breadcrumbList.className = 'breadcrumb-list';
        
        breadcrumbs.forEach((crumb, index) => {
            const item = document.createElement('li');
            item.className = 'breadcrumb-item';
            
            if (index === breadcrumbs.length - 1) {
                // Último elemento (actual)
                item.classList.add('active');
                item.textContent = crumb.text;
                item.setAttribute('aria-current', 'page');
            } else {
                // Elementos navegables
                const link = document.createElement('a');
                link.href = crumb.url;
                link.textContent = crumb.text;
                link.addEventListener('click', (e) => {
                    if (crumb.url.startsWith('#')) {
                        e.preventDefault();
                        Router.navigateTo(crumb.url);
                    }
                });
                item.appendChild(link);
            }
            
            breadcrumbList.appendChild(item);
        });
        
        this.container.innerHTML = '';
        this.container.appendChild(breadcrumbList);
    },

    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    },

    show() {
        if (this.container) {
            this.container.style.display = 'block';
        }
    }
};

// Scroll Manager - Manejo inteligente del scroll
const ScrollManager = {
    lastScrollTop: 0,
    header: null,
    
    init() {
        this.header = document.querySelector('.main-header');
        
        // Throttle del scroll para performance
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    },

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Auto-hide header en scroll hacia abajo en móvil
        if (AppState.isMobile && this.header) {
            if (scrollTop > this.lastScrollTop && scrollTop > 100) {
                // Scrolling hacia abajo
                this.header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling hacia arriba
                this.header.style.transform = 'translateY(0)';
            }
        }
        
        // Actualizar posición para efectos de parallax suaves
        this.updateScrollEffects(scrollTop);
        
        this.lastScrollTop = scrollTop;
    },

    updateScrollEffects(scrollTop) {
        // Efecto parallax sutil en el header
        const header = document.querySelector('.main-header');
        if (header && scrollTop < 500) {
            const speed = scrollTop * 0.5;
            header.style.backgroundPosition = `center ${speed}px`;
        }
        
        // Fade in/out de elementos en scroll
        const elements = document.querySelectorAll('[data-scroll-fade]');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight && rect.bottom > 0) {
                const opacity = Math.min(1, (windowHeight - rect.top) / windowHeight);
                el.style.opacity = opacity;
            }
        });
    },

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },

    scrollToElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            Utils.smoothScrollTo(element);
        }
    }
};

// Page Loader - Gestión de carga entre páginas
const PageLoader = {
    isLoading: false,
    
    show() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        Utils.showLoading();
        
        // Agregar clase de carga al body
        document.body.classList.add('page-loading');
    },
    
    hide() {
        this.isLoading = false;
        Utils.hideLoading();
        
        // Remover clase de carga
        document.body.classList.remove('page-loading');
    },
    
    loadPage(url, callback) {
        this.show();
        
        // Simular tiempo de carga mínimo para UX
        const minLoadTime = 500;
        const startTime = Date.now();
        
        // En una implementación real, aquí cargarías el contenido via AJAX
        setTimeout(() => {
            const elapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadTime - elapsed);
            
            setTimeout(() => {
                this.hide();
                if (callback) callback();
            }, remainingTime);
        }, 100);
    }
};

// Back Button Handler
const BackButtonHandler = {
    history: [],
    currentIndex: -1,
    
    init() {
        // Interceptar el botón atrás del navegador
        window.addEventListener('popstate', this.handlePopState.bind(this));
    },
    
    pushState(url, title = '') {
        this.history = this.history.slice(0, this.currentIndex + 1);
        this.history.push({ url, title, timestamp: Date.now() });
        this.currentIndex = this.history.length - 1;
        
        if (url !== window.location.href) {
            window.history.pushState({ index: this.currentIndex }, title, url);
        }
    },
    
    handlePopState(e) {
        if (e.state && typeof e.state.index === 'number') {
            this.currentIndex = e.state.index;
            const currentPage = this.history[this.currentIndex];
            
            if (currentPage) {
                this.loadPage(currentPage.url);
            }
        }
    },
    
    canGoBack() {
        return this.currentIndex > 0;
    },
    
    goBack() {
        if (this.canGoBack()) {
            window.history.back();
        }
    },
    
    loadPage(url) {
        // Implementar carga de página específica
        if (url.includes('#')) {
            const element = document.querySelector(url.split('#')[1]);
            if (element) {
                Utils.smoothScrollTo(element);
            }
        }
    }
};

// Navigation Analytics
const NavigationAnalytics = {
    sessionStart: Date.now(),
    pageViews: [],
    
    trackPageView(page, title = '') {
        const pageView = {
            page,
            title,
            timestamp: Date.now(),
            sessionTime: Date.now() - this.sessionStart,
            referrer: document.referrer,
            userAgent: navigator.userAgent
        };
        
        this.pageViews.push(pageView);
        
        // En producción, enviar a analytics
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: title,
                page_location: window.location.href
            });
        }
        
        if (CONFIG.debug) {
            console.log('📊 Page view tracked:', pageView);
        }
    },
    
    trackUserFlow() {
        return this.pageViews.map(pv => ({
            page: pv.page,
            timestamp: pv.timestamp,
            timeOnPage: this.calculateTimeOnPage(pv)
        }));
    },
    
    calculateTimeOnPage(pageView) {
        const index = this.pageViews.indexOf(pageView);
        const nextPageView = this.pageViews[index + 1];
        
        if (nextPageView) {
            return nextPageView.timestamp - pageView.timestamp;
        }
        
        return Date.now() - pageView.timestamp;
    },
    
    getSessionStats() {
        return {
            sessionDuration: Date.now() - this.sessionStart,
            pagesVisited: this.pageViews.length,
            averageTimePerPage: this.pageViews.length > 0 
                ? (Date.now() - this.sessionStart) / this.pageViews.length 
                : 0,
            userFlow: this.trackUserFlow()
        };
    }
};

// Quick Actions - Acciones rápidas de navegación
const QuickActions = {
    actions: {
        'search': () => document.getElementById('globalSearch')?.focus(),
        'help': () => window.showHelp(),
        'home': () => window.scrollTo({ top: 0, behavior: 'smooth' }),
        'emergency': () => Navigation.openTool('claves')
    },
    
    init() {
        this.createQuickActionButtons();
        this.setupGestures();
    },
    
    createQuickActionButtons() {
        // Crear botones de acción rápida si no existen
        const existingFab = document.querySelector('.floating-action-buttons');
        if (existingFab) return;
        
        const fab = document.createElement('div');
        fab.className = 'floating-action-buttons';
        fab.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 999;
        `;
        
        // Solo en móvil para no saturar desktop
        if (AppState.isMobile) {
            const quickActions = [
                { action: 'search', icon: '🔍', title: 'Buscar rápido' },
                { action: 'emergency', icon: '🚨', title: 'Emergencia' }
            ];
            
            quickActions.forEach(qa => {
                const btn = document.createElement('button');
                btn.className = 'quick-action-btn';
                btn.innerHTML = qa.icon;
                btn.title = qa.title;
                btn.style.cssText = `
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    border: none;
                    background: rgba(231, 76, 60, 0.9);
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.3);
                    transition: all 0.3s ease;
                `;
                
                btn.addEventListener('click', () => this.executeAction(qa.action));
                fab.appendChild(btn);
            });
            
            document.body.appendChild(fab);
        }
    },
    
    setupGestures() {
        // Gestos táctiles para acciones rápidas (solo móvil)
        if (!AppState.isMobile) return;
        
        let startY = 0;
        let startX = 0;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const endY = e.changedTouches[0].clientY;
            const endX = e.changedTouches[0].clientX;
            
            const deltaY = startY - endY;
            const deltaX = endX - startX;
            
            // Swipe hacia arriba para buscar
            if (deltaY > 100 && Math.abs(deltaX) < 50) {
                this.executeAction('search');
            }
            
            // Swipe hacia la derecha para volver al inicio
            if (deltaX > 150 && Math.abs(deltaY) < 50) {
                this.executeAction('home');
            }
        }, { passive: true });
    },
    
    executeAction(actionName) {
        const action = this.actions[actionName];
        if (action) {
            action();
            
            // Feedback háptico en dispositivos compatibles
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }
    }
};

// Preloader para recursos
const ResourcePreloader = {
    resources: [
        'css/main.css',
        'css/components.css',
        'css/responsive.css',
        'js/utils.js'
    ],
    
    preloadCriticalResources() {
        this.resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            
            if (resource.endsWith('.css')) {
                link.as = 'style';
            } else if (resource.endsWith('.js')) {
                link.as = 'script';
            }
            
            link.href = resource;
            document.head.appendChild(link);
        });
    },
    
    preloadNextPageResources(nextPage) {
        // Precargar recursos de la siguiente página probable
        const resourceMap = {
            'claves': ['herramientas/claves/index.html'],
            'rcp-timer': ['herramientas/rcp-timer/index.html'],
            'conversor': ['herramientas/conversor/index.html']
        };
        
        const resources = resourceMap[nextPage];
        if (resources) {
            resources.forEach(resource => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = resource;
                document.head.appendChild(link);
            });
        }
    }
};

// Inicialización del sistema de navegación
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos los módulos de navegación
    Router.init();
    BreadcrumbManager.init();
    ScrollManager.init();
    BackButtonHandler.init();
    QuickActions.init();
    
    // Precargar recursos críticos
    ResourcePreloader.preloadCriticalResources();
    
    // Track página inicial
    NavigationAnalytics.trackPageView(window.location.pathname, document.title);
    
    console.log('🧭 Sistema de navegación inicializado');
});

// Exportar funciones útiles globalmente
window.ScrollManager = ScrollManager;
window.NavigationAnalytics = NavigationAnalytics;
window.QuickActions = QuickActions;