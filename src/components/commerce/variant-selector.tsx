"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { cn, formatPrice } from '@/lib/utils';
import { type variants } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

type Variant = InferSelectModel<typeof variants>;

interface VariantSelectorProps {
    variants: Variant[];
}

export function VariantSelector({ variants }: VariantSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Group variants by type (e.g., all fabrics together)
    const variantsByType = variants.reduce((acc, variant) => {
        if (!acc[variant.type]) {
            acc[variant.type] = [];
        }
        acc[variant.type].push(variant);
        return acc;
    }, {} as Record<string, Variant[]>);

    const updateUrl = useCallback(
        (type: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === params.get(type)) {
                params.delete(type);
            } else {
                params.set(type, value);
            }
            router.replace(`?${params.toString()}`, { scroll: false });
        },
        [searchParams, router]
    );

    return (
        <div className="space-y-8">
            {Object.entries(variantsByType).map(([type, options]) => (
                <div key={type}>
                    <h3 className="text-sm font-medium text-gray-900 capitalize mb-4">
                        {type === 'fabric' ? 'Tela' : type === 'wood' ? 'Madera' : type}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {options.map((option) => {
                            const isActive = searchParams.get(type) === option.value;
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => updateUrl(type, option.value)}
                                    className={cn(
                                        "relative flex items-center justify-between rounded-lg border p-4 text-sm font-medium shadow-sm outline-none transition-all hover:border-gray-400 focus:outline-none",
                                        isActive
                                            ? "border-black ring-1 ring-black"
                                            : "border-gray-200 text-gray-900"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Color Swatch simulation */}
                                        {(type === 'fabric' || type === 'wood') && (
                                            <span
                                                className="h-6 w-6 rounded-full border border-gray-200"
                                                style={{ backgroundColor: option.value.startsWith('#') ? option.value : '#ccc' }}
                                            />
                                        )}
                                        <span>{option.name}</span>
                                    </div>
                                    {Number(option.priceAdjustment) > 0 && (
                                        <span className="text-gray-500 text-xs">
                                            +{formatPrice(option.priceAdjustment!)}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
