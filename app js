class CodeQuestApp {
    constructor() {
        // Preguntas por defecto de respaldo (Fallback) por si falla el fetch en GitHub Pages
        this.questions = [
            {
                id: 1,
                language: "C++",
                difficulty: "Fácil",
                code: "#include <iostream>\n\nint main() {\n    std::cout << \"¡Hola, Mundo!\";\n    return 0;\n}",
                options: ["C++", "Java", "Rust", "C#"],
                explanation: "Utiliza la librería cabecera `<iostream>` y `std::cout`."
            },
            {
                id: 2,
                language: "Python",
                difficulty: "Fácil",
                code: "def saludar(nombre):\n    print(f\"Hola, {nombre}\")\n\nsaludar(\"Dev\")",
                options: ["Ruby", "Python", "JavaScript", "Lua"],
                explanation: "Define funciones con `def` y no usa puntos y comas."
            },
            {
                id: 3,
                language: "JavaScript",
                difficulty: "Medio",
                code: "const sumar = (a, b) => a + b;\nconsole.log(sumar(5, 10));",
                options: ["TypeScript", "JavaScript", "Dart", "PHP"],
                explanation: "Usa funciones flecha (`=>`) y `console.log()`."
            }
        ];

        this.currentQuestion = null;
        this.selectedMode = 'classic';
        this.streak = 0;
        this.timer = null;
        this.timeLeft = 60;
        this.lives = 3;

        // Cargar estado guardado
        this.state = this.loadState();

        // Datos para el modo aprendizaje
        this.learningData = {
            "Python": { creator: "Guido van Rossum", year: 1991, use: "IA, Web, Ciencia de datos", trivia: "Su nombre viene del grupo cómico Monty Python." },
            "C++": { creator: "Bjarne Stroustrup", year: 1985, use: "Videojuegos, Sistemas operativos", trivia: "Originalmente se llamaba 'C con Clases'." },
            "Java": { creator: "James Gosling", year: 1995, use: "Empresarial, Android", trivia: "Inicialmente se llamó Oak." },
            "JavaScript": { creator: "Brendan Eich", year: 1995, use: "Desarrollo Web", trivia: "Fue creado en solo 10 días." },
            "Rust": { creator: "Graydon Hoare", year: 2010, use: "Sistemas de alto rendimiento", trivia: "Nombrado así por un hongo muy resistente." }
        };

        // Iniciar al cargar el DOM
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
        console.log("✅ App lista para jugar.");
    }

    // --- CARGAR PREGUNTAS ---
    async loadQuestions() {
        try {
            // Intenta cargar el archivo JSON
            const res = await fetch('./questions.json');
            if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
            const data = await res.json();
            if (data && data.length > 0) {
                this.questions = data;
                console.log(`📁 ${data.length} preguntas cargadas desde questions.json`);
            }
        } catch (e) {
            console.warn("⚠️ No se pudo cargar questions.json, usando preguntas de respaldo local.", e);
        }
    }

    // --- MANEJO DE ESTADO LOCALSTORAGE ---
    loadState() {
        const defaultState = {
            xp: 0,
            level: 1,
            played: 0,
            answered: 0,
            correct: 0,
            wrong: 0,
            maxStreak: 0,
            settings: { sound: true, anims: true },
            achievements: [],
            langStats: {}
        };
        try {
            const saved = localStorage.getItem('codequest_save');
            return saved ? JSON.parse(saved) : defaultState;
        } catch (e) {
            return defaultState;
        }
    }

    saveState() {
        try {
            localStorage.setItem('codequest_save', JSON.stringify(this.state));
        } catch(e) {}
        this.updateUI();
    }

    resetProgress() {
        if (confirm("¿Seguro que deseas reiniciar todo tu progreso?")) {
            localStorage.removeItem('codequest_save');
            this.state = this.loadState();
            this.saveState();
            this.showScreen('screen-home');
        }
    }

    // --- NAVEGACIÓN ---
    showScreen(screenId) {
        console.log("Cambiando a pantalla:", screenId);
        const screens = document.querySelectorAll('.screen');
        screens.forEach(s => s.classList.remove('active'));

        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        } else {
            console.error(`La pantalla #${screenId} no existe en el HTML.`);
        }

        if (screenId === 'screen-stats') this.renderStats();
    }

    showModeSelect() {
        this.showScreen('screen-modes');
    }

    // --- JUEGO ---
    startGame(mode) {
        console.log("Iniciando juego en modo:", mode);
        this.selectedMode = mode;
        this.streak = 0;
        this.timeLeft = 60;
        this.lives = 3;
        
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
                alert("⏱️ ¡Tiempo Agotado!");
                this.endGame();
            }
        }, 1000);
    }

    nextQuestion() {
        const expBox = document.getElementById('explanation-box');
        if (expBox) expBox.classList.add('hidden');
        
        if (!this.questions || this.questions.length === 0) {
            alert("No hay preguntas disponibles.");
            return;
        }

        // Seleccionar pregunta aleatoria
        const randomIndex = Math.floor(Math.random() * this.questions.length);
        this.currentQuestion = { ...this.questions[randomIndex] };

        // Modo Experto (Ocultar palabras)
        if (this.selectedMode === 'expert') {
            const keywords = ["include", "function", "def", "public", "class", "const", "let", "var", "import", "select"];
            let maskCode = this.currentQuestion.code;
            keywords.forEach(kw => {
                const reg = new RegExp(`\\b${kw}\\b`, 'gi');
                maskCode = maskCode.replace(reg, "???");
            });
            this.currentQuestion.code = maskCode;
        }

        // Mostrar código
        const codeElement = document.getElementById('code-snippet');
        if (codeElement) {
            codeElement.textContent = this.currentQuestion.code;
            codeElement.className = `language-clike`;
            
            // Proteger si Prism.js no cargó
            if (window.Prism) {
                try { Prism.highlightElement(codeElement); } catch(e){}
            }
        }

        // Badge Dificultad
        const diffBadge = document.getElementById('difficulty-badge');
        if (diffBadge) {
            diffBadge.innerText = this.currentQuestion.difficulty;
            const cleanDiff = this.currentQuestion.difficulty.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            diffBadge.className = `badge ${cleanDiff}`;
        }

        const streakEl = document.getElementById('game-streak');
        if (streakEl) streakEl.innerText = this.streak;

        // Opciones
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

            const xpGained = this.currentQuestion.difficulty === 'Fácil' ? 10 : (this.currentQuestion.difficulty === 'Medio' ? 20 : 40);
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
                    setTimeout(() => { alert("👾 ¡Perdiste todas tus vidas!"); this.endGame(); }, 400);
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

    endGame() {
        clearInterval(this.timer);
        this.state.played++;
        this.saveState();
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
        if (xpFill) {
            const progress = (this.state.xp % 100);
            xpFill.style.width = `${progress}%`;
        }
    }

    checkAchievements() {
        const list = [
            { id: 'first_win', title: 'Primer Acierto', condition: s => s.correct >= 1 },
            { id: 'streak_10', title: 'Racha Pixelada (10)', condition: s => s.maxStreak >= 10 },
            { id: 'master_50', title: 'Coder Creador (50 Aciertos)', condition: s => s.correct >= 50 }
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
            { id: 'streak_10', title: 'Racha Pixelada', desc: 'Consigue una racha de 10 aciertos.', icon: '🔥' },
            { id: 'master_50', title: 'Coder Creador', desc: 'Responde 50 preguntas correctamente.', icon: '🏆' }
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

        let topLang = '-';
        let max = 0;
        for (const [lang, count] of Object.entries(this.state.langStats)) {
            if (count > max) { max = count; topLang = lang; }
        }
        setVal('st-fav-lang', topLang);
    }

    openLearningMode() {
        this.showScreen('screen-learning');
        const sidebar = document.getElementById('lang-list');
        if (!sidebar) return;
        
        sidebar.innerHTML = '';

        Object.keys(this.learningData).forEach(lang => {
            const item = document.createElement('div');
            item.className = 'lang-item';
            item.innerText = lang;
            item.onclick = () => this.showLearningDetail(lang, item);
            sidebar.appendChild(item);
        });
    }

    showLearningDetail(lang, element) {
        document.querySelectorAll('.lang-item').forEach(i => i.classList.remove('active'));
        if (element) element.classList.add('active');

        const info = this.learningData[lang];
        const detailContainer = document.getElementById('lang-detail-content');
        if (detailContainer && info) {
            detailContainer.innerHTML = `
                <h3>💻 ${lang}</h3>
                <p><strong>Creador:</strong> ${info.creator} (${info.year})</p>
                <p><strong>Uso principal:</strong> ${info.use}</p>
                <hr style="margin: 10px 0;">
                <p><strong>💡 Curiosidad:</strong> ${info.trivia}</p>
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

        const particles = Array.from({ length: 30 }, () => ({
            x: canvas.width / 2,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            size: Math.random() * 6 + 4,
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
            if (frame++ < 40) requestAnimationFrame(animate);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        animate();
    }

    toggleSound(enabled) { this.state.settings.sound = enabled; this.saveState(); }
    toggleAnims(enabled) { this.state.settings.anims = enabled; this.saveState(); }

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

// Aseguramos que 'app' esté disponible globalmente para los onclick de HTML
window.app = new CodeQuestApp();

