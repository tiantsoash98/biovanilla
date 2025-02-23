gsap.registerPlugin(ScrollTrigger, CustomEase);

let scroll;

const selectAll = (e) => document.querySelectorAll(e);
const durationDefault = 1.2;
const durationDefaultFaster = 0.8;
const transitionOffset = 800;
const staggerDefault = 0.08;
const staggerFaster = 0.01;

CustomEase.create("primary-ease", "0.67, 0.01, 0.31, 1");
CustomEase.create("primary-ease-out", ".34, 1.56, 0.64, 1");

// Init all
initPageTransitions();

// Animation - Page Loader
function initLoader() {
  var tl = gsap.timeline();

  let delay = 0;
}

// Animation - Page Leave
function pageTransitionIn() {
  var tl = gsap.timeline();

  tl.call(function () {
    scroll.start();
  });
}

// Animation - Page Enter
function pageTransitionOut() {
  var tl = gsap.timeline();
}

function initPageTransitions() {
  barba.hooks.afterEnter(() => {
    window.scrollTo(0, 0);
  });

  barba.init({
    sync: true,
    debug: true,
    timeout: 7000,
    transitions: [
      {
        name: "default",
        once(data) {
          initSmoothScroll(data.next.container);
          initScript();
          initLoader();
        },
        async leave(data) {
          pageTransitionIn(data.current);
          await delay(transitionOffset);
        },
        async enter(data) {
          pageTransitionOut(data.next);
        },
        async beforeEnter(data) {
          ScrollTrigger.getAll().forEach((t) => t.kill());
          scroll.destroy();
          initSmoothScroll();
          initScript();
        },
      },
    ],
  });

  function delay(n) {
    n = n || 2000;
    return new Promise((done) => {
      setTimeout(() => {
        done();
      }, n);
    });
  }
}

/**
 * Fire all scripts on page load
 */
function initScript() {
  initPageScrollAttr();
  //   initNav();
  initAnchorScroll();
  initSplitText();
  // initButtons();
  initParallax();
  initSwiper();
  initAccordion();
  initScrolltriggerAnimations();
}

