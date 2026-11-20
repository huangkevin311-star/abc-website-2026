(function(){
'use strict';
var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var T=window.ABC_I18N?window.ABC_I18N.t:function(value){return value};
var LANG=window.ABC_I18N?window.ABC_I18N.lang:'fr';

/* Bandeau */
var words=T('Culture ✦ Business ✦ Rencontres ✦ Traditions ✦ Gastronomie ✦ Conférences ✦ Partage ✦ Asie ✦ ');
var ticker=$('#ticker');
for(var i=0;i<4;i++){var part=document.createElement('span');part.textContent=words+words;ticker.appendChild(part)}

/* Navigation */
var nav=$('#nav'),burger=$('#burger'),links=$('#links'),bar=$('#bar');
var hero=$('#accueil'),heroMedia=$('.hero-media');
burger.addEventListener('click',function(){var open=links.classList.toggle('open');burger.setAttribute('aria-expanded',open)});
$$('a',links).forEach(function(link){link.addEventListener('click',function(){links.classList.remove('open');burger.setAttribute('aria-expanded','false')})});
var sectionIds=['accueil','apropos','galerie','activites','evenements','contact'];
function onScroll(){
 var y=window.scrollY,height=document.documentElement.scrollHeight-window.innerHeight;
 nav.classList.toggle('solid',y>Math.max(40,hero.offsetHeight-90));bar.style.width=(height>0?y/height*100:0)+'%';
 if(!RM&&y<hero.offsetHeight*1.2)heroMedia.style.transform='translate3d(0,'+(y*.13).toFixed(1)+'px,0) scale(1.035)';
 var current=sectionIds[0];
 sectionIds.forEach(function(id){var section=document.getElementById(id);if(section&&section.getBoundingClientRect().top<140)current=id});
 $$('a',links).forEach(function(link){link.classList.toggle('on',link.getAttribute('href')==='#'+current)});
 var events=$('#evenements').getBoundingClientRect();
 $('#float').classList.toggle('show',events.top<window.innerHeight*.5&&events.bottom>window.innerHeight*.6);
}
var scrollTick=false;
window.addEventListener('scroll',function(){if(!scrollTick){scrollTick=true;requestAnimationFrame(function(){scrollTick=false;onScroll()})}},{passive:true});
window.addEventListener('resize',onScroll);onScroll();

/* Apparition discrète des activités */
var reveals=$$('.reveal');
if(RM||!('IntersectionObserver' in window)){reveals.forEach(function(item){item.classList.add('is-visible')})}
else{
 var observer=new IntersectionObserver(function(entries,instance){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('is-visible');instance.unobserve(entry.target)}})},{threshold:.18});
 reveals.forEach(function(item){observer.observe(item)});
}

/* Galerie : ajouter data-src à une tuile pour activer l’agrandissement. */
var galleryItems=$$('.tile[data-src]'),lb=$('#lb'),photoIndex=0,lastFocus=null;
function showPhoto(index){photoIndex=(index+galleryItems.length)%galleryItems.length;var tile=galleryItems[photoIndex];$('#lbi').src=tile.dataset.src;$('#lbi').alt=tile.getAttribute('aria-label')||'';$('#lbc').textContent=tile.dataset.caption||''}
function openLightbox(index){if(!galleryItems.length)return;lastFocus=document.activeElement;showPhoto(index);lb.classList.add('open');$('#lbx').focus()}
function closeLightbox(){lb.classList.remove('open');$('#lbi').removeAttribute('src');if(lastFocus)lastFocus.focus()}
galleryItems.forEach(function(tile,index){tile.addEventListener('click',function(){openLightbox(index)})});
$('#lbx').addEventListener('click',closeLightbox);$('#lbp').addEventListener('click',function(){showPhoto(photoIndex-1)});$('#lbn').addEventListener('click',function(){showPhoto(photoIndex+1)});
lb.addEventListener('click',function(event){if(event.target===lb)closeLightbox()});
document.addEventListener('keydown',function(event){if(!lb.classList.contains('open'))return;if(event.key==='Escape')closeLightbox();if(event.key==='ArrowLeft')showPhoto(photoIndex-1);if(event.key==='ArrowRight')showPhoto(photoIndex+1)});

/* Étapes du concours */
var stagePanel=$('#sp'),stageButtons=$$('.stage-tab');
function element(tag,className,text){var item=document.createElement(tag);if(className)item.className=className;if(text)item.textContent=text;return item}
function selectStage(index){
 stageButtons.forEach(function(button,buttonIndex){button.setAttribute('aria-selected',buttonIndex===index);button.tabIndex=buttonIndex===index?0:-1});stagePanel.innerHTML='';
 if(index===0){
  var stageOne=element('div');stageOne.appendChild(element('h4','',T('Stage 1 · Build a full valuation-backed recommendation')));
  stageOne.appendChild(element('p','',T("You'll build a full valuation-backed recommendation, using comparable companies analysis, an operating model, a DCF and precedent transactions. These are the skills tested in almost every finance interview, so the competition is also a first rehearsal for internship and job applications.")));
  stageOne.appendChild(element('p','',T('Team registration opens and the case is released in November 2026. Round 1 submissions close on 8 January 2027.')));
  stagePanel.appendChild(stageOne);
 }else{
  var stageTwo=element('div');stageTwo.appendChild(element('h4','',T('Stage 2 · Defend your strategy in front of a jury')));stageTwo.appendChild(element('p','',T('Finalist teams are announced on 30 January 2027. The live final takes place in Lille from 8 to 12 February 2027, and winners are announced there.')));stageTwo.appendChild(element('p','',T('Present your work to a jury of academics and professionals, and get feedback that sharpens how you think and present.')));
  var takeaway=element('div');takeaway.appendChild(element('h4','',T('What you take away')));takeaway.appendChild(element('p','',T('An official certificate from EDHEC Business School, a story you can tell in interviews, and a network of ambitious students from EDHEC and partner universities in Europe and Asia.')));
  var columnsTwo=element('div','cols');columnsTwo.appendChild(stageTwo);columnsTwo.appendChild(takeaway);stagePanel.appendChild(columnsTwo);
 }
}
stageButtons.forEach(function(button,index){button.addEventListener('click',function(){selectStage(index)});button.addEventListener('keydown',function(event){if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();var next=index?0:1;selectStage(next);stageButtons[next].focus()}})});selectStage(0);

