// js/app1.js

// --- 数据定义 ---

// 单词闪卡数据
const vocabularyData = [
    {
        en: "Serendipity",
        phonetic: "/ˌser.ənˈdɪp.ə.ti/",
        cn: "意外发现美好事物的能力",
        def: "The occurrence of events by chance in a happy way.",
        example: "Meeting you was pure serendipity."
    },
    {
        en: "Ephemeral",
        phonetic: "/ɪˈfem.ər.əl/",
        cn: "短暂的，转瞬即逝的",
        def: "Lasting for only a short time.",
        example: "Fame in the modern world is ephemeral."
    },
    {
        en: "Resilience",
        phonetic: "/rɪˈzɪl.i.əns/",
        cn: "恢复力，韧性",
        def: "The ability to become strong again after being damaged.",
        example: "She showed remarkable resilience after the accident."
    }
];

// 测验题目数据
const quizData = [
    {
        question: '"Break a leg" 是什么意思？ / What does "Break a leg" mean?',
        options: [
            "A. 真的摔断腿 / Actually break a leg", 
            "B. 祝好运 / Good luck", 
            "C. 休息一下 / Take a break"
        ],
        correctIndex: 1
    },
    {
        question: '"Piece of cake" 用来形容什么？ / What does "Piece of cake" describe?',
        options: [
            "A. 很好吃 / Very delicious", 
            "B. 很容易的事 / Something very easy", 
            "C. 一小块 / A small piece"
        ],
        correctIndex: 1
    },
    {
        question: '"Under the weather" 是什么意思？ / What does "Under the weather" mean?',
        options: [
            "A. 在户外 / Outdoors", 
            "B. 天气不好 / Bad weather", 
            "C. 身体不适 / Not feeling well"
        ],
        correctIndex: 2
    }
];

// 每日一句数据
const dailySentences = [
    {
        cn: "种一棵树最好的时间是十年前，其次是现在。",
        en: "The best time to plant a tree was 20 years ago. The second best time is now.",
        tags: ["📝 语法：比较级 / Comparative", "💡 主题：励志 / Motivation"],
        vocab: "plant (v.) 种植 / to put seeds in the ground",
        structure: "The best time to... was... The second best time is..."
    },
    {
        cn: "生活中最重要的事情就是永远不要放弃希望。",
        en: "The most important thing in life is to never give up hope.",
        tags: ["📝 语法：不定式 / Infinitive", "💡 主题：生活 / Life"],
        vocab: "give up (phrasal verb) 放弃 / to stop trying",
        structure: "The most important thing is to never..."
    }
];
// ==================== ROOTDATA ====================
const rootsData = [
    {
        root:"port",
        meaning:"to carry",
        example:"transport"
    },
    {
        root:"spect",
        meaning:"to look",
        example:"inspect"
    },
    {
        root:"dict",
        meaning:"to say",
        example:"predict"
    }
];



// --- 全局状态变量 ---
let currentCardIndex = 0;
let currentQuizIndex = 0;
let score = 0;

// --- DOM 元素获取 ---
const flashcard = document.getElementById('flashcard');
const wordEn = document.getElementById('word-en');
const wordPhonetic = document.getElementById('word-phonetic');
const wordCn = document.getElementById('word-cn');
const wordDef = document.getElementById('word-def');
const wordExample = document.getElementById('word-example');

const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
const nextBtn = document.getElementById('next-btn');
const qNumSpan = document.getElementById('q-num');
const scoreSpan = document.getElementById('score');

const sentenceCn = document.getElementById('sentence-cn');
const sentenceEn = document.getElementById('sentence-en');
const sentenceTags = document.getElementById('sentence-tags');
const vocabInfo = document.getElementById('vocab-info');
const structureInfo = document.getElementById('structure-info');
const rootContainer =
document.getElementById("rootContainer");



// --- 初始化函数 ---
function init() {
    setupTabs();
    setupFlashcards();
    loadQuiz();
    loadDailySentence();
}

// --- 标签页切换逻辑 ---
function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有激活状态
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

            // 添加当前激活状态
            tab.classList.add('active');
            const sectionId = 'section-' + tab.dataset.section;
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

// --- 闪卡逻辑 ---

function setupFlashcards() {
    renderCard();
    // 点击翻转
    flashcard.addEventListener('click', () => {
        flashcard.classList.toggle('flipped');
    });
}

function renderCard() {
    const data = vocabularyData[currentCardIndex];
    wordEn.textContent = data.en;
    wordPhonetic.textContent = data.phonetic;
    wordCn.textContent = data.cn;
    wordDef.textContent = data.def;
    wordExample.textContent = `"${data.example}"`;
    
    // 重置翻转状态
    flashcard.classList.remove('flipped');
}

