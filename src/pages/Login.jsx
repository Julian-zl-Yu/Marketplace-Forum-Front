import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../api/client.js'
import { Link } from "react-router-dom";


export default function Login(){
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  return (
    <form className="max-w-md card p-4 mx-auto" onSubmit={async e=>{
      e.preventDefault()
      setErr('')
      try{ await auth.login(username, password); nav('/'); window.location.reload();}
      catch(e){ setErr(e.message) }
    }}>
      <h1 className="text-lg font-semibold">登录</h1>
      <p className="text-sm text-slate-60a0 mt-1">使用你的帖多多账号登录</p>

      <label className="label mt-3">用户名</label>
      <input className="input" value={username} onChange={e=>setUsername(e.target.value)} required />

      <label className="label mt-3">密码</label>
      <input type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} required />

      {err && <p className="mt-2 text-sm text-rose-600">{err}</p>}
      <button className="btn btn-primary mt-3">登录</button>
        <p className="text-sm text-slate-600 mt-3">
            还没有账号？<Link to="/register" className="underline">创建账号</Link>.
        </p>
    </form>
  )
}
