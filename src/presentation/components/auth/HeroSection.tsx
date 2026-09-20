"use client";

import React from "react";
import { Command } from "lucide-react";

export function HeroSection() {
  return (
    <aside className="lg:sticky lg:top-0 lg:h-screen lg:w-[50%] shrink-0 bg-brand-dark text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-[84px] px-6 md:px-10 flex items-center border-b border-background-dark">
        <div className="w-8 h-8 border border-brand-red text-brand-red flex items-center justify-center mr-3">
          <Command className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold tracking-tight-05 text-[20px] leading-5 font-heading">
            nodewave
          </div>
          <div className="font-mono text-[9px] uppercase tracking-wide-20 text-text-secondary mt-1">
            control room
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="flex-1 px-6 py-12 md:px-12 lg:px-16 lg:py-20 flex flex-col justify-center relative">
        <div className="absolute -right-16 top-24 hidden xl:block text-[180px] font-bold leading-none text-[#151d24] select-none font-heading">
          NW
        </div>
        <div className="relative max-w-[560px]">
          <div className="font-mono text-[10px] uppercase tracking-wide-22 text-brand-red mb-6">
            / secure operations / 01
          </div>
          <h1 className="text-[52px] md:text-[72px] lg:text-[78px] leading-[.88] tracking-tight-07 font-bold max-w-[620px] font-heading">
            Keep delivery
            <br />
            <span className="text-brand-red">moving.</span>
          </h1>
          <p className="mt-8 max-w-[420px] text-[15px] leading-7 text-text-tertiary">
            The operational backbone for teams shipping high-value work across product, design,
            frontend, and backend.
          </p>

          {/* Feature Cards */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-px bg-background-dark border border-background-dark max-w-[520px]">
            <div className="bg-brand-dark p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 bg-brand-red" />
                <span className="font-mono text-[10px] uppercase tracking-wide-15 text-[#dce3e8]">
                  Dependency gates
                </span>
              </div>
              <p className="text-[12px] leading-5 text-text-secondary">
                Surface blocked work before it becomes a delivery surprise.
              </p>
            </div>
            <div className="bg-brand-dark p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 bg-brand-green" />
                <span className="font-mono text-[10px] uppercase tracking-wide-15 text-[#dce3e8]">
                  Audit by default
                </span>
              </div>
              <p className="text-[12px] leading-5 text-text-secondary">
                Every important change stays traceable and accountable.
              </p>
            </div>
          </div>

          {/* User Avatars */}
          <div className="mt-12 flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 border-2 border-brand-dark bg-[#25313a] text-[#dce3e8] flex items-center justify-center font-mono text-[9px]">
                AM
              </div>
              <div className="w-8 h-8 border-2 border-brand-dark bg-[#3a3030] text-[#f0c6c6] flex items-center justify-center font-mono text-[9px]">
                RK
              </div>
              <div className="w-8 h-8 border-2 border-brand-dark bg-[#2d3d38] text-[#c3e1d8] flex items-center justify-center font-mono text-[9px]">
                EC
              </div>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[.12em] text-text-secondary">
              Built for accountable teams
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-5 md:px-10 border-t border-background-dark flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-wide-14 text-[#66727e]">
          NodeWave Systems
        </span>
        <span className="font-mono text-[9px] uppercase tracking-wide-14 text-[#66727e]">
          v1.0.4 / encrypted
        </span>
      </div>
    </aside>
  );
}
