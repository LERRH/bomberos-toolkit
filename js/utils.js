// js/utils.js - Utilidades Generales

// Constantes útiles
const CONSTANTS = {
    EMERGENCY_CONTACTS: {
        FIRE: '116',
        POLICE: '105', 
        AMBULANCE: '117',
        EMERGENCY: '911'
    },
    
    MEASUREMENT_UNITS: {
        PRESSURE: ['PSI', 'Bar', 'kPa', 'mmHg'],
        FLOW: ['LPM', 'GPM', 'L/s'],
        LENGTH: ['m', 'ft', 'in', 'cm'],
        WEIGHT: ['kg', 'lb', 'g'],
        TEMPERATURE: ['°C', '°F', 'K']
    },

    FIRE_CLASSES: ['A', 'B', 'C', 'D', 'K'],
    
    TRIAGE_PRIORITIES: {
        IMMEDIATE: { color: 'red', priority: 1 },
        DELAYED: { color: 'yellow', priority: 2 },
        MINIMAL: { color: 'green', priority: 3 },
        DECEASED: { color: 'black', priority: 4 }
    }
};

// Utilidades de validación
const Validator = {
    // Validar email
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    // Validar teléfono peruano
    isValidPeruvianPhone(phone) {
        const regex = /^(\+51|0051|51)?[9]\d{8}$/;
        return regex.test(phone.replace(/[\s-]/g, ''));
    },

    // Validar códigos de emergencia
    isValidEmergencyCode(code) {
        const regex = /^(10|20|30|90|XX)\.\d{1,2}$/;
        return regex.test(code);
    },

    // Validar presión arterial
    isValidBloodPressure(systolic, diastolic) {
        return systolic > 0 && systolic < 300 && 
               diastolic > 0 && diastolic < 200 && 
               systolic > diastolic;
    },

    // Validar frecuencia cardíaca
    isValidHeartRate(rate, age = null) {
        if (rate < 30 || rate > 220) return false;
        
        if (age) {
            const maxRate = 220 - age;
            return rate <= maxRate;
        }
        
        return true;
    }
};

// Utilidades de formato
const Formatter = {
    // Formatear números con separadores de miles
    formatNumber(num, decimals = 0) {
        return new Intl.NumberFormat('es-PE', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    },

    // Formatear tiempo en formato MM:SS o HH:MM:SS
    formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    // Formatear fecha en español
    formatDate(date, includeTime = false) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'America/Lima'
        };

        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }

        return new Intl.DateTimeFormat('es-PE', options).format(date);
    },

    // Formatear tamaño de archivo
    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    },

    // Formatear presión arterial
    formatBloodPressure(systolic, diastolic) {
        return `${systolic}/${diastolic} mmHg`;
    },

    // Formatear código de emergencia
    formatEmergencyCode(code) {
        return code.replace(/(\d{2})\.(\d+)/, '$1.$2');
    }
};

// Utilidades de conversión
const Converter = {
    // Presión
    pressure: {
        psiToBar(psi) { return psi * 0.0689476; },
        barToPsi(bar) { return bar * 14.5038; },
        psiToKpa(psi) { return psi * 6.89476; },
        kpaToPsi(kpa) { return kpa * 0.145038; },
        barToKpa(bar) { return bar * 100; },
        kpaToBar(kpa) { return kpa * 0.01; }
    },

    // Caudal
    flow: {
        lpmToGpm(lpm) { return lpm * 0.264172; },
        gpmToLpm(gpm) { return gpm * 3.78541; },
        lpmToLps(lpm) { return lpm / 60; },
        lpsToLpm(lps) { return lps * 60; }
    },

    // Longitud
    length: {
        mToFt(m) { return m * 3.28084; },
        ftToM(ft) { return ft * 0.3048; },
        mToIn(m) { return m * 39.3701; },
        inToM(inch) { return inch * 0.0254; },
        cmToIn(cm) { return cm * 0.393701; },
        inToCm(inch) { return inch * 2.54; }
    },

    // Peso
    weight: {
        kgToLb(kg) { return kg * 2.20462; },
        lbToKg(lb) { return lb * 0.453592; },
        gToOz(g) { return g * 0.035274; },
        ozToG(oz) { return oz * 28.3495; }
    },

    // Temperatura
    temperature: {
        cToF(celsius) { return (celsius * 9/5) + 32; },
        fToC(fahrenheit) { return (fahrenheit - 32) * 5/9; },
        cToK(celsius) { return celsius + 273.15; },
        kToC(kelvin) { return kelvin - 273.15; }
    }
};

