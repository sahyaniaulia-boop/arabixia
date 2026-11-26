// Kerajaan Bahasa Arab — interactive story, classroom quiz and learning rooms
const $ = (id) => document.getElementById(id);
const screens = ['introScreen','journeyScreen','quizScreen','kingdomScreen'];
function showScreen(id){screens.forEach(s=>$(s).classList.toggle('active',s===id));window.scrollTo({top:0,behavior:'smooth'});}

// Sound effects are generated locally with Web Audio API; no external audio files required.
let audioCtx=null, soundOn=true, ambientTimer=null, ambientNodes=[];
function getAudio(){if(!audioCtx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;audioCtx=new AC();}if(audioCtx.state==='suspended')audioCtx.resume();return audioCtx;}
function tone(freq=440,duration=.12,type='sine',volume=.06,delay=0){if(!soundOn)return;const ctx=getAudio();if(!ctx)return;const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=type;osc.frequency.setValueAtTime(freq,ctx.currentTime+delay);gain.gain.setValueAtTime(.0001,ctx.currentTime+delay);gain.gain.exponentialRampToValueAtTime(volume,ctx.currentTime+delay+.02);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+delay+duration);osc.connect(gain);gain.connect(ctx.destination);osc.start(ctx.currentTime+delay);osc.stop(ctx.currentTime+delay+duration+.04);}
function chime(){[523,659,784,1046].forEach((f,i)=>tone(f,.24,'sine',.055,i*.11));}
function correctSound(){[660,880,1046].forEach((f,i)=>tone(f,.15,'triangle',.06,i*.09));}
function wrongSound(){tone(220,.2,'triangle',.06);tone(180,.22,'triangle',.05,.16);}
function doorSound(){if(!soundOn)return;const ctx=getAudio();if(!ctx)return;const duration=1.5;const buffer=ctx.createBuffer(1,ctx.sampleRate*duration,ctx.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++){const t=i/data.length;data[i]=(Math.random()*2-1)*Math.pow(1-t,2)*.22;}const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();src.buffer=buffer;filter.type='lowpass';filter.frequency.value=500;gain.gain.value=.6;src.connect(filter);filter.connect(gain);gain.connect(ctx.destination);src.start();}
function waterSound(){if(!soundOn)return;const ctx=getAudio();if(!ctx)return;const buffer=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),d=buffer.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*.12;const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();src.buffer=buffer;src.loop=true;filter.type='lowpass';filter.frequency.value=650;gain.gain.value=.055;src.connect(filter);filter.connect(gain);gain.connect(ctx.destination);src.start();ambientNodes.push(src,gain,filter);}
function stopAmbient(){ambientNodes.forEach(n=>{try{if(n.stop)n.stop();}catch(e){}});ambientNodes=[];}
function toggleSound(){soundOn=!soundOn;$('soundToggle').textContent=soundOn?'🔊':'🔇';['soundToggle2','soundToggle3'].forEach(id=>{if($(id))$(id).textContent=soundOn?'♫ Suara':'🔇 Suara';});$('soundHint').textContent=soundOn?'🔊 Efek suara aktif':'🔇 Suara dimatikan';if(soundOn){getAudio();tone(660,.1);}else stopAmbient();}
['soundToggle','soundToggle2','soundToggle3'].forEach(id=>$(id).addEventListener('click',toggleSound));
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2200);}

// Gate opening
$('openGate').addEventListener('click',()=>{
 getAudio();doorSound();$('castleScene').classList.add('opening');$('openGate').disabled=true;
 $('instruction')?.remove();
 setTimeout(()=>{showScreen('journeyScreen');$('soundHint').textContent='🔊 Dengarkan suara air sungai';waterSound();},1900);
});

// Bridge crossing
let crossed=false;
$('walkButton').addEventListener('click',()=>{
 if(crossed)return;getAudio();crossed=true;$('traveler').classList.add('walking');$('traveler').style.left=window.innerWidth<480?'69%':'73%';tone(330,.08,'triangle',.04);tone(420,.08,'triangle',.04,.28);tone(330,.08,'triangle',.04,.56);
 $('walkButton').disabled=true;$('walkButton').textContent='Menuju gerbang...';$('progressPill').textContent='Perjalanan 2/3';
 setTimeout(()=>{$('traveler').classList.remove('walking');showScreen('quizScreen');stopAmbient();chime();startQuiz();},2900);
});

