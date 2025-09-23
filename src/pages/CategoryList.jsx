// src/pages/CategoryList.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { posts, auth } from '../api/client.js'
import { categoryLabels } from '../api/client.js'

// 把后端的一条 post 归一化成前端稳定字段
function normalizePost(raw = {}) {
  const id = raw.id ?? raw.postId ?? raw.ID ?? raw.Id
  const title = raw.title ?? raw.name ?? '(no title)'
  const createdAt = raw.createdAt ?? raw.createTime ?? raw.created_at ?? raw.created ?? Date.now()
  const content = raw.content ?? raw.description ?? ''
  const author = raw.author ?? raw.username ?? raw.user ?? ''
  const category = raw.category ?? raw.categoryName ?? raw.type ?? ''
  const location = raw.location ?? ''
  const company = raw.company ?? ''
  const price = raw.price
  const wage = raw.wage
  return { id, title, createdAt, content, author, category, location, company, price, wage }
}

function PostCard({ p, onDeleted }) {
  const me = auth.getUser()?.username
  const tryDelete = async (e) => {
    e.preventDefault()
    if (!confirm('删除这条帖子？')) return
    try { await posts.removeSmart(p.id); onDeleted?.(p.id) }
    catch (err) { alert('非用户本人删除失败：' + err.message) }
  }
  return (
      <li className="card p-4 hover:shadow">
        <Link to={`/post/${p.id}`} className="block">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold leading-snug hover:underline">{p.title}</h3>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>{categoryLabels[p.category] || p.category}</span>
              <span>·</span>
              <span>{new Date(p.createdAt).toLocaleString()}</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-slate-600 line-clamp-2">{p.content}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            {p.author && <span>作者：{p.author}</span>}
            {p.location && <span>· 地点：{p.location}</span>}
            {p.company && <span>· 公司：{p.company}</span>}
            {p.price != null && <span>· 价格：¥{p.price}</span>}
            {p.wage != null && <span>· 薪资：¥{p.wage}/小时</span>}
          </div>
        </Link>
        {/*{me && <div className="mt-2"><button className="btn btn-ghost" onClick={tryDelete}>删除（需用户本人）</button></div>}*/}
      </li>
  )
}

export default function CategoryList({ cat }) {
  const [data, setData] = useState([])
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)

  const reload = async () => {
    setLoading(true); setErr('')
    try {
      // posts.list 已做分页兼容；此处再做一次归一化，过滤掉没有 id 的项避免 key/路由报错
      const list = await posts.list({ category: cat })
      const arr = Array.isArray(list) ? list : []
      const norm = arr.map(normalizePost).filter(x => x.id != null)
      setData(norm)
    } catch (e) {
      setErr(e.message || String(e))
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload();              // 调用即可，不要 return 它
  }, [cat])
  return (
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{categoryLabels[cat] || cat}</h2>
          <Link to="/new" className="btn btn-primary">发布新内容</Link>
        </div>

        {loading && <p className="mt-3 text-sm text-slate-500">Loading…</p>}
        {err && !loading && <p className="mt-2 text-sm text-rose-600 break-all">{err}</p>}

        {!loading && !err && (
            <>
              <ul className="mt-4 space-y-3">
                {data.map(p => <PostCard key={p.id} p={p} onDeleted={(id)=> setData(prev=>prev.filter(x=>x.id!==id))} />)}
              </ul>
              {!data.length && <p className="text-sm text-slate-600 mt-2">还没有新发布</p>}
            </>
        )}
      </section>
  )
}
