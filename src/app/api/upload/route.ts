import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink, stat } from "fs/promises";
import path from "path";

export const config = {
  runtime: "node",
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const oldFilePath = formData.get("oldFilePath") as string | null; // ancien fichier à supprimer

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
    }

    // supprimer l'ancien fichier si fourni
    if (oldFilePath) {
      const absoluteOldPath = path.join(process.cwd(), "public", oldFilePath);
      try {
        await stat(absoluteOldPath); // vérifier si le fichier existe
        await unlink(absoluteOldPath);
        console.log("✅ Ancien fichier supprimé :", oldFilePath);
      } catch {
        console.log("⚠️ Ancien fichier non trouvé :", oldFilePath);
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);
    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${file.name}` });
  } catch (err) {
    console.error("❌ Erreur upload :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
