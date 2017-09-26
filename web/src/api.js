// Thin wrapper around the Fetch API_URL.

// fetch polyfill
import 'whatwg-fetch';

const API_URL = process.env.API_URL;

function headers() {
  const token = JSON.parse(localStorage.getItem('token'));

  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer: ${token}`,
  };
}

function parseResponse(response) {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(response);
}

function queryString(params) {
  const query = Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
  return `${query.length ? '?' : ''}${query}`;
}

const api = {
  get(url, params = {}) {
    return fetch(`${API_URL}${url}${queryString(params)}`, {
      method: 'GET',
      headers: headers(),
    })
    .then(parseResponse);
  },

  post(url, data) {
    return fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    })
    .then(parseResponse);
  },

  patch(url, data) {
    return fetch(`${API_URL}${url}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(data),
    })
    .then(parseResponse);
  },

  delete(url) {
    return fetch(`${API_URL}${url}`, {
      method: 'DELETE',
      headers: headers(),
    })
    .then(parseResponse);
  },
};

if (process.env.NODE_ENV === 'development') {
  window.api = api;
}

export default api;
