/* 恐怖演出: 音響・照明・人影 */
        const FX={
            c(){return gameState.audioCtx},
            init(){const c=this.c();if(!c)return;this.bus=c.createGain();this.bus.connect(c.destination);const cv=c.createConvolver(),n=c.sampleRate*2.2,b=c.createBuffer(2,n,c.sampleRate);for(let h=0;h<2;h++){const d=b.getChannelData(h);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3);}cv.buffer=b;const w=c.createGain();w.gain.value=0.5;this.bus.connect(w);w.connect(cv);cv.connect(c.destination);const nb=c.createBuffer(1,c.sampleRate*4,c.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;const s=c.createBufferSource();s.buffer=nb;s.loop=true;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=140;const g=c.createGain();g.gain.value=0.4;s.connect(lp);lp.connect(g);g.connect(c.destination);s.start();this.tone=g;},
            stop(){if(this.tone)this.tone.gain.value=0;},
            noise(d,f,q,v,t=0,type='bandpass'){const c=this.c();if(!c)return;const n=c.sampleRate*d,b=c.createBuffer(1,n,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=Math.random()*2-1;const o=c.createBufferSource();o.buffer=b;const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=c.createGain(),T=c.currentTime+t;g.gain.setValueAtTime(0.0001,T);g.gain.exponentialRampToValueAtTime(v,T+d*0.35);g.gain.exponentialRampToValueAtTime(0.0001,T+d);o.connect(fl);fl.connect(g);g.connect(this.bus||c.destination);o.start(T);},
            thud(v,t=0){const c=this.c();if(!c)return;const o=c.createOscillator(),g=c.createGain(),T=c.currentTime+t;o.frequency.setValueAtTime(75,T);o.frequency.exponentialRampToValueAtTime(30,T+0.14);g.gain.setValueAtTime(v,T);g.gain.exponentialRampToValueAtTime(0.001,T+0.16);o.connect(g);g.connect(this.bus||c.destination);o.start(T);o.stop(T+0.17);},
            steps(n,v){for(let i=0;i<n;i++){const t=i*(0.55+Math.random()*0.15);const k=0.4+0.6*i/n;this.thud(v*k,t);this.noise(0.12,250,1,v*0.6*k,t,'lowpass');}},
            knock(v){[0,0.3,0.52].forEach(t=>this.thud(v,t));},
            whisper(v){for(let i=0;i<5;i++)this.noise(0.25+Math.random()*0.2,2500+Math.random()*1500,6,v,i*0.4);},
            breath(v){this.noise(1.6,700,1.2,v,0);this.noise(1.6,700,1.2,v,2.2);},
            groan(v){this.noise(1.4,160,10,v);},
            fig(x,h,op,ms){const f=document.getElementById('fx-figure');f.style.left=x+'vw';f.style.height=h+'vh';f.style.opacity=op;setTimeout(()=>f.style.opacity=0,ms);},
            black(ms){const b=document.getElementById('fx-black');b.style.opacity=1;setTimeout(()=>b.style.opacity=0,ms);},
            flick(k){const b=document.getElementById('fx-black');let i=0;const iv=setInterval(()=>{b.style.opacity=i%2?0:0.85;if(++i>=k*2){clearInterval(iv);b.style.opacity=0;}},70+Math.random()*60);},
            tick(){const tt=gameState.elapsedSeconds,tc=document.getElementById('tc');if(tc)tc.textContent=[tt/3600|0,(tt/60|0)%60,tt%60].map(x=>String(x).padStart(2,'0')).join(':');const p=Math.min(1,gameState.elapsedSeconds/1200),st=document.documentElement.style;if(this.tone)this.tone.gain.value=0.4+p*1.2;st.setProperty('--dk',(0.45+0.5*p).toFixed(2));st.setProperty('--clear',(85-50*p).toFixed(0)+'%');st.setProperty('--gr',(0.05+0.2*p).toFixed(2));if(Math.random()<0.015+p*0.05)this.flick(1+(Math.random()*2|0));},
            log(a){addLog(`<span class="text-red-400/80 italic">${a[Math.floor(Math.random()*a.length)]}</span>`);},
            minute(m){refreshScene();
                if(m<=3){[()=>this.steps(3,0.12),()=>this.knock(0.25),()=>this.groan(1.2)][(m-1)%3]();this.log(["……どこかで、床が軋んだ。","……廊下の奥から、ゆっくり足音が近づいてくる。","……コン、コン。壁の向こうから、ノックの音。"]);}
                else if(m<=8){this.steps(5,0.3);this.whisper(0.5);this.flick(2);this.fig(Math.random()<0.5?4:96,55,0.35,700);this.log(["……窓に、自分以外の影が映っていた。","……何か囁いている。聞き取れない。","……誰かが、ずっとこちらを見ている。"]);}
                else if(m<=13){this.breath(1.2);this.whisper(0.8);this.black(1200);setTimeout(()=>this.fig(30+Math.random()*40,80,0.75,900),1300);this.log(["……耳元で、息をする音がした。","……「みつけた」と聞こえた気がした。","……さっきまで無かった濡れた足跡が、すぐそこまで続いている。"]);}
                else{this.steps(8,0.6);this.knock(0.8);this.black(1600);setTimeout(()=>{this.fig(50,105,0.9,1400);document.body.classList.add('fx-shake');setTimeout(()=>document.body.classList.remove('fx-shake'),1500);},1700);this.log(["……足音が、この部屋の前で止まった。","……すぐ後ろに、冷たい空気を感じる。振り向いてはいけない。"]);}
            },
            room(){if(Math.floor(gameState.elapsedSeconds/60)>=5&&Math.random()<0.3){this.fig(8+Math.random()*84,45,0.25,500);this.steps(1,0.2);}}
        };
