
        document.addEventListener('DOMContentLoaded', () => {
        const counters = document.querySelectorAll('.counter');
        const speed = 50; // A menor número, más rápido

        const startCounter = (counter) => {
            const target = +counter.getAttribute('data-target');
            const isDecimal = counter.getAttribute('data-decimal') === 'true';
            
            const updateCount = () => {
                const count = +counter.innerText;
                const inc = target / speed;
    
                if (count < target) {
                    if (isDecimal) {
                        counter.innerText = (count + 0.1).toFixed(1);
                        setTimeout(updateCount, 40);
                    } else {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    }
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        };

        // Observer para activar la animación solo cuando se ve la sección
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    startCounter(counter);
                    observer.unobserve(counter); // Para que solo anime una vez
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
        });


        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        
        let dots = [];
        let grid = {};
        let width, height;
        const mouse = { x: null, y: null };
        
        const DOT_SPACING = 30;
        const INTERACTION_RADIUS = 160;
        const COLOR_NEXIO = "87, 220, 205"; // El verde agua que elegimos
        
        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            createDots();
        }
    
        function createDots() {
            dots = [];
            grid = {};
            const cols = Math.ceil(width / DOT_SPACING);
            const rows = Math.ceil(height / DOT_SPACING);
        
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * DOT_SPACING;
                    const y = j * DOT_SPACING;
                    const cellKey = `${Math.floor(x/100)}_${Math.floor(y/100)}`;
                    if (!grid[cellKey]) grid[cellKey] = [];
                    grid[cellKey].push(dots.length);
        
                    dots.push({
                        x, y,
                        opacity: Math.random() * 0.5,
                        speed: 0.01 + Math.random() * 0.02
                    });
                }
            }
        }
    
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            dots.forEach(dot => {
                dot.opacity += dot.speed;
                if (dot.opacity > 0.5 || dot.opacity < 0.1) dot.speed *= -1;
        
                let finalOpacity = dot.opacity;
                let radius = 1;
        
                if (mouse.x !== null) {
                    const dx = dot.x - mouse.x;
                    const dy = dot.y - mouse.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < INTERACTION_RADIUS) {
                        const factor = 1 - (dist / INTERACTION_RADIUS);
                        finalOpacity += factor * 0.5;
                        radius += factor * 2;
                    }
                }
        
                ctx.beginPath();
                ctx.fillStyle = `rgba(${COLOR_NEXIO}, ${finalOpacity})`;
                ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(animate);
        }
    
        window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
        window.addEventListener('resize', resize);
        resize();
        animate();

        function toggleChat() {
            const chatWindow = document.getElementById('chat-window');
            chatWindow.classList.toggle('d-none');
            // Si se abre, ponemos el foco en el input
            if (!chatWindow.classList.contains('d-none')) {
                document.getElementById('chat-input').focus();
            }
        }

        function sendMsg() {
            const input = document.getElementById('chat-input');
            const body = document.getElementById('chat-body');
            
            if (input.value.trim() !== "") {
                // Mensaje del Usuario
                body.innerHTML += `
                    <div class="mb-3 text-end">
                        <div class="p-3 rounded-4 shadow-sm" style="background: #57DCCD; color: #0a0a0a; display: inline-block; max-width: 85%; font-size: 0.9rem;">
                            ${input.value}
                        </div>
                    </div>`;
                
                const userText = input.value.toLowerCase();
                input.value = "";
        
                // Efecto de "escribiendo..."
                setTimeout(() => {
                    let response = "Interesante. En Nexio SIT podemos ayudarte con eso. ¿Prefieres agendar una consultoría gratuita?";
                    
                    if(userText.includes("precio") || userText.includes("costo")) {
                        response = "Nuestros proyectos son personalizados. Si gustas, déjanos tu correo y un experto te enviará un diagnóstico.";
                    } else if (userText.includes("servicios")) {
                        response = "Ofrecemos Agentes IA, Automatización de Marketing y CRM. ¿Cuál te interesa más?";
                    }
        
                    body.innerHTML += `
                        <div class="mb-3 text-start">
                            <div class="p-3 rounded-4 shadow-sm" style="background: rgba(255,255,255,0.05); color: #e2e8f0; display: inline-block; max-width: 85%; font-size: 0.9rem;">
                                ${response}
                            </div>
                        </div>`;
                    
                    // Auto-scroll al fondo
                    body.scrollTop = body.scrollHeight;
                }, 1000);
                
                body.scrollTop = body.scrollHeight;
            }
        }

        // Permitir enviar con la tecla Enter
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && document.activeElement.id === 'chat-input') {
                sendMsg();
            }
        });

        // Lógica del botón Back to Top
        const backToTopBtn = document.getElementById("btn-back-to-top");

        // Mostrar u ocultar el botón al hacer scroll
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) { // Aparece después de bajar 300px
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });

        // Función para volver arriba suavemente
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        
    

    