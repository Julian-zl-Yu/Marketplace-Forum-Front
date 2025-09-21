// src/pages/Landing.jsx
import { Link } from 'react-router-dom'
import { categoryLabels } from '../api/client.js'
import { FaNewspaper, FaShoppingBag, FaHome, FaBriefcase } from "react-icons/fa";


const tiles = [
    { to: '/all', label: '全部发布', sub: '最新帖子', icon: <FaNewspaper />, bg: 'from-violet-500 to-fuchsia-500' },
    { to: '/second-hand', label: categoryLabels.SECOND_HAND, sub: '淘好物', icon: <FaShoppingBag />, bg: 'from-emerald-500 to-teal-500' },
    { to: '/rentals', label: categoryLabels.RENTAL, sub: '找房源', icon: <FaHome />, bg: 'from-sky-500 to-cyan-500' },
    { to: '/jobs', label: categoryLabels.JOB, sub: '找工作', icon: <FaBriefcase />, bg: 'from-amber-500 to-orange-500' },
];

export default function Landing(){
    return (
        <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center relative overflow-hidden">
            {/* 背景彩色气泡 */}
            <div className="pointer-events-none absolute -top-20 -left-20 size-5/12 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 opacity-30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 size-5/12 rounded-full bg-gradient-to-tr from-cyan-300 to-blue-300 opacity-30 blur-3xl" />

            <h1 className="text-6xl sm:text-8xl font-zcool bg-gradient-to-r from-rose-400 to-yellow-400 bg-clip-text text-transparent">
                帖多多
            </h1>
            <p className="mt-3 text-slate-600">一个轻量、好用的社区信息平台</p>

            {/* 四个彩色圆形入口 */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
                {tiles.map(t => (
                    <Link
                        key={t.to}
                        to={t.to}
                        className="group w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br flex flex-col items-center justify-center text-white shadow-xl hover:scale-105 transition-transform duration-200"
                        style={{}}
                    >
                        <div className={`w-full h-full rounded-full p-[2px]`}>
                            <div className={`w-full h-full rounded-full bg-gradient-to-br ${t.bg} flex flex-col items-center justify-center`}>
                                <div className="text-lg sm:text-xl font-bold">{t.label}</div>
                                <div className="text-xs sm:text-sm opacity-90 mt-1">{t.sub}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>


        </div>
    )
}
