// Phục vụ ảnh từ R2: GET /img/<key> → trả bytes ảnh (cache dài).
export async function onRequestGet({ params, env }) {
  try {
    const key = Array.isArray(params.path) ? params.path.join('/') : String(params.path || '');
    if (!key) return new Response('Not found', { status: 404 });
    const obj = await env.IMAGES.get(key);
    if (!obj) return new Response('Not found', { status: 404 });
    const headers = new Headers();
    obj.writeHttpMetadata(headers);
    headers.set('cache-control', 'public, max-age=31536000, immutable');
    if (obj.httpEtag) headers.set('etag', obj.httpEtag);
    return new Response(obj.body, { headers });
  } catch (e) {
    return new Response('Error: ' + e, { status: 500 });
  }
}
