
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { posts, enums, auth } from '../api/client.js'
import { Link } from "react-router-dom";


export default function NewPost(){
  const nav = useNavigate()
  const me = auth.getUser()?.username            // ← 当前登录用户名
  const token = auth.getToken()
  if (!token) return <p className="text-sm text-slate-600">
    你必须 <Link to="/login" className="underline">登录</Link> 来发表新内容
  </p>

  const [form, setForm] = useState({
    category: 'SECOND_HAND',
    title: '',
    content: '',
    location: '',
    price: '',
    company: '',
    wage: ''
  })
  const [err, setErr] = useState('')

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  return (
      <form className="max-w-2xl card p-4 mx-auto" onSubmit={async e=>{
        e.preventDefault()
        setErr('')
        try{
          const payload = { ...form, author: me }  // ← 自动带上作者
          if (payload.price === '') delete payload.price
          if (payload.wage === '') delete payload.wage
          const p = await posts.create(payload)
          nav(`/post/${p.id}`)
        }catch(e){ setErr(e.message) }
      }}>
        <h1 className="text-lg font-semibold">新内容</h1>
        <p className="text-sm text-slate-600 mt-1">发布者：<strong>{me}</strong></p> {/* ← 显示当前用户 */}

        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={set('category')}>
              {enums.categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* 删除 Author 输入框 */}

          <div className="sm:col-span-2">
            <label className="label">标题</label>
            <input className="input" value={form.title} onChange={set('title')} required />
          </div>
          <div className="sm:col-span-2">
            <label className="label">内容</label>
            <textarea className="input h-40" value={form.content} onChange={set('content')} required />
          </div>
          <div>
            <label className="label">地点</label>
            <input className="input" value={form.location} onChange={set('location')} />
          </div>
          <div>
            <label className="label">公司</label>
            <input className="input" value={form.company} onChange={set('company')} />
          </div>
          <div>
            <label className="label">价格</label>
            <input className="input" type="number" step="0.01" value={form.price} onChange={set('price')} />
          </div>
          <div>
            <label className="label">薪酬</label>
            <input className="input" type="number" step="0.01" value={form.wage} onChange={set('wage')} />
          </div>
        </div>

        {err && <p className="mt-2 text-sm text-rose-600">{err}</p>}
        <button className="btn btn-primary mt-3">发布</button>
      </form>
  )
}
