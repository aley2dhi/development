 function setLanguage(lang) {
            const htmlTag = document.documentElement;
            htmlTag.setAttribute('lang', lang);
            htmlTag.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
            

            // Update all elements with data-en-text and data-ar-text attributes
            document.querySelectorAll('[data-en-text], [data-ar-text]').forEach(element => {
                const text = element.getAttribute(`data-${lang}-text`);
                if (text) {
                    element.textContent = text;
                }
            });

            // Update title
            const titleTag = document.querySelector('title');
            const titleText = titleTag.getAttribute(`data-${lang}`);
            if (titleText) {
                titleTag.textContent = titleText;
            }

            // Update placeholders
            document.querySelectorAll('[data-en-placeholder], [data-ar-placeholder]').forEach(element => {
                const placeholder = element.getAttribute(`data-${lang}-placeholder`);
                if (placeholder) {
                    element.setAttribute('placeholder', placeholder);
                }
            });

            // Update aria-labels
            document.querySelectorAll('[data-en-label], [data-ar-label]').forEach(element => {
                const label = element.getAttribute(`data-${lang}-label`);
                if (label) {
                    element.setAttribute('aria-label', label);
                }
            });

            // Update active state in language dropdown
            document.querySelectorAll('#navbarDropdownLang + .dropdown-menu .dropdown-item').forEach(item => {
                item.classList.remove('active');
                item.removeAttribute('aria-current');
                if (item.textContent.toLowerCase().includes(lang === 'ar' ? 'العربية' : 'english')) {
                    item.classList.add('active');
                    item.setAttribute('aria-current', 'true');
                }
            });

            // Adjust icon margins based on language for RTL/LTR
            document.querySelectorAll('.navbar-nav .nav-item .nav-link i, .btn i').forEach(icon => {
                if (lang === 'ar') {
                    icon.classList.remove('mr-1');
                    icon.classList.add('ml-1');
                } else {
                    icon.classList.remove('ml-1');
                    icon.classList.add('mr-1');
                }
            });
             document.querySelectorAll('.form-text').forEach(element => {
                 if (lang === 'ar') {
                     element.classList.add('text-right');
                 } else {
                     element.classList.remove('text-right');
                 }
             });
        }

        // Initialize language based on current html lang attribute
        document.addEventListener('DOMContentLoaded', () => {
            const initialLang = document.documentElement.lang;
            setLanguage(initialLang);
        });


// =================================================================