// Utilidades de cálculo para bomberos
const BomberoCalculations = {
    // Cálculo hidráulico básico: Q = A × V
    calculateFlow(area, velocity) {
        return area * velocity;
    },

    // Pérdida de presión por fricción (Hazen-Williams simplificado)
    frictionLoss(flow, length, diameter, coefficient = 120) {
        return 4.52 * Math.pow(flow / coefficient, 1.85) * Math.pow(diameter, -4.87) * length;
    },

    // Presión necesaria en boquilla
    nozzlePressure(flow, diameter) {
        // Fórmula aproximada para boquillas estándar
        return Math.pow(flow / (29.83 * Math.pow(diameter, 2)), 2);
    },

    // Tiempo de descarga de tanque
    tankDischargeTime(volume, flow) {
        return volume / flow; // en las mismas unidades
    },

    // Cálculo de espuma (regla del 3% y 6%)
    foamCalculation(waterFlow, concentration = 3) {
        return waterFlow * (concentration / 100);
    },

    // Escalera: ángulo seguro (regla 4:1)
    ladderAngle(height, base) {
        const ratio = height / base;
        const angle = Math.atan(ratio) * (180 / Math.PI);
        const isOptimal = ratio >= 3.8 && ratio <= 4.2; // Entre 75-78 grados
        
        return {
            angle: Math.round(angle),
            ratio: Math.round(ratio * 10) / 10,
            isOptimal,
            recommendation: isOptimal ? 'Ángulo óptimo' : 
                          ratio < 3.8 ? 'Muy inclinada - riesgo de vuelco' :
                          'Muy vertical - difícil acceso'
        };
    },

    // Tiempo de autonomía de SCBA
    scbaTime(pressure, consumption, workLevel = 'moderate') {
        const consumptionRates = {
            light: 25,      // L/min
            moderate: 40,   // L/min
            heavy: 60,      // L/min
            extreme: 80     // L/min
        };
        
        const rate = consumptionRates[workLevel] || consumptionRates.moderate;
        const usableAir = pressure * 0.8; // Usar solo 80% por seguridad
        
        return Math.floor(usableAir / rate);
    }
};

// Utilidades de emergencia médica
const MedicalUtils = {
    // Cálculo de Glasgow Coma Scale
    calculateGCS(eye, verbal, motor) {
        const total = eye + verbal + motor;
        let severity = '';
        
        if (total >= 13) severity = 'Leve';
        else if (total >= 9) severity = 'Moderado';
        else severity = 'Severo';
        
        return { total, severity };
    },

    // Clasificación de quemaduras por superficie corporal
    burnSurfaceArea(areas) {
        // Regla de los 9's para adultos
        const ruleOfNines = {
            head: 9,
            arm_right: 9,
            arm_left: 9,
            chest: 18,
            back: 18,
            leg_right: 18,
            leg_left: 18,
            genitals: 1
        };
        
        let total = 0;
        for (const [area, percentage] of Object.entries(areas)) {
            if (ruleOfNines[area]) {
                total += Math.min(percentage, ruleOfNines[area]);
            }
        }
        
        return {
            percentage: total,
            severity: total < 10 ? 'Menor' : total < 20 ? 'Moderada' : 'Mayor',
            requiresHospital: total >= 20 || areas.face > 0 || areas.hands > 0
        };
    },

    // Cálculo de Parkland para líquidos en quemaduras
    parklandFormula(weight, burnPercentage, hours = 24) {
        const totalFluid = 4 * weight * burnPercentage;
        const firstHalf = totalFluid / 2; // Primeras 8 horas
        const secondHalf = totalFluid / 2; // Siguientes 16 horas
        
        return {
            totalFluid,
            firstEightHours: firstHalf,
            nextSixteenHours: secondHalf,
            hourlyRateFirst8: Math.round(firstHalf / 8),
            hourlyRateNext16: Math.round(secondHalf / 16)
        };
    },

    // Signos vitales por edad
    vitalSignsByAge(age) {
        const ranges = {
            infant: { hr: [100, 160], rr: [30, 60], sbp: [70, 100] },
            toddler: { hr: [90, 150], rr: [24, 40], sbp: [80, 110] },
            preschool: { hr: [80, 140], rr: [22, 34], sbp: [80, 110] },
            school: { hr: [70, 120], rr: [18, 30], sbp: [80, 120] },
            adolescent: { hr: [60, 100], rr: [12, 16], sbp: [110, 120] },
            adult: { hr: [60, 100], rr: [12, 20], sbp: [90, 120] }
        };
        
        let category = 'adult';
        if (age < 1) category = 'infant';
        else if (age < 3) category = 'toddler';
        else if (age < 6) category = 'preschool';
        else if (age < 12) category = 'school';
        else if (age < 18) category = 'adolescent';
        
        return ranges[category];
    }
};

