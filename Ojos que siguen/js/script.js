document.addEventListener('DOMContentLoaded', function() {
    // ========== CONFIGURACIÓN INICIAL ==========
    let sensitivity = 0.5;
    let smoothness = 0.1;
    let eyelidsClosed = false;
    let eyeCount = 1;
    let blinkCount = 0;
    let crazyMode = false;
    let crazyInterval;
    
    // ========== ELEMENTOS DEL DOM ==========
    // Sliders y valores
    const sensitivitySlider = document.getElementById('sensitivity');
    const smoothnessSlider = document.getElementById('smoothness');
    const sensitivityValue = document.getElementById('sensitivityValue');
    const smoothnessValue = document.getElementById('smoothnessValue');
    
    // Botones
    const resetBtn = document.getElementById('resetBtn');
    const addEyeBtn = document.getElementById('addEyeBtn');
    const changeColorBtn = document.getElementById('changeColorBtn');
    const toggleEyelidsBtn = document.getElementById('toggleEyelidsBtn');
    const crazyModeBtn = document.getElementById('crazyModeBtn');
    const eyelidText = document.getElementById('eyelidText');
    
    // Display
    const cursorPosition = document.getElementById('cursorPosition');
    const eyesContainer = document.querySelector('.eyes-container');
    const eyeCountDisplay = document.getElementById('eyeCount');
    const blinkCountDisplay = document.getElementById('blinkCount');
    
    // ========== VARIABLES PARA ANIMACIÓN ==========
    let targetPositions = [];
    let currentPositions = [];
    
    // ========== INICIALIZACIÓN ==========
    function initialize() {
        // Inicializar arrays de posiciones
        for (let i = 0; i < eyeCount; i++) {
            targetPositions.push({ x: 0, y: 0 });
            currentPositions.push({ x: 0, y: 0 });
        }
        
        // Actualizar displays
        eyeCountDisplay.textContent = eyeCount;
        blinkCountDisplay.textContent = blinkCount;
        sensitivityValue.textContent = sensitivity.toFixed(1);
        smoothnessValue.textContent = smoothness.toFixed(2);
        
        // Iniciar animación
        animateEyes();
    }
    
    // ========== SEGUIMIENTO DEL CURSOR ==========
    document.addEventListener('mousemove', function(e) {
        updateCursorPosition(e.clientX, e.clientY);
        updateCursorDisplay(e.clientX, e.clientY);
    });
    
    function updateCursorDisplay(x, y) {
        cursorPosition.innerHTML = `<i class="fas fa-mouse-pointer"></i> Cursor: (${x}, ${y})`;
    }
    
    function updateCursorPosition(mouseX, mouseY) {
        const eyes = document.querySelectorAll('.iris');
        
        eyes.forEach((eye, index) => {
            const eyeWrapper = eye.closest('.eye-wrapper');
            const eyeRect = eyeWrapper.getBoundingClientRect();
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;
            
            // Calcular dirección del cursor relativa al ojo
            const deltaX = mouseX - eyeCenterX;
            const deltaY = mouseY - eyeCenterY;
            
            // Distancia máxima que puede moverse el iris
            const maxDistance = (eyeRect.width / 2) - (eye.getBoundingClientRect().width / 2);
            
            // Calcular ángulo y distancia
            const angle = Math.atan2(deltaY, deltaX);
            const rawDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const distance = Math.min(rawDistance * sensitivity, maxDistance);
            
            // Modo loco: movimiento aleatorio adicional
            let crazyX = 0, crazyY = 0;
            if (crazyMode) {
                crazyX = (Math.random() - 0.5) * 20;
                crazyY = (Math.random() - 0.5) * 20;
            }
            
            // Posición target
            targetPositions[index] = {
                x: Math.cos(angle) * distance + crazyX,
                y: Math.sin(angle) * distance + crazyY
            };
        });
    }
    
    // ========== ANIMACIÓN SUAVE ==========
    function animateEyes() {
        const eyes = document.querySelectorAll('.iris');
        
        eyes.forEach((eye, index) => {
            // Interpolación suave hacia la posición target
            if (targetPositions[index]) {
                currentPositions[index].x += (targetPositions[index].x - currentPositions[index].x) * smoothness;
                currentPositions[index].y += (targetPositions[index].y - currentPositions[index].y) * smoothness;
                
                // Aplicar transformación
                eye.style.transform = `translate(-50%, -50%) translate(${currentPositions[index].x}px, ${currentPositions[index].y}px)`;
            }
        });
        
        requestAnimationFrame(animateEyes);
    }
    
    // ========== CONTROL DE EVENTOS ==========
    // Sliders
    sensitivitySlider.addEventListener('input', function() {
        sensitivity = parseFloat(this.value);
        sensitivityValue.textContent = sensitivity.toFixed(1);
    });
    
    smoothnessSlider.addEventListener('input', function() {
        smoothness = parseFloat(this.value);
        smoothnessValue.textContent = smoothness.toFixed(2);
    });
    
    // Botón: Reiniciar posición
    resetBtn.addEventListener('click', function() {
        targetPositions = targetPositions.map(() => ({ x: 0, y: 0 }));
        
        // Efecto visual
        this.innerHTML = '<i class="fas fa-check"></i> ¡Reiniciado!';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-redo"></i> Reiniciar Posición';
        }, 1000);
    });
    
    // Botón: Añadir ojo extra
    addEyeBtn.addEventListener('click', function() {
        if (eyeCount >= 8) {
            alert("¡Máximo de 8 ojos alcanzado!");
            return;
        }
        
        eyeCount++;
        const newEye = document.createElement('div');
        newEye.className = 'eye-wrapper';
        newEye.id = `eye${eyeCount}`;
        
        // Tipos de ojos aleatorios
        const eyeTypes = ['normal'];
        const randomType = eyeTypes[Math.floor(Math.random() * eyeTypes.length)];
        
        newEye.innerHTML = `
            ${randomType === 'normal' ? 
                '<div class="lashes"><div class="lash"></div><div class="lash"></div><div class="lash"></div><div class="lash"></div><div class="lash"></div></div>' 
                : ''}
            <div class="eye">
                <div class="iris">
                    <div class="reflex"></div>
                    <div class="pupil"></div>
                </div>
            </div>
            <div class="eye-label">${randomType.charAt(0).toUpperCase() + randomType.slice(1)} ${eyeCount}</div>
        `;
        
        // Color aleatorio para el nuevo ojo
        const hue = Math.floor(Math.random() * 360);
        const iris = newEye.querySelector('.iris');
        
        eyesContainer.appendChild(newEye);
        
        // Añadir posiciones al array
        targetPositions.push({ x: 0, y: 0 });
        currentPositions.push({ x: 0, y: 0 });
        
        // Actualizar contador
        eyeCountDisplay.textContent = eyeCount;
        
        // Efecto visual
        this.innerHTML = `<i class="fas fa-eye"></i> ¡Ojo ${eyeCount} añadido!`;
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-plus-circle"></i> Añadir Ojo Extra';
        }, 1500);
    });
    
    // Botón: Cambiar color del iris
    changeColorBtn.addEventListener('click', function() {
        
        irises.forEach(iris => {
            const hue = Math.floor(Math.random() * 360);
            const saturation = 70 + Math.floor(Math.random() * 20);
            const lightness = 50 + Math.floor(Math.random() * 20);
            
            iris.style.background = `radial-gradient(circle at 35% 35%, 
                hsl(${hue}, ${saturation}%, ${lightness}%), 
                hsl(${hue}, ${saturation}%, ${lightness - 20}%))`;
            iris.style.borderColor = `hsl(${hue}, ${saturation}%, ${lightness - 30}%)`;
        });
        
        // Efecto visual
        this.innerHTML = '<i class="fas fa-palette"></i> ¡Colores cambiados!';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-palette"></i> Cambiar Color Iris';
        }, 1000);
    });
    
    // Botón: Modo loco
    crazyModeBtn.addEventListener('click', function() {
        crazyMode = !crazyMode;
        
        if (crazyMode) {
            // Activar modo loco
            this.classList.add('active');
            this.innerHTML = '<i class="fas fa-crazy"></i> Modo Loco: ON';
            document.body.style.cursor = 'crosshair';
            
            // Efectos visuales locos
            crazyInterval = setInterval(() => {
                document.body.style.background = `linear-gradient(45deg, 
                    hsl(${Math.random() * 360}, 70%, 20%),
                    hsl(${Math.random() * 360}, 70%, 15%))`;
            }, 2000);
            
        } else {
            // Desactivar modo loco
            this.classList.remove('active');
            this.innerHTML = '<i class="fas fa-crazy"></i> Modo Loco';
            document.body.style.cursor = 'none';
            document.body.style.background = 'linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)';
            
            clearInterval(crazyInterval);
        }
    });
    
    
    // ========== SOPORTE PARA TÁCTIL ==========
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        updateCursorPosition(touch.clientX, touch.clientY);
        updateCursorDisplay(touch.clientX, touch.clientY);
    });
    
    // ========== INICIALIZAR APLICACIÓN ==========
    initialize();
    
    // ========== FUNCIONES EXTRA PARA GITHUB ==========
    // Exportar funciones para que sean visibles en la consola
    window.eyeController = {
        addEye: function() {
            addEyeBtn.click();
        },
        changeColors: function() {
            changeColorBtn.click();
        },
        toggleCrazyMode: function() {
            crazyModeBtn.click();
        },
        getStats: function() {
            return {
                eyeCount: eyeCount,
                blinkCount: blinkCount,
                sensitivity: sensitivity,
                smoothness: smoothness,
                crazyMode: crazyMode
            };
        },
        blink: function() {
            blinkAllEyes();
        }
    };
    
    console.log("👁️ Ojos que Siguen el Cursor - Cargado correctamente!");
    console.log("Prueba estos comandos en la consola:");
    console.log("  eyeController.addEye() - Añade un nuevo ojo");
    console.log("  eyeController.changeColors() - Cambia los colores");
    console.log("  eyeController.getStats() - Muestra estadísticas");
});