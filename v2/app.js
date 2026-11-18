(function(){
var d=document,w=window,$=function(s,c){return(c||d).querySelector(s)},$$=function(s,c){return[].slice.call((c||d).querySelectorAll(s))};
var RM=w.matchMedia('(prefers-reduced-motion:reduce)').matches;

/* naglowek i pasek telefonu */
var hd=$('#hd'),mb=$('#mb'),hero=$('.hero');
var hH=w.innerHeight;w.addEventListener('resize',function(){hH=hero.offsetHeight},{passive:true});
function onS(){var y=w.scrollY;hd.classList.toggle('s',y>40);mb.classList.toggle('on',y>hH*.8)}
w.addEventListener('scroll',onS,{passive:true});requestAnimationFrame(onS);

/* menu */
var mn=$('#mn'),mB=$('#mnB'),mImgs=$$('.mn-img img'),mLoaded=false;
function mOpen(o){mn.classList.toggle('o',o);mB.setAttribute('aria-expanded',o);d.body.style.overflow=o?'hidden':'';
 if(o&&!mLoaded){mLoaded=true;mImgs.forEach(function(i){i.src=i.dataset.src});mImgs[0]&&mImgs[0].classList.add('on')}
 if(o)$('#mnX').focus();else mB.focus()}
mB.addEventListener('click',function(){mOpen(true)});$('#mnX').addEventListener('click',function(){mOpen(false)});
$$('.mn li a').forEach(function(a){a.addEventListener('click',function(){mOpen(false)});
 a.addEventListener('mouseenter',function(){mImgs.forEach(function(i,k){i.classList.toggle('on',k==a.dataset.i)})})});
d.addEventListener('keydown',function(e){if(e.key=='Escape'){if(mn.classList.contains('o'))mOpen(false);if(lb.classList.contains('o'))lbClose()}});

/* hero: pokaz zdjec */
var sl=$$('.hs'),pb=$$('#hp button'),cur=0,tm,ready=false;
function go(n){sl[cur].classList.remove('on');pb[cur].classList.remove('on');cur=(n+sl.length)%sl.length;
 var f=sl[cur];f.classList.add('on');pb[cur].classList.remove('on');void pb[cur].offsetWidth;pb[cur].classList.add('on');
 clearTimeout(tm);if(!RM)tm=setTimeout(function(){go(cur+1)},7000)}
function loadSlides(){$$('.hs [data-srcset]').forEach(function(e){e.srcset=e.dataset.srcset;e.removeAttribute('data-srcset')});ready=true}
pb.forEach(function(b,k){b.addEventListener('click',function(){if(!ready)loadSlides();go(k)})});
w.addEventListener('load',function(){setTimeout(function(){loadSlides();if(!RM)tm=setTimeout(function(){go(1)},5000)},1200)});
d.addEventListener('visibilitychange',function(){if(d.hidden)clearTimeout(tm);else if(ready&&!RM)tm=setTimeout(function(){go(cur+1)},4000)});

/* daty w pasku rezerwacji */
var d1=$('#d1'),d2=$('#d2');
if(d1){var t=new Date(),iso=function(x){return new Date(x.getTime()-x.getTimezoneOffset()*6e4).toISOString().slice(0,10)};
 var a=new Date(t);a.setDate(t.getDate()+1);var b=new Date(t);b.setDate(t.getDate()+3);
 d1.min=iso(t);d1.value=iso(a);d2.min=iso(a);d2.value=iso(b);
 d1.addEventListener('change',function(){var x=new Date(d1.value);x.setDate(x.getDate()+1);d2.min=iso(x);if(d2.value<d2.min)d2.value=d2.min});
 $$('.hb label').forEach(function(l){l.addEventListener('click',function(){var i=$('input',l);if(i&&i.showPicker)try{i.showPicker()}catch(e){}})})}

/* odslony */
var rv=$$('.rv,.ri');
if('IntersectionObserver' in w){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.05});rv.forEach(function(e){io.observe(e)})}
else rv.forEach(function(e){e.classList.add('on')});

