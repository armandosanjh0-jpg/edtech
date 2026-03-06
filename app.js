const savedUser = JSON.parse(localStorage.getItem('aiQuestUser') || 'null');

const curriculum = [
  { day: 1, level: 'Beginner', theme: 'AI Foundations', core: 'How modern AI tools work', concept: 'prompting' },
  { day: 2, level: 'Beginner', theme: 'Prompt Basics', core: 'Clear instruction patterns', concept: 'prompt templates' },
  { day: 3, level: 'Beginner', theme: 'Research Skills', core: 'Fast market and topic research', concept: 'AI agents' },
  { day: 4, level: 'Beginner', theme: 'Output Quality', core: 'Hallucination checks', concept: 'verification loops' },
  { day: 5, level: 'Beginner', theme: 'Content Ops', core: 'Daily content production', concept: 'workflow batching' },
  { day: 6, level: 'Beginner', theme: 'Build Apps with Cursor', core: 'Ship your first AI app idea in Cursor', concept: 'cursor prompts' },
  { day: 7, level: 'Beginner', theme: 'Weekly Review', core: 'Score and reflect', concept: 'retrospective' },
  { day: 8, level: 'Intermediate', theme: 'Model Selection', core: 'Choosing the right model', concept: 'latency vs quality' },
  { day: 9, level: 'Intermediate', theme: 'MCP Servers I', core: 'Why MCP matters', concept: 'MCP servers' },
  { day: 10, level: 'Intermediate', theme: 'Tool Use', core: 'Agent + tools orchestration', concept: 'tool calling' },
  { day: 11, level: 'Intermediate', theme: 'Lovable MVP Sprint', core: 'Build and deploy product ideas in Lovable', concept: 'lovable prompts' },
  { day: 12, level: 'Intermediate', theme: 'Data Handling', core: 'Chunking and retrieval', concept: 'RAG basics' },
  { day: 13, level: 'Intermediate', theme: 'Memory Patterns', core: 'Session and long-term memory', concept: 'memory design' },
  { day: 14, level: 'Intermediate', theme: 'Weekly Review', core: 'Skill checkpoint', concept: 'gap analysis' },
  { day: 15, level: 'Intermediate', theme: 'MCP Servers II', core: 'Secure connector strategy', concept: 'MCP governance' },
  { day: 16, level: 'Intermediate', theme: 'Automation Reliability', core: 'Retries and alerts', concept: 'runbooks' },
  { day: 17, level: 'Intermediate', theme: 'AI Image Prompts', core: 'Generate high-quality images with strong prompt structure', concept: 'image prompting' },
  { day: 18, level: 'Intermediate', theme: 'AI Video Prompts', core: 'Create product videos with cinematic prompt templates', concept: 'video prompting' },
  { day: 19, level: 'Intermediate', theme: 'Openclaw Build', core: 'Implementing a useful flow', concept: 'Openclaw project' },
  { day: 20, level: 'Intermediate', theme: 'Team Adoption', core: 'Rollout and training', concept: 'change management' },
  { day: 21, level: 'Advanced', theme: 'AI Architecture', core: 'System-level design', concept: 'LLMOps' },
  { day: 22, level: 'Advanced', theme: 'Evaluation', core: 'Automated eval suites', concept: 'benchmarking' },
  { day: 23, level: 'Advanced', theme: 'Safety and Policy', core: 'Guardrails and policy', concept: 'governance' },
  { day: 24, level: 'Advanced', theme: 'MCP Servers III', core: 'Production MCP patterns', concept: 'MCP scaling' },
  { day: 25, level: 'Advanced', theme: 'Growth Systems', core: 'AI-driven growth loops', concept: 'experimentation' },
  { day: 26, level: 'Advanced', theme: 'Executive Reporting', core: 'KPI narrative and ROI', concept: 'stakeholder alignment' },
  { day: 27, level: 'Advanced', theme: 'Founder Execution', core: '0→1 AI product launch', concept: 'ship cycles' },
  { day: 28, level: 'Advanced', theme: 'Openclaw Advanced', core: 'Composable advanced flows', concept: 'Openclaw scaling' },
  { day: 29, level: 'Advanced', theme: 'Capstone Build', core: 'Build your AI operating system', concept: 'capstone' },
  { day: 30, level: 'Advanced', theme: 'Graduation Sprint', core: 'Final assessment + roadmap', concept: 'next 90 days' },
];

