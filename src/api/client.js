const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

function getToken(){ return localStorage.getItem('token') || '' }
function setToken(t){ localStorage.setItem('token', t || '') }
function logout(){ localStorage.removeItem('token') }
function getUser(){ try{ return JSON.parse(localStorage.getItem('user')||'') }catch(e){ return null } }
function setUser(u){ if(!u){ localStorage.removeItem('user'); } else { localStorage.setItem('user', JSON.stringify(u)) } }

async function request(path, { method='GET', body, auth=true, headers={} } = {}){
  const opts = { method, headers: { 'Content-Type':'application/json', ...headers } }
  if (auth && getToken()) opts.headers['Authorization'] = `Bearer ${getToken()}`
  if (body !== undefined) opts.body = JSON.stringify(body)
  const res = await fetch(`${API_BASE}${path}`, opts)
  if (!res.ok){
    const text = await res.text().catch(()=>res.statusText)
    throw new Error(`${res.status} ${res.statusText} — ${text}`)
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

export const auth = {
  async login(username, password){
    const data = await request('/api/auth/login', { method:'POST', body:{ username, password }, auth:false })
    setToken(data.token); setUser({ username })
    return data
  },
  async register(username, password){
    return request('/api/auth/register',{ method:'POST', body:{ username, password }, auth:false })
  },
  logout, getToken, setToken, getUser, setUser
}

export const posts = {
  async list(params = {}) {
    // 同时带上 category 和 categoryName，后端取其一
    const qpObj = { page: 0, size: 10, ...params };
    if (params.category && !params.categoryName) {
      qpObj.categoryName = params.category;
    }
    const qp = new URLSearchParams(qpObj).toString();

    const res = await request(`/api/posts?${qp}`, { method: 'GET', auth: false });

    // 关键：统一“数组”输出，避免 .map 崩溃
    if (Array.isArray(res)) return res;
    if (res?.records) return res.records;   // MyBatis-Plus Page
    if (res?.content) return res.content;   // Spring Data Page
    if (res?.items)   return res.items;     // 其它分页风格
    if (res?.data)    return Array.isArray(res.data) ? res.data : []; // 有些包在 data
    return [];
  },

  get(id){ return request(`/api/posts/${id}`, { method:'GET', auth:false }) },
  create(payload){ return request('/api/posts', { method:'POST', body: payload }) },
  removeAdmin(id){ return request(`/api/admin/posts/${id}`, { method:'DELETE' }) },
  removeMine(id){ return request(`/api/posts/${id}`, { method:'DELETE' }) },
  async removeSmart(id){ try{ return await this.removeMine(id) } catch(e){ return await this.removeAdmin(id) } },
}

export const comments = {
  async list(postId, params = {}) {
    const qp = new URLSearchParams({ page: 0, size: 20, ...params }).toString();

    // 带 token 请求（auth:true），并兼容三种路径
    const res = await (async () => {
      try {
        return await request(`/api/comments/${postId}/comments?${qp}`, { method: 'GET', auth: true });
      } catch (e1) {
        try {
          return await request(`/api/posts/${postId}/comments?${qp}`, { method: 'GET', auth: true });
        } catch (e2) {
          return await request(`/api/comments?postId=${postId}&${qp}`, { method: 'GET', auth: true });
        }
      }
    })();

    // 统一返回“数组”，避免 .map 崩溃
    if (Array.isArray(res)) return res;
    if (res?.records) return res.records;   // MyBatis-Plus Page
    if (res?.content) return res.content;   // Spring Data Page
    if (res?.items)   return res.items;     // 其它分页风格
    if (res?.data)    return Array.isArray(res.data) ? res.data : [];
    return [];
  },

  async create(postId, payload) {
    try { return await request(`/api/comments/${postId}/comments`, { method: 'POST', body: payload }); }
    catch { return await request(`/api/posts/${postId}/comments`, { method: 'POST', body: payload }); }
  },

  async remove(postId, id) {
    try { return await request(`/api/comments/${postId}/comments/${id}`, { method: 'DELETE' }); }
    catch { return await request(`/api/posts/${postId}/comments/${id}`, { method: 'DELETE' }); }
  }
}

export const enums = { categories: ['SECOND_HAND','RENTAL','JOB'] }

export const categoryLabels = {
  SECOND_HAND: '二手交易',
  RENTAL: '房屋出租',
  JOB: '招聘求职'
}