// Five question entrance quiz. Correct answers earn a key; mistakes can be retried.
const quizQuestions=[
 {cat:'KOSAKATA',ar:'مَدْرَسَةٌ',q:'Apa arti kata di atas?',opts:['Sekolah','Rumah','Pasar','Kebun'],correct:0,explain:'مَدْرَسَةٌ artinya sekolah.'},
 {cat:'KOSAKATA',ar:'كِتَابٌ',q:'Apa arti kata كِتَابٌ?',opts:['Pensil','Buku','Meja','Tas'],correct:1,explain:'كِتَابٌ artinya buku.'},
 {cat:'PROFESI',ar:'طَبِيبٌ',q:'Siapakah طَبِيبٌ?',opts:['Guru','Polisi','Dokter','Petani'],correct:2,explain:'طَبِيبٌ artinya dokter.'},
 {cat:'KELUARGA',ar:'أُمِّي',q:'Apa arti kata أُمِّي?',opts:['Ayahku','Ibuku','Kakakku','Nenekku'],correct:1,explain:'أُمِّي artinya ibuku.'},
 {cat:'UNGKAPAN',ar:'هٰذَا أَبِي',q:'Apa arti kalimat هٰذَا أَبِي?',opts:['Ini ibuku','Itu ayahku','Ini ayahku','Itu rumahku'],correct:2,explain:'هٰذَا أَبِي artinya ini ayahku.'}
];
let qIndex=0,keys=0,locked=false;
function startQuiz(){qIndex=0;keys=0;locked=false;$('keyCount').textContent='🗝️ Kunci terkumpul: 0';renderQuestion();}
function renderQuestion(){
 const q=quizQuestions[qIndex];locked=false;$('quizCount').textContent=`Pertanyaan ${qIndex+1} dari ${quizQuestions.length}`;$('quizProgress').style.width=`${qIndex/quizQuestions.length*100}%`;$('questionCategory').textContent=q.cat;$('questionArabic').textContent=q.ar;$('questionText').textContent=q.q;$('answerFeedback').textContent='Pilih satu jawaban yang menurutmu benar.';$('answerFeedback').style.color='#8b8c7d';$('nextQuestion').disabled=true;$('nextQuestion').textContent=qIndex===quizQuestions.length-1?'Lihat hasil →':'Berikutnya →';
 $('answers').innerHTML=q.opts.map((o,i)=>`<button class="answer-btn" data-index="${i}">${o}</button>`).join('');
}
$('answers').addEventListener('click',e=>{
 const btn=e.target.closest('.answer-btn');if(!btn||locked)return;getAudio();const q=quizQuestions[qIndex],chosen=+btn.dataset.index;
 if(chosen===q.correct){locked=true;keys++;correctSound();btn.classList.add('correct');$('answerFeedback').textContent='✓ Benar! '+q.explain;$('answerFeedback').style.color='#4b895e';$('keyCount').textContent=`🗝️ Kunci terkumpul: ${keys}`;$('nextQuestion').disabled=false;$('answers').querySelectorAll('button').forEach(b=>b.disabled=true);}
 else{wrongSound();btn.classList.add('wrong');btn.disabled=true;$('answerFeedback').textContent='Belum tepat. Coba pilihan yang lain, ya!';$('answerFeedback').style.color='#b86d5c';}
});
$('nextQuestion').addEventListener('click',()=>{
 if(!locked)return;if(qIndex<quizQuestions.length-1){qIndex++;renderQuestion();}else{ $('quizProgress').style.width='100%';showScreen('kingdomScreen');$('finalKeys').textContent=keys;$('welcomeName').textContent='Penjelajah Hebat';chime();toast('Gerbang kerajaan ilmu berhasil dibuka!');}
});