// Init Smooth Scroll
// https://github.com/darkroomengineering/lenis
function initSmoothScroll() {
  scroll = new Lenis({
    duration: 1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    gestureDirection: "vertical",
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    scroll.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

/* Navbar */
function initPageScrollAttr() {
  var body = $("body");

  ScrollTrigger.create({
    trigger: body,
    start: "top -90px", // Scroll past 90px on the page
    end: "bottom bottom",
    onToggle: (self) =>
      body.attr("data-page-beyond-fold", self.isActive ? "true" : "false"),
    onUpdate: (self) => {
      body.attr(
        "data-page-scrolling-down",
        self.direction == 1 ? "true" : "false"
      );
    },
  });
}

function initNav() {
  var nav = $("[data-navbar]");

  $("[data-navigation-toogler]").change(function () {
    if (this.checked) {
      // Animate nav menu on open
      nav.attr("data-menu-open", "true");
      var tl = gsap.timeline();

      tl.fromTo(
        "[data-nav-menu] .nav_menu_inner",
        {
          yPercent: 100,
        },
        {
          yPercent: 0,
          ease: "primary-ease",
          duration: durationDefaultFaster,
          stagger: staggerDefault,
        },
        0.1
      );
    } else {
      nav.attr("data-menu-open", "false");
    }
  });
}

function initAnchorScroll() {
  // Removes url hash on click on link
  // https://discourse.webflow.com/t/removing-anchor-links-from-changing-browser-url-when-clicked/52133/17
  $("a").click(function () {
    setTimeout(function () {
      history.replaceState(null, null, " ");
    }, 0);
  });
}

function initParallax() {
  // https://codepen.io/petebarr/pen/qBOeVoz
  $("[data-parallax-trigger]").each(function () {
    let triggerElement = $(this);
    let targetElement = $(this).find("[data-parallax-wrap]");

    gsap.fromTo(
      targetElement,
      {
        y: "-20vh",
      },
      {
        y: "20vh",
        scrollTrigger: {
          trigger: triggerElement,
          scrub: true,
          start: "top bottom", // position of trigger meets the scroller position
        },
        ease: "none",
      }
    );
  });
}

// Split Type
function initSplitText() {
  let splitSelector = $("[data-split-text] :is(h1, h2, h3, h4, h5, h6, p)");
  var splitTextLines = new SplitType(splitSelector, {
    types: "lines",
    lineClass: "single-line",
    wordClass: "single-word",
    charClass: "single-char",
  });
  $("[data-split-text] .single-line").wrapInner(
    '<div class="single-line-inner" data-single-line-inner>'
  );

  // var splitTextLines = new SplitType("[data-split-text]", {
  //   types: "lines, words",
  //   wordClass: "single-word",
  // });
  // $("[data-split-text] .single-word").wrapInner(
  //   '<div class="single-word-inner">'
  // );

  // var splitWordsWrap = new SplitText(".split-words-wrap", {type: "words", wordsClass: "single-word"});
  // $('.split-words-wrap .single-word').wrapInner('<div class="single-word-inner">');

  // var splitWords = new SplitText(".split-words", {type: "words", wordsClass: "single-word"});
  // $('.split-words .single-word').wrapInner('<div class="single-word-inner">');

  // var splitTextChars = new SplitText(".split-chars", {type: "chars", charsClass: "single-char"});
  // $('.split-chars .single-char').wrapInner('<div class="single-char-inner">');
}

// Swiper
// https://www.youtube.com/watch?v=Qn1qL3TGMug
function initSwiper() {
  $(".swiper_wrap").each(function () {
    const swiper = new Swiper($(this).find(".swiper")[0], {
      wrapperClass: "swiper_wrapper",
      slideClass: "swiper_slide",
      slidesPerView: "auto",
      grabCursor: true,
      loop: true,
      speed: 1000,
      slidesPerView: 1.3,
      breakpoints: {
        // when window width is >= 768px
        769: {
          slidesPerView: 2.6,
        },
        // when window width is >= 768px
        1921: {
          slidesPerView: 2.3,
        },
      },
      // Navigation arrows
      navigation: {
        nextEl: $(this).find(".swiper_button_right")[0],
        prevEl: $(this).find(".swiper_button_left")[0],
      },
    });
  });
}

function initAccordion() {
  $("[data-accordion-toggle]").click(function () {
    // If already active is clicked, turn into not active
    if ($(this).attr("data-accordion-status") == "active") {
      $(this)
        .attr("data-accordion-status", "not-active")
        .siblings()
        .attr("data-accordion-status", "not-active");
    } else {
      $(this).siblings().attr("data-accordion-status", "not-active");
      $(this).attr("data-accordion-status", "active");

      let parentWrapper = $(this).closest("[data-accordion-wrapper]");

      if ($(parentWrapper).attr("data-accordion-style") == "with-img") {
        updateAccordionImg($(this).attr("data-index"), parentWrapper);
      }
    }
  });
}

function updateAccordionImg(imgIndex, parentWrapper) {
  let accordionImgSelector =
    "[data-accordion-img][data-index=" + imgIndex + "]";
  let targetElement = $(parentWrapper).find(accordionImgSelector);
  let siblingsElement = $(targetElement).siblings();

  var tl = gsap.timeline();

  tl.set(targetElement, {
    zIndex: 5,
  });

  tl.fromTo(
    siblingsElement,
    {
      filter: "brightness(100%)",
    },
    {
      filter: "brightness(60%)",
      ease: "primary-ease",
      duration: durationDefaultFaster,
    },
    0
  );

  tl.fromTo(
    targetElement,
    {
      clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      filter: "brightness(60%)",
    },
    {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      filter: "brightness(100%)",
      ease: "primary-ease",
      duration: durationDefaultFaster,
    },
    0
  );

  tl.set(siblingsElement, {
    clearProps: "all",
  });

  tl.set(targetElement, {
    clearProps: "all",
  });

  tl.call(function () {
    $(siblingsElement).attr("data-accordion-status", "not-active");
    $(targetElement).attr("data-accordion-status", "active");
  });
}

/**
 * Scrolltrigger Animations Desktop + Mobile
 */
function initScrolltriggerAnimations() {
  if (document.querySelector("[data-split-text][data-animate-scroll]")) {
    $("[data-split-text][data-animate-scroll]").each(function () {
      let triggerElement = $(this);
      let targetElement = $(this).find("[data-single-line-inner]");

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 90%",
          end: "100% 0%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        targetElement,
        {
          yPercent: 110,
          rotate: 0.001,
        },
        {
          yPercent: 0,
          rotate: 0.001,
          ease: "primary-ease",
          duration: durationDefault,
          stagger: staggerDefault,
        },
        -0.2
      );
    });
  }

  if (document.querySelector("[data-fade-in][data-animate-scroll]")) {
    $("[data-fade-in][data-animate-scroll]").each(function () {
      let triggerElement = $(this);
      let targetElement = $(this);

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 90%",
          end: "100% 0%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        targetElement,
        {
          y: "3em",
          rotate: 0.001,
          autoAlpha: 0,
        },
        {
          y: 0,
          rotate: 0.001,
          autoAlpha: 1,
          ease: "Expo.easeOut",
          duration: durationDefault,
          stagger: staggerDefault,
        },
        0.2
      );
    });
  }

  if (
    document.querySelector(
      "[data-divider='horizontal'][data-animate-scroll='true']"
    )
  ) {
    $("[data-divider='horizontal'][data-animate-scroll='true']").each(
      function () {
        let triggerElement = $(this);
        let targetElement = $(this);

        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: "0% 90%",
            end: "100% 0%",
            toggleActions: "play none none none",
          },
        });

        tl.from(
          targetElement,
          {
            scaleX: 0,
            duration: durationDefault,
            stagger: staggerDefault,
          },
          -0.2
        );
      }
    );
  }

  if (
    document.querySelector(
      "[data-divider='vertical'][data-animate-scroll='true']"
    )
  ) {
    $("[data-divider='vertical'][data-animate-scroll='true']").each(
      function () {
        let triggerElement = $(this);
        let targetElement = $(this);

        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: "0% 90%",
            end: "100% 0%",
            toggleActions: "play none none none",
          },
        });

        tl.from(
          targetElement,
          {
            scaleY: 0,
            duration: durationDefault,
            stagger: staggerDefault,
          },
          -0.2
        );
      }
    );
  }

  if (document.querySelector("[data-animate-scroll-group]")) {
    $("[data-animate-scroll-group]").each(function () {
      let triggerElement = $(this);
      let targetEyebrow = triggerElement.find("[data-eyebrow]");
      let targetElementLines = triggerElement.find("[data-single-line-inner]");
      let targetElementFade = triggerElement.find("[data-fade-in]");

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 90%",
          end: "100% 0%",
          toggleActions: "play none none none",
        },
      });

      if (targetEyebrow.length) {
        tl.fromTo(
          targetEyebrow.find("[data-eyebrow-marker]"),
          {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ease: "primary-ease",
            duration: durationDefault,
          },
          -0.2
        );

        tl.from(
          targetEyebrow.find("[data-eyebrow-text]"),
          {
            opacity: 0,
            ease: "none",
            duration: durationDefault,
            stagger: staggerDefault,
          },
          "> -0.5"
        );
      }

      let lineOffset;
      if (targetEyebrow.length) {
        lineOffset = "0.2";
      } else {
        lineOffset = "-0.2";
      }

      if (targetElementLines.length) {
        tl.fromTo(
          targetElementLines,
          {
            yPercent: 110,
            rotate: 0.001,
          },
          {
            yPercent: 0,
            rotate: 0.001,
            ease: "primary-ease",
            duration: durationDefault,
            stagger: staggerDefault,
          },
          lineOffset
        );
      }

      let fadeOffset;
      if (targetElementLines.length) {
        fadeOffset = "> -0.4";
      } else {
        fadeOffset = "0.2";
      }

      if (targetElementFade.length) {
        tl.fromTo(
          targetElementFade,
          {
            y: "2em",
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            ease: "Expo.easeOut",
            duration: durationDefault,
            stagger: staggerDefault,
          },
          fadeOffset
        );
      }
    });
  }

  // Disable GSAP on Mobile
  ScrollTrigger.matchMedia({
    // Desktop Only Scrolltrigger
    "(min-width: 992px)": function () {}, // End Desktop Only Scrolltrigger
    // Tablet & Mobile Only
    "(max-width: 991px)": function () {}, // End Tablet & Mobile Only
  });
}
