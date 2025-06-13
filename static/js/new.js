
// Get references to elements
        const contentArea = document.getElementById('content-area');
        const decreaseFontBtn = document.getElementById('decrease-font');
        const increaseFontBtn = document.getElementById('increase-font');
        const lightThemeBtn = document.getElementById('light-theme');
        const darkThemeBtn = document.getElementById('dark-theme');
        const highContrastThemeBtn = document.getElementById('high-contrast-theme');

        const decreaseLineHeightBtn = document.getElementById('decrease-line-height');
        const increaseLineHeightBtn = document.getElementById('increase-line-height');
        const decreaseLetterSpacingBtn = document.getElementById('decrease-letter-spacing');
        const increaseLetterSpacingBtn = document.getElementById('increase-letter-spacing');

        const toggleHighlightLinksBtn = document.getElementById('toggle-highlight-links');
        const toggleGrayscaleBtn = document.getElementById('toggle-grayscale');
        const resetSettingsBtn = document.getElementById('reset-settings');

        const body = document.body;

        // Navbar elements
        const speakContentBtn = document.getElementById('speak-content-btn');
        const speechToTextBtn = document.getElementById('speech-to-text-btn'); 
        const signLanguageBtn = document.getElementById('sign-language-btn');
        const interactiveMapsBtn = document.getElementById('interactive-maps-btn');
        const requestAssistantBtn = document.getElementById('request-assistant-btn'); // New
        const scheduleAppointmentBtn = document.getElementById('schedule-appointment-btn'); // New

        const transcriptionOutput = document.getElementById('transcription-output');
        const transcriptionStatus = document.getElementById('transcription-status');

        // AI-Powered Text Simplification elements
        const aiTextInput = document.getElementById('ai-text-input');
        const simplifyTextBtn = document.getElementById('simplify-text-btn');
        const aiStatus = document.getElementById('ai-status');
        const aiOutput = document.getElementById('ai-output');

        // Instant Feedback elements (New)
        const feedbackTextInput = document.getElementById('feedback-text-input');
        const recordFeedbackBtn = document.getElementById('record-feedback-btn');
        const submitFeedbackBtn = document.getElementById('submit-feedback-btn');
        const feedbackStatus = document.getElementById('feedback-status');

        // AI Chatbot elements (New)
        const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
        const chatbotModal = document.getElementById('chatbot-modal');
        const chatbotMessages = document.getElementById('chatbot-messages');
        const chatbotInput = document.getElementById('chatbot-input');
        const chatbotSendBtn = document.getElementById('chatbot-send-btn');
        const chatbotLoading = document.getElementById('chatbot-loading');

        // Modals
        const signLanguageModal = document.getElementById('sign-language-modal');
        const interactiveMapsModal = document.getElementById('interactive-maps-modal');
        const requestAssistantModal = document.getElementById('request-assistant-modal'); // New
        const scheduleAppointmentModal = document.getElementById('schedule-appointment-modal'); // New
        const closeButtons = document.querySelectorAll('.close-button');


        // Default and current settings
        let currentFontSize = parseFloat(localStorage.getItem('fontSize')) || 16; // Base font size
        const fontSizeStep = 2; // px

        let currentLineHeight = parseFloat(localStorage.getItem('lineHeight')) || 1.6; // Default line height
        const lineHeightStep = 0.2; // em

        let currentLetterSpacing = parseFloat(localStorage.getItem('letterSpacing')) || 0; // Default letter spacing
        const letterSpacingStep = 0.05; // em

        let highlightLinksEnabled = localStorage.getItem('highlightLinks') === 'true';
        let grayscaleEnabled = localStorage.getItem('grayscale') === 'true';
        let currentTheme = localStorage.getItem('colorTheme') || 'light-mode'; // Default to light

        // Speech Recognition setup
        let recognition;
        let isTranscribing = false;

        // Interactive Map variables
        let mapCanvas;
        let mapCtx;
        let userPosition = { x: 50, y: 50 };
        const userSize = 10;
        const cellSize = 50; // Size of each "room" or "block" on the map
        const mapLayout = [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ]; // 0 = path, 1 = wall/obstacle

        // Chatbot history
        let chatHistory = [{ role: "model", parts: [{ text: "أهلاً بك! كيف يمكنني مساعدتك اليوم في رفقاء النور؟" }] }];

        // --- Journey Tracking (Basic Console Log) ---
        function trackJourney(activity) {
            const timestamp = new Date().toLocaleString('ar-SA', { hour12: false });
            console.log(`[سجل الأنشطة - ${timestamp}] ${activity}`);
        }

        // Functions to apply styles
        function applyFontSize() {
            contentArea.style.fontSize = `${currentFontSize}px`;
            localStorage.setItem('fontSize', currentFontSize);
            trackJourney(`تم تغيير حجم الخط إلى ${currentFontSize}px`);
        }

        function applyLineHeight() {
            contentArea.style.lineHeight = `${currentLineHeight}`;
            localStorage.setItem('lineHeight', currentLineHeight);
            trackJourney(`تم تغيير ارتفاع السطر إلى ${currentLineHeight}`);
        }

        function applyLetterSpacing() {
            contentArea.style.letterSpacing = `${currentLetterSpacing}em`;
            localStorage.setItem('letterSpacing', currentLetterSpacing);
            trackJourney(`تم تغيير تباعد الأحرف إلى ${currentLetterSpacing}em`);
        }

        function applyColorTheme(theme) {
            body.classList.remove('light-mode', 'high-contrast', 'dark-mode'); 
            if (theme === 'high-contrast') {
                body.classList.add('high-contrast');
            } else if (theme === 'dark-mode') {
                body.classList.add('dark-mode');
            } else if (theme === 'light-mode') {
                body.classList.add('light-mode');
            }
            localStorage.setItem('colorTheme', theme);
            currentTheme = theme;
            trackJourney(`تم تغيير سمة الألوان إلى ${theme}`);
        }

        function applyHighlightLinks() {
            if (highlightLinksEnabled) {
                contentArea.classList.add('highlight-links');
            } else {
                contentArea.classList.remove('highlight-links');
            }
            localStorage.setItem('highlightLinks', highlightLinksEnabled);
            trackJourney(`تم ${highlightLinksEnabled ? 'تفعيل' : 'تعطيل'} تمييز الروابط`);
        }

        function applyGrayscale() {
            if (grayscaleEnabled) {
                body.classList.add('grayscale-mode');
            } else {
                body.classList.remove('grayscale-mode');
            }
            localStorage.setItem('grayscale', grayscaleEnabled);
            trackJourney(`تم ${grayscaleEnabled ? 'تفعيل' : 'تعطيل'} تدرج الرمادي`);
        }

        function resetAllSettings() {
            currentFontSize = 16;
            currentLineHeight = 1.6;
            currentLetterSpacing = 0;
            highlightLinksEnabled = false;
            grayscaleEnabled = false;
            currentTheme = 'light-mode';

            applyFontSize();
            applyLineHeight();
            applyLetterSpacing();
            applyColorTheme(currentTheme);
            applyHighlightLinks();
            applyGrayscale();

            localStorage.removeItem('fontSize');
            localStorage.removeItem('lineHeight');
            localStorage.removeItem('letterSpacing');
            localStorage.removeItem('highlightLinks');
            localStorage.removeItem('grayscale');
            localStorage.removeItem('colorTheme');
            trackJourney('تم إعادة تعيين جميع الإعدادات');
        }

        // --- Core Functionality for Navbar ---

        // Text-to-Speech function for Arabic content
        function speakPageContent() {
            if (!('speechSynthesis' in window)) {
                alert("تحويل النص إلى كلام غير مدعوم في متصفحك."); 
                return;
            }

            window.speechSynthesis.cancel(); // Stop any ongoing speech

            const textToSpeak = contentArea.innerText; // Get all text from the main content area
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'ar-SA'; // Set to Saudi Arabic
            transcriptionStatus.textContent = 'يتكلم النص العربي...'; // Use transcriptionStatus for messages

            const voices = window.speechSynthesis.getVoices();
            const arabicVoice = voices.find(voice => voice.lang === 'ar-SA' || voice.lang.startsWith('ar-'));

            if (arabicVoice) {
                utterance.voice = arabicVoice;
            } else {
                console.warn('لم يتم العثور على صوت عربي (ar-SA). سيتم استخدام الصوت الافتراضي للمتصفح.');
                transcriptionStatus.textContent = 'يتكلم النص العربي (باستخدام الصوت الافتراضي)...';
            }

            utterance.onend = () => {
                transcriptionStatus.textContent = 'انتهى التحدث.';
                trackJourney('تم استخدام تحويل النص إلى كلام لقراءة محتوى الصفحة');
            };
            utterance.onerror = (event) => {
                console.error('خطأ في تحويل النص العربي إلى كلام:', event.error);
                transcriptionStatus.textContent = `خطأ في التحدث: ${event.error}.`;
                trackJourney(`خطأ في تحويل النص إلى كلام: ${event.error}`);
            };
            window.speechSynthesis.speak(utterance);
        }

        // Speech-to-Text (Arabic)
        function toggleSpeechToText() {
            if (!('webkitSpeechRecognition' in window)) {
                transcriptionStatus.textContent = "تحويل الكلام إلى نص غير مدعوم في متصفحك. يرجى استخدام Chrome أو Edge.";
                trackJourney('محاولة استخدام تحويل الكلام إلى نص في متصفح غير مدعوم');
                return;
            }

            if (!recognition) {
                recognition = new webkitSpeechRecognition();
                recognition.continuous = true; // Keep listening
                recognition.interimResults = true; // Show results as they come
                recognition.lang = 'ar-SA'; // Set language to Saudi Arabic

                recognition.onstart = () => {
                    isTranscribing = true;
                    speechToTextBtn.textContent = 'إيقاف التحويل';
                    speechToTextBtn.classList.remove('btn-success');
                    speechToTextBtn.classList.add('btn-danger');     
                    transcriptionOutput.value = ''; // Clear previous text
                    transcriptionStatus.textContent = 'جاري الاستماع للكلام العربي... يرجى التحدث الآن.';
                    trackJourney('بدء تحويل الكلام إلى نص');
                };

                recognition.onresult = (event) => {
                    let interimTranscript = '';
                    let finalTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }
                    transcriptionOutput.value = finalTranscript + interimTranscript;
                };

                recognition.onerror = (event) => {
                    isTranscribing = false;
                    speechToTextBtn.textContent = 'تحويل الكلام إلى نص (عربي)';
                    speechToTextBtn.classList.remove('btn-danger');
                    speechToTextBtn.classList.add('btn-success');   
                    console.error('خطأ في التعرف على الكلام:', event.error);
                    if (event.error === 'no-speech') {
                        transcriptionStatus.textContent = 'لم يتم الكشف عن كلام. يرجى المحاولة مرة أخرى والتحدث بوضوح.';
                        trackJourney('خطأ في تحويل الكلام إلى نص: لم يتم الكشف عن كلام');
                    } else if (event.error === 'not-allowed') {
                        transcriptionStatus.textContent = 'تم حظر الوصول إلى الميكروفون. يرجى السماح بالوصول في إعدادات المتصفح.';
                        trackJourney('خطأ في تحويل الكلام إلى نص: تم حظر الميكروفون');
                    } else {
                        transcriptionStatus.textContent = `خطأ: ${event.error}. يرجى التأكد من الوصول إلى الميكروفون والمحاولة مرة أخرى.` + (event.error === 'aborted' ? ' (تم الإيقاف عن طريق المستخدم أو النظام).' : '');
                        trackJourney(`خطأ غير معروف في تحويل الكلام إلى نص: ${event.error}`);
                    }
                };

                recognition.onend = () => {
                    isTranscribing = false;
                    speechToTextBtn.textContent = 'تحويل الكلام إلى نص (عربي)';
                    speechToTextBtn.classList.remove('btn-danger');
                    speechToTextBtn.classList.add('btn-success');   
                    transcriptionStatus.textContent = 'انتهى التحويل. انقر للبدء مرة أخرى.';
                    trackJourney('انتهى تحويل الكلام إلى نص');
                };
            }

            if (isTranscribing) {
                recognition.stop();
            } else {
                recognition.start();
            }
        }


        // LLM-Powered Text Simplification/Rewriting
        async function simplifyText() {
            const textToProcess = aiTextInput.value.trim();
            if (!textToProcess) {
                aiStatus.textContent = 'الرجاء إدخال نص عربي للتبسيط أو إعادة الصياغة.';
                return;
            }

            aiStatus.textContent = 'جاري معالجة النص...';
            aiOutput.value = ''; // Clear previous output
            trackJourney('بدء تبسيط/إعادة صياغة النص');

            try {
                const prompt = `أعد صياغة هذا النص العربي لجعله أبسط وأسهل في الفهم، مع التركيز على الوضوح لكبار السن وذوي الإعاقة. النص الأصلي: ${textToProcess}`;
                
                let chatHistory = [];
                chatHistory.push({ role: "user", parts: [{ text: prompt }] });

                const payload = { contents: chatHistory };
                const apiKey = ""; 
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`API error: ${response.status} - ${errorData.error.message}`);
                }

                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const simplifiedText = result.candidates[0].content.parts[0].text;
                    aiOutput.value = simplifiedText;
                    aiStatus.textContent = 'تم تبسيط/إعادة صياغة النص بنجاح.';
                    trackJourney('تم تبسيط النص بنجاح باستخدام الذكاء الاصطناعي');
                } else {
                    aiStatus.textContent = 'لم يتمكن الذكاء الاصطناعي من معالجة النص. يرجى المحاولة مرة أخرى.';
                    console.error('LLM response structure unexpected:', result);
                    trackJourney('فشل تبسيط النص: استجابة غير متوقعة من LLM');
                }

            } catch (error) {
                aiStatus.textContent = `حدث خطأ: ${error.message}`;
                console.error('Error calling Gemini API:', error);
                trackJourney(`خطأ في تبسيط النص بواسطة الذكاء الاصطناعي: ${error.message}`);
            }
        }

        // --- Instant Feedback (New) ---
        let mediaRecorderFeedback;
        let audioChunksFeedback = [];
        let isRecordingFeedback = false;

        async function toggleRecordFeedback() {
            if (!isRecordingFeedback) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    mediaRecorderFeedback = new MediaRecorder(stream);
                    audioChunksFeedback = [];

                    mediaRecorderFeedback.ondataavailable = event => {
                        audioChunksFeedback.push(event.data);
                    };

                    mediaRecorderFeedback.onstop = () => {
                        const audioBlob = new Blob(audioChunksFeedback, { type: 'audio/webm' });
                        // For a real app, you'd upload this blob to a server.
                        // For now, just indicate it's recorded.
                        feedbackStatus.textContent = 'تم تسجيل الملاحظات الصوتية بنجاح.';
                        trackJourney('تم تسجيل ملاحظات صوتية');
                    };

                    mediaRecorderFeedback.start();
                    recordFeedbackBtn.textContent = 'إيقاف التسجيل';
                    recordFeedbackBtn.classList.remove('btn-outline-success');
                    recordFeedbackBtn.classList.add('btn-danger');
                    isRecordingFeedback = true;
                    feedbackStatus.textContent = 'جاري التسجيل... يرجى التحدث بملاحظاتك.';
                    trackJourney('بدء تسجيل الملاحظات الصوتية');
                } catch (err) {
                    console.error("خطأ في الوصول إلى الميكروفون:", err);
                    feedbackStatus.textContent = "تعذر الوصول إلى الميكروفون. يرجى التحقق من الأذونات.";
                    trackJourney(`خطأ في الوصول إلى الميكروفون لتسجيل الملاحظات: ${err.message}`);
                }
            } else {
                if (mediaRecorderFeedback && mediaRecorderFeedback.state === 'recording') {
                    mediaRecorderFeedback.stop();
                    recordFeedbackBtn.textContent = 'تسجيل الملاحظات الصوتية';
                    recordFeedbackBtn.classList.remove('btn-danger');
                    recordFeedbackBtn.classList.add('btn-outline-success');
                    isRecordingFeedback = false;
                    feedbackStatus.textContent = 'تم إيقاف التسجيل.';
                    trackJourney('إيقاف تسجيل الملاحظات الصوتية');
                }
            }
        }

        function submitFeedback() {
            const textFeedback = feedbackTextInput.value.trim();
            if (textFeedback || audioChunksFeedback.length > 0) {
                console.log('ملاحظات نصية:', textFeedback);
                if (audioChunksFeedback.length > 0) {
                    const audioBlob = new Blob(audioChunksFeedback, { type: 'audio/webm' });
                    console.log('ملاحظات صوتية (Blob):', audioBlob);
                }
                feedbackStatus.textContent = 'شكراً لملاحظاتك!';
                feedbackTextInput.value = '';
                audioChunksFeedback = []; // Clear recorded audio
                trackJourney('تم إرسال التقييم');
            } else {
                feedbackStatus.textContent = 'الرجاء إدخال ملاحظات نصية أو تسجيل ملاحظات صوتية.';
            }
        }

        // --- Interactive Map (New) ---
        let mapUserX = 0;
        let mapUserY = 0;
        const mapSpeed = 10;
        let mapCurrentDirection = 0; // 0: Up, 90: Right, 180: Down, 270: Left

        function drawMap() {
            if (!mapCtx) return;
            mapCtx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);

            // Draw grid and walls
            for (let row = 0; row < mapLayout.length; row++) {
                for (let col = 0; col < mapLayout[row].length; col++) {
                    mapCtx.beginPath();
                    mapCtx.rect(col * cellSize, row * cellSize, cellSize, cellSize);
                    if (mapLayout[row][col] === 1) {
                        mapCtx.fillStyle = '#6c757d'; // Bootstrap secondary dark
                    } else {
                        mapCtx.fillStyle = '#f8f9fa'; // Bootstrap light
                    }
                    mapCtx.fill();
                    mapCtx.strokeStyle = '#dee2e6'; // Bootstrap light gray
                    mapCtx.stroke();
                }
            }

            // Draw user
            mapCtx.beginPath();
            mapCtx.arc(userPosition.x, userPosition.y, userSize, 0, Math.PI * 2);
            mapCtx.fillStyle = '#0d6efd'; // Bootstrap primary
            mapCtx.fill();
            mapCtx.strokeStyle = '#0a53ed';
            mapCtx.lineWidth = 2;
            mapCtx.stroke();

            // Draw direction indicator
            mapCtx.save();
            mapCtx.translate(userPosition.x, userPosition.y);
            mapCtx.rotate(mapCurrentDirection * Math.PI / 180);
            mapCtx.beginPath();
            mapCtx.moveTo(0, -userSize);
            mapCtx.lineTo(userSize * 0.7, 0);
            mapCtx.lineTo(0, userSize);
            mapCtx.fillStyle = 'yellow';
            mapCtx.fill();
            mapCtx.restore();
        }

        function speakMapGuidance(message) {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(message);
                utterance.lang = 'ar-SA';
                mapGuidanceStatus.textContent = message;
                window.speechSynthesis.speak(utterance);
            }
        }

        function moveMapUser(direction) {
            let nextX = userPosition.x;
            let nextY = userPosition.y;
            let currentGridX = Math.floor(userPosition.x / cellSize);
            let currentGridY = Math.floor(userPosition.y / cellSize);
            let newGuidance = '';

            // Update position based on direction
            if (direction === 'forward') {
                switch (mapCurrentDirection) {
                    case 0: // Up
                        nextY -= mapSpeed;
                        newGuidance = 'تتحرك إلى الأمام.';
                        break;
                    case 90: // Right
                        nextX += mapSpeed;
                        newGuidance = 'تتحرك إلى اليمين.';
                        break;
                    case 180: // Down
                        nextY += mapSpeed;
                        newGuidance = 'تتحرك إلى الخلف.';
                        break;
                    case 270: // Left
                        nextX -= mapSpeed;
                        newGuidance = 'تتحرك إلى اليسار.';
                        break;
                }
            } else if (direction === 'left') {
                mapCurrentDirection = (mapCurrentDirection - 90 + 360) % 360;
                newGuidance = 'استدرت يسارًا.';
            } else if (direction === 'right') {
                mapCurrentDirection = (mapCurrentDirection + 90) % 360;
                newGuidance = 'استدرت يمينًا.';
            }

            // Check for collisions (simple grid-based collision for walls)
            let nextGridX = Math.floor(nextX / cellSize);
            let nextGridY = Math.floor(nextY / cellSize);

            if (nextGridX >= 0 && nextGridX < mapLayout[0].length &&
                nextGridY >= 0 && nextGridY < mapLayout.length) {
                if (mapLayout[nextGridY][nextGridX] !== 1) { // If not a wall
                    userPosition.x = nextX;
                    userPosition.y = nextY;
                } else {
                    newGuidance += ' اصطدمت بحائط!';
                }
            } else {
                 newGuidance += ' وصلت إلى حافة الخريطة!';
            }

            drawMap();
            speakMapGuidance(newGuidance);
            trackJourney(`تحرك المستخدم في الخريطة: ${direction}, الاتجاه: ${mapCurrentDirection}`);
        }

        // --- AI Chatbot (New) ---
        async function sendMessage() {
            const userMessage = chatbotInput.value.trim();
            if (!userMessage) return;

            addMessageToChat('user', userMessage);
            chatbotInput.value = ''; // Clear input
            chatbotLoading.classList.remove('d-none'); // Show loading indicator
            trackJourney(`رسالة المستخدم إلى الشات بوت: "${userMessage}"`);

            try {
                chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
                const payload = { contents: chatHistory };
                const apiKey = ""; // Canvas will provide this at runtime
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`API error: ${response.status} - ${errorData.error.message}`);
                }

                const result = await response.json();
                chatbotLoading.classList.add('d-none'); // Hide loading indicator

                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const aiResponse = result.candidates[0].content.parts[0].text;
                    addMessageToChat('ai', aiResponse);
                    chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });
                    trackJourney(`استجابة الشات بوت: "${aiResponse}"`);

                    // Speak AI response for visual/audio accessibility
                    if ('speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                        const utterance = new SpeechSynthesisUtterance(aiResponse);
                        utterance.lang = 'ar-SA';
                        window.speechSynthesis.speak(utterance);
                    }
                } else {
                    addMessageToChat('ai', 'عذرًا، لم أتمكن من فهم طلبك. يرجى المحاولة مرة أخرى.');
                    trackJourney('الشات بوت: استجابة غير متوقعة من LLM');
                }

            } catch (error) {
                chatbotLoading.classList.add('d-none');
                addMessageToChat('ai', `حدث خطأ: ${error.message}`);
                console.error('Error calling Gemini API for chatbot:', error);
                trackJourney(`خطأ في الشات بوت: ${error.message}`);
            } finally {
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to bottom
            }
        }

        function addMessageToChat(sender, text) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('chat-message', sender);
            messageDiv.textContent = text;
            chatbotMessages.appendChild(messageDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to bottom
        }

        // --- Modal functions ---
        function openModal(modalElement) {
            modalElement.classList.add('visible');
            modalElement.style.display = 'flex'; // Ensure it's flex for centering
            trackJourney(`تم فتح النافذة المنبثقة: ${modalElement.id}`);

            if (modalElement.id === 'interactive-maps-modal') {
                // Initialize map when modal is opened
                mapCanvas = document.getElementById('interactive-map-canvas');
                mapCtx = mapCanvas.getContext('2d');
                mapUserX = mapCanvas.width / 2;
                mapUserY = mapCanvas.height / 2;
                userPosition = { x: mapUserX, y: mapUserY };
                mapCurrentDirection = 0; // Reset direction to up
                drawMap();
                speakMapGuidance('أهلاً بك في الخريطة الداخلية. استخدم الأسهم للتنقل.');
            }
        }

        function closeModal(modalElement) {
            modalElement.classList.remove('visible');
            // Allow transition to complete before setting display to none
            setTimeout(() => {
                modalElement.style.display = 'none';
            }, 300); // Match CSS transition duration
            trackJourney(`تم إغلاق النافذة المنبثقة: ${modalElement.id}`);
        }

        // Load saved preferences on page load
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize font size and line height on contentArea
            contentArea.style.fontSize = `${currentFontSize}px`;
            contentArea.style.lineHeight = `${currentLineHeight}`;

            applyFontSize();
            applyLineHeight();
            applyLetterSpacing();
            applyColorTheme(currentTheme); // Apply theme on load
            applyHighlightLinks();
            applyGrayscale();

            // Populate voices after they are loaded (important for TTS)
            if ('speechSynthesis' in window) {
                window.speechSynthesis.onvoiceschanged = () => {
                    console.log('Voices loaded for Speech Synthesis.');
                };
            }

            trackJourney('تم تحميل الصفحة');
        });

        // Event Listeners for existing controls
        increaseFontBtn.addEventListener('click', () => {
            currentFontSize += fontSizeStep;
            applyFontSize();
        });

        decreaseFontBtn.addEventListener('click', () => {
            if (currentFontSize > fontSizeStep) {
                currentFontSize -= fontSizeStep;
                applyFontSize();
            }
        });

        lightThemeBtn.addEventListener('click', () => applyColorTheme('light-mode'));
        darkThemeBtn.addEventListener('click', () => applyColorTheme('dark-mode'));
        highContrastThemeBtn.addEventListener('click', () => applyColorTheme('high-contrast'));

        increaseLineHeightBtn.addEventListener('click', () => {
            currentLineHeight = Math.min(currentLineHeight + lineHeightStep, 2.5); 
            applyLineHeight();
        });

        decreaseLineHeightBtn.addEventListener('click', () => {
            if (currentLineHeight > 1.0) { 
                currentLineHeight = Math.max(currentLineHeight - lineHeightStep, 1.0);
                applyLineHeight();
            }
        });

        increaseLetterSpacingBtn.addEventListener('click', () => {
            currentLetterSpacing = Math.min(currentLetterSpacing + letterSpacingStep, 0.5); 
            applyLetterSpacing();
        });

        decreaseLetterSpacingBtn.addEventListener('click', () => {
            currentLetterSpacing = Math.max(currentLetterSpacing - letterSpacingStep, 0); 
            applyLetterSpacing();
        });

        toggleHighlightLinksBtn.addEventListener('click', () => {
            highlightLinksEnabled = !highlightLinksEnabled;
            applyHighlightLinks();
        });

        toggleGrayscaleBtn.addEventListener('click', () => {
            grayscaleEnabled = !grayscaleEnabled;
            applyGrayscale();
        });

        resetSettingsBtn.addEventListener('click', resetAllSettings);

        // Event Listeners for Navbar features
        speakContentBtn.addEventListener('click', speakPageContent);
        speechToTextBtn.addEventListener('click', toggleSpeechToText); 
        simplifyTextBtn.addEventListener('click', simplifyText); 
        
        signLanguageBtn.addEventListener('click', () => openModal(signLanguageModal));
        interactiveMapsBtn.addEventListener('click', () => openModal(interactiveMapsModal));
        requestAssistantBtn.addEventListener('click', () => openModal(requestAssistantModal)); // New
        scheduleAppointmentBtn.addEventListener('click', () => openModal(scheduleAppointmentModal)); // New

        // Instant Feedback Event Listeners
        recordFeedbackBtn.addEventListener('click', toggleRecordFeedback);
        submitFeedbackBtn.addEventListener('click', submitFeedback);

        // Interactive Map Event Listeners
        document.getElementById('map-move-forward').addEventListener('click', () => moveMapUser('forward'));
        document.getElementById('map-turn-left').addEventListener('click', () => moveMapUser('left'));
        document.getElementById('map-turn-right').addEventListener('click', () => moveMapUser('right'));
        const mapGuidanceStatus = document.getElementById('map-guidance-status');


        // Chatbot Event Listeners
        chatbotToggleBtn.addEventListener('click', () => openModal(chatbotModal));
        chatbotSendBtn.addEventListener('click', sendMessage);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const modalId = event.target.dataset.modal;
                const modalToClose = document.getElementById(modalId);
                if (modalToClose) {
                    closeModal(modalToClose);
                }
            });
        });

        // Form Submission Event Listeners (Prevent default and log)
        document.getElementById('assistant-request-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('assistant-name').value;
            const contact = document.getElementById('assistant-contact').value;
            const details = document.getElementById('assistant-details').value;
            const statusDiv = document.getElementById('assistant-request-status');
            statusDiv.textContent = `تم إرسال طلبك بنجاح يا ${name}! سيتم التواصل معك على ${contact}.`;
            console.log('تم إرسال طلب مرافق:', { name, contact, details });
            trackJourney('تم إرسال طلب مرافق');
            // In a real app, you'd send this data to a backend.
        });

        document.getElementById('appointment-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const date = document.getElementById('appointment-date').value;
            const time = document.getElementById('appointment-time').value;
            const type = document.getElementById('appointment-type').value;
            const statusDiv = document.getElementById('appointment-status');
            statusDiv.textContent = `تم تأكيد موعدك لنوع "${type}" في تاريخ ${date} الساعة ${time}.`;
            console.log('تم تأكيد الموعد:', { date, time, type });
            trackJourney('تم جدولة موعد');
            // In a real app, you'd send this data to a backend.
        });