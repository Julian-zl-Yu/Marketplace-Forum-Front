import { NavLink, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Home from './pages/Home.jsx'
import Post from './pages/Post.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NewPost from './pages/NewPost.jsx'
import CategoryList from './pages/CategoryList.jsx'
import { auth } from './api/client.js'

export default function App(){
  const token = auth.getToken()
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="container flex items-center justify-between py-3">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-emerald-500" />
            <span className="text-lg text-green-700 font-semibold tracking-tight">帖多多</span>
          </NavLink>
          <nav className="hidden gap-6 md:flex">
            <NavLink to="/all" className="text-sm text-fuchsia-500 hover:text-slate-900">全部</NavLink>
            <NavLink to="/second-hand" className="text-sm text-emerald-500 hover:text-slate-900">二手</NavLink>
            <NavLink to="/rentals" className="text-sm text-sky-500 hover:text-slate-900">住房</NavLink>
            <NavLink to="/jobs" className="text-sm text-amber-500 hover:text-slate-900">工作</NavLink>
            <NavLink to="/new" className="text-sm text-amber-700 hover:text-slate-900">发布内容</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            {token ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">你好！ <strong>{auth.getUser()?.username || 'user'}</strong></span>
                <button className="btn btn-ghost" onClick={()=>{auth.logout(); auth.setUser(null); location.reload()}}>登出</button>
              </div>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-ghost">登录</NavLink>
                <NavLink to="/register" className="btn btn-primary">注册</NavLink>
              </>
            )}
            <a href="/swagger-ui.html" className="btn btn-primary" target="_blank" rel="noreferrer">API Docs</a>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/all" element={<Home/>} />
          <Route path="/post/:id" element={<Post/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/new" element={<NewPost/>} />
          <Route path="/second-hand" element={<CategoryList cat="SECOND_HAND"/>} />
          <Route path="/rentals" element={<CategoryList cat="RENTAL"/>} />
          <Route path="/jobs" element={<CategoryList cat="JOB"/>} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="container py-8 text-sm text-slate-500">
          © 于知理 2025年9月21日 北京天坛
          {/*© {new Date().getFullYear()} 于知理 2025年九月21日 北京天坛*/}
        </div>
      </footer>
    </div>
  )
}
