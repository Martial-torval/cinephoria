import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Récupération de la session côté serveur
    const sessionData = await auth.api.getSession({ headers: req.headers });

    // Vérification sécurisée
    if (!sessionData || !sessionData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = sessionData.user;

    if (!["ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Liste tous les utilisateurs avec le rôle EMPLOYEE
    const employees = await auth.api.listUsers({
      query: {
        filterField: "role",
        filterValue: "EMPLOYEE",
        filterOperator: "eq",
        limit: 100,
        offset: 0,
      },
      headers: req.headers,
    });

    return NextResponse.json({ employees: employees.users || [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Vérifie que l'utilisateur est admin ou employé
    const session = await auth.api.getSession(req);
    if (!session?.user || !["ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { email, firstname, lastname, username, password, role } = body;

    // Validation simple
    if (
      !email ||
      !firstname ||
      !lastname ||
      !username ||
      !password ||
      !["USER", "EMPLOYEE", "ADMIN"].includes(role)
    ) {
      return NextResponse.json(
        { message: "Tous les champs sont requis et role doit être valide" },
        { status: 400 }
      );
    }

    // Création de l'utilisateur via le plugin admin
    const newUser = await auth.api.createUser({
      body: {
        email,
        password,
        name: `${firstname} ${lastname}`,
        role,
        data: {
          firstname,
          lastname,
          username,
        },
      },
      headers: req.headers,
    });

    return NextResponse.json(newUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Erreur inconnue", error);
    }
  }
}
