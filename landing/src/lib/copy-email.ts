// Enhances the contact section with a "copy email" button.
// Without JS the plain mailto link remains fully functional.
export function initCopyEmail(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-copy-email]');
  const status = document.querySelector<HTMLElement>('[data-copy-status]');
  if (!button || !status) return;

  const email = button.dataset.copyEmail;
  if (!email || !navigator.clipboard) return;

  button.hidden = false;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      status.textContent = 'Email address copied to clipboard.';
      button.textContent = 'Copied ✓';
      setTimeout(() => {
        button.textContent = 'Copy email';
        status.textContent = '';
      }, 2500);
    } catch {
      status.textContent = 'Copy failed — please select the address manually.';
    }
  });
}
