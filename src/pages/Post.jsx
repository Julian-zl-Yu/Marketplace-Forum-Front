import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {posts, comments, auth, categoryLabels} from '../api/client.js'


function CommentItem({ c, postId, onDeleted }){
  const me = auth.getUser()?.username
  const canDelete = me && (me === c.author)
  const doDelete = async () => {
    if (!confirm('Delete this comment?')) return
    try { await comments.remove(postId, c.id); onDeleted && onDeleted(c.id) } catch(e){ alert('Delete failed: ' + e.message) }
  }
  return (
    <li className="border-t border-slate-100 py-3">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>作者： {c.author}</span>
        <div className="flex items-center gap-3">
          <span>{new Date(c.createdAt).toLocaleString()}</span>
          {canDelete && <button className="btn btn-ghost" onClick={doDelete}>Delete</button>}
        </div>
      </div>
      <p className="mt-1 text-sm whitespace-pre-wrap">{c.content}</p>
    </li>
  )
}

function CommentForm({ postId, onCreated }){
  const token = auth.getToken()
  const me = auth.getUser()?.username      // ← 当前登录用户名
  const [content, setContent] = useState('')
  const [err, setErr] = useState('')

  if (!token) return <p className="text-sm text-slate-600">请在 <Link to="/login" className="underline">登录</Link>后评论</p>

  return (
      <form className="mt-3 space-y-2" onSubmit={async e=>{
        e.preventDefault()
        setErr('')
        try{
          await comments.create(postId, { author: me, content })  // ← 自动带上 author
          setContent('')
          onCreated && onCreated()
        }catch(e){ setErr(e.message) }
      }}>
        <p className="text-sm text-slate-600">用户： <strong>{me}</strong></p> {/* ← 显示当前用户 */}
        <div>
          <label className="label">评论</label>
          <textarea className="input h-28" value={content} onChange={e=>setContent(e.target.value)} required />
        </div>
        {err && <p className="text-sm text-rose-600">{err}</p>}
        <button className="btn btn-primary">发表评论</button>
      </form>
  )
}


export default function Post(){
  const { id } = useParams()
  const nav = useNavigate()
  const [p, setP] = useState(null)
  const [cs, setCs] = useState([])
  const [err, setErr] = useState('')

  const reload = ()=>{
    posts.get(id).then(setP).catch(e=>setErr(e.message))
    comments.list(id).then(setCs).catch(e=>console.error(e))
  }
  useEffect(() => { reload(); }, [id])

  if (err) return <p className="text-rose-600">{err}</p>
  if (!p) return <p>Loading…</p>

  const me = auth.getUser()?.username
  const isOwner = me && (me === p.author)

  const deletePost = async ()=>{
    if (!confirm('Delete this post?')) return
    try{ await posts.removeSmart(p.id); nav('/') }catch(e){ alert('Delete failed: ' + e.message) }
  }

  return (
    <article className="grid gap-6 lg:grid-cols-12">
      <section className="lg:col-span-8 card p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{p.title}</h1>
          <span className="text-sm text-slate-500">{categoryLabels[p.category] || p.category}</span>
        </div>
        <div className="mt-1 text-sm text-slate-500">
          <span>作者： {p.author}</span>
          {p.location && <span> · 地点：{p.location}</span>}
          {p.company && <span> · 公司 {p.company}</span>}
          <span> · {new Date(p.createdAt).toLocaleString()}</span>
        </div>
        <div className="prose mt-4 max-w-none whitespace-pre-wrap">{p.content}</div>
      </section>

      <aside className="lg:col-span-4 space-y-4">
        <div className="card p-4">
          <h3 className="text-sm font-semibold">详细内容</h3>
          <ul className="mt-2 text-sm text-slate-600 space-y-1">
            {p.price != null && <li>价格: ${p.price}</li>}
            {p.wage != null && <li>薪酬: ${p.wage}/hr</li>}
          </ul>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-semibold">选择</h3>
          <div className="mt-2 flex gap-2">
            <Link to="/" className="btn btn-ghost">返回</Link>
            {me && <button className="btn btn-ghost" onClick={deletePost}>删除</button>}
          </div>
        </div>
      </aside>

      <section className="lg:col-span-12 card p-4">
        <h3 className="text-lg font-semibold">评论</h3>
        <ul className="mt-3">
          {cs.map(c => <CommentItem key={c.id} c={c} postId={id} onDeleted={(cid)=> setCs(prev=>prev.filter(x=>x.id!==cid))} />)}
        </ul>
        <CommentForm postId={id} onCreated={reload} />
      </section>
    </article>
  )
}
