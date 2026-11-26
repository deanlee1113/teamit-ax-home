/* 팀잇 AX 홈페이지 동작
   이 파일이 없어도 글과 그림은 모두 보입니다. 여기서는 세 가지만 합니다.
   1) 좁은 화면의 메뉴 열고 닫기
   2) '작동 방식'의 네 단계를 탭으로 바꾸기
   3) 화면 캡처를 눌러 크게 보기 */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* 1) 메뉴 */
  const top = $('.top');
  const menuBtn = $('.menu-btn');
  const setMenu = open => {
    top.toggleAttribute('data-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? '닫기' : '메뉴';
  };
  menuBtn.addEventListener('click', () => setMenu(!top.hasAttribute('data-open')));
  $('#menu').addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && top.hasAttribute('data-open')) { setMenu(false); menuBtn.focus(); }
  });

  /* 2) 단계 탭 */
  const how = $('#how');
  const tablist = $('.tabs');
  const tabs = $$('a', tablist);
  const panels = tabs.map(t => $(t.hash));
  const select = (i, { focus = false, remember = true } = {}) => {
    tabs.forEach((t, k) => {
      const on = k === i;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panels[k].hidden = !on;
    });
    tablist.style.setProperty('--i', i);
    if (focus) tabs[i].focus({ preventScroll: true });
    if (remember) history.replaceState(null, '', tabs[i].hash);
  };
  const indexFromHash = () => tabs.findIndex(t => t.hash === location.hash);

  tablist.setAttribute('role', 'tablist');
  tabs.forEach((t, i) => {
    t.setAttribute('role', 'tab');
    t.setAttribute('aria-controls', panels[i].id);
    panels[i].setAttribute('role', 'tabpanel');
    panels[i].setAttribute('aria-labelledby', t.id);
    t.addEventListener('click', e => { e.preventDefault(); select(i); });
    t.addEventListener('keydown', e => {
      const move = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (move) { e.preventDefault(); select((i + move + tabs.length) % tabs.length, { focus: true }); }
      else if (e.key === 'Home') { e.preventDefault(); select(0, { focus: true }); }
      else if (e.key === 'End') { e.preventDefault(); select(tabs.length - 1, { focus: true }); }
      else if (e.key === ' ') { e.preventDefault(); select(i); }
    });
  });
  $$('.next').forEach(b => b.addEventListener('click', () => {
    select(Number(b.dataset.next), { focus: true });
    tablist.scrollIntoView({ block: 'start' });
  }));

  const first = indexFromHash();
  select(Math.max(0, first), { remember: false });
  if (first >= 0) how.scrollIntoView();
  addEventListener('hashchange', () => {
    const i = indexFromHash();
    if (i >= 0) { select(i, { remember: false }); how.scrollIntoView(); }
  });

  /* 3) 크게 보기 */
  const lb = $('#lb');
  const lbImg = $('img', lb);
  $$('.zoom').forEach(z => {
    const im = $('img', z);
    z.setAttribute('aria-label', '크게 보기: ' + im.alt);
    z.addEventListener('click', () => {
      lbImg.src = im.currentSrc || im.src;
      lbImg.alt = im.alt;
      lb.showModal();
    });
  });
  lb.addEventListener('click', () => lb.close());
})();
