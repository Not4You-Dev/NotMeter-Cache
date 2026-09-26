(() => {
  let initialized = false;

  function init(t) {
    const notice = document.getElementById("chuseok-coupon-notice");
    if (!notice || initialized) return;
    initialized = true;
    const expiresAt = Date.parse(notice.dataset.expiresAt);
    const button = document.getElementById("chuseok-coupon-copy");
    const code = document.getElementById("chuseok-coupon-code");
    const feedback = document.getElementById("chuseok-coupon-feedback");
    const rewardsButton = document.getElementById("chuseok-coupon-rewards");
    const rewardsDialog = document.getElementById("chuseok-rewards-dialog");
    const rewardsImage = document.getElementById("chuseok-rewards-image");
    const rewardsClose = document.getElementById("chuseok-rewards-close");
    let expiryTimer = 0;
    let copyTimer = 0;

    function syncVisibility() {
      window.clearTimeout(expiryTimer);
      const remaining = expiresAt - Date.now();
      notice.hidden = !Number.isFinite(remaining) || remaining <= 0;
      if (notice.hidden && rewardsDialog.open) rewardsDialog.close();
      if (!notice.hidden) {
        expiryTimer = window.setTimeout(syncVisibility, Math.min(remaining, 86_400_000));
      }
    }

    rewardsButton.addEventListener("click", () => {
      syncVisibility();
      if (notice.hidden || rewardsDialog.open) return;
      if (!rewardsImage.hasAttribute("src")) rewardsImage.src = rewardsImage.dataset.src;
      rewardsDialog.showModal();
      document.body.classList.add("coupon-rewards-open");
    });
    rewardsClose.addEventListener("click", () => rewardsDialog.close());
    rewardsDialog.addEventListener("click", event => {
      if (event.target !== rewardsDialog) return;
      const rect = rewardsDialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) rewardsDialog.close();
    });
    rewardsDialog.addEventListener("keydown", event => {
      if (event.key === "Escape") event.stopPropagation();
    });
    rewardsDialog.addEventListener("close", () => {
      document.body.classList.remove("coupon-rewards-open");
      if (!notice.hidden) rewardsButton.focus({ preventScroll: true });
    });

    function setCopyLabel(key) {
      button.dataset.i18n = key;
      button.textContent = t(key);
    }

    button.addEventListener("click", async () => {
      syncVisibility();
      if (notice.hidden || button.disabled) return;
      window.clearTimeout(copyTimer);
      button.disabled = true;
      try {
        await navigator.clipboard.writeText(code.textContent.trim());
        setCopyLabel("couponCopied");
        feedback.textContent = t("couponCopied");
      } catch {
        setCopyLabel("couponCopyFailed");
        feedback.textContent = t("couponCopyHelp");
      } finally {
        button.disabled = false;
        copyTimer = window.setTimeout(() => {
          setCopyLabel("couponCopy");
          feedback.textContent = "";
        }, 3_000);
      }
    });

    document.addEventListener("visibilitychange", syncVisibility);
    window.addEventListener("pageshow", syncVisibility);
    syncVisibility();
  }

  window.NotMeterCouponNotice = Object.freeze({ init });
})();
