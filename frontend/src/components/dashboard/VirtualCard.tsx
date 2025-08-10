// src/components/dashboard/VirtualCard.tsx
import { Wifi } from "lucide-react";

export default function VirtualCard() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full border-t-4 border-t-gray-800">
      
      <div>
        <span className="font-semibold text-gray-800">Virtual Card</span>
        
        {/* Card Container */}
        <div className="w-full max-w-xs mx-auto mt-4">
          <div 
            className="
              relative w-full rounded-2xl p-6 flex flex-col justify-between shadow-2xl
              bg-gradient-to-br from-[#1A202C] via-[#2D3748] to-[#5A67D8]
              aspect-[1.586/1] text-white overflow-hidden
            "
          >
            {/* Glossy Overlay Effect */}
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45"></div>

            {/* Card Content Top: Now contains the balance */}
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="text-sm text-gray-400">Available Balance</span>
                <p className="text-2xl font-bold tracking-wider">₹400.00</p>
              </div>
              <Wifi size={28} className="-mt-1 text-gray-300" />
            </div>
            
            {/* Card Content Bottom */}
            <div className="relative z-10 flex justify-between items-end">
                {/* Left side: All text details */}
                <div>
                    <p className="font-mono tracking-wider text-sm">6764 4354 2344 3245</p>
                    <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs font-semibold uppercase">DIPTESH SINGH</p>
                        <div className="text-left">
                            <span className="text-[10px] font-extralight block leading-none">VALID TILL</span>
                            <span className="text-sm font-semibold">09/24</span>
                        </div>
                    </div>
                </div>

                {/* Right side: Logo */}
                <div className="relative w-12 h-8 flex items-center">
                    <div className="absolute w-8 h-8 bg-[#EB001B] rounded-full right-4"></div>
                    <div className="absolute w-8 h-8 bg-[#F79E1B] opacity-80 rounded-full right-0"></div>
                </div>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
}