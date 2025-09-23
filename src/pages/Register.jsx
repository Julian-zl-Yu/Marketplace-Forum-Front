import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth } from '../api/client.js'


export default function Register(){
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState('')
  const [ok, setOk] = useState(false)

  return (
    <form className="max-w-md card p-4 mx-auto" onSubmit={async e=>{
      e.preventDefault()
      setErr(''); setOk(false)
      if (password !== confirm){ setErr('Passwords do not match'); return }
      try{
        await auth.register(username, password)
        await auth.login(username, password)
        setOk(true)
        nav('/')
      }catch(e){ setErr(e.message) }
    }}>
      <h1 className="text-lg font-semibold">注册账号</h1>
      <p className="text-sm text-slate-600 mt-1">注册一个新的帖多多账号</p>

      <label className="label mt-3">用户名</label>
      <input className="input" value={username} onChange={e=>setUsername(e.target.value)} required />

      <label className="label mt-3">密码</label>
      <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} required />

      <label className="label mt-3">确认密码</label>
      <input type="password" className="input" value={confirm} onChange={e=>setConfirm(e.target.value)} required />

      {err && <p className="mt-2 text-sm text-rose-600">{err}</p>}
      {ok && <p className="mt-2 text-sm text-emerald-600">Registered! Redirecting…</p>}

      <button className="btn btn-primary mt-3">创建账号</button>
      <p className="text-sm text-slate-600 mt-3">已经有账号？<Link to="/login" className="underline">点此登录</Link>.</p>
    </form>
  )
}
