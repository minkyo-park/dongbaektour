// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 모바일 메뉴 토글
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // 검색 기능
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterCoupons();
        });
    }

    // 쿠폰 필터 기능
    const filterButtons = document.querySelectorAll('.filter-btn');
    const couponCards = document.querySelectorAll('.coupon-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 활성 버튼 변경
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 필터링 실행
            filterCoupons();
        });
    });

    // 통합 필터링 함수
    function filterCoupons() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const activeFilter = document.querySelector('.filter-btn.active');
        const category = activeFilter ? activeFilter.getAttribute('data-category') : 'all';
        
        couponCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            const cardDescription = card.querySelector('.coupon-description').textContent.toLowerCase();
            const cardCode = card.querySelector('.coupon-code span').textContent.toLowerCase();
            
            // 카테고리 필터링
            const categoryMatch = category === 'all' || cardCategory === category;
            
            // 검색어 필터링
            const searchMatch = !searchTerm || 
                              cardTitle.includes(searchTerm) || 
                              cardDescription.includes(searchTerm) ||
                              cardCode.includes(searchTerm);
            
            if (categoryMatch && searchMatch) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // 스무스 스크롤 기능
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // 외부 링크인 경우 기본 동작 허용
            if (targetId.startsWith('http') || targetId.includes('.html')) {
                return; // 기본 링크 동작 허용
            }
            
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 스크롤 시 헤더 스타일 변경
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#ffffff';
            header.style.backdropFilter = 'none';
        }
    });

    // 쿠폰 카드 호버 효과
    couponCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 카테고리 카드 클릭 이벤트
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            
            // 해당 카테고리로 필터링
            const targetButton = document.querySelector(`[data-category="${getCategoryKey(category)}"]`);
            if (targetButton) {
                targetButton.click();
                scrollToCoupons();
            }
        });
    });

    // 쿠폰 사용 버튼은 이제 링크로 직접 이동하므로 별도 이벤트 리스너 불필요

    // FAQ 토글 기능
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const content = document.getElementById(targetId);
            const icon = this.querySelector('.arrow-icon');
            
            // 다른 FAQ 닫기
            document.querySelectorAll('.faq-content.open').forEach(openContent => {
                if (openContent.id !== targetId) {
                    openContent.classList.remove('open');
                    const prevButton = openContent.previousElementSibling;
                    if (prevButton) {
                        prevButton.querySelector('.arrow-icon').classList.remove('rotate-180');
                    }
                }
            });

            // 현재 FAQ 열기/닫기
            content.classList.toggle('open');
            icon.classList.toggle('rotate-180');
        });
    });

    // 애니메이션 관찰자 (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 애니메이션 대상 요소들 관찰
    const animatedElements = document.querySelectorAll('.coupon-card, .category-card, .feature-item, .reason-card, .stat-item, .bar-container, .faq-item, .before-state, .after-state, .guarantee-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // 숫자 카운터 애니메이션
    const animateNumbers = (element, target, suffix = '') => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 30);
    };

    // 통계 섹션이 보일 때 숫자 애니메이션 실행
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stats = entry.target.querySelectorAll('.stat-value');
                stats.forEach((stat, index) => {
                    const targets = [5.8, 1200, 98];
                    const suffixes = ['억', '+', '%'];
                    animateNumbers(stat, targets[index], suffixes[index]);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // 히어로 통계 애니메이션
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const heroStatsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stats = entry.target.querySelectorAll('.stat-item h3');
                    stats.forEach((stat, index) => {
                        const targets = [50, 30, 24];
                        const suffixes = ['+', '%', '/7'];
                        animateNumbers(stat, targets[index], suffixes[index]);
                    });
                    heroStatsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        heroStatsObserver.observe(heroStats);
    }
});