// Utilidades de localización y GPS
const LocationUtils = {
    // Obtener coordenadas actuales
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocalización no soportada'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                position => resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                }),
                error => reject(error),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
            );
        });
    },

    // Calcular distancia entre dos puntos (Haversine)
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Radio de la Tierra en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    },

    // Formatear coordenadas para radio
    formatCoordinatesForRadio(lat, lng) {
        const latDir = lat >= 0 ? 'N' : 'S';
        const lngDir = lng >= 0 ? 'E' : 'W';
        
        const latDeg = Math.floor(Math.abs(lat));
        const latMin = (Math.abs(lat) - latDeg) * 60;
        
        const lngDeg = Math.floor(Math.abs(lng));
        const lngMin = (Math.abs(lng) - lngDeg) * 60;
        
        return `${latDeg}°${latMin.toFixed(3)}'${latDir} ${lngDeg}°${lngMin.toFixed(3)}'${lngDir}`;
    }
};

// Utilidades de sonido y alertas
const SoundUtils = {
    // Crear contexto de audio
    audioContext: null,
    
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Audio no soportado');
        }
    },

    // Generar tono de alerta
    playTone(frequency = 800, duration = 200, volume = 0.1) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    },

    // Secuencia de alerta de emergencia
    emergencyAlert() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.playTone(1000, 300, 0.2);
            }, i * 400);
        }
        
        // Vibración si está disponible
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 200]);
        }
    },

    // Alerta de RCP (cada 30 compresiones)
    rcpAlert() {
        this.playTone(600, 100, 0.15);
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
    }
};

// Utilidades de almacenamiento local
const StorageUtils = {
    // Guardar datos con expiración
    setWithExpiry(key, value, ttl) {
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    },

    // Obtener datos verificando expiración
    getWithExpiry(key) {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;
        
        const item = JSON.parse(itemStr);
        const now = new Date();
        
        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        
        return item.value;
    },

    // Guardar configuración del usuario
    saveUserPreferences(preferences) {
        localStorage.setItem('bomberosToolkit_preferences', JSON.stringify(preferences));
    },

    // Cargar configuración del usuario
    loadUserPreferences() {
        const prefs = localStorage.getItem('bomberosToolkit_preferences');
        return prefs ? JSON.parse(prefs) : {
            theme: 'auto',
            fontSize: 'medium',
            soundEnabled: true,
            vibrationEnabled: true,
            autoSave: true,
            language: 'es'
        };
    },

    // Guardar historial de búsquedas
    saveSearchHistory(query) {
        const history = this.getSearchHistory();
        history.unshift(query);
        
        // Mantener solo las últimas 50 búsquedas
        const trimmedHistory = history.slice(0, 50);
        localStorage.setItem('bomberosToolkit_searchHistory', JSON.stringify(trimmedHistory));
    },

    // Obtener historial de búsquedas
    getSearchHistory() {
        const history = localStorage.getItem('bomberosToolkit_searchHistory');
        return history ? JSON.parse(history) : [];
    },

    // Limpiar datos antiguos
    cleanup() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('bomberosToolkit_temp_')) {
                const item = this.getWithExpiry(key);
                if (!item) {
                    localStorage.removeItem(key);
                }
            }
        });
    }
};

// Utilidades de red y conectividad
const NetworkUtils = {
    // Detectar tipo de conexión
    getConnectionType() {
        if ('connection' in navigator) {
            return navigator.connection.effectiveType;
        }
        return 'unknown';
    },

    // Verificar si está online
    isOnline() {
        return navigator.onLine;
    },

    // Test de velocidad básico
    speedTest() {
        return new Promise((resolve) => {
            const start = Date.now();
            const image = new Image();
            
            image.onload = () => {
                const duration = Date.now() - start;
                const speed = duration < 500 ? 'fast' : duration < 2000 ? 'medium' : 'slow';
                resolve({ duration, speed });
            };
            
            image.onerror = () => {
                resolve({ duration: 99999, speed: 'offline' });
            };
            
            // Imagen pequeña para test
            image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7?' + Math.random();
        });
    },

    // Detectar si hay datos limitados
    isDataSaver() {
        if ('connection' in navigator && 'saveData' in navigator.connection) {
            return navigator.connection.saveData;
        }
        return false;
    }
};

