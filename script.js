'use strict';

const questions = [
  {
    question: 'ما عاصمة سلطنة عُمان؟',
    hint: 'تقع على ساحل بحر عُمان، وهي مركز الحكم والإدارة.',
    answers: ['صلالة', 'مسقط', 'نزوى', 'صحار'],
    correct: 1,
    explanation: 'مسقط هي عاصمة سلطنة عُمان.',
  },
  {
    question: 'في أي محافظة تقع مدينة صلالة؟',
    hint: 'تشتهر هذه المحافظة بموسم الخريف والطبيعة الخضراء.',
    answers: ['الداخلية', 'مسندم', 'ظفار', 'البريمي'],
    correct: 2,
    explanation: 'تقع صلالة في محافظة ظفار، التي تشتهر بموسم الخريف.',
  },
  {
    question: 'بماذا اشتهرت عُمان تاريخيًا في تجارة اللبان؟',
    hint: 'توجد مواقع أثرية مرتبطة بهذه التجارة في جنوب عُمان.',
    answers: ['اللبان العُماني', 'الحرير الصيني', 'القطن الهندي', 'الكاكاو'],
    correct: 0,
    explanation: 'كان اللبان العُماني سلعة مهمة في طرق التجارة القديمة.',
  },
  {
    question: 'ما اسم السلسلة الجبلية المعروفة في شمال عُمان؟',
    hint: 'تضم مناطق جبلية مرتفعة، منها جبل شمس.',
    answers: ['جبال الأطلس', 'جبال الحجر', 'جبال الألب', 'جبال طوروس'],
    correct: 1,
    explanation: 'جبال الحجر من أبرز السلاسل الجبلية في شمال عُمان.',
  },
  {
    question: 'أين تقع محافظة مسندم؟',
    hint: 'تقع في أقصى شمال عُمان وتطل على مضيق هرمز.',
    answers: ['جنوب عُمان', 'وسط عُمان', 'أقصى شمال عُمان', 'شرق ظفار'],
    correct: 2,
    explanation: 'تقع مسندم في أقصى شمال عُمان، وتتميز بموقعها البحري المهم.',
  },
];

const $ = (id) => document.getElementById(id);

const state = {
  character: 'explorer',
  index: 0,
  score: 0,
  answered: false,
  running: false,
};

const characterIcons = {
  explorer: '🧭',
  discoverer: '🔭',
  robot: '🤖',
};

const arabicNumber = (value) => Number(value).toLocaleString('ar-OM');

function updatePoints() {
  $('headerPoints').textContent = arabicNumber(state.score);
  $('gamePoints').textContent = arabicNumber(state.score);
}

function updateProgress() {
  const percent = (state.index / questions.length) * 100;

  $('progressBar').style.width = `${percent}%`;
  $('progressText').textContent = `${arabicNumber(Math.round(percent))}٪`;

  // يتحرك اللاعب من اليمين إلى اليسار مع تقدم السباق.
  $('racePlayer').style.right = `${percent}%`;
  $('racePlayer').style.transform = 'translateX(50%)';
  $('racePlayer').textContent = characterIcons[state.character];
}

function selectCharacter(character) {
  if (!characterIcons[character]) return;

  state.character = character;

  document.querySelectorAll('.character-card').forEach((card) => {
    const selected = card.dataset.character === character;

    card.classList.toggle('selected', selected);
    card.setAttribute('aria-pressed', String(selected));
  });

  $('racePlayer').textContent = characterIcons[character];
}

function renderQuestion() {
  const question = questions[state.index];

  state.answered = false;

  $('quizArea').hidden = false;
  $('resultArea').hidden = true;
  $('questionNumber').textContent = `السؤال ${arabicNumber(
    state.index + 1
  )} من ${arabicNumber(questions.length)}`;

  $('questionText').textContent = question.question;
  $('questionHint').textContent = question.hint;
  $('feedback').textContent = '';
  $('feedback').className = 'feedback';
  $('nextButton').hidden = true;

  const options = $('answerOptions');
  options.replaceChildren();

  question.answers.forEach((answer, index) => {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'answer-option';
    button.textContent = answer;
    button.addEventListener('click', () => chooseAnswer(index));

    options.appendChild(button);
  });

  updatePoints();
  updateProgress();
}

