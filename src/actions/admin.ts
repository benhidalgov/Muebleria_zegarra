"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { products, variants } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import sharp from "sharp";

async function generateLqip(imageUrl: string): Promise<string> {
    try {
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();
        const data = await sharp(Buffer.from(buffer))
            .resize(10)
            .webp({ quality: 20 })
            .toBuffer();
        return `data:image/webp;base64,${data.toString("base64")}`;
    } catch (error) {
        console.error("Error generating LQIP:", error);
        return "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoKAAcAAUAmJaQAAuQA/v02V///754A/v3tFv//9z///8kX/4j/4v/b///ywf/39sP/9/bD//f2w//39sP/9/bD/gAA";
    }
}

async function requireAdmin() {
    const session = await auth();
    // @ts-ignore
    if (session?.user?.role !== "admin") {
        throw new Error("Unauthorized");
    }
    return session;
}

export async function createProduct(formData: FormData) {
    await requireAdmin();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const basePrice = formData.get("basePrice") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (!name || !slug || !basePrice || !imageUrl) {
        throw new Error("Missing fields");
    }

    const lqip = await generateLqip(imageUrl);

    await db.insert(products).values({
        name,
        slug,
        description,
        basePrice,
        imageUrl,
        lqip,
    });

    revalidatePath("/");
    revalidatePath("/productos");
    revalidatePath("/admin");
    redirect("/admin");
}

export async function updateProduct(id: string, formData: FormData) {
    await requireAdmin();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const basePrice = formData.get("basePrice") as string;
    const imageUrl = formData.get("imageUrl") as string;

    if (!name || !slug || !basePrice || !imageUrl) {
        throw new Error("Missing fields");
    }

    // Check if image changed to regenerate LQIP
    const existing = await db.query.products.findFirst({
        where: eq(products.id, id),
    });

    let lqip = existing?.lqip || "";
    if (existing?.imageUrl !== imageUrl) {
        lqip = await generateLqip(imageUrl);
    }

    await db
        .update(products)
        .set({ name, slug, description, basePrice, imageUrl, lqip })
        .where(eq(products.id, id));

    revalidatePath("/");
    revalidatePath("/productos");
    revalidatePath(`/product/${slug}`);
    revalidatePath("/admin");
    redirect("/admin");
}

export async function deleteProduct(id: string) {
    await requireAdmin();

    // Delete variants first (foreign key)
    await db.delete(variants).where(eq(variants.productId, id));
    // Then delete product
    await db.delete(products).where(eq(products.id, id));

    revalidatePath("/");
    revalidatePath("/productos");
    revalidatePath("/admin");
    redirect("/admin");
}
