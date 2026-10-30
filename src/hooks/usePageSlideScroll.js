import { useEffect, useRef } from "react";

/**
 * usePageSlideScroll
 * Enables slide-by-slide, page-by-page presentation scrolling.
 * - Scrolls exactly one page at a time.
 * - Even a small scroll gesture cleanly advances to the next section or snaps back,
 *   never stopping midway.
 * - Safely permits normal scrolling inside open modals, inputs, and dialogs.
 */
export default function usePageSlideScroll(slideSelector = ".slide-section", topOffset = 80) {
  const isAnimatingRef = useRef(false);
  const touchStartYRef = useRef(null);

  useEffect(() => {
    // Cooldown duration in ms
    const COOLDOWN_MS = 750;

    const getSlides = () => Array.from(document.querySelectorAll(slideSelector));

    const getCurrentSlideIndex = (slides) => {
      if (!slides.length) return 0;
      const scrollPos = window.scrollY + topOffset + 10;
      let closestIdx = 0;
      let minDistance = Infinity;

      slides.forEach((slide, idx) => {
        const top = slide.offsetTop;
        const dist = Math.abs(top - scrollPos);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });
      return closestIdx;
    };

    const scrollToSlide = (slide) => {
      if (!slide) return;
      isAnimatingRef.current = true;
      const targetTop = Math.max(0, slide.offsetTop - (topOffset > 0 ? topOffset : 0));
      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, COOLDOWN_MS);
    };

    const isInteractiveOrModal = (target) => {
      if (!target) return false;
      return Boolean(
        target.closest?.(
          "form, input, textarea, select, button, .MuiDialog-root, .MuiDrawer-root, [role='dialog'], .scrollable-content, .MuiPaper-root, .MuiAccordion-root"
        )
      );
    };

    // Wheel event handler (desktop mouse & trackpad)
    const handleWheel = (e) => {
      // Allow normal interactions in dialogs, inputs, drawers
      if (isInteractiveOrModal(e.target)) return;

      const slides = getSlides();
      if (slides.length <= 1) return;

      // Always block midway drift if an animation is active
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      const deltaY = e.deltaY;
      // Filter out tiny ambient trackpad jitter
      if (Math.abs(deltaY) < 18) return;

      e.preventDefault();

      const currentIdx = getCurrentSlideIndex(slides);
      const currentSlide = slides[currentIdx];
      const rect = currentSlide.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (deltaY > 0) {
        // SCROLL DOWN: Next page
        // If current slide is taller than viewport and user hasn't seen the bottom yet
        if (rect.bottom > viewportHeight + 40 && rect.top <= 10) {
          isAnimatingRef.current = true;
          const advance = Math.min(viewportHeight * 0.8, rect.bottom - viewportHeight);
          window.scrollBy({ top: advance, behavior: "smooth" });
          setTimeout(() => {
            isAnimatingRef.current = false;
          }, 550);
          return;
        }

        if (currentIdx < slides.length - 1) {
          scrollToSlide(slides[currentIdx + 1]);
        }
      } else {
        // SCROLL UP: Previous page
        if (rect.top < -40) {
          isAnimatingRef.current = true;
          const retreat = Math.max(-viewportHeight * 0.8, rect.top);
          window.scrollBy({ top: retreat, behavior: "smooth" });
          setTimeout(() => {
            isAnimatingRef.current = false;
          }, 550);
          return;
        }

        if (currentIdx > 0) {
          scrollToSlide(slides[currentIdx - 1]);
        }
      }
    };

    // Keyboard navigation (ArrowDown, ArrowUp, PageDown, PageUp)
    const handleKeyDown = (e) => {
      if (isInteractiveOrModal(e.target)) return;

      const slides = getSlides();
      if (!slides.length || isAnimatingRef.current) return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        const currentIdx = getCurrentSlideIndex(slides);
        if (currentIdx < slides.length - 1) {
          scrollToSlide(slides[currentIdx + 1]);
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        const currentIdx = getCurrentSlideIndex(slides);
        if (currentIdx > 0) {
          scrollToSlide(slides[currentIdx - 1]);
        }
      }
    };

    // Touch swipe navigation (mobile & tablet)
    const handleTouchStart = (e) => {
      if (isInteractiveOrModal(e.target)) {
        touchStartYRef.current = null;
        return;
      }
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (touchStartYRef.current === null || isAnimatingRef.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartYRef.current - touchEndY;
      touchStartYRef.current = null;

      // Threshold of 45px for intentional swipe
      if (Math.abs(diffY) < 45) return;

      const slides = getSlides();
      if (!slides.length) return;

      const currentIdx = getCurrentSlideIndex(slides);
      if (diffY > 0 && currentIdx < slides.length - 1) {
        scrollToSlide(slides[currentIdx + 1]);
      } else if (diffY < 0 && currentIdx > 0) {
        scrollToSlide(slides[currentIdx - 1]);
      }
    };

    // Anchor click helper: Lock controller during smooth scroll from nav clicks
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest("a[href^='#']");
      if (!anchor) return;
      isAnimatingRef.current = true;
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 900);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("click", handleAnchorClick);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [slideSelector, topOffset]);
}