function chooseAnswer(selectedIndex) {
  if (!state.running || state.answered) return;

  state.answered = true;

  const question = questions[state.index];
  const buttons = [...$('answerOptions').querySelectorAll('button')];
  const feedback = $('feedback');

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === question.correct) {
      button.classList.add('correct');
    } else if (index === selectedIndex) {
      button.classList.add('incorrect');
    }
  });

  if (selectedIndex === question.correct) {
    state.score += 100;

    feedback.textContent = `إجابة صحيحة! +١٠٠ نقطة. ${question.explanation}`;
    feedback.className = 'feedback success';
  } else {
    feedback.textContent = `ليست الإجابة الصحيحة. ${question.explanation}`;
    feedback.className = 'feedback error';
  }

  updatePoints();

  $('nextButton').textContent =
    state.index === questions.length - 1 ? 'عرض النتيجة 🏆' : 'السؤال التالي ←';

  $('nextButton').hidden = false;
}

function nextQuestion() {
  if (!state.answered) return;

  if (state.index < questions.length - 1) {
    state.index += 1;
    renderQuestion();
  } else {
    finishGame();
  }
}

function finishGame() {
  state.running = false;

  $('quizArea').hidden = true;
  $('resultArea').hidden = false;
  $('progressBar').style.width = '100%';
  $('progressText').textContent = '١٠٠٪';
  $('racePlayer').style.right = '100%';

  const total = questions.length * 100;

  $('finalScore').textContent = arabicNumber(state.score);

  if (state.score === total) {
    $('resultTitle').textContent = 'إنجاز مذهل! 🌟';
    $('resultMessage').textContent =
      'أجبت عن جميع الأسئلة إجابة صحيحة. أنت بطل المعرفة!';
  } else if (state.score >= 300) {
    $('resultTitle').textContent = 'أحسنت يا مستكشف عُمان! 🏆';
    $('resultMessage').textContent =
      'لقد حققت نتيجة رائعة. واصل الاستكشاف وتعلم المزيد.';
  } else {
    $('resultTitle').textContent = 'انتهت الجولة! 🧭';
    $('resultMessage').textContent =
      'كل رحلة فرصة للتعلم. أعد السباق وحاول تحقيق نتيجة أفضل.';
  }

  try {
    const previousBest = Number(
      localStorage.getItem('sirajOmanBestScore') || 0
    );

    if (state.score > previousBest) {
      localStorage.setItem('sirajOmanBestScore', String(state.score));
    }
  } catch (error) {
    console.warn('تعذر حفظ أفضل نتيجة على هذا الجهاز.', error);
  }
}

function startGame() {
  state.index = 0;
  state.score = 0;
  state.answered = false;
  state.running = true;

  $('homeScreen').scrollIntoView({ behavior: 'smooth', block: 'start' });

  renderQuestion();
}

function replayGame() {
  startGame();
}

function showHelp() {
  const dialog = $('helpDialog');

  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    alert(
      'اختر شخصيتك، ثم ابدأ السباق. أجب عن الأسئلة واجمع النقاط حتى نهاية الجولة.'
    );
  }
}

document.querySelectorAll('.character-card').forEach((card) => {
  card.addEventListener('click', () => {
    selectCharacter(card.dataset.character);
  });
});

$('startButton').addEventListener('click', startGame);
$('exploreButton').addEventListener('click', () => {
  $('discoverySection').scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
});

$('nextButton').addEventListener('click', nextQuestion);
$('replayButton').addEventListener('click', replayGame);
$('helpButton').addEventListener('click', showHelp);

$('closeHelp').addEventListener('click', () => {
  $('helpDialog').close();
});

$('helpDialog').addEventListener('click', (event) => {
  if (event.target === $('helpDialog')) {
    $('helpDialog').close();
  }
});

selectCharacter('explorer');
updatePoints();
updateProgress();

// تفعيل بوابات الاستكشاف
document.querySelectorAll('.gate-card, .portal-card, .explore-card').forEach(gate => {
  gate.style.cursor = 'pointer';

  gate.addEventListener('click', () => {
    const title = gate.querySelector('h3, h2, .gate-title, .portal-title');
    const name = title ? title.textContent.trim() : gate.textContent.trim();

    const details = {
      'التاريخ والحضارة': 'اكتشف القلاع والحصون والحكايات العُمانية العريقة.',
      'المحافظات والمعالم': 'انطلق في رحلة عبر محافظات سلطنة عُمان ومعالمها.',
      'الطبيعة والتراث': 'تعرّف على الجبال والأودية والشواطئ والتقاليد الأصيلة.',
      'عُمان والمستقبل': 'اكتشف إنجازات عُمان وطموحاتها نحو المستقبل.'
    };

    const description = Object.entries(details).find(([key]) => name.includes(key));

    alert((description ? description[1] : name) + '\n\nترقّب المزيد من المغامرات في هذه البوابة!');
  });
});


