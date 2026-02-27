/**
 * Le Château Doré - JavaScript
 * European Classic Restaurant Website
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functions
  initHeader();
  initSmoothScroll();
  initAnimations();
  initReservationForm();
  initNewsletterForm();
  initMobileMenu();
});

/**
 * Header scroll effect
 */
function initHeader() {
  const header = document.querySelector(".header");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

/**
 * Smooth scroll for navigation links
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Update active nav link
        navLinks.forEach((link) => link.classList.remove("active"));
        this.classList.add("active");
      }
    });
  });
}

/**
 * Scroll animations using Intersection Observer
 */
function initAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");

        // Add stagger effect for menu items
        if (entry.target.classList.contains("menu-item")) {
          const menuItems = document.querySelectorAll(".menu-item");
          menuItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
          });
        }
      }
    });
  }, observerOptions);

  // Elements to animate
  const animateElements = document.querySelectorAll(
    ".about-content, .menu-item, .contact-item, .section-header",
  );

  animateElements.forEach((el) => {
    el.classList.add("animate-on-scroll");
    observer.observe(el);
  });

  // Add CSS for animations
  const style = document.createElement("style");
  style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .menu-item {
            transition-delay: 0s !important;
        }
    `;
  document.head.appendChild(style);
}

/**
 * Reservation form handling
 */
function initReservationForm() {
  const form = document.querySelector(".reservation-form");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validate required fields
    if (!data.name || !data.phone || !data.date || !data.time || !data.guests) {
      showAlert("Vui lòng điền đầy đủ thông tin bắt buộc!", "error");
      return;
    }

    // Show success message (in real app, send to server)
    showAlert(
      "Đặt bàn thành công! Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.",
      "success",
    );

    // Reset form
    form.reset();
  });
}

/**
 * Newsletter form handling
 */
function initNewsletterForm() {
  const form = document.querySelector(".newsletter-form");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value;

    if (!email) {
      showAlert("Vui lòng nhập địa email!", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showAlert("Vui lòng nhập địa chỉ email hợp lệ!", "error");
      return;
    }

    showAlert(
      "Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi tin tức mới nhất đến email của bạn.",
      "success",
    );

    emailInput.value = "";
  });
}

/**
 * Email validation
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".nav-menu");

  if (!menuBtn || !navMenu) return;

  menuBtn.addEventListener("click", function () {
    navMenu.classList.toggle("active");

    // Change icon
    const icon = menuBtn.querySelector("i");
    if (navMenu.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });

  // Close menu when clicking on a link
  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navMenu.classList.remove("active");
      const icon = menuBtn.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    });
  });

  // Add mobile menu styles
  const style = document.createElement("style");
  style.textContent = `
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 70px;
                left: 0;
                right: 0;
                background: rgba(28, 20, 16, 0.98);
                padding: 20px;
                transform: translateY(-150%);
                transition: transform 0.4s ease;
                z-index: 999;
            }
            
            .nav-menu.active {
                transform: translateY(0);
            }
            
            .nav-menu ul {
                flex-direction: column;
                gap: 0;
            }
            
            .nav-menu li {
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .nav-menu a {
                display: block;
                padding: 15px 0;
                text-align: center;
            }
        }
    `;
  document.head.appendChild(style);
}

/**
 * Custom alert function
 */
function showAlert(message, type) {
  // Remove existing alerts
  const existingAlert = document.querySelector(".custom-alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  // Create alert element
  const alert = document.createElement("div");
  alert.className = `custom-alert alert-${type}`;
  alert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i>
            <span>${message}</span>
        </div>
    `;

  // Add alert styles
  const style = document.createElement("style");
  style.textContent = `
        .custom-alert {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            animation: slideIn 0.4s ease;
        }
        
        .custom-alert .alert-content {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 18px 25px;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            font-family: 'Cormorant Garamond', serif;
            font-size: 16px;
        }
        
        .alert-success .alert-content {
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            color: white;
        }
        
        .alert-error .alert-content {
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
        }
        
        .alert-success i,
        .alert-error i {
            font-size: 22px;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
        
        .custom-alert.hiding {
            animation: slideOut 0.4s ease forwards;
        }
    `;
  document.head.appendChild(style);

  document.body.appendChild(alert);

  // Auto remove after 5 seconds
  setTimeout(() => {
    alert.classList.add("hiding");
    setTimeout(() => {
      alert.remove();
    }, 400);
  }, 5000);
}

/**
 * Parallax effect for hero section
 */
window.addEventListener("scroll", function () {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const scrolled = window.pageYOffset;
  const rate = scrolled * 0.4;

  if (scrolled < window.innerHeight) {
    hero.style.backgroundPositionY = rate + "px";
  }
});

/**
 * Navbar active link on scroll
 */
window.addEventListener("scroll", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-menu a");

  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    if (scrolledY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

const scrolledY = window.scrollY;
