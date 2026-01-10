export async function uploadFile(
  file: File,
  oldFilePath?: string
): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (oldFilePath) formData.append("oldFilePath", oldFilePath);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Erreur upload fichier");

    const data = await res.json();
    return data.url; // URL publique du fichier
  } catch (err) {
    console.error("❌ Erreur upload :", err);
    return null;
  }
}
