"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { products } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import sharp from "sharp";

export async function createProduct(formData: FormData) {
    const session = await auth();

    // 1. Auth Check
    // @ts-ignore
    if (session?.user?.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const basePrice = formData.get("basePrice") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (!name || !slug || !basePrice || !imageUrl) {
        throw new Error("Missing fields");
    }

    // 2. Generate LQIP
    let lqip = "";
    try {
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();

        // Resize to 10px width for placeholder
        const data = await sharp(Buffer.from(buffer))
            .resize(10)
            .webp({ quality: 20 })
            .toBuffer();

        lqip = `data:image/webp;base64,${data.toString("base64")}`;
    } catch (error) {
        console.error("Error generating LQIP:", error);
        // Fallback or throw? For now, we allow it to fail but log it.
        // In production, you might want a default placeholder.
        lqip = "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoKAAcAAUAmJaQAAuQA/v02V///754A/v3tFv//9z///8kX/4j/4v/b///ywf/39sP/9/bD//f2w//39sP/9/bD/gAA";
    }

    // 3. Save to DB
    await db.insert(products).values({
        name,
        slug,
        description,
        basePrice,
        imageUrl,
        lqip,
    });

    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin");
}
