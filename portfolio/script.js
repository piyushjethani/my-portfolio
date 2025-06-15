document.addEventListener('DOMContentLoaded', function() {
    const burger = document.getElementById('burger');
    const menu = document.getElementById('menu');
    const menuLinks = document.querySelectorAll('.menu-link');
    const sections = document.querySelectorAll('section[id]');
    const header = document.querySelector('.header');
    const homeLink = document.querySelector('.menu-link[href="#"]');
    const headerHeight = header.offsetHeight;
    let isScrolling = false;
    
    function toggleMenu(forceClose = false) {
    if (forceClose) {
    burger.classList.remove('is-active');
    menu.classList.remove('is-active');
    menu.style.display = 'none';
    return;
    }
    
    const willOpen = !menu.classList.contains('is-active');
    if (willOpen) {
    menu.style.display = 'flex';
    void menu.offsetWidth; // Force reflow
    }
    
    burger.classList.toggle('is-active', willOpen);
    menu.classList.toggle('is-active', willOpen);
    
    if (!willOpen) {
    setTimeout(() => { menu.style.display = 'none'; }, 300);
    }
    }
    
    burger.addEventListener('click', () => toggleMenu());
    
    function updateActiveLink() {
    if (isScrolling) return;
    
    const scrollPosition = window.scrollY + headerHeight + 10;
    
    if (window.scrollY < 100) {
    menuLinks.forEach(link => link.classList.remove('active'));
    if (homeLink) homeLink.classList.add('active');
    return;
    }
    
    let closestSection = null;
    let smallestDistance = Infinity;
    
    sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
    const distance = Math.abs(scrollPosition - (sectionTop + section.offsetHeight/2));
    if (distance < smallestDistance) {
    smallestDistance = distance;
    closestSection = section;
    }
    }
    });
    
    if (closestSection) {
    menuLinks.forEach(link => {
    if (!link.classList.contains('temp-active')) {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${closestSection.id}`) {
    link.classList.add('active');
    }
    }
    });
    }
    }
    
    function smoothScrollTo(targetElement) {
    if (!targetElement) return;
    
    isScrolling = true;
    const targetPosition = targetElement === document.body ? 0 :
    Math.max(0, targetElement.offsetTop - headerHeight - 1);
    
    // Use native smooth scroll if available
    if ('scrollBehavior' in document.documentElement.style) {
    window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
    });
    } else {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(400, Math.max(100, Math.abs(distance) * 0.2));
    let startTime = null;
    
    function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    window.scrollTo(0, startPosition + distance * progress);
    
    if (timeElapsed < duration) {
    requestAnimationFrame(animation);
    } else {
    completeScroll();
    }
    }
    
    requestAnimationFrame(animation);
    }
    
    function completeScroll() {
    isScrolling = false;
    updateActiveLink();
    }
    
    setTimeout(completeScroll, 500);
    }
    
    function handleNavigationClick(e) {
    const targetId = this.getAttribute('href');
    
    if (targetId.startsWith('#')) {
    e.preventDefault();
    const targetElement = targetId === '#' ? document.body : document.querySelector(targetId);
    
    if (window.innerWidth <= 768) {
    toggleMenu(true);
    }
    
    menuLinks.forEach(link => {
    link.classList.remove('active', 'temp-active');
    });
    this.classList.add('temp-active');
    
    smoothScrollTo(targetElement);
    
    setTimeout(() => {
    this.classList.remove('temp-active');
    this.classList.add('active');
    }, 300);
    }
    }
    
    menuLinks.forEach(link => {
    link.addEventListener('click', handleNavigationClick);
    });
    
    const observer = new IntersectionObserver((entries) => {
    if (isScrolling) return;
    
    entries.forEach(entry => {
    if (entry.isIntersecting) {
    const targetLink = document.querySelector(`.menu-link[href="#${entry.target.id}"]:not(.temp-active)`);
    if (targetLink) {
    menuLinks.forEach(link => link.classList.remove('active'));
    targetLink.classList.add('active');
    }
    }
    });
    }, {
    threshold: 0.5,
    rootMargin: `-${headerHeight + 10}px 0px -30% 0px`
    });
    
    sections.forEach(section => {
    if (document.querySelector(`.menu-link[href="#${section.id}"]`)) {
    observer.observe(section);
    }
    });
    
    function handleResize() {
    if (window.innerWidth > 768) {
    menu.style.display = 'flex';
    menu.classList.remove('is-active');
    burger.classList.remove('is-active');
    } else if (!menu.classList.contains('is-active')) {
    menu.style.display = 'none';
    }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
    if (!isScrolling) {
    updateActiveLink();
    }
    }, 100);
    });
    
    updateActiveLink();
    });
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('.filter-item');
    
    function filterProjects(category) {
    filterItems.forEach(item => {
    if (category === 'all' || item.dataset.category === category) {
    item.style.display = 'block';
    setTimeout(() => {
    item.style.opacity = '1';
    item.style.transform = 'translateY(0)';
    }, 50);
    } else {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    setTimeout(() => {
    item.style.display = 'none';
    }, 300);
    }
    });
    }
    
    filterButtons.forEach(button => {
    button.addEventListener('click', function() {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    this.classList.add('active');
    
    const filterValue = this.dataset.filter;
    filterProjects(filterValue);
    });
    });
    
    filterProjects('all');