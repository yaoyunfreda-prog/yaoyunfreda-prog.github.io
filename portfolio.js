const pageTitles = [
  '作品集封面','关于我','共息之馆 · 项目概述','共息之馆 · 研究','共息之馆 · 案例与设计','共息之馆 · 流程与视觉','共息之馆 · 测试与成果',
  '绿途 · 项目概述','绿途 · 用户研究','绿途 · 设计机会','绿途 · 服务蓝图','绿途 · App 与 AR','气味社交 · 项目概述','气味社交 · 用户访谈',
  '气味社交 · 未来情境','气味社交 · 服务系统','气味社交 · 装置原型','气味社交 · 约会空间','其他作品概览','纹启丝路','太空之吻','敦煌飞天','色彩停处有塔塔','步履不停','龙梭寻巧记','00:33 · 三十三秒'
];
const groups = [
  {id:'gallery-intro',start:1,end:2},
  {id:'gallery-projects',start:3,end:18},
  {id:'gallery-other',start:19,end:26}
];
const imagePath = n => `assets/portfolio/page-${String(n).padStart(2,'0')}.jpg`;
let currentPage = 0;
let previousFocus = null;
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const count = document.getElementById('lightbox-count');
const caption = document.getElementById('lightbox-caption');

function showPage(n, updateHash = true) {
  if (n < 1 || n > 26) return;
  if (lightbox.hidden) previousFocus = document.activeElement;
  currentPage = n;
  lightboxImage.src = imagePath(n);
  lightboxImage.alt = `作品集第 ${n} 页：${pageTitles[n-1]}`;
  count.textContent = `${String(n).padStart(2,'0')} / 26`;
  caption.textContent = pageTitles[n-1];
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('lightbox-close').focus();
  if (updateHash) history.replaceState(null, '', `#page=${n}`);
}
function closePage() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  history.replaceState(null, '', location.pathname + location.search);
  if (previousFocus) previousFocus.focus();
}

groups.forEach(group => {
  const parent = document.getElementById(group.id);
  for (let n=group.start;n<=group.end;n++) {
    const button = document.createElement('button');
    button.className = 'page-card';
    button.type = 'button';
    button.setAttribute('aria-label', `放大查看第 ${n} 页：${pageTitles[n-1]}`);
    const img = document.createElement('img');
    img.src = imagePath(n);
    img.alt = `作品集第 ${n} 页缩略图`;
    img.loading = n < 4 ? 'eager' : 'lazy';
    const label = document.createElement('div');
    label.className = 'page-card-caption';
    const title = document.createElement('strong');
    title.textContent = pageTitles[n-1];
    const number = document.createElement('span');
    number.textContent = String(n).padStart(2,'0') + ' ↗';
    label.append(title, number);
    button.append(img, label);
    button.addEventListener('click', () => showPage(n));
    parent.append(button);
  }
});
document.getElementById('lightbox-close').addEventListener('click', closePage);
document.getElementById('lightbox-prev').addEventListener('click', () => showPage(Math.max(1,currentPage-1)));
document.getElementById('lightbox-next').addEventListener('click', () => showPage(Math.min(26,currentPage+1)));
document.addEventListener('keydown', event => {
  if (lightbox.hidden) return;
  if (event.key === 'Escape') closePage();
  if (event.key === 'ArrowLeft') showPage(Math.max(1,currentPage-1));
  if (event.key === 'ArrowRight') showPage(Math.min(26,currentPage+1));
});
lightbox.addEventListener('click', event => { if (event.target === lightbox) closePage(); });
const fromHash = /^#page=(\d+)$/.exec(location.hash);
if (fromHash) showPage(Number(fromHash[1]), false);
