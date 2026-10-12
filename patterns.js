const patternData = {
  pushe: {title:'普斯贺纹',type:'几何纹样',number:'01',front:'assets/patterns/pushe-front.jpg',back:'assets/patterns/pushe-back.jpg',scan:'assets/patterns/pushe-scan.jpg',audio:'assets/patterns/pushe-narration.mp3'},
  hamuer: {title:'哈木尔纹',type:'动物纹样',number:'02',front:'assets/patterns/hamuer-front.jpg',back:'assets/patterns/hamuer-back.jpg',scan:'assets/patterns/hamuer-scan.jpg',audio:'assets/patterns/hamuer-narration.mp3'},
  juancao: {title:'卷草纹',type:'植物纹样',number:'03',front:'assets/patterns/juancao-front.jpg',back:'assets/patterns/juancao-back.jpg',scan:'assets/patterns/juancao-scan.jpg',audio:'assets/patterns/juancao-narration.mp3'}
};
let activePattern = 'pushe';
let activeSide = 'front';
const frontButton = document.getElementById('show-front');
const backButton = document.getElementById('show-back');
const cardImage = document.getElementById('postcard-image');
function renderPattern(changeAudio = false){
  const item = patternData[activePattern];
  document.getElementById('pattern-count').textContent = item.number + ' / POSTCARD';
  document.getElementById('pattern-title').textContent = item.title;
  document.getElementById('pattern-type').textContent = item.type;
  cardImage.src = item[activeSide];
  cardImage.alt = item.title + '明信片' + (activeSide === 'front' ? '正面' : '背面');
  const scan = document.getElementById('scan-image');
  scan.src = item.scan;
  scan.alt = item.title + '扫码后的手机效果';
  document.getElementById('scan-link').href = item.scan;
  if (changeAudio) {
    const audio = document.getElementById('pattern-audio');
    audio.pause();
    audio.src = item.audio;
    audio.load();
  }
  frontButton.classList.toggle('is-active', activeSide === 'front');
  backButton.classList.toggle('is-active', activeSide === 'back');
  frontButton.setAttribute('aria-pressed', String(activeSide === 'front'));
  backButton.setAttribute('aria-pressed', String(activeSide === 'back'));
  document.querySelectorAll('.postcard-choice').forEach(button => {
    const current = button.dataset.pattern === activePattern;
    button.classList.toggle('is-active', current);
    button.setAttribute('aria-pressed', String(current));
  });
}
document.querySelectorAll('.postcard-choice').forEach(button => button.addEventListener('click', () => {
  const changeAudio = activePattern !== button.dataset.pattern;
  activePattern = button.dataset.pattern;
  activeSide = 'front';
  renderPattern(changeAudio);
}));
frontButton.addEventListener('click', () => {activeSide='front';renderPattern();});
backButton.addEventListener('click', () => {activeSide='back';renderPattern();});
document.getElementById('postcard-flip').addEventListener('click', () => {activeSide = activeSide === 'front' ? 'back' : 'front';renderPattern();});
