export function generateCspHeader(useNonce: boolean) {
  const nonce = useNonce ? crypto.randomUUID() : null;
  const defaultSrc = `default-src 'self';`;
  const scriptSrc = useNonce
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''};`
    : `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''};`;

  const styleSrc = useNonce
    ? `style-src 'self' 'nonce-${nonce}';`
    : `style-src 'self' 'unsafe-inline';`;

  const cspHeader = `
    ${defaultSrc}
    ${scriptSrc}
    ${styleSrc}
    img-src 'self' blob: data: https://images.unsplash.com https://avatar.vercel.sh;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  return { cspHeader, nonce };
}