/* تفعيل بوابات الاستكشاف في سراج عُمان */
document.querySelectorAll('.discovery-card').forEach((gate) => {
  gate.style.cursor = 'pointer';

  gate.addEventListener('click', () => {
    const title = gate.querySelector('h3')?.textContent.trim();

    const adventures = {
      'التاريخ والحضارة': {
        emoji: '🏛️',
        description: 'استكشف قلاع عُمان وحصونها، واكتشف أسرار الحضارة العُمانية.',
        challenge: 'تحدٍّ: لماذا بُنيت القلاع والحصون قديمًا؟',
        answer: 'للدفاع والحماية ومراقبة الطرق والمناطق المهمة.'
      },
      'المحافظات والمعالم': {
        emoji: '🗺️',
        description: 'انطلق في رحلة بين محافظات عُمان، من الجبال الشامخة إلى الشواطئ الساحرة.',
        challenge: 'تحدٍّ: كم عدد محافظات سلطنة عُمان؟',
        answer: '١١ محافظة.'
      }
    };

    const adventure = adventures[title];

    if (adventure) {
      alert(
        `${adventure.emoji} ${title}\n\n` +
        `${adventure.description}\n\n` +
        `${adventure.challenge}\n\n` +
        `الإجابة: ${adventure.answer}`
      );
    } else {
      alert(`${title}\n\nاستعد لمغامرة جديدة في سِراج عُمان!`);
    }
  });
});


/* تفعيل بوابات الاستكشاف */
document.querySelectorAll('.discovery-card').forEach((gate) => {
  gate.addEventListener('click', () => {
    const title = gate.querySelector('h3').textContent.trim();

    const adventures = {
      'التاريخ والحضارة':
        '🏛️ اكتشف قلاع عُمان وحصونها وشواهدها التاريخية!',
      'المحافظات والمعالم':
        '🗺️ عُمان تضم ١١ محافظة، ولكل محافظة معالمها المميزة!',
      'الطبيعة والتراث':
        '🌿 اكتشف الجبال والأودية والشواطئ والحرف العُمانية الأصيلة!',
      'عُمان والمستقبل':
        '🔬 انطلق لاكتشاف الابتكار والعلوم وطموحات عُمان المستقبلية!'
    };

    alert(
      (adventures[title] || '✨ مرحبًا بك في سِراج عُمان!') +
      '\n\nاستعد لمغامرة جديدة في رحلتك المعرفية.'
    );
  });
});


