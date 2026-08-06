export function generateCspHeader(nonce: string, incomingHeaders: Headers) {
  const requestHeaders = new Headers(incomingHeaders);
  requestHeaders.set('x-nonce', nonce);

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''};
    style-src 'self' 'nonce-${nonce}' 'unsafe-inline';
    img-src 'self' blob: data: https://images.unsplash.com https://avatar.vercel.sh;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  return { cspHeader, requestHeaders };
}
