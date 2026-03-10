export async function load() {
  const { merge } = await import('es-toolkit');
  return merge;
}