const state = {
  xp: 0,
  streak: Number(localStorage.getItem('aiQuestStreak') || 0),
  hearts: 5,
  gems: 20,
  chestReady: false,
  lessonsCompleted: 0,
  streakDate: localStorage.getItem('aiQuestLastDate') || null,
  questsClaimedToday: false,
  user: savedUser,
  lessons: [],
};

const skills = [
  { name: 'Prompt Crafting', level: 3 },
  { name: 'Automation Ops', level: 2 },
  { name: 'AI Research', level: 4 },
  { name: 'Multimodal Creation', level: 1 },
];

const sources = [
  { name: 'OpenAI', type: 'Models & APIs', url: 'https://platform.openai.com/' },
  { name: 'Anthropic', type: 'Claude docs', url: 'https://docs.anthropic.com/' },
  { name: 'Google AI Studio', type: 'Gemini tooling', url: 'https://aistudio.google.com/' },
  { name: 'Hugging Face', type: 'Models & datasets', url: 'https://huggingface.co/' },
  { name: 'MCP Official', type: 'Model Context Protocol', url: 'https://modelcontextprotocol.io/' },
  { name: 'OpenClaw GitHub', type: 'Openclaw ecosystem', url: 'https://github.com/' },
  { name: 'Cursor', type: 'AI app builder IDE', url: 'https://www.cursor.com/' },
  { name: 'Lovable', type: 'AI product builder', url: 'https://lovable.dev/' },
  { name: 'Leonardo AI', type: 'AI image generation', url: 'https://leonardo.ai/' },
  { name: 'Runway', type: 'AI video generation', url: 'https://runwayml.com/' },
];

const questConfig = [
  { id: 'one-lesson', label: 'Finish 1 lesson', reward: 10, target: () => 1, progress: () => state.lessonsCompleted },
  { id: 'two-lessons', label: 'Finish 2 lessons', reward: 15, target: () => 2, progress: () => state.lessonsCompleted },
  { id: 'earn-60xp', label: 'Earn 60 XP', reward: 20, target: () => 60, progress: () => state.xp },
];

const els = {
  xp: document.getElementById('xp-count'),
  streak: document.getElementById('streak-count'),
  hearts: document.getElementById('hearts-count'),
  gems: document.getElementById('gems-count'),
  lessons: document.getElementById('lessons'),
  quests: document.getElementById('quests'),
  claimQuest: document.getElementById('claim-quest'),
  chestProgress: document.getElementById('chest-progress'),
  openChest: document.getElementById('open-chest'),
  chestLog: document.getElementById('chest-log'),
  skills: document.getElementById('skills'),
  sources: document.getElementById('sources'),
  loginForm: document.getElementById('login-form'),
  logoutBtn: document.getElementById('logout-btn'),
  greeting: document.getElementById('user-greeting'),
  loginHint: document.getElementById('login-hint'),
  tutorMessage: document.getElementById('tutor-message'),
  refreshLessons: document.getElementById('refresh-lessons'),
  lessonDate: document.getElementById('lesson-date'),
  focusRole: document.getElementById('focus-role'),
  nextMilestone: document.getElementById('next-milestone'),
  motivationLine: document.getElementById('motivation-line'),
  curriculumDay: document.getElementById('curriculum-day'),
};

const todayKey = new Date().toISOString().slice(0, 10);
if (state.streakDate !== todayKey) state.questsClaimedToday = false;

function currentCurriculumDay() {
  return Math.min(Math.max(state.streak || 1, 1), 30);
}

function buildLessonsForDay(day, role) {
  const row = curriculum[day - 1];
  const roleTask = {
    executive: 'Executive brief: risk + KPI impact',
    entrepreneur: 'Founder sprint: ship a market-ready experiment with Cursor/Lovable',
    builder: 'Builder lab: implement with Cursor and polish with image/video AI prompts',
  };

  return [
    { title: `Day ${day}: ${row.theme}`, topic: row.core, duration: '7 min', xp: 25 },
    { title: `${row.concept} Drill`, topic: `Hands-on ${row.concept}`, duration: '8 min', xp: 30 },
    { title: 'Role Mission', topic: roleTask[role] || roleTask.builder, duration: '6 min', xp: 25 },
    { title: 'Reflection + Action', topic: 'Apply today in your real workflow', duration: '5 min', xp: 20 },
  ];
}

