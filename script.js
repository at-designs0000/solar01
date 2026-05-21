document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. FAQ Accordion (よくある質問 アコーディオン)
     ========================================================================== */
  const faqHeaders = document.querySelectorAll('.faq-header');
  
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const faqItem = header.parentElement;
      const faqContent = header.nextElementSibling;
      const isActive = faqItem.classList.contains('active');
      
      // Close all other FAQ items first for clean accordion behavior
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-content').style.maxHeight = null;
      });
      
      if (!isActive) {
        faqItem.classList.add('active');
        // Calculate and set precise max-height for CSS Transition
        faqContent.style.maxHeight = faqContent.scrollHeight + "px";
      } else {
        faqItem.classList.remove('active');
        faqContent.style.maxHeight = null;
      }
    });
  });

  /* ==========================================================================
     2. Cases Category Filter (買取実績 フィルター)
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const caseCards = document.querySelectorAll('.case-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      const filterValue = button.getAttribute('data-filter');
      
      caseCards.forEach(card => {
        // Simple fade-out and display toggle
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95) translateY(10px)';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'flex';
            // Slight delay to trigger CSS transition smoothly
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1) translateY(0)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  /* ==========================================================================
     3. Smooth Anchor Scroll with Header Offset
     ========================================================================== */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const siteHeader = document.getElementById('site-header');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Calculate offset (sticky header height)
        const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ==========================================================================
     4. Hero Fast Calculator (ファーストビュー簡易査定シミュレーター)
     ========================================================================== */
  const fastCalcForm = document.getElementById('fast-calc-form');
  const fastCalcSubmit = document.getElementById('fast-calc-submit');
  
  if (fastCalcForm) {
    fastCalcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const category = document.getElementById('fast-category').value;
      const scale = document.getElementById('fast-scale').value;
      const work = document.getElementById('fast-work').value;
      
      if (!category || !scale || !work) return;
      
      // Calculate realistic dummy price range based on inputs
      let minPrice = 0;
      let maxPrice = 0;
      let unit = "万円";
      let name = "";
      
      switch(category) {
        case 'pcs':
          name = "パワーコンディショナ";
          if (scale === 'small') { minPrice = 30; maxPrice = 80; }
          else if (scale === 'medium') { minPrice = 120; maxPrice = 300; }
          else { minPrice = 500; maxPrice = 1500; }
          break;
        case 'panel':
          name = "太陽光モジュール";
          if (scale === 'small') { minPrice = 15; maxPrice = 50; }
          else if (scale === 'medium') { minPrice = 80; maxPrice = 220; }
          else { minPrice = 400; maxPrice = 1200; }
          break;
        case 'cubicle':
          name = "高圧キュービクル";
          if (scale === 'small') { minPrice = 40; maxPrice = 100; }
          else if (scale === 'medium') { minPrice = 150; maxPrice = 450; }
          else { minPrice = 600; maxPrice = 1800; }
          break;
        case 'generator':
          name = "非常用・産業用発電機";
          if (scale === 'small') { minPrice = 50; maxPrice = 120; }
          else if (scale === 'medium') { minPrice = 200; maxPrice = 600; }
          else { minPrice = 800; maxPrice = 2500; }
          break;
        default:
          name = "産業機器";
          if (scale === 'small') { minPrice = 10; maxPrice = 40; }
          else if (scale === 'medium') { minPrice = 60; maxPrice = 180; }
          else { minPrice = 300; maxPrice = 1000; }
      }
      
      // Deduct potential work costs if required
      if (work === 'yes') {
        let workCost = 0;
        if (scale === 'small') workCost = 10;
        else if (scale === 'medium') workCost = 40;
        else workCost = 150;
        
        minPrice = Math.max(5, minPrice - workCost);
        maxPrice = Math.max(15, maxPrice - workCost);
      }
      
      // Change Fast Calc Panel HTML to beautiful results panel
      const parentPanel = fastCalcForm.parentElement;
      
      parentPanel.style.opacity = '0';
      parentPanel.style.transition = 'opacity 0.4s ease';
      
      setTimeout(() => {
        parentPanel.innerHTML = `
          <div style="text-align: center; color: #fff;">
            <div style="font-size: 3rem; color: #10B981; margin-bottom: 15px;"><i class="fa-solid fa-calculator"></i></div>
            <h3 class="panel-title" style="font-size: 1.4rem; color: #fff; margin-bottom: 8px;">簡易シミュレーション結果</h3>
            <p style="font-size: 0.85rem; color: #E2E8F0; margin-bottom: 24px;">ご選択いただいた条件の目安買取額です</p>
            
            <div style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <span style="font-size: 0.8rem; color: #34D399; font-weight: 700; display: block; margin-bottom: 6px;">${name} 目安査定額</span>
              <span style="font-size: 2.25rem; font-weight: 900; color: #EA580C; letter-spacing: -0.02em;">¥${minPrice}万〜${maxPrice}万円</span>
            </div>
            
            <p style="font-size: 0.8rem; color: #E2E8F0; line-height: 1.6; margin-bottom: 24px;">
              ※上記は撤去・運搬費用目安を考慮した概算価格です。現地環境やメーカー・型式により、さらに高額査定になる可能性がございます。
            </p>
            
            <a href="#quote-form-section" class="btn btn-primary" id="result-cta-btn" style="width: 100%; margin-bottom: 12px;">
              <i class="fa-solid fa-envelope"></i> この条件で正式査定を依頼
            </a>
            
            <button class="btn btn-outline" id="re-calc-btn" style="width: 100%; color: #fff; border-color: rgba(255,255,255,0.4); padding: 10px 20px; font-size: 0.85rem;">
              もう一度シミュレーションする
            </button>
          </div>
        `;
        
        parentPanel.style.opacity = '1';
        
        // Add events to new buttons
        document.getElementById('result-cta-btn').addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector('#quote-form-section');
          const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
          
          // Pre-fill main form category based on calculator selection
          const mainCategorySelect = document.getElementById('form-category');
          if (mainCategorySelect) {
            mainCategorySelect.value = category;
          }
          
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.pageYOffset - headerHeight,
            behavior: 'smooth'
          });
        });
        
        document.getElementById('re-calc-btn').addEventListener('click', () => {
          location.reload(); // Simple restoration of state
        });
      }, 400);
    });
  }

  /* ==========================================================================
     5. Main Quote Form Submitting & validation (査定依頼フォーム送信制御)
     ========================================================================== */
  const leadQuoteForm = document.getElementById('lead-quote-form');
  const quoteFormSubmitBtn = document.getElementById('quote-form-submit');
  
  if (leadQuoteForm) {
    leadQuoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Perform HTML5 native check trigger (or additional checking if needed)
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const category = document.getElementById('form-category').value;
      const prefecture = document.getElementById('form-prefecture').value;
      
      if (!name || !email || !phone || !category || !prefecture) {
        alert('必須項目をすべて入力してください。');
        return;
      }
      
      // Change Button style to Sending...
      const originalBtnText = quoteFormSubmitBtn.innerHTML;
      quoteFormSubmitBtn.disabled = true;
      quoteFormSubmitBtn.style.backgroundColor = '#64748B';
      quoteFormSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 送信中...';
      
      // Mock Server submission delay
      setTimeout(() => {
        const quoteWrapper = leadQuoteForm.parentElement;
        quoteWrapper.style.opacity = '0';
        quoteWrapper.style.transition = 'opacity 0.4s ease';
        
        setTimeout(() => {
          quoteWrapper.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #fff;">
              <div style="font-size: 4rem; color: #10B981; margin-bottom: 24px;"><i class="fa-regular fa-circle-check"></i></div>
              <h3 style="font-size: 1.75rem; font-weight: 700; color: #fff; margin-bottom: 16px;">無料査定のご依頼、承りました</h3>
              <p style="font-size: 1rem; color: #E2E8F0; line-height: 1.8; margin-bottom: 30px; max-width: 600px; margin-left: auto; margin-right: auto;">
                ご登録いただいたメールアドレスへ「査定受付完了メール」を送信いたしました。<br>
                通常24時間以内に、査定担当者より概算見積りのご連絡、または現地訪問に関する日程調整のお電話をさせていただきます。<br>
                お急ぎの場合は、下記の弊社直通電話または公式LINEまでご連絡ください。
              </p>
              
              <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                <a href="tel:0120-123-456" class="btn btn-secondary" style="padding: 12px 24px; font-size: 0.95rem;">
                  <i class="fa-solid fa-phone"></i> お電話：0120-123-456
                </a>
                <a href="https://line.me/" target="_blank" rel="noopener" class="btn btn-line" style="padding: 12px 24px; font-size: 0.95rem;">
                  <i class="fa-brands fa-line"></i> LINEで急ぎ写真査定
                </a>
              </div>
            </div>
          `;
          quoteWrapper.style.opacity = '1';
        }, 400);
      }, 1500);
    });
  }

  /* ==========================================================================
     6. Mobile Hamburger Menu Toggle (モバイルハンバーガーメニュー開閉)
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('header-nav');
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  if (hamburgerBtn && navMenu) {
    // トグル動作
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    
    // リンククリック時に閉じる
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
    
    // メニュー外クリック時に閉じる
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
});
