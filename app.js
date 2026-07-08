const rooms = [
  { id: 'ceo', name: 'CEO soba', purpose: 'Strategija i odluke' },
  { id: 'dev', name: 'Dev Room', purpose: 'Kod, testovi i deploy' },
  { id: 'research', name: 'Research', purpose: 'Istraživanje i analiza' },
  { id: 'marketing', name: 'Marketing', purpose: 'Content, SEO i kampanje' },
  { id: 'finance', name: 'Finance', purpose: 'Troškovi i KPI' },
  { id: 'ops', name: 'Operations', purpose: 'Automacije i alati' },
];

const defaultAgents = [
  { id: 'alpha', name: 'Alpha', role: 'CEO Agent', room: 'ceo', avatar: '🧠', cpu: 34, ram: 46, focus: 82, task: 'Razrađuje plan za AI Sims OS', memory: ['Vlasnik želi Sims-style UI', 'Prioritet: launch bez ZIP-a'], chat: [] },
  { id: 'coder', name: 'Coder', role: 'Developer Agent', room: 'dev', avatar: '👨‍💻', cpu: 58, ram: 64, focus: 71, task: 'Gradi frontend simulaciju', memory: ['Stack: HTML/CSS/JS sada, React kasnije', 'Treba dodati Ollama bridge'], chat: [] },
  { id: 'researcher', name: 'Researcher', role: 'Research Agent', room: 'research', avatar: '🔎', cpu: 24, ram: 38, focus: 88, task: 'Prikuplja ideje za agente i sobe', memory: ['Agenti trebaju delegirati posao', 'Vizual: Sims + RimWorld'], chat: [] },
  { id: 'writer', name: 'Writer', role: 'Marketing Agent', room: 'marketing', avatar: '✍️', cpu: 41, ram: 35, focus: 77, task: 'Piše opis projekta za GitHub', memory: ['Ton: startup/open-source', 'Objasniti lokalni AI'], chat: [] },
  { id: 'cfo', name: 'CFO', role: 'Finance Agent', room: 'finance', avatar: '💰', cpu: 19, ram: 28, focus: 65, task: 'Procjenjuje trošak lokalnog i cloud rada', memory: ['Lokalni modeli smanjuju API trošak'], chat: [] },
  { id: 'opsbot', name: 'OpsBot', role: 'Automation Agent', room: 'ops', avatar: '⚙️', cpu: 52, ram: 49, focus: 73, task: 'Planira integracije: GitHub, Gmail, Telegram', memory: ['Plugin sustav je faza 2'], chat: [] },
];

let state = JSON.parse(localStorage.getItem('aiSimsState') || 'null') || {
  agents: defaultAgents,
  selected: 'alpha',
  running: false,
  minute: 9 * 60,
  day: 1,
  tasks: [
    'Dodati lokalni Ollama bridge',
    'Napraviti pravi drag-and-drop grid',
    'Dodati task board',
  ]
};

const house = document.getElementById('house');
const agentList = document.getElementById('agentList');
const tickBtn = document.getElementById('tickBtn');
const addTaskBtn = document.getElementById('addTaskBtn');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const emptyInspector = document.getElementById('emptyInspector');
const agentInspector = document.getElementById('agentInspector');

function save() {
  localStorage.setItem('aiSimsState', JSON.stringify(state));
}

function selectedAgent() {
  return state.agents.find(a => a.id === state.selected);
}

