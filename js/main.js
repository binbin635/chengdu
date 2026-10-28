/* ============================================================
 * 蜀韵·成都 —— 全站公共脚本 js/main.js
 * 功能清单：
 *   1. 首页全屏 Banner 自动轮播（4.5s 切换，支持箭头/圆点/悬停暂停）
 *   2. 首页导航：页面滚动后自动变为白底（.scrolled）
 *   3. 滚动入场动画：元素进入视口后 .reveal → .visible
 *   4. 页脚版权年份自动更新
 * 说明：使用原生 JavaScript，无任何第三方依赖。
 * ============================================================ */

(function () {
  'use strict';

  /* 小工具：兼容旧浏览器的类数组遍历 */
  function each(list, fn) {
    Array.prototype.forEach.call(list, fn);
  }

  /*
   * ---------- 1. 首页 Banner 自动轮播 ----------
   */
  var banner = document.getElementById('banner');
  if (banner) {
    var slides   = banner.querySelectorAll('.banner-slide'); // 三张轮播图
    var dots     = banner.querySelectorAll('.banner-dots .dot'); // 圆点
    var prevBtn  = document.getElementById('bannerPrev');
    var nextBtn  = document.getElementById('bannerNext');
    var current  = 0;      // 当前播放索引
    var timer    = null;   // 定时器句柄
    var INTERVAL = 4500;   // 自动轮播间隔（毫秒）

    /* 切换到指定索引（支持环形轮回） */
    function goTo(index) {
      current = (index + slides.length) % slides.length;
      each(slides, function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      each(dots, function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function nextSlide() { goTo(current + 1); }
    function prevSlide() { goTo(current - 1); }

    /* 启动 / 停止自动播放 */
    function startAuto() {
      if (!timer) { timer = setInterval(nextSlide, INTERVAL); }
    }
    function stopAuto() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    /* 手动切换后重置计时，避免刚点完又立刻自动跳转 */
    function manualTo(index) {
      stopAuto();
      goTo(index);
      startAuto();
    }

    /* 绑定上一张 / 下一张按钮 */
    if (prevBtn) {
      prevBtn.addEventListener('click', function () { manualTo(current - 1); });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () { manualTo(current + 1); });
    }

    /* 绑定轮播圆点点击 */
    each(dots, function (dot) {
      dot.addEventListener('click', function () {
        manualTo(parseInt(dot.getAttribute('data-index'), 10) || 0);
      });
    });

    /* 鼠标悬停暂停，移开继续 */
    banner.addEventListener('mouseenter', stopAuto);
    banner.addEventListener('mouseleave', startAuto);

    startAuto(); // 页面加载后立即开始自动轮播
  }

  /*
   * ---------- 2. 固定导航：滚动后添加 .scrolled ----------
   */
  var header = document.getElementById('siteHeader');
  if (header) {
    function onScroll() {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll);
    onScroll(); // 页面初始化时执行一次，避免刷新后状态残留
  }

  /*
   * ---------- 3. 滚动入场动画（IntersectionObserver） ----------
   * 说明：仅在 JS 支持时隐藏 .reveal，禁用 JS 时内容照常显示。
   */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    document.documentElement.classList.add('js'); // 通知 CSS 启用入场动画
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // 只播放一次
        }
      });
    }, { threshold: 0.15 });
    each(revealEls, function (el) { observer.observe(el); });
  }

  /*
   * ---------- 4. 页脚版权年份自动更新 ----------
   */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
