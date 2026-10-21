(() => {
  const anniversaryDate = { month: 7, day: 4 }; // JavaScript months are zero-based: August = 7
  const title = document.getElementById('anniversary-title');
  const message = document.getElementById('anniversary-message');
  const age = document.getElementById('anniversary-age');
  const label = document.getElementById('countdown-label');
  const countdown = document.getElementById('anniversary-countdown');
  const dateText = (d) => d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  function updateAnniversary() {
    const now = new Date();
    const thisYear = new Date(now.getFullYear(), anniversaryDate.month, anniversaryDate.day, 0, 0, 0);
    const isAnniversary = now.getMonth() === anniversaryDate.month && now.getDate() === anniversaryDate.day;
    let next = thisYear;
    if (thisYear < now && !isAnniversary) next = new Date(now.getFullYear() + 1, anniversaryDate.month, anniversaryDate.day);
    if (isAnniversary) next = thisYear;
    const years = now.getFullYear() - 2025 - (now < new Date(now.getFullYear(), 7, 4) ? 1 : 0);
    age.textContent = `${Math.max(0, years)}${isAnniversary ? '' : '+'}`;
    if (isAnniversary) {
      title.textContent = `Happy TYAC Anniversary!`;
      message.textContent = `Today we celebrate ${Math.max(0, now.getFullYear() - 2025)} year(s) of TYAC. Thank you to our members, volunteers, partners, and supporters for helping move our mission forward.`;
      label.textContent = `Celebrating on ${dateText(thisYear)}`;
      countdown.querySelectorAll('strong').forEach(el => el.textContent = '🎉');
    } else {
      title.textContent = 'Celebrating our journey';
      label.textContent = `Until our next anniversary — ${dateText(next)}`;
      const seconds = Math.max(0, Math.floor((next - now) / 1000));
      const values = [Math.floor(seconds / 86400), Math.floor(seconds % 86400 / 3600), Math.floor(seconds % 3600 / 60), seconds % 60];
      ['days','hours','minutes','seconds'].forEach((key, i) => {
        const el = countdown.querySelector(`[data-${key}]`);
        if (el) el.textContent = String(values[i]).padStart(2, '0');
      });
    }
  }
  updateAnniversary(); setInterval(updateAnniversary, 1000);

  const form = document.getElementById('birthday-form');
  const list = document.getElementById('birthday-list');
  const count = document.getElementById('birthday-count');
  const STORAGE_KEY = 'tyacBirthdayRemindersDemo';
  let birthdays = [];
  try { birthdays = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); if (!Array.isArray(birthdays)) birthdays = []; } catch (_) { birthdays = []; }
  const nextDate = (month, day) => {
    const now = new Date(); let date = new Date(now.getFullYear(), month, day, 12);
    if (date < new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0)) date = new Date(now.getFullYear() + 1, month, day, 12);
    return date;
  };
  function render() {
    birthdays.sort((a,b) => nextDate(...a.md.split('-').map(Number).map((n,i)=>i===0?n-1:n)) - nextDate(...b.md.split('-').map(Number).map((n,i)=>i===0?n-1:n)));
    count.textContent = birthdays.length;
    list.replaceChildren();
    if (!birthdays.length) { const empty = document.createElement('div'); empty.className = 'empty-state'; empty.textContent = 'No birthdays saved on this device yet.'; list.append(empty); return; }
    birthdays.forEach((b, i) => {
      const [m,d] = b.md.split('-').map(Number);
      const next = nextDate(m-1,d);
      const today = new Date(); const isToday = today.getMonth() === m-1 && today.getDate() === d;
      const item = document.createElement('div'); item.className = 'birthday-item';
      const avatar = document.createElement('span'); avatar.className='birthday-avatar'; avatar.textContent = b.name.trim().charAt(0).toUpperCase();
      const details = document.createElement('div'); const name = document.createElement('div'); name.className='birthday-name'; name.textContent=b.name;
      const sub = document.createElement('small'); sub.textContent = isToday ? '🎉 Birthday today!' : `${next.toLocaleDateString(undefined,{month:'short',day:'numeric'})} · ${Math.ceil((new Date(next.getFullYear(),next.getMonth(),next.getDate())-new Date(today.getFullYear(),today.getMonth(),today.getDate()))/86400000)} day(s) to go`;
      details.append(name,sub); const remove=document.createElement('button'); remove.type='button'; remove.className='remove-birthday'; remove.textContent='Remove'; remove.setAttribute('aria-label',`Remove ${b.name}`); remove.addEventListener('click',()=>{birthdays.splice(i,1);save();});
      item.append(avatar,details,remove); list.append(item);
    });
  }
  function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(birthdays));render();}catch(_){alert('Unable to save on this device. Check browser storage settings.');}}
  if(form) form.addEventListener('submit', e=>{
    e.preventDefault(); const name=document.getElementById('birthday-name').value.trim(); const raw=document.getElementById('birthday-date').value;
    if(!name||!raw) return; const date=new Date(`${raw}T12:00:00`); const md=`${date.getMonth()+1}-${date.getDate()}`;
    if(!birthdays.some(b=>b.name.toLowerCase()===name.toLowerCase()&&b.md===md)) birthdays.push({name,md,public:document.getElementById('birthday-public').checked});
    save(); form.reset();
  });
  render();
})();