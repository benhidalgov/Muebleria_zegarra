'use client';

import { useState } from 'react';
import Link from 'next/link';

const categories = [
    { emoji: '🛋️', label: 'Sofás', slug: 'sofas' },
    { emoji: '🪑', label: 'Sillas', slug: 'sillas' },
    { emoji: '🛏️', label: 'Camas', slug: 'camas' },
    { emoji: '🍽️', label: 'Comedores', slug: 'comedores' },
    { emoji: '📚', label: 'Estantes', slug: 'estantes' },
    { emoji: '🗄️', label: 'Escritorios', slug: 'escritorios' },
    { emoji: '🪞', label: 'Tocadores', slug: 'tocadores' },
    { emoji: '🏠', label: 'Mesas', slug: 'mesas' },
];

export function RadialSearchMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const totalItems = categories.length;
    // Distribute items in a full circle (360°)
    const angleStep = (2 * Math.PI) / totalItems;
    // Start from the top (-90° offset)
    const startAngle = -Math.PI / 2;

    return (
        <div className="relative flex items-center justify-center" style={{ minHeight: '340px' }}>
            {/* Backdrop overlay when open */}
            <div
                className={`fixed inset-0 z-20 transition-all duration-500 ${isOpen
                        ? 'bg-black/40 backdrop-blur-sm pointer-events-auto'
                        : 'bg-transparent pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Radial items */}
            {categories.map((cat, i) => {
                const angle = startAngle + i * angleStep;
                // Radius: responsive — smaller on mobile
                const radius = 150;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                    <Link
                        key={cat.slug}
                        href={`/productos?category=${cat.slug}`}
                        className={`absolute z-30 flex flex-col items-center justify-center 
                            w-20 h-20 md:w-24 md:h-24 rounded-2xl 
                            bg-white/10 backdrop-blur-md border border-white/20
                            text-white no-underline
                            hover:bg-white/25 hover:scale-110 hover:border-white/40
                            transition-all duration-500 ease-out
                            group
                            ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                        `}
                        style={{
                            transform: isOpen
                                ? `translate(${x}px, ${y}px) scale(1)`
                                : `translate(0px, 0px) scale(0)`,
                            transitionDelay: isOpen ? `${i * 60}ms` : `${(totalItems - i) * 30}ms`,
                        }}
                        onClick={(e) => {
                            // Don't close, let navigation happen
                            e.stopPropagation();
                        }}
                    >
                        <span className="text-2xl md:text-3xl mb-1 transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-0.5">
                            {cat.emoji}
                        </span>
                        <span className="text-[10px] md:text-xs font-medium tracking-wide text-center leading-tight">
                            {cat.label}
                        </span>
                    </Link>
                );
            })}

            {/* Center button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative z-30 flex flex-col items-center justify-center
                    w-36 h-36 md:w-44 md:h-44 rounded-full cursor-pointer
                    border-2 transition-all duration-500 ease-out
                    ${isOpen
                        ? 'bg-white/20 backdrop-blur-md border-white/40 shadow-[0_0_40px_rgba(255,255,255,0.15)]'
                        : 'bg-white/10 backdrop-blur-md border-white/25 shadow-[0_0_60px_rgba(255,255,255,0.1)] animate-[pulse-glow_3s_ease-in-out_infinite] hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_80px_rgba(255,255,255,0.2)]'
                    }
                `}
            >
                {isOpen ? (
                    <span className="text-white text-4xl font-light transition-transform duration-300">
                        ✕
                    </span>
                ) : (
                    <>
                        {/* Search icon */}
                        <svg
                            className="w-8 h-8 md:w-10 md:h-10 text-white/80 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                        <span className="text-white text-xs md:text-sm font-medium tracking-wide text-center px-4 leading-snug">
                            ¿Qué estás
                            <br />
                            buscando?
                        </span>
                    </>
                )}
            </button>
        </div>
    );
}