// --- Draggable Menu Logic (remains unchanged) ---
        const draggableMenuIcon = document.getElementById('draggableMenuIcon');
        const floatingMenuContent = document.getElementById('floatingMenuContent');
        const closeMenuBtn = document.getElementById('closeMenuBtn');

        let isDragging = false;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        draggableMenuIcon.addEventListener('mousedown', dragStart);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('mousemove', drag);

        draggableMenuIcon.addEventListener('touchstart', dragStart);
        document.addEventListener('touchend', dragEnd);
        document.addEventListener('touchmove', drag);

        function dragStart(e) {
            if (!floatingMenuContent.classList.contains('d-none') && floatingMenuContent.contains(e.target)) {
                return;
            }

            if (e.type === "touchstart") {
                initialX = e.touches[0].clientX;
                initialY = e.touches[0].clientY;
            } else {
                initialX = e.clientX;
                initialY = e.clientY;
            }

            const rect = draggableMenuIcon.getBoundingClientRect();
            xOffset = initialX - rect.left;
            yOffset = initialY - rect.top;

            isDragging = true;
            draggableMenuIcon.classList.add('dragging');
            e.stopPropagation();
        }

        function dragEnd() {
            if (isDragging) {
                draggableMenuIcon.classList.remove('dragging');
                isDragging = false;
                if (!floatingMenuContent.classList.contains('d-none')) {
                    positionFloatingMenu();
                }
            }
        }

        function drag(e) {
            if (!isDragging) return;

            e.preventDefault();

            let currentX;
            let currentY;

            if (e.type === "touchmove") {
                currentX = e.touches[0].clientX;
                currentY = e.touches[0].clientY;
            } else {
                currentX = e.clientX;
                currentY = e.clientY;
            }

            const newLeft = currentX - xOffset;
            const newTop = currentY - yOffset;

            const maxX = window.innerWidth - draggableMenuIcon.offsetWidth;
            const maxY = window.innerHeight - draggableMenuIcon.offsetHeight;

            draggableMenuIcon.style.left = Math.max(0, Math.min(newLeft, maxX)) + "px";
            draggableMenuIcon.style.top = Math.max(0, Math.min(newTop, maxY)) + "px";

            if (!floatingMenuContent.classList.contains('d-none')) {
                positionFloatingMenu();
            }
        }

        // --- Menu Toggle and Positioning Logic (remains unchanged) ---
        function positionFloatingMenu() {
            const iconRect = draggableMenuIcon.getBoundingClientRect();
            const menuWidth = floatingMenuContent.offsetWidth;
            const menuHeight = floatingMenuContent.offsetHeight;

            let menuLeft = iconRect.right + 15;
            let menuTop = iconRect.top;

            if (menuLeft + menuWidth > window.innerWidth) {
                menuLeft = iconRect.left - menuWidth - 15;
                if (menuLeft < 0) {
                    menuLeft = iconRect.right + 15;
                    if (menuLeft + menuWidth > window.innerWidth) {
                           menuLeft = window.innerWidth - menuWidth;
                    }
                }
            }

            if (menuTop + menuHeight > window.innerHeight) {
                menuTop = window.innerHeight - menuHeight;
                if (menuTop < 0) {
                    menuTop = 0;
                }
            }

            floatingMenuContent.style.left = menuLeft + "px";
            floatingMenuContent.style.top = menuTop + "px";
        }

        function toggleMenu(e) {
            e.stopPropagation();

            const isHidden = floatingMenuContent.classList.contains('d-none');
            if (isHidden) {
                floatingMenuContent.classList.remove('d-none');
                positionFloatingMenu();
                document.addEventListener('click', closeMenuOutside, true);
            } else {
                floatingMenuContent.classList.add('d-none');
                document.removeEventListener('click', closeMenuOutside, true);
            }
        }

        function closeMenuOutside(e) {
            if (!floatingMenuContent.contains(e.target) && !draggableMenuIcon.contains(e.target)) {
                floatingMenuContent.classList.add('d-none');
                document.removeEventListener('click', closeMenuOutside, true);
            }
        }

        draggableMenuIcon.addEventListener('click', (e) => {
            if (!isDragging) {
                toggleMenu(e);
            }
        });
        closeMenuBtn.addEventListener('click', toggleMenu);

        window.addEventListener('resize', () => {
            if (!floatingMenuContent.classList.contains('d-none')) {
                positionFloatingMenu();
            }
        });
		
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
		
		// Functions to apply styles
        function applyFontSize() {
            contentArea.style.fontSize = `${currentFontSize}px`;
            localStorage.setItem('fontSize', currentFontSize);
            // trackJourney(`تم تغيير حجم الخط إلى ${currentFontSize}px`);
        }

        function applyLineHeight() {
            contentArea.style.lineHeight = `${currentLineHeight}`;
            localStorage.setItem('lineHeight', currentLineHeight);
            // trackJourney(`تم تغيير ارتفاع السطر إلى ${currentLineHeight}`);
        }

        function applyLetterSpacing() {
            contentArea.style.letterSpacing = `${currentLetterSpacing}em`;
            localStorage.setItem('letterSpacing', currentLetterSpacing);
            // trackJourney(`تم تغيير تباعد الأحرف إلى ${currentLetterSpacing}em`);
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
            // trackJourney(`تم تغيير سمة الألوان إلى ${theme}`);
        }

        function applyHighlightLinks() {
            if (highlightLinksEnabled) {
                contentArea.classList.add('highlight-links');
            } else {
                contentArea.classList.remove('highlight-links');
            }
            localStorage.setItem('highlightLinks', highlightLinksEnabled);
            // trackJourney(`تم ${highlightLinksEnabled ? 'تفعيل' : 'تعطيل'} تمييز الروابط`);
        }

        function applyGrayscale() {
            if (grayscaleEnabled) {
                body.classList.add('grayscale-mode');
            } else {
                body.classList.remove('grayscale-mode');
            }
            localStorage.setItem('grayscale', grayscaleEnabled);
            // trackJourney(`تم ${grayscaleEnabled ? 'تفعيل' : 'تعطيل'} تدرج الرمادي`);
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
            // trackJourney('تم إعادة تعيين جميع الإعدادات');
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

            // trackJourney('تم تحميل الصفحة');
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