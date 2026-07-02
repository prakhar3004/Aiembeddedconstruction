export const getApiBase = () => {
  return localStorage.getItem('nirmaan_api_base') || 'http://localhost:3001/api';
};

// Helper to get token
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const token = localStorage.getItem('nirmaan_jwt_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Generic request helper
async function request(endpoint, options = {}) {
  const url = `${getApiBase()}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

export const apiService = {
  // Auth
  async login(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
      localStorage.setItem('nirmaan_jwt_token', data.token);
    }
    return data;
  },

  async register(name, email, password) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    if (data.token) {
      localStorage.setItem('nirmaan_jwt_token', data.token);
    }
    return data;
  },

  async me() {
    return request('/auth/me');
  },

  logout() {
    localStorage.removeItem('nirmaan_jwt_token');
  },

  // Projects
  async getProjects() {
    return request('/projects');
  },

  async createProject(projectData) {
    return request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  },

  async deleteProject(projectId) {
    return request(`/projects/${projectId}`, {
      method: 'DELETE'
    });
  },

  async updateProjectRisk(projectId, riskAssessment) {
    return request(`/projects/${projectId}/risk`, {
      method: 'PUT',
      body: JSON.stringify(riskAssessment)
    });
  },

  async bulkUpdateActivities(projectId, activities) {
    return request(`/projects/${projectId}/activities_bulk`, {
      method: 'PUT',
      body: JSON.stringify({ activities })
    });
  },

  // Activities & Checklists
  async getActivities(projectId) {
    return request(`/projects/${projectId}/activities`);
  },

  async updateActivity(projectId, activityId, activityData) {
    return request(`/projects/${projectId}/activities/${activityId}`, {
      method: 'PUT',
      body: JSON.stringify(activityData)
    });
  },

  async toggleChecklistItem(projectId, activityId, itemIndex, checked) {
    return request(`/projects/${projectId}/activities/${activityId}/checklist/${itemIndex}`, {
      method: 'PUT',
      body: JSON.stringify({ checked })
    });
  },

  // Chats
  async getChats(projectId) {
    return request(`/projects/${projectId}/chat`);
  },

  async sendChatMessage(projectId, text, sender) {
    return request(`/projects/${projectId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ text, sender })
    });
  }
};
