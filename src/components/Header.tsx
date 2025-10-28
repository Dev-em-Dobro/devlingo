import { ArrowLeft } from 'lucide-react'
import { IoLogoJavascript, IoFlame, IoDiamond, IoHeart } from 'react-icons/io5'

const Header = () => {
  return (
    <>
      {/* Top bar with icons */}
      <div className="bg-white border-b border-gray-200 py-3 px-4">
        <div className="flex items-center justify-between md:max-w-6xl md:mx-auto">
          <div className="flex items-center gap-2">
            <IoLogoJavascript size={28} className="text-[#f7df1e]" />
          </div>
          <div className="flex items-center gap-2">
            <IoFlame size={24} className="text-orange-500" />
            <span className="font-bold text-gray-700">0</span>
          </div>
          <div className="flex items-center gap-2">
            <IoDiamond size={24} className="text-blue-500" />
            <span className="font-bold text-gray-700">156</span>
          </div>
          <div className="flex items-center gap-2">
            <IoHeart size={24} className="text-red-500" />
            <span className="font-bold text-gray-700">∞</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-[#58CC02] py-6 px-4 md:px-8 border-b-[5px] border-[#55b20e] rounded-[12px] mx-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="text-white hover:opacity-80 transition-opacity">
                <ArrowLeft size={24} />
              </button>
              <div>
                <div className="text-white/90 text-sm font-semibold uppercase tracking-wide">
                  SEÇÃO 1, UNIDADE 1
                </div>
                <h1 className="text-white text-2xl font-bold mt-1">
                  Fundamentos de JavaScript
                </h1>
              </div>
            </div>
            {/* <button className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 py-2 flex items-center gap-2 font-bold transition-colors">
              <List size={20} />
              GUIA
            </button> */}
          </div>
        </div>
      </header>
    </>
  )
}

export default Header

