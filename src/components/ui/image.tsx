"use client";

import NextImage, { ImageProps as NextImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageProps extends NextImageProps {
    /**
     * Base64 blur data URL for the placeholder.
     * If provided, `placeholder` will be set to "blur" automatically.
     */
    lqip?: string;
    className?: string;
}

export function Image({ lqip, className, alt, ...props }: ImageProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={cn("overflow-hidden relative", className)}>
            <NextImage
                {...props}
                alt={alt}
                className={cn(
                    "duration-700 ease-in-out",
                    isLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0",
                    // If the parent passes a class, we merge it, but the internal animation classes take precedence for loading state
                )}
                onLoad={() => setIsLoading(false)}
                placeholder={lqip ? "blur" : "empty"}
                blurDataURL={lqip}
            />
        </div>
    );
}
