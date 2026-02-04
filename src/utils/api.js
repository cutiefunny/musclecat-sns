// src/utils/api.js

// Vite 환경 변수를 사용하여 베이스 URL 결정
const BASE_URL = import.meta.env.DEV 
  ? "http://localhost:8000"       // 로컬 개발 환경
  : "https://musclecat.co.kr";    // 배포 환경

console.log(`[System] Current API Base: ${BASE_URL}`);

/**
 * 공통 Fetch Wrapper
 * @param {string} endpoint - '/sns/getPosts' 같은 엔드포인트
 * @param {object} options - method, body 등 옵션
 */
export async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Request Failed:", error);
    throw error;
  }
}