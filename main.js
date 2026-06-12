let nomeUsuario = "";
let modoEscuroAtivo = false;
let tamanhoFonte = 100;

document.addEventListener('DOMContentLoaded', () => {
    verificarPreferencias();
    configurarSaudacao();
    if (document.getElementById('quiz-container')) carregarQuiz();
});

function alternarModoEscuro() {
    modoEscuroAtivo = !modoEscuroAtivo;
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('agroDarkMode', modoEscuroAtivo);
    const btn = document.getElementById('toggle-dark');
    if (btn) btn.innerHTML = modoEscuroAtivo ? '☀️' : '🌙';
}

function ajustarFonte(delta) {
    tamanhoFonte = Math.min(Math.max(tamanhoFonte + delta, 80), 150);
    document.documentElement.style.fontSize = tamanhoFonte + '%';
}

function configurarSaudacao() {
    const saudacaoDiv = document.getElementById('saudacao-usuario');
    if (!saudacaoDiv) return;
    nomeUsuario = localStorage.getItem('agroNome');
    if (nomeUsuario) {
        saudacaoDiv.innerHTML = `<h3>Olá, ${nomeUsuario}! 🌱</h3>`;
    } else {
        saudacaoDiv.innerHTML = `
            <div class="input-nome">
                <input type="text" id="input-nome" placeholder="Seu nome">
                <button onclick="salvarNome()" class="btn">Entrar</button>
            </div>
        `;
    }
}

function salvarNome() {
    const input = document.getElementById('input-nome');
    if (input && input.value.trim() !== "") {
        nomeUsuario = input.value.trim();
        localStorage.setItem('agroNome', nomeUsuario);
        configurarSaudacao();
    }
}

// --- ASSISTENTE VIRTUAL (Antiga IA) ---

const baseConhecimento = {
    "sustentabilidade": "É o equilíbrio entre produção e preservação, garantindo recursos para o futuro.",
    "tecnologia": "Drones e sensores ajudam a produzir mais com menos impacto ambiental.",
    "meio ambiente": "O agro sustentável protege matas e usa técnicas como o plantio direto.",
    "agrinho": "Projeto educativo que valoriza o campo e a cidadania.",
    "pib": "O agronegócio representa cerca de 25% do PIB brasileiro."
};

function perguntarAssistente() {
    const input = document.getElementById('ai-input');
    const output = document.getElementById('ai-output');
    if (!input || !output) return;

    const pergunta = input.value.toLowerCase();
    let resposta = "Interessante! Tente perguntar sobre 'tecnologia' ou 'sustentabilidade'.";

    for (let chave in baseConhecimento) {
        if (pergunta.includes(chave)) {
            resposta = baseConhecimento[chave];
            break;
        }
    }

    const msg = document.createElement('div');
    msg.className = 'chat-bubble';
    msg.innerHTML = `<strong>Você:</strong> ${input.value}<br><strong>Assistente:</strong> ${resposta}`;
    output.prepend(msg);
    input.value = "";
}

// --- QUIZ ---

const perguntasQuiz = [
    {
        pergunta: "O que significa ILPF?",
        opcoes: ["Integração Lavoura-Pecuária-Floresta", "Indústria de Lavouras Fortes", "Inovação Livre", "Imposto de Lavouras"],
        correta: 0
    },
    {
        pergunta: "Qual técnica evita a erosão?",
        opcoes: ["Queimada", "Aragem", "Plantio Direto", "Monocultura"],
        correta: 2
    }
];

function carregarQuiz() {
    const container = document.getElementById('quiz-container');
    if (!container) return;
    let html = "";
    perguntasQuiz.forEach((p, index) => {
        html += `
            <div class="quiz-item">
                <p><strong>${index + 1}. ${p.pergunta}</strong></p>
                ${p.opcoes.map((opt, i) => `<label><input type="radio" name="q${index}" value="${i}"> ${opt}</label><br>`).join('')}
            </div>
        `;
    });
    html += `<button onclick="verificarQuiz()" class="btn">Verificar</button>`;
    container.innerHTML = html;
}

function verificarQuiz() {
    let acertos = 0;
    perguntasQuiz.forEach((p, index) => {
        const sel = document.querySelector(`input[name="q${index}"]:checked`);
        if (sel && parseInt(sel.value) === p.correta) acertos++;
    });
    alert(`Você acertou ${acertos} de ${perguntasQuiz.length}!`);
}

function verificarPreferencias() {
    if (localStorage.getItem('agroDarkMode') === 'true') alternarModoEscuro();
}