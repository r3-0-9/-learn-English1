// ==================== TAB SWITCHING ====================
const tabBtns = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.section');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const sectionId = btn.dataset.section;
        
        tabBtns.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById('section-' + sectionId).classList.add('active');
    });
});

// ==================== FLASHCARDS ====================
const cards = [
    {
        en: "Serendipity",
        phonetic: "/ˌser.ənˈdɪp.ə.ti/",
        cn: "意外发现美好事物的能力",
        def: "The occurrence of events by chance in a happy way.",
        example: "Meeting you was pure serendipity."
    },
    {
        en: "Resilience",
        phonetic: "/rɪˈzɪl.jəns/",
        cn: "韧性；恢复力",
        def: "The ability to recover quickly from difficulties.",
        example: "Her resilience after the failure was inspiring."
    },
    {
        en: "Epiphany",
        phonetic: "/ɪˈpɪf.ən.i/",
        cn: "顿悟；灵光乍现",
        def: "A moment of sudden revelation or insight.",
        example: "I had an epiphany about the solution."
    },
    {
        en: "Ubiquitous",
        phonetic: "/juːˈbɪk.wɪ.təs/",
        cn: "无处不在的",
        def: "Present, appearing, or found everywhere.",
        example: "Smartphones are now ubiquitous in modern life."
    },
    {
        en: "Eloquent",
        phonetic: "/ˈel.ə.kwənt/",
        cn: "雄辩的；有说服力的",
        def: "Fluent or persuasive in speaking or writing.",
        example: "She gave an eloquent speech at the ceremony."
    }
];

let currentCard = 0;
const flashcard = document.getElementById('flashcard');

flashcard.addEventListener('click', () => {
    flashcard.classList.toggle('flipped');
});

function updateCard() {
    const card = cards[currentCard];
    document.getElementById('word-en').textContent = card.en;
    document.getElementById('word-phonetic').textContent = card.phonetic;
    document.getElementById('word-cn').textContent = card.cn;
    document.getElementById('word-def').textContent = card.def;
    document.getElementById('word-example').textContent = `"${card.example}"`;
    flashcard.classList.remove('flipped');
}

function nextCard() {
    currentCard = (currentCard + 1) % cards.length;
    updateCard();
}

function prevCard() {
    currentCard = (currentCard - 1 + cards.length) % cards.length;
    updateCard();
}

// ==================== QUIZ ====================
const quizData = [
    {
        q: '"Break a leg" 是什么意思？ / What does "Break a leg" mean?',
        options: ["真的摔断腿 / Actually break a leg", "祝好运 / Good luck", "休息一下 / Take a break"],
        correct: 1
    },
    {
        q: '"It\'s raining cats and dogs" 表示？ / What does this idiom mean?',
        options: ["天上下猫和狗 / Literally cats and dogs", "倾盆大雨 / Heavy rain", "动物逃跑 / Animals escaping"],
        correct: 1
    },
    {
        q: '"Piece of cake" 的意思是？ / What does "Piece of cake" mean?',
        options: ["一块蛋糕 / A slice of cake", "小菜一碟 / Very easy", "甜点时间 / Dessert time"],
        correct: 1
    },
    {
        q: '"Hit the books" 表示？ / What does "Hit the books" mean?',
        options: ["打书 / Hit books physically", "开始认真学习 / Start studying hard", "买书 / Buy books"],
        correct: 1
    },
    {
        q: '"Bite the bullet" 的意思是？ / What does this phrase mean?',
        options: ["咬子弹 / Chew a bullet", "咬紧牙关忍受 / Face a difficult situation bravely", "开枪 / Fire a gun"],
        correct: 1
    }
];

let currentQ = 0;
let score = 0;
let answered = false;

function renderQuiz() {
    document.getElementById('q-num').textContent = currentQ + 1;
    document.getElementById('score').textContent = score;
    document.getElementById('quiz-question').textContent = quizData[currentQ].q;
    
    const optsContainer = document.getElementById('quiz-options');
    optsContainer.innerHTML = '';
    
    quizData[currentQ].options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-btn';
        btn.textContent = ['A', 'B', 'C'][i] + '. ' + opt;
        btn.onclick = () => checkAnswer(i);
        optsContainer.appendChild(btn);
    });
    
    document.getElementById('quiz-feedback').classList.add('hidden');
    document.getElementById('next-btn').classList.add('hidden');
    answered = false;
}

