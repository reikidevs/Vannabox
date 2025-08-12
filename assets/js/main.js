// Main JavaScript functionality for Vannabox website
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initMobileMenu();
        initSmoothScrolling();
        initBackToTop();
        initFormValidation();
        initAnimations();
        initSecurity();
    });
    
    // Mobile Menu Toggle
    function initMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', function(e) {
                e.preventDefault();
                mobileMenu.classList.toggle('hidden');
                
                // Toggle hamburger icon
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    if (mobileMenu.classList.contains('hidden')) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    } else {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    }
                }
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileMenuButton.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        }
    }
    
    // Smooth Scrolling for Navigation Links
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    const mobileMenuButton = document.getElementById('mobile-menu-button');
                    if (mobileMenu) {
                        mobileMenu.classList.add('hidden');
                        const icon = mobileMenuButton?.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                }
            });
        });
    }
    
    // Back to Top Button
    function initBackToTop() {
        const backToTopButton = document.getElementById('back-to-top');

        if (backToTopButton) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTopButton.classList.remove('opacity-0', 'invisible');
                    backToTopButton.classList.add('opacity-100', 'visible');
                } else {
                    backToTopButton.classList.add('opacity-0', 'invisible');
                    backToTopButton.classList.remove('opacity-100', 'visible');
                }
            });

            backToTopButton.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // Form Validation and Handling
    function initFormValidation() {
        const contactForm = document.getElementById('contact-form');
        const submitBtn = document.getElementById('submit-btn');
        const charCount = document.getElementById('char-count');
        const messageField = document.getElementById('message');

        // Character counter for message field
        if (messageField && charCount) {
            messageField.addEventListener('input', function() {
                const count = this.value.length;
                charCount.textContent = count;
                
                if (count > 1000) {
                    charCount.style.color = '#ef4444';
                } else if (count > 800) {
                    charCount.style.color = '#f59e0b';
                } else {
                    charCount.style.color = '#6b7280';
                }
            });
        }

        // Real-time validation
        function validateField(field) {
            const errorDiv = field.parentNode.querySelector('.error-message');
            let isValid = true;
            let errorMessage = '';

            // Remove previous error styling
            field.classList.remove('border-red-500');
            if (errorDiv) {
                errorDiv.classList.add('hidden');
                errorDiv.textContent = '';
            }

            // Check if field is required and empty
            if (field.hasAttribute('required') && !field.value.trim()) {
                isValid = false;
                errorMessage = 'Field ini wajib diisi.';
            }

            // Specific validations
            switch (field.type) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (field.value && !emailRegex.test(field.value)) {
                        isValid = false;
                        errorMessage = 'Format email tidak valid.';
                    }
                    break;
                case 'tel':
                    const phoneRegex = /^[0-9+\-\s()]+$/;
                    if (field.value && !phoneRegex.test(field.value)) {
                        isValid = false;
                        errorMessage = 'Format nomor telepon tidak valid.';
                    }
                    break;
                case 'text':
                    if (field.name === 'name') {
                        const nameRegex = /^[a-zA-Z\s]+$/;
                        if (field.value && !nameRegex.test(field.value)) {
                            isValid = false;
                            errorMessage = 'Nama hanya boleh berisi huruf dan spasi.';
                        }
                    }
                    break;
            }

            // Check maxlength
            if (field.hasAttribute('maxlength') && field.value.length > parseInt(field.getAttribute('maxlength'))) {
                isValid = false;
                errorMessage = `Maksimal ${field.getAttribute('maxlength')} karakter.`;
            }

            // Show error if invalid
            if (!isValid) {
                field.classList.add('border-red-500');
                if (errorDiv) {
                    errorDiv.textContent = errorMessage;
                    errorDiv.classList.remove('hidden');
                }
            }

            return isValid;
        }

        // Add real-time validation to all form fields
        if (contactForm) {
            const formFields = contactForm.querySelectorAll('input[required], textarea[required]');
            formFields.forEach(field => {
                field.addEventListener('blur', () => validateField(field));
                field.addEventListener('input', () => {
                    if (field.classList.contains('border-red-500')) {
                        validateField(field);
                    }
                });
            });

            // Enhanced form submission: open WhatsApp with prefilled message
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                // Validate all fields
                const formFields = this.querySelectorAll('input[required], textarea[required]');
                let isFormValid = true;
                formFields.forEach(field => { if (!validateField(field)) isFormValid = false; });

                // Honeypot (bot protection)
                const honeypot = this.querySelector('input[name="website"]');
                if (honeypot && honeypot.value) { return; }

                // Check CAPTCHA (client-side only)
                const captcha = this.querySelector('input[name="captcha"]');
                if (!captcha || !captcha.checked) {
                    alert('Silakan centang "Saya bukan robot"');
                    return;
                }

                if (!isFormValid) {
                    alert('Mohon perbaiki kesalahan pada form sebelum mengirim.');
                    return;
                }

                const submitText = submitBtn.querySelector('.submit-text');
                const loadingText = submitBtn.querySelector('.loading-text');
                submitBtn.disabled = true;
                submitText.classList.add('hidden');
                loadingText.classList.remove('hidden');

                // Prepare payload
                const payload = {
                    name: this.querySelector('input[name="name"]').value.trim(),
                    phone: this.querySelector('input[name="phone"]').value.trim(),
                    email: this.querySelector('input[name="email"]').value.trim(),
                    message: this.querySelector('textarea[name="message"]').value.trim(),
                    website: honeypot ? honeypot.value : '',
                    csrf_token: this.querySelector('input[name="csrf_token"]').value
                };

                try {
                    // Build WhatsApp message and open WA
                    const msg = [
                        'Halo Vannabox 👋',
                        'Saya ingin konsultasi/pemesanan Udang Vaname.',
                        '',
                        'Detail Kontak:',
                        `- Nama: ${payload.name}`,
                        `- Telepon: ${payload.phone}`,
                        `- Email: ${payload.email}`,
                        '',
                        'Pesan:',
                        payload.message || '-',
                        '',
                        'Terima kasih!'
                    ].join('\n');
                    const waUrl = 'https://wa.me/6285864138261?text=' + encodeURIComponent(msg);
                    window.open(waUrl, '_blank');
                    
                    // Reset loading state and form
                    submitBtn.disabled = false;
                    submitText.classList.remove('hidden');
                    loadingText.classList.add('hidden');
                    this.reset();
                    if (captcha) captcha.checked = false;
                    if (charCount) charCount.textContent = '0';
                    formFields.forEach(field => {
                        field.classList.remove('border-red-500');
                        const errorDiv = field.parentNode.querySelector('.error-message');
                        if (errorDiv) errorDiv.classList.add('hidden');
                    });
                } catch (error) {
                    console.error('Form submission error:', error);
                    alert('Terjadi kesalahan. Silakan coba lagi.');
                } finally {
                    // Reset loading state
                    submitBtn.disabled = false;
                    submitText.classList.remove('hidden');
                    loadingText.classList.add('hidden');
                }
            });
        }
    }
    
    // Animation and Intersection Observer
    function initAnimations() {
        // Performance: Lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Add fade-in animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }
    
    // Security Features
    function initSecurity() {
        // Security: Allow right-click, only restrict on sensitive elements (images, forms)
        document.addEventListener('contextmenu', function(e) {
            if (e.target.tagName === 'IMG' || e.target.closest('form')) {
                e.preventDefault();
            }
        });

        // Blokir shortcut umum untuk Inspect/Source/Console
        document.addEventListener('keydown', function(e) {
            // F12
            if (e.keyCode === 123) { e.preventDefault(); return false; }
            // Ctrl/Cmd + Shift + I/J/C
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
                e.preventDefault(); return false;
            }
            // Ctrl/Cmd + U (View Source), S (Save), P (Print)
            if ((e.ctrlKey || e.metaKey) && (e.keyCode === 85 || e.keyCode === 83 || e.keyCode === 80)) {
                e.preventDefault(); return false;
            }
        });

        // Deteksi DevTools sederhana dan tampilkan overlay peringatan
        (function(){
            const threshold = 160; // ambang selisih inner vs outer window
            setInterval(function(){
                try {
                    const opened = (window.outerWidth - window.innerWidth > threshold) || (window.outerHeight - window.innerHeight > threshold);
                    let overlay = document.getElementById('devtools-block');
                    if (opened) {
                        if (!overlay) {
                            overlay = document.createElement('div');
                            overlay.id = 'devtools-block';
                            overlay.style.cssText = 'position:fixed;inset:0;background:#000;opacity:.95;color:#fff;z-index:99999;display:flex;align-items:center;justify-content:center;font:600 18px/1.4 Inter,Arial,sans-serif;text-align:center;padding:24px;';
                            overlay.textContent = 'Akses dibatasi. Tutup developer tools untuk melanjutkan.';
                            document.body.appendChild(overlay);
                        }
                    } else if (overlay) {
                        overlay.remove();
                    }
                } catch(_) {}
            }, 500);
        })();

        // Security: Disable text selection on logo
        document.querySelectorAll('img[alt*="Logo"]').forEach(img => {
            img.style.userSelect = 'none';
            img.style.webkitUserSelect = 'none';
            img.style.mozUserSelect = 'none';
            img.style.msUserSelect = 'none';
        });
    }
})();