// 쿠폰 코드 복사 함수
function copyCouponCode(code, buttonElement) {
    // 클립보드 API 지원 확인
    if (!navigator.clipboard) {
        // 구형 브라우저를 위한 fallback
        fallbackCopyTextToClipboard(code, buttonElement);
        return;
    }

    navigator.clipboard.writeText(code).then(function() {
        // 복사 성공 알림
        showNotification(`쿠폰 코드 "${code}"가 복사되었습니다!`, 'success');
        
        // 복사 버튼 텍스트 변경
        const copyBtn = buttonElement;
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '복사됨!';
        copyBtn.style.background = '#10b981';
        
        // 복사 후 바로 쿠폰 사용 페이지로 이동
        const couponCard = copyBtn.closest('.coupon-card');
        const useCouponBtn = couponCard.querySelector('.use-coupon-btn');
        if (useCouponBtn) {
            // 링크로 직접 이동
            window.open(useCouponBtn.href, '_blank');
        }
        
        // 2초 뒤에 버튼 텍스트 원래대로 복구
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#2563eb';
        }, 2000);
    }).catch(function(err) {
        console.error('복사 실패: ', err);
        // 클립보드 API 실패 시 fallback 사용
        fallbackCopyTextToClipboard(code, buttonElement);
    });
}

// 구형 브라우저를 위한 복사 fallback 함수
function fallbackCopyTextToClipboard(text, buttonElement) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // 화면에 보이지 않도록 설정
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification(`쿠폰 코드 "${text}"가 복사되었습니다!`, 'success');
            
            // 복사 버튼 텍스트 변경
            const copyBtn = buttonElement;
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '복사됨!';
            copyBtn.style.background = '#10b981';
            
            // 복사 후 바로 쿠폰 사용 페이지로 이동
            const couponCard = copyBtn.closest('.coupon-card');
            const useCouponBtn = couponCard.querySelector('.use-coupon-btn');
            if (useCouponBtn) {
                // 링크로 직접 이동
                window.open(useCouponBtn.href, '_blank');
            }
            
            // 2초 뒤에 버튼 텍스트 원래대로 복구
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '#2563eb';
            }, 2000);
        } else {
            showNotification('복사에 실패했습니다. 수동으로 복사해주세요.', 'error');
        }
    } catch (err) {
        console.error('Fallback 복사 실패: ', err);
        showNotification('복사에 실패했습니다. 수동으로 복사해주세요.', 'error');
    }
    
    document.body.removeChild(textArea);
}

// 쿠폰 섹션으로 스크롤
function scrollToCoupons() {
    const couponsSection = document.querySelector('#coupons');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = couponsSection.offsetTop - headerHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// 카테고리명을 키로 변환
function getCategoryKey(categoryName) {
    const categoryMap = {
        '항공권': 'flight',
        '호텔': 'hotel',
        '투어': 'tour',
        '패키지': 'package'
    };
    return categoryMap[categoryName] || 'all';
}

// 알림 표시 함수
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 알림 요소 생성
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 스타일 적용
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // 애니메이션으로 표시
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 3초 후 제거
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 쿠폰 검색 기능
function searchCoupons(searchTerm) {
    const couponCards = document.querySelectorAll('.coupon-card');
    const searchTermLower = searchTerm.toLowerCase();
    
    couponCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.coupon-description').textContent.toLowerCase();
        const code = card.querySelector('.coupon-code span').textContent.toLowerCase();
        
        if (title.includes(searchTermLower) || 
            description.includes(searchTermLower) || 
            code.includes(searchTermLower)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 키보드 접근성 개선
document.addEventListener('keydown', function(e) {
    // ESC 키로 모바일 메뉴 닫기
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    }
    
    // Enter 키로 버튼 활성화
    if (e.key === 'Enter' && e.target.classList.contains('filter-btn')) {
        e.target.click();
    }
});

// 페이지 로드 완료 후 초기화
window.addEventListener('load', function() {
    // 로딩 애니메이션 제거 (있다면)
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
    
    // 페이지 로드 완료 알림
    console.log('마이리얼트립 쿠폰 페이지가 성공적으로 로드되었습니다.');
});

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        padding: 1rem;
        gap: 1rem;
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .coupon-card.hidden {
        display: none !important;
    }
    
    .coupon-card.show {
        display: block !important;
        animation: fadeIn 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);
