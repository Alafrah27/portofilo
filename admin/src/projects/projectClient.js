import { authClient, authStore } from '../auth/authStore.js';

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGES = 10;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function validateImages(files) {
  if (files.length > MAX_IMAGES) throw new Error('Choose up to 10 images.');
  for (const file of files) {
    if (!IMAGE_TYPES.includes(file.type)) throw new Error('Only JPEG, PNG, and WebP images are allowed.');
    if (file.size > MAX_IMAGE_SIZE) throw new Error('Each image must be at most 5MB.');
  }
}

export function projectForm({ title, description, websiteUrl, files = [] }, { editing = false } = {}) {
  if (!title.trim() || title.trim().length > 200) throw new Error('Enter a project name of up to 200 characters.');
  const text = description.replace(/<[^>]*>/g, '').replace(/&nbsp;|&#160;|\u00a0/gi, ' ').trim();
  if (!text || description.length > 100000) throw new Error('Add a project story of up to 100,000 characters.');
  validateImages(files);
  if (!editing && !files.length) throw new Error('Add at least one project image.');
  const body = new FormData();
  body.append('title', title.trim());
  body.append('description', description.trim());
  if (websiteUrl !== undefined) {
    if (typeof websiteUrl !== 'string') throw new Error('Enter a valid HTTP or HTTPS website URL.');
    const value = websiteUrl.trim();
    if (value) {
      let url;
      try { url = new URL(value); } catch { throw new Error('Enter a valid HTTP or HTTPS website URL.'); }
      if (value.length > 2048 || !['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) {
        throw new Error('Enter a valid HTTP or HTTPS website URL of up to 2,048 characters.');
      }
    }
    body.append('websiteUrl', value);
  }
  files.forEach((file) => body.append('images', file));
  return body;
}

export function createProjectClient({ request, onUnauthorized = async () => {} }) {
  async function send(path, options) {
    try { return await request(path, options); }
    catch (error) {
      if (error.status === 401 || error.status === 403) await onUnauthorized();
      throw error;
    }
  }
  const pathFor = (id) => `/projects/${encodeURIComponent(id)}`;
  return {
    async list() { return (await send('/projects')).projects; },
    async get(id) { return (await send(pathFor(id))).project; },
    async create(data) {
      return (await send('/projects', { method: 'POST', body: projectForm(data), timeoutMs: 180000 })).project;
    },
    async update(id, data) {
      return (await send(pathFor(id), { method: 'PATCH', body: projectForm(data, { editing: true }), timeoutMs: 180000 })).project;
    },
    async remove(id) { await send(pathFor(id), { method: 'DELETE', timeoutMs: 180000 }); },
  };
}

export const projectsApi = createProjectClient({
  request: (path, options) => authClient.apiRequest(path, options),
  onUnauthorized: () => authStore.checkSession(),
});