/* ===== نظام تحديات التاريخ والحضارة ===== */
(() => {
  const challenge = document.getElementById('historyChallenge');
  if (!challenge || challenge.dataset.initialized === 'true') return;
  challenge.dataset.initialized = 'true';

  const questions = [
    {
      q: 'ما اسم الحصن التاريخي الشهير في ولاية نزوى؟',
      a: ['حصن نزوى', 'قلعة بهلاء', 'حصن جبرين'],
      correct: 0,
      info: 'حصن نزوى من أبرز المعالم التاريخية في سلطنة عُمان.'
    },
    {
      q: 'أين تقع قلعة بهلاء التاريخية؟',
      a: ['محافظة ظفار', 'محافظة الداخلية', 'محافظة مسندم'],
      correct: 1,
      info: 'تقع قلعة بهلاء في محافظة الداخلية، وهي مدرجة ضمن قائمة التراث العالمي.'
    },
    {
      q: 'ما الوظيفة الأساسية لكثير من القلاع والحصون قديمًا؟',
      a: ['الدفاع والحماية', 'إقامة السباقات', 'زراعة المحاصيل داخل الأبراج'],
      correct: 0,
      info: 'استُخدمت القلاع والحصون للدفاع والحماية ومراقبة المناطق والطرق.'
    },
    {
      q: 'ما اسم السفينة العُمانية التقليدية التي ارتبطت بالتجارة البحرية؟',
      a: ['المركب الجليدي', 'الداو', 'القطار'],
      correct: 1,
      info: 'ارتبطت السفن التقليدية المعروفة بالداو بالتجارة والملاحة البحرية في المنطقة.'
    },
    {
      q: 'ما المدينة العُمانية المشهورة بصناعة الفخار؟',
      a: ['بهلاء', 'خصب', 'صلالة'],
      correct: 0,
      info: 'تشتهر ولاية بهلاء بصناعة الفخار والحرف التقليدية.'
    }
  ];

  const questionEl = document.getElementById('historyQuestion');
  const answersEl = document.getElementById('historyAnswers');
  const pointsEl = document.getElementById('historyPoints');
  const numberEl = document.getElementById('historyQuestionNumber');
  const feedbackEl = document.getElementById('historyFeedback');
  const nextBtn = document.getElementById('historyNext');
  const resultEl = document.getElementById('historyResult');
  const finalScoreEl = document.getElementById('historyFinalScore');
  const restartBtn = document.getElementById('historyRestart');
  const closeBtn = document.getElementById('historyClose');

  if (![questionEl, answersEl, pointsEl, numberEl, feedbackEl,
        nextBtn, resultEl, finalScoreEl, restartBtn, closeBtn].every(Boolean)) {
    console.error('بعض عناصر شاشة التحديات غير موجودة في index.html.');
    return;
  }

  let current = 0;
  let points = 0;
  let answered = false;

  function showQuestion() {
    answered = false;
    const item = questions[current];
    questionEl.textContent = item.q;
    numberEl.textContent = current + 1;
    pointsEl.textContent = points;
    feedbackEl.textContent = '';
    nextBtn.hidden = true;
    resultEl.hidden = true;
    answersEl.hidden = false;
    answersEl.replaceChildren();

    item.a.forEach((answer, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = answer;
      button.style.cssText =
        'padding:14px;border:2px solid #d7e2e8;border-radius:12px;' +
        'background:#f7fafc;color:#173b54;cursor:pointer;font-size:16px';
      button.addEventListener('click', () => chooseAnswer(index, button));
      answersEl.appendChild(button);
    });
  }

  function chooseAnswer(index, selectedButton) {
    if (answered) return;
    answered = true;

    const item = questions[current];
    const buttons = [...answersEl.querySelectorAll('button')];

    buttons.forEach(button => {
      button.disabled = true;
      button.style.cursor = 'default';
    });

    if (index === item.correct) {
      points += 10;
      selectedButton.style.background = '#d9f7e8';
      selectedButton.style.borderColor = '#168653';
      feedbackEl.textContent = '✅ إجابة صحيحة! +10 نقاط. ' + item.info;
    } else {
      selectedButton.style.background = '#ffe5e5';
      selectedButton.style.borderColor = '#c93b3b';
      buttons[item.correct].style.background = '#d9f7e8';
      buttons[item.correct].style.borderColor = '#168653';
      feedbackEl.textContent = '💡 ليست الإجابة الصحيحة. ' + item.info;
    }

    pointsEl.textContent = points;
    nextBtn.textContent =
      current === questions.length - 1 ? 'عرض النتيجة 🏅' : 'السؤال التالي ←';
    nextBtn.hidden = false;
  }

  nextBtn.addEventListener('click', () => {
    if (!answered) return;

    if (current < questions.length - 1) {
      current++;
      showQuestion();
    } else {
      questionEl.textContent = 'اكتملت مغامرة التاريخ والحضارة!';
      answersEl.hidden = true;
      nextBtn.hidden = true;
      resultEl.hidden = false;
      numberEl.textContent = questions.length;
      finalScoreEl.textContent =
        `حصلت على ${points} من ${questions.length * 10} نقطة.`;

      try {
        const previous = Number(localStorage.getItem('sirajHistoryBest') || 0);
        if (points > previous) {
          localStorage.setItem('sirajHistoryBest', String(points));
        }
      } catch (error) {
        console.info('تعذر حفظ أفضل نتيجة على هذا الجهاز.');
      }
    }
  });

  function startChallenge() {
    current = 0;
    points = 0;
    challenge.hidden = false;
    resultEl.hidden = true;
    showQuestion();
    challenge.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  restartBtn.addEventListener('click', startChallenge);

  closeBtn.addEventListener('click', () => {
    challenge.hidden = true;
  });

  document.querySelectorAll('.discovery-card').forEach(card => {
    const title = card.querySelector('h3');
    if (!title || !title.textContent.includes('التاريخ والحضارة')) return;

    card.addEventListener('click', event => {
      event.preventDefault();
      startChallenge();
    });
  });
})();


/* ===== تحديات المحافظات والمعالم ===== */
(() => {
  const cards = [...document.querySelectorAll('.discovery-card')];
  const card = cards.find(c =>
    c.querySelector('h3')?.textContent.includes('المحافظات والمعالم')
  );

  const challenge = document.getElementById('historyChallenge');
  if (!card || !challenge) return;

  card.addEventListener('click', event => {
    event.preventDefault();

    const title = document.getElementById('historyQuestion');
    const answers = document.getElementById('historyAnswers');
    const points = document.getElementById('historyPoints');
    const number = document.getElementById('historyQuestionNumber');
    const feedback = document.getElementById('historyFeedback');
    const next = document.getElementById('historyNext');
    const result = document.getElementById('historyResult');
    const finalScore = document.getElementById('historyFinalScore');
    const restart = document.getElementById('historyRestart');

    const questions = [
      { q: 'كم عدد محافظات سلطنة عُمان؟',
        a: ['9 محافظات', '11 محافظة', '13 محافظة'],
        correct: 1, info: 'تتكون سلطنة عُمان من 11 محافظة.' },
      { q: 'في أي محافظة تقع ولاية صلالة؟',
        a: ['ظفار', 'الداخلية', 'مسندم'],
        correct: 0, info: 'تقع صلالة في محافظة ظفار جنوب سلطنة عُمان.' },
      { q: 'في أي محافظة تقع ولاية نزوى؟',
        a: ['شمال الباطنة', 'الداخلية', 'الوسطى'],
        correct: 1, info: 'نزوى إحدى ولايات محافظة الداخلية.' },
      { q: 'ما المحافظة التي تقع في أقصى شمال سلطنة عُمان؟',
        a: ['مسندم', 'ظفار', 'جنوب الشرقية'],
        correct: 0, info: 'تقع محافظة مسندم في أقصى شمال السلطنة.' },
      { q: 'في أي محافظة تقع ولاية صحار؟',
        a: ['جنوب الباطنة', 'شمال الباطنة', 'البريمي'],
        correct: 1, info: 'صحار هي مركز محافظة شمال الباطنة.' }
    ];

    let current = 0;
    let score = 0;
    let answered = false;

    challenge.hidden = false;
    result.hidden = true;
    answers.hidden = false;
    challenge.scrollIntoView({ behavior: 'smooth', block: 'start' });

    function showQuestion() {
      answered = false;
      const item = questions[current];
      title.textContent = item.q;
      number.textContent = current + 1;
      points.textContent = score;
      feedback.textContent = '';
      next.hidden = true;
      result.hidden = true;
      answers.hidden = false;
      answers.replaceChildren();

      item.a.forEach((text, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = text;
        button.style.cssText =
          'padding:14px;border:2px solid #d7e2e8;border-radius:12px;' +
          'background:#f7fafc;color:#173b54;cursor:pointer;font-size:16px';

        button.addEventListener('click', () => {
          if (answered) return;
          answered = true;

          const buttons = [...answers.querySelectorAll('button')];
          buttons.forEach(b => b.disabled = true);

          if (index === item.correct) {
            score += 10;
            button.style.background = '#d9f7e8';
            feedback.textContent = '✅ إجابة صحيحة! +10 نقاط. ' + item.info;
          } else {
            button.style.background = '#ffe5e5';
            buttons[item.correct].style.background = '#d9f7e8';
            feedback.textContent = '💡 ليست الإجابة الصحيحة. ' + item.info;
          }

          points.textContent = score;
          next.textContent = current === questions.length - 1
            ? 'عرض النتيجة 🏅' : 'السؤال التالي ←';
          next.hidden = false;
        });

        answers.appendChild(button);
      });
    }

    next.onclick = () => {
      if (!answered) return;

      if (current < questions.length - 1) {
        current++;
        showQuestion();
      } else {
        title.textContent = 'أكملت مغامرة المحافظات والمعالم!';
        answers.hidden = true;
        next.hidden = true;
        result.hidden = false;
        number.textContent = questions.length;
        finalScore.textContent =
          `نتيجتك: ${score} من ${questions.length * 10} نقطة.`;
      }
    };

    restart.onclick = showQuestion;
    showQuestion();
  });
})();

/* ===== سراج عُمان: تفعيل بوابتي الطبيعة والمستقبل ===== */
(() => {
  const challenge = document.getElementById('historyChallenge');
  if (!challenge) {
    console.error('لم يتم العثور على شاشة التحديات.');
    return;
  }

  const $ = id => document.getElementById(id);

  const ui = {
    question: $('historyQuestion'),
    answers: $('historyAnswers'),
    points: $('historyPoints'),
    number: $('historyQuestionNumber'),
    feedback: $('historyFeedback'),
    next: $('historyNext'),
    result: $('historyResult'),
    finalScore: $('historyFinalScore'),
    restart: $('historyRestart'),
    close: $('historyClose')
  };

  if (Object.values(ui).some(element => !element)) {
    console.error('تحققي من وجود عناصر شاشة التحديات في index.html.');
    return;
  }

  const portals = {
    'الطبيعة والتراث': [
      {
        q: 'بماذا تتميز الأودية العُمانية؟',
        a: ['بالمياه والمناظر الطبيعية المتنوعة', 'بالثلوج الدائمة', 'بالأنهار الجليدية'],
        c: 0,
        info: 'تتميز أودية عُمان بتنوع تضاريسها وبركها المائية ومناظرها الطبيعية.'
      },
      {
        q: 'ما اسم الشجرة التي يُستخرج منها اللبان؟',
        a: ['شجرة النخيل', 'شجرة اللبان', 'شجرة الزيتون'],
        c: 1,
        info: 'يُستخرج اللبان من أشجار اللبان، التي تشتهر بها محافظة ظفار.'
      },
      {
  q: 'ما اسم المادة العطرية التي تشتهر بها محافظة ظفار؟',
  a: ['اللبان', 'الفحم', 'القطن'],
  c: 0,
  info: 'يشتهر اللبان الظفاري بتاريخ عريق في التجارة والاستخدامات التقليدية.'
},
      {
        q: 'ما السلوك الأفضل عند زيارة منطقة طبيعية؟',
        a: ['ترك النفايات خلفنا', 'إتلاف النباتات', 'المحافظة على المكان وعدم ترك النفايات'],
        c: 2,
        info: 'حماية الطبيعة مسؤولية الجميع، ويجب ترك المواقع نظيفة.'
      },
      {
        q: 'أي بيئة طبيعية تشتهر بها محافظة ظفار خلال موسم الخريف؟',
        a: ['المروج الخضراء والضباب', 'الجليد الدائم', 'الغابات القطبية'],
        c: 0,
        info: 'يتميز موسم الخريف في ظفار بانخفاض الحرارة نسبيًا والضباب واخضرار الطبيعة.'
      }
    ],

    'عُمان والمستقبل': [
      {
        q: 'ما المصدر الذي ينتج الكهرباء من أشعة الشمس؟',
        a: ['الألواح الشمسية', 'الفحم الخشبي فقط', 'مياه البحر دون أجهزة'],
        c: 0,
        info: 'تحول الألواح الشمسية ضوء الشمس إلى طاقة كهربائية.'
      },
      {
        q: 'ما المقصود بالاستدامة؟',
        a: ['استهلاك الموارد دون تفكير', 'تلبية احتياجات الحاضر مع الحفاظ على موارد المستقبل', 'التخلص من جميع الموارد'],
        c: 1,
        info: 'تهدف الاستدامة إلى استخدام الموارد بمسؤولية للأجيال الحالية والقادمة.'
      },
      {
        q: 'كيف تساعد التقنية في التعليم؟',
        a: ['تمنع البحث والتعلم', 'تتيح مصادر وأدوات تعلم متنوعة', 'تجعل التحقق من المعلومات غير ضروري'],
        c: 1,
        info: 'توفر التقنية أدوات تفاعلية ومصادر متعددة، مع أهمية التحقق من المعلومات.'
      },
      {
        q: 'أي سلوك يعزز الابتكار؟',
        a: ['رفض جميع الأفكار الجديدة', 'تكرار الحلول دون تفكير', 'تجربة أفكار جديدة وتقييم نتائجها'],
        c: 2,
        info: 'يقوم الابتكار على التفكير والتجربة والتعلم من النتائج.'
      },
      {
        q: 'كيف نستخدم الذكاء الاصطناعي بمسؤولية؟',
        a: ['نصدق كل نتيجة دون تحقق', 'نتحقق من المعلومات ونحافظ على الخصوصية', 'نشارك كلمات المرور معه'],
        c: 1,
        info: 'من الاستخدام المسؤول التحقق من المخرجات وحماية البيانات الشخصية.'
      }
    ]
  };

  let activeQuestions = [];
  let activeTitle = '';
  let current = 0;
  let score = 0;
  let answered = false;

  function startPortal(name) {
    activeTitle = name;
    activeQuestions = portals[name];
    current = 0;
    score = 0;
    answered = false;

    challenge.hidden = false;
    ui.result.hidden = true;
    ui.answers.hidden = false;

    const heading = challenge.querySelector('h2');
    if (heading) heading.textContent = '🌟 مغامرة ' + name;

    showQuestion();
    challenge.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showQuestion() {
    const item = activeQuestions[current];
    answered = false;

    ui.question.textContent = item.q;
    ui.number.textContent = current + 1;
    ui.points.textContent = score;
    ui.feedback.textContent = '';
    ui.next.hidden = true;
    ui.result.hidden = true;
    ui.answers.hidden = false;
    ui.answers.replaceChildren();

    item.a.forEach((answer, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = answer;
      button.style.cssText =
        'padding:14px;border:2px solid #d7e2e8;border-radius:12px;' +
        'background:#f7fafc;color:#173b54;cursor:pointer;font-size:16px';

      button.addEventListener('click', () => chooseAnswer(index, button));
      ui.answers.appendChild(button);
    });
  }

  function chooseAnswer(index, selected) {
    if (answered) return;
    answered = true;

    const item = activeQuestions[current];
    const buttons = [...ui.answers.querySelectorAll('button')];

    buttons.forEach(button => {
      button.disabled = true;
      button.style.cursor = 'default';
    });

    if (index === item.c) {
      score += 10;
      selected.style.background = '#d9f7e8';
      selected.style.borderColor = '#168653';
      ui.feedback.textContent = '✅ إجابة صحيحة! +10 نقاط. ' + item.info;
    } else {
      selected.style.background = '#ffe5e5';
      selected.style.borderColor = '#c93b3b';
      buttons[item.c].style.background = '#d9f7e8';
      buttons[item.c].style.borderColor = '#168653';
      ui.feedback.textContent = '💡 ليست الإجابة الصحيحة. ' + item.info;
    }

    ui.points.textContent = score;
    ui.next.textContent =
      current === activeQuestions.length - 1
        ? 'عرض النتيجة 🏅'
        : 'السؤال التالي ←';
    ui.next.hidden = false;
  }

  function showResult() {
    ui.question.textContent = 'أكملت مغامرة ' + activeTitle + '!';
    ui.answers.hidden = true;
    ui.next.hidden = true;
    ui.result.hidden = false;
    ui.number.textContent = activeQuestions.length;
    ui.finalScore.textContent =
      `نتيجتك: ${score} من ${activeQuestions.length * 10} نقطة.`;

    try {
      const key = 'sirajBest_' + activeTitle;
      const previous = Number(localStorage.getItem(key) || 0);

      if (score > previous) {
        localStorage.setItem(key, String(score));
      }
    } catch (error) {
      // تستمر اللعبة حتى إذا تعذر حفظ النتيجة.
    }
  }

  ui.next.addEventListener('click', () => {
    if (!answered) return;

    if (current < activeQuestions.length - 1) {
      current++;
      showQuestion();
    } else {
      showResult();
    }
  });

  ui.restart.addEventListener('click', () => {
    if (!activeQuestions.length) return;
    startPortal(activeTitle);
  });

  ui.close.addEventListener('click', () => {
    challenge.hidden = true;
  });

  // التقاط النقر قبل أي مستمع قديم على البطاقة.
  document.addEventListener('click', event => {
    const card = event.target.closest('.discovery-card');
    if (!card) return;

    const heading = card.querySelector('h3');
    if (!heading) return;

    const name = heading.textContent.trim();
    if (!portals[name]) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const label = card.querySelector('.coming-label');
    if (label) label.remove();

    startPortal(name);
  }, true);

  // إزالة عبارة قيد التطوير من البوابتين اللتين اكتملتا.
  document.querySelectorAll('.discovery-card').forEach(card => {
    const heading = card.querySelector('h3');
    if (heading && portals[heading.textContent.trim()]) {
      card.querySelector('.coming-label')?.remove();
    }
  });
})();



/* ===== نظام إنجازات سِراج عُمان ===== */
(function () {
  const STORAGE_KEY = "sirajOmanAchievementsV1";

  const portalNames = [
    "التاريخ والحضارة",
    "المحافظات والمعالم",
    "الطبيعة والتراث",
    "عُمان والمستقبل"
  ];

  let saved = {};

  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (error) {
    saved = {};
  }

  saved.completed = saved.completed || {};
  saved.bestScores = saved.bestScores || {};

  let activePortal = "";
  let previousResult = "";

  const result = document.getElementById("historyResult");
  const finalScore = document.getElementById("historyFinalScore");

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch (error) {
      console.warn("تعذر حفظ الإنجازات على هذا الجهاز.");
    }
  }

  function renderAchievements() {
    const total = Object.values(saved.bestScores)
      .reduce((sum, score) => sum + (Number(score) || 0), 0);

    
    const totalElement = document.getElementById("sirajTotalPoints");
    if (totalElement) totalElement.textContent = total;
    
    // تحديث مسار مغامرة سِراج عُمان
    const completedCount = portalNames.filter(
      name => !!saved.completed[name]
    ).length;

    const progressCount = document.getElementById("journeyProgressCount");
    const progressBar = document.getElementById("journeyProgressBar");
    const progressFill = document.getElementById("journeyProgressFill");
    const progressMessage = document.getElementById("journeyProgressMessage");

    if (progressCount) {
      progressCount.textContent =
        `${completedCount.toLocaleString("ar")} من ٤ بوابات مكتملة`;
    }

    if (progressFill) {
      progressFill.style.width = `${(completedCount / 4) * 100}%`;
    }

    if (progressBar) {
      progressBar.setAttribute("aria-valuenow", completedCount);
    }

    const journeyGateNames = [
      "التاريخ والحضارة",
      "المحافظات والمعالم",
      "الطبيعة والتراث",
      "عُمان والمستقبل"
    ];

    journeyGateNames.forEach((name, index) => {
      const gate = document.getElementById(`journeyGate${index + 1}`);
      if (!gate) return;

      const completed = !!saved.completed[name];
      gate.classList.toggle("completed", completed);

      const status = gate.querySelector(".journey-gate-status");
      if (status) {
        status.textContent = completed
          ? "مكتملة ✓"
          : "بانتظار الاكتشاف";
      }
    });

    if (progressMessage) {
      if (completedCount === 4) {
        progressMessage.textContent =
          "🏆 رائع! أكملت جميع البوابات الأربع. أنت سفير عُمان!";
      } else if (completedCount > 0) {
        progressMessage.textContent =
          `✨ أنجزت ${completedCount.toLocaleString("ar")} من ٤ بوابات. واصل المغامرة لاكتشاف المزيد!`;
      } else {
        progressMessage.textContent =
          "🚀 انطلق في أول تحدٍّ لتبدأ رحلتك!";
      }
    }

    const headerPoints = document.getElementById("headerPoints");
if (headerPoints) {
  headerPoints.textContent = total.toLocaleString("ar");
}

    const explorer = document.getElementById("badgeExplorer");
    const governorates = document.getElementById("badgeGovernorates");
    const ambassador = document.getElementById("badgeAmbassador");

    function updateBadge(element, unlocked) {
      if (!element) return;

      element.classList.toggle("locked", !unlocked);
      element.classList.toggle("unlocked", unlocked);

      const status = element.querySelector(".badge-status");
      if (status) {
        status.textContent = unlocked
          ? "🏆 تم اكتسابه!"
          : "🔒 لم يُكتسب بعد";
      }
    }

    updateBadge(explorer, Object.keys(saved.completed).length > 0);

    updateBadge(
      governorates,
      !!saved.completed["المحافظات والمعالم"]
    );

    updateBadge(
      ambassador,
      portalNames.every(name => !!saved.completed[name])
    );
  }

  function detectPortal(card) {
    const heading = card.querySelector("h3");
    return heading ? heading.textContent.trim() : "";
  }

  document.addEventListener("click", function (event) {
    const card = event.target.closest(".discovery-card");

    if (card) {
      const name = detectPortal(card);
      if (portalNames.includes(name)) {
        activePortal = name;
        previousResult = "";
      }
    }

    if (event.target.closest("#historyRestart")) {
      previousResult = "";
    }
  }, true);

  function checkChallengeResult() {
    if (!result || !finalScore || !activePortal) return;

    const isVisible =
      !result.hidden &&
      result.getAttribute("aria-hidden") !== "true" &&
      getComputedStyle(result).display !== "none";

    if (!isVisible) {
      previousResult = "";
      return;
    }

    const resultText = result.textContent.trim();
    if (!resultText || resultText === previousResult) return;

    previousResult = resultText;

    const scoreMatch = finalScore.textContent.match(/-?\d+/);
    const score = scoreMatch ? Number(scoreMatch[0]) : 0;

    saved.completed[activePortal] = true;

    saved.bestScores[activePortal] = Math.max(
      Number(saved.bestScores[activePortal]) || 0,
      score
    );

    saveProgress();
    renderAchievements();
  }

  if (result) {
    new MutationObserver(checkChallengeResult).observe(result, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
  }

  if (finalScore) {
    new MutationObserver(checkChallengeResult).observe(finalScore, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  renderAchievements();
})();
