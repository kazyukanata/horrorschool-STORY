/* ゲーム進行・UI */
        let gameState = {
            currentRoom: 'class2b',
            inventory: [],
            solvedCount: 0,
            errorCount: 0,
            solvedRiddles: {
                r1: false, r2: false, r3: false, r4: false, r5: false,
                r6: false, r7: false, r8: false, r9: false, r10: false
            },
            startTime: null,
            timerInterval: null,
            elapsedSeconds: 0,
            isGameOver: false,
            audioCtx: null,
            bgmInterval: null,
            currentHintRiddle: 1,
            lastPhantomMinute: 0
        };

        const rooms = {
            class2b: {
                name: '2年B組 教室 (謎1 & 謎2)',
                nav: [
                    { to: 'hallway', label: '廊下 ➔' },
                    { to: 'science', label: '理科室' },
                    { to: 'nurse', label: '保健室' },
                    { to: 'music', label: '音楽室' }
                ],
                render: () => `
                    <div class="space-y-4">
                        <div class="text-4xl mb-2">🏫</div>
                        <h4 class="text-base md:text-lg font-bold text-slate-100">2年B組 教室</h4>
                        <p class="text-xs md:text-sm text-slate-300 font-medium">黒板の言葉の序列と、教卓に残された古文書がある。</p>
                        <div class="flex flex-wrap justify-center gap-3 pt-2">
                            <button onclick="examineRiddle1()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer font-bold">【謎1】黒板の席次メモ</button>
                            <button onclick="examineRiddle2()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer font-bold">【謎2】教卓の古文書</button>
                        </div>
                    </div>
                `
            },
            hallway: {
                name: '中央廊下 (謎3 & 謎4)',
                nav: [
                    { to: 'class2b', label: '⬅ 教室' },
                    { to: 'science', label: '理科室' },
                    { to: 'broadcast', label: '放送室' },
                    { to: 'staffroom', label: '🔒 職員室' }
                ],
                render: () => `
                    <div class="space-y-4">
                        <div class="text-4xl mb-2">🚪</div>
                        <h4 class="text-base md:text-lg font-bold text-slate-100">中央廊下・掲示板</h4>
                        <p class="text-xs md:text-sm text-slate-300 font-medium">窓ガラスの映り込みと、掲示板の規則性を示す図表がある。</p>
                        <div class="flex flex-wrap justify-center gap-3 pt-2">
                            <button onclick="examineRiddle3()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer font-bold">【謎3】窓ガラスの映り込み</button>
                            <button onclick="examineRiddle4()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer font-bold">【謎4】掲示板の論理図表</button>
                        </div>
                    </div>
                `
            },
            science: {
                name: '理科室 (謎5)',
                nav: [
                    { to: 'hallway', label: '⬅ 廊下' },
                    { to: 'class2b', label: '教室' },
                    { to: 'nurse', label: '保健室' }
                ],
                render: () => `
                    <div class="space-y-4">
                        <div class="text-4xl mb-2">🧪</div>
                        <h4 class="text-base md:text-lg font-bold text-slate-100">理科室・実験台</h4>
                        <p class="text-xs md:text-sm text-slate-300 font-medium">天秤と、未知の溶液に関する哲学的ジレンマのメモがある。</p>
                        <div class="flex flex-wrap justify-center gap-3 pt-2">
                            <button onclick="examineRiddle5()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer font-bold">【謎5】天秤の比率パズル</button>
                        </div>
                    </div>
                `
            },
            nurse: {
                name: '保健室 (謎6)',
                nav: [
                    { to: 'hallway', label: '⬅ 廊下' },
                    { to: 'science', label: '理科室' },
                    { to: 'music', label: '音楽室' }
                ],
                render: () => `
                    <div class="space-y-4">
                        <div class="text-4xl mb-2">💊</div>
                        <h4 class="text-base md:text-lg font-bold text-slate-100">保健室・ベッドルーム</h4>
                        <p class="text-xs md:text-sm text-slate-300 font-medium">人体解剖図と、心理テストのカルテが置かれている。</p>
                        <div class="flex flex-wrap justify-center gap-3 pt-2">
                            <button onclick="examineRiddle6()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer font-bold">【謎6】保健室の薬瓶</button>
                        </div>
                    </div>
                `
            },
            music: {
                name: '音楽室 (謎7)',
                nav: [
                    { to: 'hallway', label: '⬅ 廊下' },
                    { to: 'class2b', label: '教室' },
                    { to: 'broadcast', label: '放送室' }
                ],
                render: () => `
                    <div class="space-y-4">
                        <div class="text-4xl mb-2">🎹</div>
                        <h4 class="text-base md:text-lg font-bold text-slate-100">音楽室・グランドピアノ</h4>
                        <p class="text-xs md:text-sm text-slate-300 font-medium">五線譜に書かれた不協和音の暗号がある。</p>
                        <div class="flex flex-wrap justify-center gap-3 pt-2">
                            <button onclick="examineRiddle7()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer font-bold">【謎7】ピアノの譜面</button>
                        </div>
                    </div>
                `
            },
            broadcast: {
                name: '放送室 (謎8 & 謎9)',
                nav: [
                    { to: 'hallway', label: '⬅ 廊下' },
                    { to: 'music', label: '音楽室' },
                    { to: 'staffroom', label: '職員室' }
                ],
                render: () => `
                    <div class="space-y-4">
                        <div class="text-4xl mb-2">🎙️</div>
                        <h4 class="text-base md:text-lg font-bold text-slate-100">放送室・ミキサー卓</h4>
                        <p class="text-xs md:text-sm text-slate-300 font-medium">アナログラジオの周波数盤と、哲学的メッセージが刻まれたテープがある。</p>
                        <div class="flex flex-wrap justify-center gap-3 pt-2">
                            <button onclick="examineRiddle8()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer font-bold">【謎8】放送室のダイヤル</button>
                            <button onclick="examineRiddle9()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer font-bold">【謎9】逆再生テープ</button>
                        </div>
                    </div>
                `
            },
            staffroom: {
                name: '職員室 (最終 謎10)',
                nav: [{ to: 'hallway', label: '⬅ 廊下' }],
                render: () => `
                    <div class="space-y-4">
                        <div class="text-4xl mb-2">🏛️</div>
                        <h4 class="text-base md:text-lg font-bold text-slate-100">職員室・マスター金庫 (謎10)</h4>
                        <p class="text-xs md:text-sm text-slate-300 font-medium">これまでの1〜9の謎で得た「思考のベクトル」をすべて統合する最終防壁。</p>
                        <div class="flex flex-wrap justify-center gap-3 pt-2">
                            <button onclick="examineRiddle10()" class="bg-red-950 hover:bg-red-900 text-red-200 text-xs md:text-sm px-5 py-3 rounded-xl border border-red-700 transition font-bold cursor-pointer">【謎10】マスター金庫の統合パネル</button>
                        </div>
                    </div>
                `
            }
        };


        
        

        function startGame() {
            document.getElementById('screen-intro').classList.add('hidden');
            document.getElementById('screen-game').classList.remove('hidden');
            gameState.startTime = Date.now();
            gameState.timerInterval = setInterval(updateTimer, 1000);
            initHorrorBGM();
            FX.init();
            renderRoom();
            addLog("ゲーム開始！制限時間20分。大人の論理的思考でこの迷宮を突破せよ！");
        }

        function initHorrorBGM() {
            try {
                gameState.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                
                function playAmbientLoop() {
                    if (gameState.isGameOver || !gameState.audioCtx) return;
                    try {
                        let osc = gameState.audioCtx.createOscillator();
                        let gain = gameState.audioCtx.createGain();
                        
                        osc.type = 'sine';
                        let now = gameState.audioCtx.currentTime;
                        osc.frequency.setValueAtTime(55, now);
                        osc.frequency.linearRampToValueAtTime(58.27, now + 4);
                        osc.frequency.linearRampToValueAtTime(55, now + 8);
                        
                        gain.gain.setValueAtTime(0.01, now);
                        gain.gain.linearRampToValueAtTime(0.25, now + 3);
                        gain.gain.linearRampToValueAtTime(0.01, now + 8);
                        
                        osc.connect(gain);
                        gain.connect(gameState.audioCtx.destination);
                        
                        osc.start(now);
                        osc.stop(now + 8);
                    } catch(err) {}
                }

                playAmbientLoop();
                gameState.bgmInterval = setInterval(playAmbientLoop, 8000);
            } catch(e) {}
        }

        function playHeartbeat() {
            try {
                if (!gameState.audioCtx || gameState.isGameOver) return;
                let ctx = gameState.audioCtx;

                function singleBeat(delay) {
                    setTimeout(() => {
                        if (gameState.isGameOver) return;
                        let osc = ctx.createOscillator();
                        let gain = ctx.createGain();
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(60, ctx.currentTime);
                        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);
                        
                        gain.gain.setValueAtTime(0.8, ctx.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
                        
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start();
                        osc.stop(ctx.currentTime + 0.15);
                    }, delay);
                }

                singleBeat(0);
                singleBeat(250);
            } catch(e) {}
        }

        function triggerPhantomFlash() {
            const overlay = document.getElementById('phantom-overlay');
            if (!overlay || gameState.isGameOver) return;
            overlay.classList.remove('hidden');
            
            try {
                if (gameState.audioCtx) {
                    let ctx = gameState.audioCtx;
                    let osc = ctx.createOscillator();
                    let gain = ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(100, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.6);
                    gain.gain.setValueAtTime(0.6, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.6);
                }
            } catch(e) {}

            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 3500);
        }

        function playHorrorScream() {
            try {
                if (!gameState.audioCtx) return;
                let ctx = gameState.audioCtx;
                
                let osc1 = ctx.createOscillator();
                let gain1 = ctx.createGain();
                osc1.type = 'sawtooth';
                osc1.frequency.setValueAtTime(45, ctx.currentTime);
                osc1.frequency.linearRampToValueAtTime(25, ctx.currentTime + 3);
                gain1.gain.setValueAtTime(0.5, ctx.currentTime);
                gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3);
                osc1.connect(gain1);
                gain1.connect(ctx.destination);
                osc1.start();
                osc1.stop(ctx.currentTime + 3);

                setTimeout(() => {
                    let osc2 = ctx.createOscillator();
                    let gain2 = ctx.createGain();
                    osc2.type = 'sine';
                    osc2.frequency.setValueAtTime(500, ctx.currentTime);
                    osc2.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 1.5);
                    osc2.frequency.linearRampToValueAtTime(180, ctx.currentTime + 2.5);
                    gain2.gain.setValueAtTime(0.4, ctx.currentTime);
                    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.5);
                    osc2.connect(gain2);
                    gain2.connect(ctx.destination);
                    osc2.start();
                    osc2.stop(ctx.currentTime + 2.5);
                }, 400);

                const phantomTexts = [
                    "「……すぐ後ろにいる……」",
                    "「……まだ逃げられると思っているのか……？」",
                    "「……時間がない……」"
                ];
                const randomText = phantomTexts[Math.floor(Math.random() * phantomTexts.length)];
                addLog(`<span class="text-red-500 font-bold">${randomText}</span>`);
            } catch(e) {}
        }

        function updateTimer() {
            if (gameState.isGameOver) return;
            const now = Date.now();
            gameState.elapsedSeconds = Math.floor((now - gameState.startTime) / 1000);
            
            const totalLimit = 1200;
            const remaining = Math.max(0, totalLimit - gameState.elapsedSeconds);
            const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
            const secs = (remaining % 60).toString().padStart(2, '0');
            const timerEl = document.getElementById('timer');
            if (timerEl) {
                timerEl.innerText = `${mins}:${secs}`;
                
                if (remaining <= 180) {
                    timerEl.className = "font-retro text-2xl text-red-500 font-bold timer-blink";
                    playHeartbeat();
                } else if (remaining <= 300) {
                    timerEl.className = "font-retro text-2xl text-red-500 font-bold timer-blink";
                    playHeartbeat();
                } else if (remaining <= 600) {
                    timerEl.className = "font-retro text-2xl text-red-500 font-bold";
                }
            }
            
            FX.tick();
            const currentElapsedMinutes = Math.floor(gameState.elapsedSeconds / 60);
            if (currentElapsedMinutes > gameState.lastPhantomMinute && remaining > 0) {
                gameState.lastPhantomMinute = currentElapsedMinutes;
                FX.minute(currentElapsedMinutes);
            }

            if (remaining <= 0) {
                triggerGameOverTime();
            }
        }

        function triggerGameOverTime() {
            if (gameState.isGameOver) return;
            gameState.isGameOver = true;
            clearInterval(gameState.timerInterval);
            clearInterval(gameState.bgmInterval); FX.stop();
            document.getElementById('screen-game').classList.add('hidden');
            document.getElementById('screen-gameover-time').classList.remove('hidden');
        }

        function triggerGameOverTrap(msg) {
            if (gameState.isGameOver) return;
            gameState.isGameOver = true;
            clearInterval(gameState.timerInterval);
            clearInterval(gameState.bgmInterval); FX.stop();
            document.getElementById('screen-game').classList.add('hidden');
            document.getElementById('trap-message').innerText = msg;
            document.getElementById('screen-gameover-trap').classList.remove('hidden');
        }

        function changeRoom(roomKey) {
            if (gameState.isGameOver) return;
            gameState.currentRoom = roomKey;
            FX.room();
            renderRoom();
        }

        function renderRoom() {
            const room = rooms[gameState.currentRoom];
            document.getElementById('room-title').innerText = `場所: ${room.name}`;
            document.getElementById('progress-indicator').innerText = `クリアした謎: ${gameState.solvedCount} / 10 ／ 次: ${NEXTLOC[gameState.solvedCount+1]}`;
            
            let navHtml = '';
            room.nav.forEach(n => {
                navHtml += `<button onclick="changeRoom('${n.to}')" class="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer font-bold">${n.label}</button>`;
            });
            document.getElementById('room-nav').innerHTML = navHtml;
            document.getElementById('room-view').innerHTML = sceneHtml() + '<div class="relative z-10 bg-black/55 rounded-xl p-5 backdrop-blur-[1px]">' + room.render() + '</div>';
            decorateRiddleButtons();
            renderInventory();
        }

        function renderInventory() {
            const invContainer = document.getElementById('inventory-list');
            if (!invContainer) return;
            if (gameState.inventory.length === 0) {
                invContainer.innerHTML = '<span class="text-xs text-slate-400 self-center px-2 font-medium">まだアイテムはありません</span>';
                return;
            }
            let html = '';
            gameState.inventory.forEach(item => {
                html += `<div class="bg-indigo-950/70 border border-indigo-500/40 text-indigo-200 text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 font-medium"><span>📦</span><span>${item}</span></div>`;
            });
            invContainer.innerHTML = html;
        }

        function addLog(text) {
            const logContainer = document.getElementById('log-container');
            if (!logContainer) return;
            const div = document.createElement('div');
            div.className = "text-slate-200 border-l-2 border-red-500/60 pl-2.5 py-0.5 font-medium";
            div.innerHTML = text;
            logContainer.appendChild(div);
            logContainer.scrollTop = logContainer.scrollHeight;
        }

        function submitAnswer() {
            if (gameState.isGameOver) return;
            const inputEl = document.getElementById('answer-input');
            if (!inputEl) return;
            const input = inputEl.value.normalize('NFKC').trim().toLowerCase();
            if (!input) return;
            inputEl.value = '';

            addLog(`入力解答: 「${input}」`);

            const trapLeads = ['miracle', 'きせき', '奇跡', 'freedom', 'free', 'escape'];
            if (trapLeads.includes(input)) {
                triggerGameOverTrap(`情報がまだ ${gameState.solvedCount} / 10 問しか揃っていない、あるいは罠のワード「${input}」を選んでしまったため、防衛トラップが作動した！`);
                return;
            }

            let matched = false;
            const cur = gameState.solvedCount + 1;
            if (cur <= 9 && ANS[cur].includes(input)) { markSolved('r'+cur, cur); matched = true; }
            else if (cur <= 9 && Object.keys(ANS).some(k => k > cur && ANS[k].includes(input))) {
                addLog('システム: その謎にはまだ辿り着いていない。今の謎を解け。'); return;
            }
            if (!matched && (input === '3015' || input === '5103')) {
                if (gameState.solvedCount < 9) { addLog(`システム: 金庫は沈黙したまま。断片が足りない（${gameState.solvedCount}/9）`); return; }
                gameState.solvedRiddles.r10 = true;
                if (input === '3015') triggerSuccess1(); else triggerSuccess2();
                return;
            }

            if (!matched) {
                gameState.errorCount++;
                addLog(`システム: 不正解、またはまだ解けない暗号です。（誤り回数: ${gameState.errorCount} / 3）`);
                if (gameState.errorCount >= 3) {
                    triggerGameOverTrap("誤った入力を3回繰り返したため、校舎の防衛セキュリティが暴走した……！");
                }
            }
        }

        function markSolved(key, n) {
            gameState.solvedRiddles[key] = true;
            gameState.solvedCount++;
            gameState.inventory.push(`断片${n}: 【${FRAG[n]}】`);
            renderInventory();
            document.getElementById('progress-indicator').innerText = `クリアした謎: ${gameState.solvedCount} / 10`;
            addLog(`【正解】謎${n} を解いた。断片【${FRAG[n]}】を手に入れた。`);
            renderRoom();
            if (n < 9) addLog(`システム: 次の謎は【${NEXTLOC[n+1]}】にある。`);
            if (gameState.solvedCount === 9) addLog("システム: 断片が9つ揃った。職員室の金庫を調べよ。");
        }

        function triggerSuccess1() {
            if (gameState.isGameOver) return;
            gameState.isGameOver = true;
            clearInterval(gameState.timerInterval);
            clearInterval(gameState.bgmInterval); FX.stop();
            document.getElementById('screen-game').classList.add('hidden');
            document.getElementById('screen-success-1').classList.remove('hidden');
            const mins = Math.floor(gameState.elapsedSeconds / 60);
            const secs = gameState.elapsedSeconds % 60;
            document.getElementById('success-time-1').innerText = `クリアタイム: ${mins}分${secs}秒`;
        }

        function triggerSuccess2() {
            if (gameState.isGameOver) return;
            gameState.isGameOver = true;
            clearInterval(gameState.timerInterval);
            clearInterval(gameState.bgmInterval); FX.stop();
            document.getElementById('screen-game').classList.add('hidden');
            document.getElementById('screen-success-2').classList.remove('hidden');
            const mins = Math.floor(gameState.elapsedSeconds / 60);
            const secs = gameState.elapsedSeconds % 60;
            document.getElementById('success-time-2').innerText = `クリアタイム: ${mins}分${secs}秒`;
        }

        function openZoom(title, htmlContent) {
            document.getElementById('zoom-title').innerText = title;
            document.getElementById('zoom-body').innerHTML = htmlContent;
            document.getElementById('zoomModal').classList.remove('hidden');
        }

        function openSchoolInfo() { document.getElementById('schoolInfoModal').classList.remove('hidden'); }

        function openHintSelector() {
            const container = document.getElementById('hint-riddle-buttons');
            let html = '';
            for (let i = 1; i <= 10; i++) {
                html += `<button onclick="showHintDetail(${i})" class="bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs md:text-sm py-2 px-3 rounded-lg border border-slate-700 transition font-bold cursor-pointer">謎 ${i}</button>`;
            }
            container.innerHTML = html;
            document.getElementById('hint-selector-view').classList.remove('hidden');
            document.getElementById('hint-detail-view').classList.add('hidden');
            document.getElementById('hintModal').classList.remove('hidden');
        }

        function showHintDetail(riddleNum) {
            gameState.currentHintRiddle = riddleNum;
            const data = hintsData[riddleNum];
            document.getElementById('hint-detail-title').innerText = data.title;
            
            document.getElementById('hint-text-1').innerText = "（ボタンを押すと表示されます）";
            document.getElementById('hint-text-1').className = "text-xs md:text-sm leading-relaxed text-slate-400 italic font-medium";
            const btn1 = document.getElementById('unlock-btn-1');
            btn1.innerText = "表示する";
            btn1.className = "text-xs bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 px-2.5 py-1 rounded border border-amber-600/50 transition cursor-pointer font-bold";
            btn1.disabled = false;

            document.getElementById('hint-text-2').innerText = "";
            document.getElementById('hint-text-2').classList.add('hidden');
            const btn2 = document.getElementById('unlock-btn-2');
            btn2.innerText = "ヒント1を先に開いてください";
            btn2.className = "text-xs bg-slate-800 text-slate-500 px-2.5 py-1 rounded border border-slate-700 cursor-not-allowed font-bold";
            btn2.disabled = true;

            document.getElementById('hint-text-3').innerText = "";
            document.getElementById('hint-text-3').classList.add('hidden');
            const btn3 = document.getElementById('unlock-btn-3');
            btn3.innerText = "ヒント2を先に開いてください";
            btn3.className = "text-xs bg-slate-800 text-slate-500 px-2.5 py-1 rounded border border-slate-700 cursor-not-allowed font-bold";
            btn3.disabled = true;

            document.getElementById('hint-selector-view').classList.add('hidden');
            document.getElementById('hint-detail-view').classList.remove('hidden');
        }

        function unlockHint(hintLevel) {
            const data = hintsData[gameState.currentHintRiddle];
            if (hintLevel === 1) {
                document.getElementById('hint-text-1').innerText = data.h1;
                document.getElementById('hint-text-1').className = "text-xs md:text-sm leading-relaxed text-slate-100 not-italic font-medium";
                const btn1 = document.getElementById('unlock-btn-1');
                btn1.innerText = "表示済み"; btn1.disabled = true;

                const btn2 = document.getElementById('unlock-btn-2');
                btn2.innerText = "表示する";
                btn2.className = "text-xs bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 px-2.5 py-1 rounded border border-amber-600/50 transition cursor-pointer font-bold";
                btn2.disabled = false;
                document.getElementById('hint-text-2').classList.remove('hidden');
                document.getElementById('hint-text-2').innerText = "（ボタンを押すと表示されます）";
                document.getElementById('hint-text-2').className = "text-xs md:text-sm leading-relaxed text-slate-400 italic font-medium";
            } else if (hintLevel === 2) {
                document.getElementById('hint-text-2').innerText = data.h2;
                document.getElementById('hint-text-2').className = "text-xs md:text-sm leading-relaxed text-slate-100 not-italic font-medium";
                const btn2 = document.getElementById('unlock-btn-2');
                btn2.innerText = "表示済み"; btn2.disabled = true;

                const btn3 = document.getElementById('unlock-btn-3');
                btn3.innerText = "表示する";
                btn3.className = "text-xs bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 px-2.5 py-1 rounded border border-amber-600/50 transition cursor-pointer font-bold";
                btn3.disabled = false;
                document.getElementById('hint-text-3').classList.remove('hidden');
                document.getElementById('hint-text-3').innerText = "（ボタンを押すと表示されます）";
                document.getElementById('hint-text-3').className = "text-xs md:text-sm leading-relaxed text-slate-400 italic font-medium";
            } else if (hintLevel === 3) {
                document.getElementById('hint-text-3').innerText = data.h3;
                document.getElementById('hint-text-3').className = "text-xs md:text-sm leading-relaxed text-slate-100 not-italic font-medium";
                const btn3 = document.getElementById('unlock-btn-3');
                btn3.innerText = "表示済み"; btn3.disabled = true;
            }
        }

        function backToHintSelector() {
            document.getElementById('hint-detail-view').classList.add('hidden');
            document.getElementById('hint-selector-view').classList.remove('hidden');
        }

        function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
    
        function decorateRiddleButtons() {
            document.querySelectorAll('#room-view button[onclick^="examineRiddle"]').forEach(b => {
                const n = +b.getAttribute('onclick').match(/\d+/)[0];
                if (n >= 10) return;
                if (gameState.solvedRiddles['r'+n]) { b.classList.add('opacity-50'); b.innerHTML = '✔ ' + b.innerHTML; }
                else if (n > gameState.solvedCount + 1) { b.classList.add('opacity-40'); b.innerHTML = '🔒 ' + b.innerHTML; }
            });
        }