/* przeciaganie mysza */
function drag(el){var x0,s0,mv=false,down=false;
 el.addEventListener('pointerdown',function(e){if(e.pointerType!='mouse')return;down=true;mv=false;x0=e.clientX;s0=el.scrollLeft});
 w.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-x0;if(Math.abs(dx)>5){mv=true;el.classList.add('drag')}if(mv)el.scrollLeft=s0-dx});
 w.addEventListener('pointerup',function(){if(!down)return;down=false;el.classList.remove('drag');
  if(mv&&el.classList.contains('sc')){var k=Math.round(el.scrollLeft/el.clientWidth);el.scrollTo({left:k*el.clientWidth,behavior:'smooth'})}});
 el.addEventListener('click',function(e){if(mv){e.preventDefault();e.stopPropagation();mv=false}},true)}

/* karuzele pokoi */
$$('.sc-w').forEach(function(wr){var sc=$('.sc',wr),out=$('output',wr),n=sc.children.length;drag(sc);
 function idx(){return Math.round(sc.scrollLeft/sc.clientWidth)}
 sc.addEventListener('scroll',function(){out.textContent=(idx()+1)+' / '+n},{passive:true});
 $$('[data-k]',wr).forEach(function(b){b.addEventListener('click',function(){var k=(idx()+ +b.dataset.k+n)%n;sc.scrollTo({left:k*sc.clientWidth,behavior:RM?'auto':'smooth'})})})});

/* galeria */
var gs=$('#gs');drag(gs);
$$('[data-g]').forEach(function(b){b.addEventListener('click',function(){gs.scrollBy({left:+b.dataset.g*gs.clientWidth*.7,behavior:RM?'auto':'smooth'})})});

/* lightbox */
var lb=$('#lb'),li=$('img',lb),lc=$('p',lb),set=[],pos=0,last;
function show(){var b=set[pos];li.src=b.dataset.src;li.alt=b.dataset.cap||'';lc.textContent=b.dataset.cap||''}
function lbOpen(list,k){set=list;pos=k;last=d.activeElement;show();lb.classList.add('o');d.body.style.overflow='hidden';$('.x',lb).focus()}
function lbClose(){lb.classList.remove('o');d.body.style.overflow='';li.removeAttribute('src');last&&last.focus()}
$$('[data-lb]').forEach(function(g){var bs=$$('button[data-src]',g);bs.forEach(function(b,k){b.addEventListener('click',function(){lbOpen(bs,k)})})});
$('.x',lb).addEventListener('click',lbClose);
$('.p',lb).addEventListener('click',function(){pos=(pos-1+set.length)%set.length;show()});
$('.n',lb).addEventListener('click',function(){pos=(pos+1)%set.length;show()});
lb.addEventListener('click',function(e){if(e.target==lb)lbClose()});
d.addEventListener('keydown',function(e){if(!lb.classList.contains('o'))return;if(e.key=='ArrowLeft')$('.p',lb).click();if(e.key=='ArrowRight')$('.n',lb).click()});
var tx=0;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)$(dx<0?'.n':'.p',lb).click()});

/* formularz pokazowy */
var fm=$('#fm');fm.addEventListener('submit',function(e){e.preventDefault();$('#fmOk').hidden=false});

/* mapa przy przewinieciu */
var map=$('#map'),mapOn=false;
function mapLoad(){if(mapOn)return;mapOn=true;var f=d.createElement('iframe');f.title='Mapa dojazdu do Hotelu Country Club Żywiec';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';
 f.src='https://maps.google.com/maps?q=Hotel+Country+Club+%C5%BBywiec,+Kie%C5%82bas%C3%B3w+24,+34-340+Jele%C5%9Bnia&z=13&output=embed';map.appendChild(f)}
if('IntersectionObserver' in w){var mo=new IntersectionObserver(function(es){if(es[0].isIntersecting){mapLoad();mo.disconnect()}},{rootMargin:'400px'});mo.observe(map)}

/* cookies */
$$('#ck button').forEach(function(b){b.addEventListener('click',function(){try{localStorage.setItem('ck',b.dataset.c)}catch(e){}$('#ck').hidden=true})});
})();