// Learning content: six topics in the uploaded Bahasa Arab MI Class IV material.
const lessons=[
{id:1,icon:'🏡',title:'العنوان — Al-‘Unwān',name:'Alamat',desc:'Mengenal alamat rumah, jalan, nomor, dan angka.',color:'#f8ead2',words:[['بَيْتٌ','rumah'],['شَارِعٌ','jalan'],['رَقْمٌ','nomor'],['هَاتِفٌ','telepon'],['وَاحِدٌ','satu'],['اِثْنَانِ','dua'],['ثَلَاثَةٌ','tiga'],['أَرْبَعَةٌ','empat'],['خَمْسَةٌ','lima']],sentences:[['أَيْنَ بَيْتُكَ؟','Di mana rumahmu?'],['بَيْتِي فِي شَارِعِ مَاوَر، رَقْمُ خَمْسَةٍ.','Rumahku di Jalan Mawar, nomor lima.']],tasks:['Susun huruf: و – ا – ح – د.','Susun huruf: ث – ل – ا – ث – ة.','Susun kata: قَرِيبٌ – الْمَدْرَسَةِ – مِنْ – بَيْتِي.']},
{id:2,icon:'🩺',title:'المهنة — Al-Mihnah',name:'Profesi',desc:'Mengenal nama pekerjaan dan cita-cita.',color:'#f7e4df',words:[['طَبِيبٌ','dokter laki-laki'],['طَبِيبَةٌ','dokter perempuan'],['مُهَنْدِسٌ','insinyur'],['مُدَرِّسٌ','guru laki-laki'],['مُمَرِّضَةٌ','perawat'],['شُرْطِيٌّ','polisi'],['تَاجِرٌ','pedagang'],['مُوَظَّفٌ','pegawai'],['خَيَّاطَةٌ','penjahit']],sentences:[['أُرِيدُ أَنْ أَكُونَ شُرْطِيًّا.','Saya ingin menjadi polisi.'],['هٰذَا عَزِيزٌ، هُوَ شُرْطِيٌّ.','Ini Aziz, dia seorang polisi.']],tasks:['Susun huruf: م – ه – ن – د – س.','Susun huruf: ت – ا – ج – ر.','Susun kata: أَنْ – أَكُونَ – أُرِيدُ – طَبِيبًا.']},
{id:3,icon:'👨‍👩‍👧',title:'أهلي — Ahlī',name:'Keluargaku',desc:'Menulis kosakata keluarga dan ungkapan sederhana.',color:'#e8edf7',words:[['أَبِي','ayahku'],['أُمِّي','ibuku'],['أَخِي','saudara laki-lakiku'],['أُخْتِي','saudara perempuanku'],['جَدِّي','kakekku'],['جَدَّتِي','nenekku'],['عَمِّي','pamanku'],['عَمَّتِي','bibiku']],sentences:[['هٰذِهِ أُمِّي.','Ini ibuku.'],['هٰذَا أَبِي.','Ini ayahku.']],tasks:['Susun huruf: أ – ب – ي.','Susun huruf: ا – ب – ن.','Lengkapi: هٰذِهِ .......... (أُمِّي).']},
{id:4,icon:'👪',title:'أفراد الأسرة — Afrād al-Usrah',name:'Anggota Keluarga',desc:'Mengenal anggota keluarga dan kata tunjuk.',color:'#eee8f6',words:[['أَبٌ','ayah'],['أُمٌّ','ibu'],['جَدٌّ','kakek'],['جَدَّةٌ','nenek'],['أَخٌ','saudara laki-laki'],['أُخْتٌ','saudara perempuan'],['عَمٌّ','paman'],['عَمَّةٌ','bibi']],sentences:[['هٰذَا أَبِي، هُوَ طَبِيبٌ.','Ini ayahku, dia dokter.'],['هٰذِهِ أُمِّي، هِيَ مُدَرِّسَةٌ.','Ini ibuku, dia guru.']],tasks:['Susun kata: هٰذِهِ – أُمِّي – مُدَرِّسَةٌ.','Susun kata: هٰذَا – أَبِي – طَبِيبٌ.']},
{id:5,icon:'🧹',title:'في البيت — Fī al-Bait',name:'Di Rumah',desc:'Menulis nama kegiatan dan benda di rumah.',color:'#e5f0e6',words:[['يَغْسِلُ','mencuci'],['يَقْرَأُ','membaca'],['يَكْوِي','menyetrika'],['يَكْنُسُ','menyapu'],['يَطْبُخُ','memasak'],['يَسْقِي','menyiram'],['الْأَطْبَاقُ','piring-piring'],['الْمَلَابِسُ','pakaian'],['الْكِتَابُ','buku']],sentences:[['أَغْسِلُ الْأَطْبَاقَ.','Saya mencuci piring.'],['أَقْرَأُ الْكِتَابَ.','Saya membaca buku.'],['أَكْنُسُ غُرْفَةَ الْجُلُوسِ.','Saya menyapu ruang duduk.']],tasks:['Susun huruf: ي – ق – ر – أ.','Susun huruf: ي – ك – و – ي.','Susun kata: يَكْنُسُ – غُرْفَةَ الْجُلُوسِ.']},
{id:6,icon:'🇮🇩',title:'أحب إندونيسيا — Uḥibbu Indūnīsiyā',name:'Aku Cinta Indonesia',desc:'Menulis nama tempat dan keindahan alam Indonesia.',color:'#f7ebd4',words:[['جَبَلٌ','gunung'],['شَاطِئٌ','pantai'],['بَحْرٌ','laut'],['جَزِيرَةٌ','pulau'],['مَنْظَرٌ','pemandangan'],['جَمِيلَةٌ','indah'],['إِنْدُونِيسِيَا','Indonesia'],['بِلَادِي','negeriku']],sentences:[['هِيَ وَطَنِي إِنْدُونِيسِيَا.','Indonesia adalah tanah airku.'],['هٰذِهِ بَلْدَةٌ جَمِيلَةٌ.','Ini negeri yang indah.'],['ذٰلِكَ جَبَلُ بُرُومُو.','Itu Gunung Bromo.']],tasks:['Susun huruf: ج – ب – ل.','Susun huruf: ش – ا – ط – ئ.','Susun kata: هِيَ – وَطَنِي – إِنْدُونِيسِيَا.']}
];
const roomGrid=$('roomGrid');
roomGrid.innerHTML=lessons.map(l=>`<button class="room-card" data-id="${l.id}" style="--room-color:${l.color}"><span class="room-icon">${l.icon}</span><h3>${l.name}</h3><p>${l.desc}</p><span class="enter-room">Masuk ruang →</span></button>`).join('');
roomGrid.addEventListener('click',e=>{
 const card=e.target.closest('.room-card');if(!card)return;const l=lessons.find(x=>x.id===+card.dataset.id);document.querySelectorAll('.room-card').forEach(x=>x.classList.remove('selected'));card.classList.add('selected');renderLesson(l);$('insideLesson').scrollIntoView({behavior:'smooth',block:'start'});tone(660,.09,'sine',.04);
});
function renderLesson(l){
 $('insideLesson').innerHTML=`<article class="lesson-content"><div class="lesson-head"><span class="big-icon">${l.icon}</span><div><h3>${l.title}</h3><p>${l.desc}</p></div></div><div class="lesson-columns"><section class="lesson-box"><h4>📖 Kosakata (الْمُفْرَدَاتُ)</h4>${l.words.map(w=>`<div class="vocab-row"><span>${w[1]}</span><span class="arabic" lang="ar" dir="rtl">${w[0]}</span></div>`).join('')}</section><section class="lesson-box"><h4>💬 Contoh kalimat</h4>${l.sentences.map(s=>`<div class="example"><div class="arabic" lang="ar" dir="rtl">${s[0]}</div><small>${s[1]}</small></div>`).join('')}</section></div><div class="mission"><b>✏️ Misi Kitabah</b><p>Salin dan kerjakan di buku tulismu. Ingat, tulisan Arab dimulai dari kanan ke kiri.</p><ol>${l.tasks.map(t=>`<li>${t}</li>`).join('')}</ol></div></article>`;
}