function timeLabel() {
  const h = Math.floor(state.minute / 60) % 24;
  const m = state.minute % 60;
  return `Dan ${state.day} · ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function positionFor(index) {
  const positions = [
    [22, 78], [118, 98], [204, 72], [78, 154], [176, 150]
  ];
  return positions[index % positions.length];
}

function renderHouse() {
  house.innerHTML = '';
  rooms.forEach(room => {
    const el = document.createElement('div');
    el.className = 'room';
    el.dataset.room = room.id;
    el.innerHTML = `<div class="roomHeader"><div><div class="roomTitle">${room.name}</div><div class="roomPurpose">${room.purpose}</div></div><div>▦</div></div>`;

    el.addEventListener('dragover', e => e.preventDefault());
    el.addEventListener('drop', e => {
      const id = e.dataTransfer.getData('agent');
      const agent = state.agents.find(a => a.id === id);
      if (agent) {
        agent.room = room.id;
        agent.memory.unshift(`Premješten u ${room.name}`);
        state.selected = id;
        save();
        render();
      }
    });

    state.agents.filter(a => a.room === room.id).forEach((agent, i) => {
      const [left, top] = positionFor(i);
      const a = document.createElement('div');
      a.className = 'agent';
      a.draggable = true;
      a.style.left = `${left}px`;
      a.style.top = `${top}px`;
      a.innerHTML = `<div class="bubble">${agent.task.split(' ').slice(0, 5).join(' ')}...</div><div class="avatar">${agent.avatar}</div><div class="agentNameSmall">${agent.name}</div>`;
      a.addEventListener('dragstart', e => e.dataTransfer.setData('agent', agent.id));
      a.addEventListener('click', () => { state.selected = agent.id; save(); render(); });
      el.appendChild(a);
    });

    house.appendChild(el);
  });
}

function renderList() {
  agentList.innerHTML = '';
  state.agents.forEach(agent => {
    const item = document.createElement('div');
    item.className = 'agentListItem';
    item.innerHTML = `<div class="avatar">${agent.avatar}</div><div><strong>${agent.name}</strong><br><small>${agent.role}</small></div>`;
    item.onclick = () => { state.selected = agent.id; save(); render(); };
    agentList.appendChild(item);
  });
}

function renderInspector() {
  const a = selectedAgent();
  if (!a) {
    emptyInspector.classList.remove('hidden');
    agentInspector.classList.add('hidden');
    return;
  }
  emptyInspector.classList.add('hidden');
  agentInspector.classList.remove('hidden');

  document.getElementById('avatarBig').textContent = a.avatar;
  document.getElementById('agentName').textContent = a.name;
  document.getElementById('agentRole').textContent = a.role;
  document.getElementById('cpu').value = a.cpu;
  document.getElementById('ram').value = a.ram;
  document.getElementById('focus').value = a.focus;
  document.getElementById('currentTask').textContent = a.task;

  const mem = document.getElementById('memoryList');
  mem.innerHTML = a.memory.slice(0, 6).map(x => `<li>${x}</li>`).join('');

  const chat = document.getElementById('chatLog');
  chat.innerHTML = a.chat.map(m => `<div class="message"><strong>${m.from}:</strong> ${m.text}</div>`).join('') || '<p>Još nema poruka.</p>';
  chat.scrollTop = chat.scrollHeight;
}

function render() {
  document.getElementById('worldTime').textContent = timeLabel();
  document.getElementById('taskCount').textContent = `${state.tasks.length} zadataka`;
  tickBtn.textContent = state.running ? '⏸ Pauziraj simulaciju' : '▶ Pokreni simulaciju';
  renderHouse();
  renderList();
  renderInspector();
}

function simulateStep() {
  state.minute += 15;
  if (state.minute >= 24 * 60) { state.minute = 8 * 60; state.day += 1; }
  const phrases = [
    'radim na zadatku', 'trebam input iz druge sobe', 'imam novu ideju', 'šaljem status update', 'optimiziram workflow'
  ];
  state.agents.forEach(a => {
    a.cpu = Math.max(8, Math.min(98, a.cpu + Math.round(Math.random() * 20 - 10)));
    a.ram = Math.max(12, Math.min(96, a.ram + Math.round(Math.random() * 14 - 7)));
    a.focus = Math.max(20, Math.min(99, a.focus + Math.round(Math.random() * 12 - 6)));
    if (Math.random() > .62) {
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      a.chat.push({ from: a.name, text: `${phrase}.` });
      a.memory.unshift(`${timeLabel()}: ${phrase}`);
    }
  });
  save();
  render();
}

let interval = null;
tickBtn.onclick = () => {
  state.running = !state.running;
  if (state.running) interval = setInterval(simulateStep, 1600);
  else clearInterval(interval);
  save();
  render();
};

addTaskBtn.onclick = () => {
  const task = prompt('Upiši novi zadatak za AI firmu:');
  if (!task) return;
  state.tasks.unshift(task);
  const a = selectedAgent() || state.agents[0];
  a.task = task;
  a.memory.unshift(`Dobio novi zadatak: ${task}`);
  save();
  render();
};

saveBtn.onclick = () => { save(); alert('Svijet je spremljen u browseru.'); };
resetBtn.onclick = () => {
  if (!confirm('Resetirati AI Sims svijet?')) return;
  localStorage.removeItem('aiSimsState');
  location.reload();
};

document.getElementById('sendChat').onclick = () => {
  const input = document.getElementById('chatText');
  const text = input.value.trim();
  const a = selectedAgent();
  if (!text || !a) return;
  a.chat.push({ from: 'Ti', text });
  a.chat.push({ from: a.name, text: `Primljeno. Dodajem u memoriju i prilagođavam zadatak: "${text}"` });
  a.memory.unshift(`Uputa korisnika: ${text}`);
  a.task = text;
  input.value = '';
  save();
  render();
};

render();