/* Frise et compte à rebours */
var parseDate=function(value){return Date.parse(value)},start=parseDate('2026-11-11T00:00:00+01:00'),submission=parseDate('2027-01-08T23:59:00+01:00'),jury=parseDate('2027-01-30T00:00:00+01:00'),finalStart=parseDate('2027-02-08T00:00:00+01:00'),finalEnd=parseDate('2027-02-13T00:00:00+01:00');
function timelinePosition(now){var dates=[start,submission,jury,finalEnd];if(now<=dates[0])return 0;if(now>=dates[3])return 100;for(var index=0;index<3;index++){if(now<dates[index+1])return (index+(now-dates[index])/(dates[index+1]-dates[index]))/3*100}return 100}
function updateCountdown(){
 var now=Date.now(),position=timelinePosition(now);$('#today').style.left=position+'%';$('#fill').style.width=position+'%';$$('.node').forEach(function(node,index){node.classList.toggle('done',position>=index/3*100-.01)});
 var target,title,eye=T('Next milestone');
 if(now<submission){target=submission;title=T('Round 1 submissions close on 8 January 2027')}
 else if(now<jury){target=jury;title=T('Finalist teams announced on 30 January 2027')}
 else if(now<finalStart){target=finalStart;title=T('Live final in Lille starts on 8 February 2027')}
 else if(now<finalEnd){target=finalEnd;title=T('The live final is on in Lille. Winners announced.');eye=T('Live now')}
 else{target=now;title=T('Thank you to every team that took part.');eye=T('Completed')}
 $('#cdEye').textContent=eye;$('#cdTitle').textContent=title;var remaining=Math.max(0,target-now),pad=function(number){return String(number).padStart(2,'0')};
 $('#cd0').textContent=pad(Math.floor(remaining/864e5));$('#cd1').textContent=pad(Math.floor(remaining/36e5)%24);$('#cd2').textContent=pad(Math.floor(remaining/6e4)%60);$('#cd3').textContent=pad(Math.floor(remaining/1e3)%60);
}
updateCountdown();setInterval(updateCountdown,1000);

/* Vérification de l’éligibilité */
var year='b12',team='4';
function updateVerdict(){
 var verdict=$('#verdict'),tag,className,title,copy;
 if(year!=='b12'&&year!=='pge1'){className='no';tag=T('Not eligible');title=T('Open to 1st and 2nd year Bachelor students and 1st year PGE students');copy=T('The competition is open to 1st and 2nd year Bachelor students and 1st year PGE students from EDHEC, as well as eligible students from other universities in Europe and Asia. Questions? abc@edhec.com.')}
 else if(team==='6'){className='mid';tag=T('Almost');title=T('Teams are 3 to 5 people');copy=T('Split into two teams, or pick up to five members. Teams are formed of 3-5 people.')}
 else if(team==='1'){className='ok';tag=T('You can register');title=T('Register on your own');copy=T("No team yet? Register on your own and we'll randomly match you with other solo participants to form a team, or you could follow us up once you find more participants. No prior finance experience is required.")}
 else if(team==='2'){className='mid';tag=T('One more to go');title=T('You need 3 to 5 people');copy=T("Teams are formed of 3-5 people. Add a teammate, or register on your own and we'll randomly match you with other solo participants.")}
 else{className='ok';tag=T('You can register');title=T('You are ready to go');copy=T('Eligible as a team of 3 to 5 people. No prior finance experience is required, only curiosity and the will to learn.')}
 verdict.innerHTML='';verdict.appendChild(element('span','tag '+className,tag));verdict.appendChild(element('h4','',title));verdict.appendChild(element('p','',copy));
 if(className!=='no'){var register=element('a','btn solid',T('Register your team now'));register.href='https://forms.gle/NBf1yPQsdf7txBQq8';register.style.alignSelf='flex-start';verdict.appendChild(register)}
}
function buttonGroup(id,setValue){$$('#'+id+' button').forEach(function(button){button.addEventListener('click',function(){$$('#'+id+' button').forEach(function(other){other.setAttribute('aria-pressed','false')});button.setAttribute('aria-pressed','true');setValue(button.dataset.v);updateVerdict()})})}
buttonGroup('yr',function(value){year=value});buttonGroup('tm',function(value){team=value});updateVerdict();

/* Aides à la copie */
function copyText(text,done,fail){try{navigator.clipboard.writeText(text).then(done,fail)}catch(error){fail()}}
var copyMail=$('#copyMail');copyMail.addEventListener('click',function(){copyText('edhecabc.partenariat@gmail.com',function(){copyMail.textContent=LANG==='fr'?'Copié ✓':'Copied ✓';setTimeout(function(){copyMail.textContent=T('Copier')},2000)},function(){copyMail.textContent=LANG==='fr'?'Sélectionnez l’adresse':'Select the address'})});
})();