// Utilidades de accesibilidad
const AccessibilityUtils = {
    // Aumentar contraste
    toggleHighContrast() {
        document.body.classList.toggle('high-contrast');
        this.saveAccessibilityPreference('highContrast', document.body.classList.contains('high-contrast'));
    },

    // Cambiar tamaño de fuente
    setFontSize(size) {
        const sizes = { small: 0.9, medium: 1.0, large: 1.2, xlarge: 1.4 };
        const multiplier = sizes[size] || 1.0;
        
        document.documentElement.style.fontSize = `${16 * multiplier}px`;
        this.saveAccessibilityPreference('fontSize', size);
    },

    // Activar/desactivar animaciones
    toggleAnimations(enabled) {
        if (enabled) {
            document.body.classList.remove('no-animations');
        } else {
            document.body.classList.add('no-animations');
        }
        this.saveAccessibilityPreference('animations', enabled);
    },

    // Activar modo de enfoque
    enableFocusMode() {
        document.body.classList.add('focus-mode');
        
        // Resaltar elementos interactivos
        const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
        focusableElements.forEach(el => {
            el.style.outline = '3px solid #007cba';
            el.style.outlineOffset = '2px';
        });
    },

    // Guardar preferencias de accesibilidad
    saveAccessibilityPreference(key, value) {
        const prefs = StorageUtils.loadUserPreferences();
        prefs[key] = value;
        StorageUtils.saveUserPreferences(prefs);
    },

    // Anunciar para lectores de pantalla
    announce(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
};

// Utilidades de Performance
const PerformanceUtils = {
    // Medir tiempo de carga
    measureLoadTime() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            return {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
                loadComplete: navigation.loadEventEnd - navigation.navigationStart,
                firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
                firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
            };
        }
        return null;
    },

    // Optimizar imágenes lazy loading
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    },

    // Limpiar memoria
    cleanup() {
        // Remover event listeners huérfanos
        const elements = document.querySelectorAll('[data-cleanup]');
        elements.forEach(el => {
            const clone = el.cloneNode(true);
            el.parentNode.replaceChild(clone, el);
        });
        
        // Forzar garbage collection si está disponible
        if (window.gc) {
            window.gc();
        }
    },

    // Monitorear uso de memoria
    getMemoryUsage() {
        if ('memory' in performance) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576),
                total: Math.round(performance.memory.totalJSHeapSize / 1048576),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            };
        }
        return null;
    }
};

// Utilidades de debugging para desarrollo
const DebugUtils = {
    // Logging avanzado
    log(level, message, data = null) {
        if (!CONFIG.debug) return;
        
        const timestamp = new Date().toISOString();
        const styles = {
            error: 'color: #e74c3c; font-weight: bold;',
            warn: 'color: #f39c12; font-weight: bold;',
            info: 'color: #3498db;',
            success: 'color: #27ae60; font-weight: bold;'
        };
        
        console.log(
            `%c[${timestamp}] ${level.toUpperCase()}: ${message}`,
            styles[level] || styles.info,
            data
        );
    },

    // Profiler simple
    profile(name, fn) {
        if (!CONFIG.debug) return fn();
        
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        this.log('info', `Profile ${name}: ${(end - start).toFixed(2)}ms`);
        return result;
    },

    // Información del sistema
    getSystemInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            connection: NetworkUtils.getConnectionType(),
            memory: PerformanceUtils.getMemoryUsage(),
            performance: PerformanceUtils.measureLoadTime()
        };
    }
};

// Inicialización de utilidades
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar módulos que lo requieran
    SoundUtils.init();
    PerformanceUtils.setupLazyLoading();
    
    // Limpiar almacenamiento antiguo
    StorageUtils.cleanup();
    
    // Cargar preferencias de accesibilidad
    const prefs = StorageUtils.loadUserPreferences();
    if (prefs.fontSize && prefs.fontSize !== 'medium') {
        AccessibilityUtils.setFontSize(prefs.fontSize);
    }
    if (prefs.highContrast) {
        AccessibilityUtils.toggleHighContrast();
    }
    if (prefs.animations === false) {
        AccessibilityUtils.toggleAnimations(false);
    }
    
    // Log de información del sistema en modo debug
    if (CONFIG.debug) {
        DebugUtils.log('info', 'Utilidades inicializadas', DebugUtils.getSystemInfo());
    }
});

// Exportar utilidades globalmente
window.Validator = Validator;
window.Formatter = Formatter;
window.Converter = Converter;
window.BomberoCalculations = BomberoCalculations;
window.MedicalUtils = MedicalUtils;
window.LocationUtils = LocationUtils;
window.SoundUtils = SoundUtils;
window.StorageUtils = StorageUtils;
window.NetworkUtils = NetworkUtils;
window.AccessibilityUtils = AccessibilityUtils;
window.PerformanceUtils = PerformanceUtils;
window.DebugUtils = DebugUtils;
window.CONSTANTS = CONSTANTS;