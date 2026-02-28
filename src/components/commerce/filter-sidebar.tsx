"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { cn } from '@/lib/utils';

const FILTERS = [
    {
        id: 'category',
        name: 'Categoría',
        options: [
            { label: 'Sofás', value: 'sofas' },
            { label: 'Mesas', value: 'tables' },
            { label: 'Sillones', value: 'chairs' },
            { label: 'Iluminación', value: 'lighting' },
        ],
    },
    {
        id: 'material',
        name: 'Material',
        options: [
            { label: 'Madera', value: 'wood' },
            { label: 'Tela', value: 'fabric' },
            { label: 'Cuero', value: 'leather' },
            { label: 'Metal', value: 'metal' },
        ],
    },
];

export function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === params.get(name)) {
                params.delete(name); // Toggle off
            } else {
                params.set(name, value);
            }
            return params.toString();
        },
        [searchParams]
    );

    return (
        <div className="space-y-8">
            {FILTERS.map((section) => (
                <div key={section.id}>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-4">{section.name}</h3>
                    <ul className="space-y-3">
                        {section.options.map((option) => {
                            const isActive = searchParams.get(section.id) === option.value;
                            return (
                                <li key={option.value}>
                                    <button
                                        onClick={() => {
                                            router.push(`/productos?${createQueryString(section.id, option.value)}`, { scroll: false });
                                        }}
                                        className={cn(
                                            "text-sm transition-colors hover:text-gray-900 dark:hover:text-white text-left block w-full",
                                            isActive ? "font-semibold text-black dark:text-white underline" : "text-gray-500 dark:text-gray-400"
                                        )}
                                    >
                                        {option.label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
}