function gradeFromPercent(percent) {
  if (percent >= 100) return { tier: 'Gold', multiplier: 1.6, icon: '🥇' };
  if (percent >= 70) return { tier: 'Silver', multiplier: 1.3, icon: '🥈' };
  if (percent >= 40) return { tier: 'Bronze', multiplier: 1.0, icon: '🥉' };
  return { tier: 'Unranked', multiplier: 0, icon: '⬜' };
}

function getQuestGrade(quest) {
  const progress = quest.progress();
  const target = quest.target();
  const percent = Math.min(100, Math.round((progress / target) * 100));
  return { ...gradeFromPercent(percent), percent, progress, target };
}

function generateDailyLessons() {
  const role = state.user?.role || 'builder';
  const day = currentCurriculumDay();
  state.lessons = buildLessonsForDay(day, role);
  els.lessonDate.textContent = `Updated: ${new Date().toLocaleDateString()}`;
  if (els.curriculumDay) els.curriculumDay.textContent = `Day ${day}/30`;
}

function requireLogin() {
  if (state.user) return false;
  els.chestLog.textContent = 'Please log in first to use your personal AI tutor and start lessons.';
  return true;
}

function setTutorMessage() {
  if (!state.user) {
    els.tutorMessage.textContent = 'Log in and your tutor will generate your 30-day personalized curriculum.';
    return;
  }

  const day = currentCurriculumDay();
  const row = curriculum[day - 1];
  els.tutorMessage.textContent = `Hi ${state.user.username}, you are on Day ${day}/30 (${row.level}): ${row.theme}.`;
}

function setPersonalizationPanel() {
  els.focusRole.textContent = state.user ? state.user.role : 'Guest';
  const next = Math.ceil((state.xp + 1) / 50) * 50;
  els.nextMilestone.textContent = `${next} XP`;

  if (!state.user) {
    els.motivationLine.textContent = 'Log in to unlock the full beginner → advanced path.';
  } else if (state.lessonsCompleted >= 3) {
    els.motivationLine.textContent = 'Great pace. Finish one more lesson and close today strong.';
  } else if (state.streak >= 5) {
    els.motivationLine.textContent = `You are on a ${state.streak}-day streak. Stay consistent.`;
  } else {
    els.motivationLine.textContent = 'Small daily progress compounds into advanced mastery.';
  }
}

function setAuthUI() {
  const loggedIn = Boolean(state.user);
  els.loginForm.hidden = loggedIn;
  els.logoutBtn.hidden = !loggedIn;
  els.claimQuest.disabled = !loggedIn;
  els.openChest.disabled = !loggedIn || !state.chestReady;

  if (loggedIn) {
    els.greeting.textContent = `Welcome back, ${state.user.username}!`;
    els.loginHint.textContent = 'You are logged in. Complete lessons to move through the 30-day curriculum.';
  } else {
    els.greeting.textContent = 'Log in to save your daily progress and unlock rewards.';
    els.loginHint.textContent = 'Log in to start your 30-day AI mastery curriculum.';
  }
}

function updateUI() {
  els.xp.textContent = state.xp;
  els.streak.textContent = state.streak;
  els.hearts.textContent = state.hearts;
  els.gems.textContent = state.gems;

  const progress = state.xp % 50;
  els.chestProgress.style.width = `${state.chestReady ? 100 : (progress / 50) * 100}%`;

  setAuthUI();
  setTutorMessage();
  setPersonalizationPanel();
  renderQuests();
}

function completeLesson(lesson, button) {
  if (requireLogin() || button.dataset.done === 'yes') return;

  button.dataset.done = 'yes';
  button.textContent = 'Completed';
  button.disabled = true;

  state.xp += lesson.xp;
  state.lessonsCompleted += 1;

  if (!state.streakDate || state.streakDate !== todayKey) {
    state.streak += 1;
    state.streakDate = todayKey;
    localStorage.setItem('aiQuestStreak', String(state.streak));
    localStorage.setItem('aiQuestLastDate', todayKey);
    generateDailyLessons();
    renderLessons();
  }

  if (Math.floor(state.xp / 50) > Math.floor((state.xp - lesson.xp) / 50)) {
    state.chestReady = true;
    els.chestLog.textContent = '🎁 Chest unlocked! Open it for surprise rewards.';
  }

  if (state.lessonsCompleted % 2 === 0 && state.hearts < 5) state.hearts += 1;
  updateUI();
}

