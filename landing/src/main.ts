// Progressive enhancement entry — the page must work fully without this file.
import { initCopyEmail } from './lib/copy-email';
import { initReveal } from './lib/reveal';

document.documentElement.classList.add('js');
initCopyEmail();
initReveal();
