// app/api/users/[id]/route.ts
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

interface UpdateUserBody {
  email?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  password?: string;
  role?: "USER" | "EMPLOYEE" | "ADMIN";
}

type Role = "USER" | "EMPLOYEE" | "ADMIN";

interface UpdateUserBody {
  email?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  password?: string;
  role?: Role;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id_user: string }> }
) {
  try {
    const { id_user } = await params;
    if (!id_user) {
      return NextResponse.json(
        { error: "ID utilisateur manquant" },
        { status: 400 }
      );
    }

    const body = (await req.json()) as UpdateUserBody;
    const { password, ...userFields } = body;

    // 1) Récupérer la session côté serveur (cookie envoyé via headers)
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Interdit - accès admin requis" },
        { status: 403 }
      );
    }

    // 2) Préparer l'objet de mise à jour (n'envoyer que les champs définis)
    const updateData: Partial<Omit<UpdateUserBody, "password">> = {};
    if (userFields.email !== undefined) updateData.email = userFields.email;
    if (userFields.firstname !== undefined)
      updateData.firstname = userFields.firstname;
    if (userFields.lastname !== undefined)
      updateData.lastname = userFields.lastname;
    if (userFields.username !== undefined)
      updateData.username = userFields.username;
    if (userFields.role !== undefined) updateData.role = userFields.role;

    let updatedUserResponse: unknown = null;

    // 3) Appeler adminUpdateUser si on a des champs à modifier
    if (Object.keys(updateData).length > 0) {
      updatedUserResponse = await auth.api.adminUpdateUser({
        body: { userId: id_user, data: updateData },
        headers: req.headers,
      });
    }

    // 4) Si on a un password, utiliser la bonne action serveur : setUserPassword
    if (password && password.trim() !== "") {
      await auth.api.setUserPassword({
        body: {
          userId: id_user,
          newPassword: password,
        },
        headers: req.headers,
      });
    }

    // 5) Réponse
    return NextResponse.json(
      { message: "Utilisateur mis à jour", updated: updatedUserResponse },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Erreur PUT /api/users/[id_user]:", err);

    const message = err instanceof Error ? err.message : "Erreur interne";
    // Si l'erreur contient 'FORBIDDEN' dans le message, renvoyer 403
    if (typeof message === "string" && /forbid/i.test(message)) {
      return NextResponse.json({ error: message }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id_user: string } }
) {
  try {
    const { id_user } = await params; // 👈 on attend avant de destructurer

    if (!id_user || id_user === "undefined") {
      return NextResponse.json({ error: "❌ ID manquant" }, { status: 400 });
    }

    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès refusé — admin requis" },
        { status: 403 }
      );
    }
    await auth.api.removeUser({
      body: { userId: id_user },
      headers: req.headers,
    });

    return NextResponse.json(
      { message: "✅ Utilisateur supprimé" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur DELETE /api/users/[id_user]:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
