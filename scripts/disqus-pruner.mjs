/**
 * Disqus Ad Pruner & Validator utilities.
 */

/**
 * Prunes ad iframes from a Disqus container without removing
 * the main comments iframe or notification indicators.
 *
 * @param {HTMLElement} container - The container element (e.g., #disqus_thread)
 * @returns {Array<HTMLElement>} List of removed iframes
 */
export function pruneDisqusAds(container) {
  if (!container || !container.getElementsByTagName) return [];
  const removed = [];
  const iframes = Array.from(container.getElementsByTagName('iframe'));
  for (let i = 0; i < iframes.length; i++) {
    const iframe = iframes[i];
    const src = iframe.src || (iframe.getAttribute && iframe.getAttribute('src')) || '';
    if (src.includes('ads-iframe') || src.includes('disqusads') || src.includes('taboola')) {
      if (typeof iframe.remove === 'function') {
        iframe.remove();
      } else if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      removed.push(iframe);
    }
  }
  return removed;
}

/**
 * Validates that a comments iframe is present in the container
 * and hasn't been improperly destroyed or replaced.
 *
 * @param {HTMLElement} container - The container element (e.g., #disqus_thread)
 * @returns {{ valid: boolean, commentsIframe: HTMLElement|null, reason?: string }}
 */
export function validateCommentsState(container) {
  if (!container || !container.getElementsByTagName) {
    return { valid: false, commentsIframe: null, reason: 'Container not found' };
  }
  const iframes = Array.from(container.getElementsByTagName('iframe'));
  const commentsIframe = iframes.find(f => {
    const src = f.src || (f.getAttribute && f.getAttribute('src')) || '';
    const id = f.id || '';
    return src.includes('disqus.com/embed/comments') || (id.startsWith('dsq-app') && !src.includes('ads'));
  });

  if (!commentsIframe) {
    return { valid: false, commentsIframe: null, reason: 'Comments iframe missing' };
  }
  return { valid: true, commentsIframe };
}