function renderLessons() {
  els.lessons.innerHTML = '';
  const template = document.getElementById('lesson-template');

  state.lessons.forEach((lesson) => {
    const clone = template.content.cloneNode(true);
    const title = clone.querySelector('h3');
    const detail = clone.querySelector('p');
    const tag = clone.querySelector('.tag');
    const button = clone.querySelector('button');

    title.textContent = lesson.title;
    const promptHint = lesson.title.toLowerCase().includes('prompt') ? ' • Use: role + context + constraints + output format' : '';
    detail.textContent = `${lesson.duration} • ${lesson.topic}${promptHint}`;
    tag.textContent = `+${lesson.xp} XP`;
    button.addEventListener('click', () => completeLesson(lesson, button));

    els.lessons.appendChild(clone);
  });
}

function renderSkills() {
  skills.forEach((skill) => {
    const card = document.createElement('article');
    card.className = 'skill-card';
    card.innerHTML = `<h3>${skill.name}</h3><p class="muted">Keep practicing to level up and unlock elite drills.</p><span class="skill-level">Level ${skill.level}</span>`;
    els.skills.appendChild(card);
  });
}

function renderSources() {
  sources.forEach((source) => {
    const link = document.createElement('a');
    link.className = 'source-item';
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.innerHTML = `<strong>${source.name}</strong><span>${source.type}</span>`;
    els.sources.appendChild(link);
  });
}

function renderQuests() {
  els.quests.innerHTML = '';
  questConfig.forEach((quest) => {
    const grade = getQuestGrade(quest);
    const item = document.createElement('li');
    item.className = `quest-item${grade.percent >= 100 ? ' done' : ''}`;

    item.innerHTML = `
      <span>${grade.icon} ${quest.label} (${grade.progress}/${grade.target})</span>
      <strong class="grade-pill ${grade.tier.toLowerCase()}">${grade.tier} • ${grade.percent}%</strong>
    `;
    els.quests.appendChild(item);
  });
}

function claimQuests() {
  if (requireLogin()) return;
  if (state.questsClaimedToday) return void (els.chestLog.textContent = 'You already claimed your quest rewards today.');

  const reward = questConfig.reduce((sum, quest) => {
    const grade = getQuestGrade(quest);
    return sum + Math.round(quest.reward * grade.multiplier);
  }, 0);

  if (!reward) return void (els.chestLog.textContent = 'Reach at least Bronze on one quest to claim rewards.');

  state.gems += reward;
  state.questsClaimedToday = true;
  els.chestLog.textContent = `Claimed ${reward} gems using rubric grades (Bronze/Silver/Gold).`;
  updateUI();
}

function openChest() {
  if (requireLogin() || !state.chestReady) return;
  const gemReward = Math.floor(Math.random() * 25) + 10;
  const bonusXp = Math.floor(Math.random() * 16) + 5;
  state.gems += gemReward;
  state.xp += bonusXp;
  state.chestReady = false;
  els.chestLog.textContent = `Chest opened: +${gemReward} gems and +${bonusXp} bonus XP!`;
  updateUI();
}

function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(els.loginForm);
  const username = String(formData.get('username') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const role = String(formData.get('role') || '').trim();

  if (!username || !email || !role) {
    els.chestLog.textContent = 'Please provide username, email, and role to log in.';
    return;
  }

  state.user = { username, email, role };
  localStorage.setItem('aiQuestUser', JSON.stringify(state.user));
  els.loginForm.reset();
  generateDailyLessons();
  renderLessons();
  els.chestLog.textContent = `Logged in as ${username}. Your 30-day curriculum is ready.`;
  updateUI();
}

function handleLogout() {
  localStorage.removeItem('aiQuestUser');
  state.user = null;
  generateDailyLessons();
  renderLessons();
  els.chestLog.textContent = 'You have logged out. Log in again to continue learning.';
  updateUI();
}

function handleRefreshLessons() {
  if (requireLogin()) return;
  generateDailyLessons();
  renderLessons();
  els.chestLog.textContent = 'Tutor refreshed your lessons for today in the 30-day program.';
  updateUI();
}

els.loginForm.addEventListener('submit', handleLogin);
els.logoutBtn.addEventListener('click', handleLogout);
els.claimQuest.addEventListener('click', claimQuests);
els.openChest.addEventListener('click', openChest);
els.refreshLessons.addEventListener('click', handleRefreshLessons);

generateDailyLessons();
renderLessons();
renderSkills();
renderSources();
updateUI();
