import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { posts } from '../api/client.js'
import { categoryLabels } from '../api/client.js'


function PostCard({ p }){
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
          <span>作者：{p.author}</span>
          {p.location && <span>· 地点：{p.location}</span>}
          {p.company && <span>· 公司：{p.company}</span>}
          {p.price != null && <span>· 价格：${p.price}</span>}
          {p.wage != null && <span>· 薪酬：${p.wage}/hr</span>}
        </div>
      </Link>
    </li>
  )
}

export default function Home(){
  const [data, setData] = useState([])
  const [err, setErr] = useState('')
  useEffect(()=>{ posts.list().then(setData).catch(e=>setErr(e.message)) },[])
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-lg text-amber-700 font-semibold">最新发布</h2>
        <Link to="/new" className="btn btn-primary">发布新内容</Link>
      </div>
      {err && <p className="mt-2 text-sm text-rose-600">{err}</p>}
      <ul className="mt-4 space-y-3">{data.map(p => <PostCard key={p.id} p={p} />)}</ul>
      {!data.length && !err && <p className="text-sm text-slate-600 mt-2">还没有发布</p>}
    </section>
  )
}
