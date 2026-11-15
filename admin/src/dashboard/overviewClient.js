import { authClient, authStore } from '../auth/authStore.js';

export function createOverviewClient({ request, onUnauthorized = async () => {} }) {
  return {
    async get() {
      try {
        const response = await request('/overview');
        const overview = response?.overview;
        const counts = ['total', 'todo', 'inProgress', 'completed', 'open', 'completionRate'];
        if (!overview || !Number.isInteger(overview.projects) || overview.projects < 0
          || !counts.every((key) => Number.isInteger(overview.tasks?.[key]) && overview.tasks[key] >= 0)
          || overview.tasks.completionRate > 100 || !Number.isFinite(Date.parse(overview.asOf))
          || !Array.isArray(overview.recentProjects) || !Array.isArray(overview.activity)) {
          throw new Error('Unable to read workspace totals. Please try again.');
        }
        return overview;
      } catch (error) {
        if (error.status === 401 || error.status === 403) await onUnauthorized();
        throw error;
      }
    },
  };
}

export const overviewApi = createOverviewClient({
  request: (path, options) => authClient.apiRequest(path, options),
  onUnauthorized: () => authStore.checkSession(),
});