function nextCard() {
    currentCardIndex = (currentCardIndex + 1) % vocabularyData.length;
    renderCard();
}

function prevCard() {
    currentCardIndex = (currentCardIndex - 1 + vocabularyData.length) % vocabularyData.length;
    renderCard();
}

// --- 测验逻辑 ---

function loadQuiz() {
    score = 0;
    currentQuizIndex = 0;
    scoreSpan.textContent = score;
    renderQuestion();
}

function renderQuestion() {
    const data = quizData[currentQuizIndex];
    quizQuestion.textContent = data.question;
    qNumSpan.textContent = currentQuizIndex + 1;
    
    // 清空选项并重新生成
    quizOptions.innerHTML = '';
    data.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-btn';
        btn.textContent = option;
        btn.dataset.index = index;
        btn.addEventListener('click', () => checkAnswer(index, btn));
        quizOptions.appendChild(btn);
    });

    // 隐藏反馈和下一题按钮
    quizFeedback.classList.add('hidden');
    nextBtn.classList.add('hidden');
}

function checkAnswer(selectedIndex, btn) {
    const data = quizData[currentQuizIndex];
    const buttons = quizOptions.querySelectorAll('.quiz-btn');
    
    // 禁用所有按钮
    buttons.forEach(b => b.disabled = true);

    // 显示反馈
    quizFeedback.classList.remove('hidden');
    
    if (selectedIndex === data.correctIndex) {
        score++;
        scoreSpan.textContent = score;
        btn.style.backgroundColor = '#4CAF50'; // 正确绿色
        quizFeedback.textContent = "✅ 正确！/ Correct!";
        quizFeedback.style.color = "#4CAF50";
    } else {
        btn.style.backgroundColor = '#f44336'; // 错误红色
        // 高亮正确答案
        buttons[data.correctIndex].style.backgroundColor = '#4CAF50';
        quizFeedback.textContent = "❌ 错误。/ Wrong.";
        quizFeedback.style.color = "#f44336";
    }

    // 显示下一题按钮
    nextBtn.classList.remove('hidden');
}

function nextQuestion() {
    currentQuizIndex++;
    if (currentQuizIndex < quizData.length) {
        renderQuestion();
    } else {
        // 测验结束
        quizQuestion.textContent = `🎉 测验完成！/ Quiz Finished! 你的得分 / Your Score: ${score}/${quizData.length}`;
        quizOptions.innerHTML = '';
        quizFeedback.classList.add('hidden');
        nextBtn.textContent = "重新开始 / Restart";
        nextBtn.onclick = () => {
            nextBtn.textContent = "下一题 / Next →";
            nextBtn.onclick = nextQuestion;
            loadQuiz();
        };
    }
}

// --- 每日一句逻辑 ---

function loadDailySentence() {
    const data = dailySentences[0]; // 默认加载第一句
    updateSentenceUI(data);
}

function newSentence() {
    // 随机获取一句
    const randomIndex = Math.floor(Math.random() * dailySentences.length);
    const data = dailySentences[randomIndex];
    updateSentenceUI(data);
}

function updateSentenceUI(data) {
    sentenceCn.textContent = data.cn;
    sentenceEn.textContent = data.en;
    vocabInfo.textContent = data.vocab;
    structureInfo.textContent = data.structure;
    
    // 更新标签
    sentenceTags.innerHTML = '';
    data.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        sentenceTags.appendChild(span);
    });
}
// ==================== ROOTDATA ====================
const rootsData = [
    {
        root:"port",
        meaning:"to carry",
        example:"transport"
    },
    {
        root:"spect",
        meaning:"to look",
        example:"inspect"
    },
    {
        root:"dict",
        meaning:"to say",
        example:"predict"
    }
];


const rootContainer =
document.getElementById("rootContainer");


rootsData.forEach(item=>{


    const card =
    document.createElement("div");


    card.className="root-card";


    card.innerHTML=`

    <div class="root-inner">

        <div class="root-front">
            <h2>${item.root}</h2>
        </div>


        <div class="root-back">
            <p>${item.meaning}</p>
            <p>${item.example}</p>
        </div>

    </div>

    `;


    card.onclick=function(){

        card.classList.toggle("flipped");

    };


    rootContainer.appendChild(card);


});


// 将函数暴露给全局作用域以供HTML中的onclick调用
window.nextCard = nextCard;
window.prevCard = prevCard;
window.nextQuestion = nextQuestion;
window.newSentence = newSentence;

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);

