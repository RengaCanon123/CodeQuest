/* ==========================================================================
   CODEQUEST - ENGINE PRINCIPAL MEJORADO
   ========================================================================== */

class CodeQuestApp {
    constructor() {
        // Límite de preguntas por partida para evitar partidas infinitas
        this.MAX_QUESTIONS_PER_GAME = 10;
        this.gameQuestionCount = 0;
        this.askedQuestionIds = new Set(); // Para controlar que no se repitan

        // Preguntas por defecto de respaldo
        this.questions = [
            {
                id: 1,
                language: "C++",
                difficulty: "Fácil",
                code: "#include <iostream>\n\nint main() {\n    std::cout << \"¡Hola, Mundo!\";\n    return 0;\n}",
                options: ["C++", "Java", "Rust", "C#"],
                explanation: "Utiliza la librería cabecera `<iostream>` y `std::cout` para imprimir en consola."
            },
            {
                id: 2,
                language: "Python",
                difficulty: "Fácil",
                code: "def saludar(nombre):\n    print(f\"Hola, {nombre}\")\n\nsaludar(\"Dev\")",
                options: ["Ruby", "Python", "JavaScript", "Lua"],
                explanation: "Define funciones con `def`, usa sangría (indentación) en lugar de llaves y no requiere puntos y comas."
            },
            {
                id: 3,
                language: "JavaScript",
                difficulty: "Medio",
                code: "const sumar = (a, b) => a + b;\nconsole.log(sumar(5, 10));",
                options: ["TypeScript", "JavaScript", "Dart", "PHP"],
                explanation: "Utiliza funciones flecha (`=>`) y `console.log()` para mostrar salida en el navegador o consola."
            },
            {
                id: 4,
                language: "HTML",
                difficulty: "Fácil",
                code: "<div class=\"contenedor\">\n  <h1>Título</h1>\n  <p>Párrafo de texto</p>\n</div>",
                options: ["HTML", "XML", "JSX", "PHP"],
                explanation: "Es un lenguaje de marcado basado en etiquetas como `<div>`, `<h1>` y `<p>` para estructurar páginas web."
            },
            {
                id: 5,
                language: "CSS",
                difficulty: "Fácil",
                code: ".boton {\n  background-color: #ff69b4;\n  color: white;\n  border-radius: 8px;\n}",
                options: ["CSS", "SCSS", "JSON", "JavaScript"],
                explanation: "Define reglas de estilo visual con selectores (`.clase`), propiedades y valores terminados en punto y coma."
            }
        ];

        this.currentQuestion = null;
        this.selectedMode = 'classic';
        this.streak = 0;
        this.timer = null;
        this.timeLeft = 60;
        this.lives = 3;

        this.state = this.loadState();

        // Modo Aprendizaje explicativo para principiantes
        this.learningData = {
            "Python": {
                creator: "Guido van Rossum (1991)",
                use: "Inteligencia Artificial, Ciencia de Datos, Automatización y Desarrollo Web.",
                concept: "Es conocido por ser el lenguaje más legible y fácil de aprender. Se parece mucho al inglés escrito.",
                syntaxKey: "Usa sangrías (espacios) para organizar el código en lugar de llaves `{}`.",
                example: "edad = 15\nif edad >= 18:\n    print('Mayor de edad')\nelse:\n    print('Menor de edad')"
            },
            "C++": {
                creator: "Bjarne Stroustrup (1985)",
                use: "Motores de videojuegos (Unreal Engine), Sistemas Operativos, Robótica y Software de alto rendimiento.",
                concept: "Es un lenguaje potente que da control total sobre la memoria del equipo y la velocidad de ejecución.",
                syntaxKey: "Cada instrucción termina en punto y coma `;` y el código principal vive dentro de `int main() { ... }`.",
                example: "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << '¡Hola C++!';\n    return 0;\n}"
            },
            "JavaScript": {
                creator: "Brendan Eich (1995)",
                use: "Desarrollo Web (da interactividad a las páginas), aplicaciones móviles y servidores.",
                concept: "Es el lenguaje nativo de la web. Todo lo que hace clic, se mueve o cambia en un sitio web usa JS.",
                syntaxKey: "Usa variables como `const` o `let` y funciones que reaccionan a eventos del usuario.",
                example: "let boton = document.querySelector('button');\nboton.onclick = () => alert('¡Hiciste clic!');"
            },
            "HTML": {
                creator: "Tim Berners-Lee (1993)",
                use: "Estructura y esqueleto de todas las páginas web de Internet.",
                concept: "No es un lenguaje de programación, sino de 'marcado'. Define dónde van los textos, imágenes y botones.",
                syntaxKey: "Usa etiquetas con apertura e inicio: `<etiqueta>Contenido</etiqueta>`.",
                example: "<h1>Mi Título</h1>\n<p>Este es un párrafo de prueba.</p>\n<button>Hacer Clic</button>"
            },
            "CSS": {
                creator: "Håkon Wium Lie (1996)",
                use: "Diseño visual, colores, tipografías y maquetación de sitios web.",
                concept: "Se encarga del aspecto estético del HTML. Transforma esqueletos sencillos en interfaces bonitas.",
                syntaxKey: "Aplica estilos usando reglas de `propiedad: valor;` dentro de bloques delimitados por `{}`.",
                example: "body {\n    background-color: #f0f0f0;\n    font-family: Arial, sans-serif;\n}"
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        console.log("🚀 Inicializando CodeQuest...");
        await this.loadQuestions();
        this.setupKeyboardListeners();
        this.updateUI();
        this.renderAchievements();
    }

    async loadQuestions() {
        try {
            const res = await fetch('./questions.json');
            if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
            const data = await res.json();
            if (data && data.length > 0) {
                this.questions = data;
            }
        } catch (e) {
            console.warn("⚠️ Usando preguntas locales.", e);
        }
    }

    loadState() {
        const defaultState = {
            xp: 0, level: 1, played: 0, answered: 0, correct: 0, wrong: 0, maxStreak: 0,
            settings: { sound: true, anims: true }, achievements: [], langStats: {}
        };
        try {
            const saved = localStorage.getItem('codequest_save');
            return saved ? JSON.parse(saved) : defaultState;
        } catch (e) {
            return defaultState;
        }
    }

    saveState() {
        try { localStorage.setItem('codequest_save', JSON.stringify(this.state)); } catch(e) {}
        this.updateUI();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) targetScreen.classList.add('active');
        if (screenId === 'screen-stats') this.renderStats();
    }

    showModeSelect() { this.showScreen('screen-modes'); }

    // --- INICIO DE PARTIDA ---
    startGame(mode) {
        this.selectedMode = mode;
        this.streak = 0;
        this.timeLeft = 60;
        this.lives = 3;
        this.gameQuestionCount = 0;
        this.askedQuestionIds.clear(); // Limpiar preguntas hechas en esta partida

        const modeInd = document.getElementById('mode-indicator');
        if (modeInd) modeInd.innerText = mode.toUpperCase();
        
        document.getElementById('timer-box').style.display = (mode === 'time') ? 'block' : 'none';
        document.getElementById('lives-box').style.display = (mode === 'survival') ? 'block' : 'none';

        if (mode === 'time') this.startTimer();

        this.showScreen('screen-game');
        this.nextQuestion();
    }

    startTimer() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeLeft--;
            const timerEl = document.getElementById('game-timer');
            if (timerEl) timerEl.innerText = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.endGame("⏱️ ¡Tiempo Agotado!");
            }
        }, 1000);
    }

    // --- SIGUIENTE PREGUNTA (SIN REPETICIONES Y CON LÍMITE) ---
    nextQuestion() {
        // Verificar si la partida llegó a su límite de preguntas
        if (this.selectedMode !== 'time' && this.selectedMode !== 'survival') {
            if (this.gameQuestionCount >= this.MAX_QUESTIONS_PER_GAME) {
                this.endGame("🎉 ¡Partida completada! Has respondido las 10 preguntas.");
                return;
            }
        }

        const expBox = document.getElementById('explanation-box');
        if (expBox) expBox.classList.add('hidden');

        // Filtrar preguntas que NO se hayan hecho en esta partida
        let availableQuestions = this.questions.filter(q => !this.askedQuestionIds.has(q.id));

        // Si se agotaron todas las preguntas disponibles del banco:
        if (availableQuestions.length === 0) {
            this.askedQuestionIds.clear(); // Reiniciar pool de vistas
            availableQuestions = [...this.questions];
        }

        // Elegir pregunta aleatoria dentro del conjunto no repetido
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        this.currentQuestion = { ...availableQuestions[randomIndex] };
        this.askedQuestionIds.add(this.currentQuestion.id);
        this.gameQuestionCount++;

        // Modo Experto (Ocultar palabras clave)
        if (this.selectedMode === 'expert') {
            const keywords = ["include", "function", "def", "public", "class", "const", "let", "var", "import", "select"];
            let maskCode = this.currentQuestion.code;
            keywords.forEach(kw => {
                const reg = new RegExp(`\\b${kw}\\b`, 'gi');
                maskCode = maskCode.replace(reg, "???");
            });
            this.currentQuestion.code = maskCode;
        }

        // Mostrar en la interfaz
        const codeElement = document.getElementById('code-snippet');
        if (codeElement) {
            codeElement.textContent = this.currentQuestion.code;
            codeElement.className = `language-clike`;
            if (window.Prism) { try { Prism.highlightElement(codeElement); } catch(e){} }
        }

        const diffBadge = document.getElementById('difficulty-badge');
        if (diffBadge) {
            diffBadge.innerText = `${this.currentQuestion.difficulty} (${this.gameQuestionCount}/${this.MAX_QUESTIONS_PER_GAME})`;
        }

        const optionsContainer = document.getElementById('options-container');
        if (optionsContainer) {
            optionsContainer.innerHTML = '';
            this.currentQuestion.options.forEach((option, idx) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.innerHTML = `<span>[${idx + 1}]</span> ${option}`;
                btn.onclick = () => this.handleAnswer(option, btn);
                optionsContainer.appendChild(btn);
            });
        }
    }

    handleAnswer(selectedOption, clickedBtn) {
        const allBtns = document.querySelectorAll('.option-btn');
        allBtns.forEach(b => b.onclick = null);

        const isCorrect = selectedOption === this.currentQuestion.language;
        this.state.answered++;

        const lang = this.currentQuestion.language;
        this.state.langStats[lang] = (this.state.langStats[lang] || 0) + (isCorrect ? 1 : 0);

        if (isCorrect) {
            clickedBtn.classList.add('correct');
            this.playSound(587.33, 'triangle', 0.15);
            this.streak++;
            if (this.streak > this.state.maxStreak) this.state.maxStreak = this.streak;
            this.state.correct++;

            const xpGained = this.currentQuestion.difficulty === 'Fácil' ? 10 : 20;
            this.addXP(xpGained);

            if (this.selectedMode === 'time') this.timeLeft += 3;
            if (this.state.settings.anims) this.triggerConfetti();

        } else {
            clickedBtn.classList.add('wrong');
            this.playSound(150, 'sawtooth', 0.3);
            this.streak = 0;
            this.state.wrong++;

            allBtns.forEach(b => {
                if (b.innerText.includes(this.currentQuestion.language)) b.classList.add('correct');
            });

            if (this.selectedMode === 'survival') {
                this.lives--;
                const livesEl = document.getElementById('game-lives');
                if (livesEl) livesEl.innerText = this.lives;
                if (this.lives <= 0) {
                    setTimeout(() => { this.endGame("👾 ¡Perdiste todas tus vidas!"); }, 400);
                    return;
                }
            }
        }

        const expBox = document.getElementById('explanation-box');
        const expHeader = document.getElementById('explanation-header');
        const expText = document.getElementById('explanation-text');

        if (expBox && expHeader && expText) {
            expHeader.innerText = isCorrect ? "✨ ¡Correcto!" : `❌ Incorrecto. Era ${this.currentQuestion.language}`;
            expHeader.style.color = isCorrect ? "var(--correct-border)" : "var(--wrong-border)";
            expText.innerText = this.currentQuestion.explanation;
            expBox.classList.remove('hidden');
        }

        this.checkAchievements();
        this.saveState();
    }

    endGame(message = "Partida Finalizada") {
        clearInterval(this.timer);
        this.state.played++;
        this.saveState();
        alert(`${message}\n\nAciertos en esta sesión: ${this.streak}\nXP Total: ${this.state.xp}`);
        this.showScreen('screen-home');
    }

    addXP(points) {
        this.state.xp += points;
        const nextLevelXP = this.state.level * 100;
        if (this.state.xp >= nextLevelXP) {
            this.state.level++;
            alert(`🎉 ¡SUBISTE DE NIVEL! Ahora eres Nivel ${this.state.level}`);
        }
    }

    updateUI() {
        const lvlEl = document.getElementById('nav-level');
        if (lvlEl) lvlEl.innerText = `NV. ${this.state.level}`;
        const xpFill = document.getElementById('mini-xp-fill');
        if (xpFill) xpFill.style.width = `${(this.state.xp % 100)}%`;
    }

    checkAchievements() {
        const list = [
            { id: 'first_win', title: 'Primer Acierto', condition: s => s.correct >= 1 },
            { id: 'streak_10', title: 'Racha Pixelada (10)', condition: s => s.maxStreak >= 10 }
        ];
        list.forEach(ach => {
            if (!this.state.achievements.includes(ach.id) && ach.condition(this.state)) {
                this.state.achievements.push(ach.id);
                alert(`🏆 ¡Logro Desbloqueado!: ${ach.title}`);
            }
        });
    }

    renderAchievements() {
        const container = document.getElementById('achievements-container');
        if (!container) return;
        container.innerHTML = '';
        const allAchievements = [
            { id: 'first_win', title: 'Primer Acierto', desc: 'Responde acertadamente 1 pregunta.', icon: '⭐' },
            { id: 'streak_10', title: 'Racha Pixelada', desc: 'Consigue una racha de 10 aciertos.', icon: '🔥' }
        ];
        allAchievements.forEach(ach => {
            const unlocked = this.state.achievements.includes(ach.id);
            const card = document.createElement('div');
            card.className = `achievement-card ${unlocked ? 'unlocked' : ''}`;
            card.innerHTML = `
                <div class="ach-icon">${ach.icon}</div>
                <div>
                    <strong>${ach.title} ${unlocked ? '✅' : '🔒'}</strong>
                    <p style="font-size: 0.8rem;">${ach.desc}</p>
                </div>
            `;
            container.appendChild(card);
        });
    }

    renderStats() {
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
        setVal('st-played', this.state.played);
        setVal('st-answered', this.state.answered);
        setVal('st-correct', this.state.correct);
        setVal('st-wrong', this.state.wrong);
        const acc = this.state.answered > 0 ? Math.round((this.state.correct / this.state.answered) * 100) : 0;
        setVal('st-accuracy', `${acc}%`);
        setVal('st-streak', this.state.maxStreak);
        setVal('st-level', this.state.level);
        setVal('st-xp', `${this.state.xp} XP`);
    }

    // --- MODO APRENDIZAJE DESCRIPTIVO ---
    openLearningMode() {
        this.showScreen('screen-learning');
        const sidebar = document.getElementById('lang-list');
        if (!sidebar) return;
        sidebar.innerHTML = '';

        const languages = Object.keys(this.learningData);
        languages.forEach((lang, index) => {
            const item = document.createElement('div');
            item.className = 'lang-item';
            item.innerText = lang;
            item.onclick = () => this.showLearningDetail(lang, item);
            sidebar.appendChild(item);
            
            // Cargar el primer lenguaje por defecto
            if (index === 0) this.showLearningDetail(lang, item);
        });
    }

    showLearningDetail(lang, element) {
        document.querySelectorAll('.lang-item').forEach(i => i.classList.remove('active'));
        if (element) element.classList.add('active');

        const info = this.learningData[lang];
        const detailContainer = document.getElementById('lang-detail-content');
        if (detailContainer && info) {
            detailContainer.innerHTML = `
                <h2 style="margin-top:0;">💻 ${lang}</h2>
                <p><strong>👨‍💻 Creador & Origen:</strong> ${info.creator}</p>
                <p><strong>🎯 ¿Para qué se usa?:</strong> ${info.use}</p>
                <div style="background: rgba(0,0,0,0.05); padding: 10px; border-radius: 6px; margin: 10px 0;">
                    <p><strong>💡 ¿Qué es? (Para Principiantes):</strong></p>
                    <p>${info.concept}</p>
                </div>
                <p><strong>🔑 Regla Clave de Sintaxis:</strong> ${info.syntaxKey}</p>
                <p><strong>📝 Ejemplo Básico:</strong></p>
                <pre style="background: #1e1e1e; color: #d4d4d4; padding: 10px; border-radius: 6px; overflow-x: auto;"><code>${info.example}</code></pre>
            `;
        }
    }

    playSound(freq, type = 'sine', duration = 0.1) {
        if (!this.state.settings.sound) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
            osc.stop(ctx.currentTime + duration);
        } catch (e) { }
    }

    triggerConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = Array.from({ length: 25 }, () => ({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            size: Math.random() * 5 + 3,
            color: ['#FFF3A6', '#BEEBFF', '#A8E6CF', '#FFAAA5'][Math.floor(Math.random() * 4)]
        }));

        let frame = 0;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
            });
            if (frame++ < 35) requestAnimationFrame(animate);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        animate();
    }

    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            const gameScreen = document.getElementById('screen-game');
            if (!gameScreen || !gameScreen.classList.contains('active')) return;

            if (['1', '2', '3', '4'].includes(e.key)) {
                const index = parseInt(e.key) - 1;
                const btns = document.querySelectorAll('.option-btn');
                if (btns[index]) btns[index].click();
            }
        });
    }
}

window.app = new CodeQuestApp();