function checkAnswer(idx) {
    if (answered) return;
    answered = true;
    
    const btns = document.querySelectorAll('.quiz-btn');
    const feedback = document.getElementById('quiz-feedback');
    
    btns.forEach((btn, i) => {
        btn.classList.add('disabled');
        if (i === quizData[currentQ].correct) {
            btn.classList.add('correct');
        } else if (i === idx && i !== quizData[currentQ].correct) {
            btn.classList.add('wrong');
        }
    });
    
    if (idx === quizData[currentQ].correct) {
        score++;
        document.getElementById('score').textContent = score;
        feedback.textContent = '✅ 正确！/ Correct!';
        feedback.className = 'feedback correct';
    } else {
        const correctLetter = ['A', 'B', 'C'][quizData[currentQ].correct];
        feedback.textContent = `❌ 错误，正确答案是 ${correctLetter}。/ Wrong, the answer is ${correctLetter}.`;
        feedback.className = 'feedback wrong';
    }
    
    feedback.classList.remove('hidden');
    document.getElementById('next-btn').classList.remove('hidden');
}

function nextQuestion() {
    currentQ++;
    
    if (currentQ >= quizData.length) {
        showQuizResult();
        return;
    }
    
    renderQuiz();
}

function showQuizResult() {
    const quizBox = document.querySelector('.quiz-box');
    const perfect = score === quizData.length;
    
    quizBox.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
            <h2 style="color: #065f46; margin-bottom: 12px;">测验完成！/ Quiz Complete!</h2>
            <p style="font-size: 24px; color: #059669; font-weight: 700;">你的得分：${score} / ${quizData.length}</p>
            <p style="color: #6b7280; margin-top: 12px; font-size: 16px;">
                ${perfect ? '太棒了！满分！/ Perfect score!' : '继续加油！/ Keep practicing!'}
            </p>
            <button onclick="resetQuiz()" style="margin-top: 24px; padding: 14px 36px; background: #10b981; color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">重新开始 / Restart</button>
        </div>
    `;
}

function resetQuiz() {
    currentQ = 0;
    score = 0;
    
    const quizBox = document.querySelector('.quiz-box');
    quizBox.innerHTML = `
        <div class="quiz-header">
            <span class="badge">Question <span id="q-num">1</span>/5</span>
            <span class="score">Score: <span id="score">0</span></span>
        </div>
        <p class="quiz-question" id="quiz-question"></p>
        <div class="quiz-options" id="quiz-options"></div>
        <div id="quiz-feedback" class="feedback hidden"></div>
        <button id="next-btn" class="next-btn hidden" onclick="nextQuestion()">下一题 / Next →</button>
    `;
    
    renderQuiz();
}

// ==================== DAILY SENTENCE ====================
const sentences = [
    {
        cn: "种一棵树最好的时间是十年前，其次是现在。",
        en: "The best time to plant a tree was 20 years ago. The second best time is now.",
        tags: ["📝 语法：比较级 / Comparative", "💡 主题：励志 / Motivation"],
        vocab: "plant (v.) 种植 / to put seeds in the ground",
        structure: "The best time to... was... The second best time is..."
    },
    {
        cn: "不积跬步，无以至千里。",
        en: "A journey of a thousand miles begins with a single step.",
        tags: ["📝 语法：谚语 / Proverb", "💡 主题：坚持 / Perseverance"],
        vocab: "journey (n.) 旅程 / a long trip",
        structure: "A... begins with a..."
    },
    {
        cn: "活到老，学到老。",
        en: "You are never too old to learn.",
        tags: ["📝 语法：双重否定 / Double Negative", "💡 主题：学习 / Learning"],
        vocab: "never (adv.) 从不 / at no time",
        structure: "never too... to..."
    },
    {
        cn: "机会总是留给有准备的人。",
        en: "Opportunities always favor the prepared mind.",
        tags: ["📝 语法：一般现在时 / Simple Present", "💡 主题：机遇 / Opportunity"],
        vocab: "favor (v.) 偏爱；有利于 / to prefer or support",
        structure: "... favor the prepared..."
    },
    {
        cn: "千里之行，始于足下。",
        en: "Every long journey starts with the first step.",
        tags: ["📝 语法：一般现在时 / Simple Present", "💡 主题：行动 / Action"],
        vocab: "journey (n.) 旅行 / travel or passage",
        structure: "Every... starts with..."
    }
];

let currentSentence = 0;

function newSentence() {
    currentSentence = (currentSentence + 1) % sentences.length;
    const s = sentences[currentSentence];
    
    document.getElementById('sentence-cn').textContent = s.cn;
    document.getElementById('sentence-en').textContent = s.en;
    document.getElementById('vocab-info').textContent = s.vocab;
    document.getElementById('structure-info').textContent = s.structure;
    
    const tagsContainer = document.getElementById('sentence-tags');
    tagsContainer.innerHTML = '';
    s.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        tagsContainer.appendChild(span);
    });
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    updateCard();
    renderQuiz();
});
