import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id_review: string } }
) {
  try {
    const body = await req.json();
    const statut = body.statut;
    if (!["valid", "refus"].includes(statut)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const updatedReview = await prisma.review.update({
      where: { id: Number(params.id_review) },
      data: {
        statut,
      },
    });

    return NextResponse.json({ results: updatedReview });
  } catch (err) {
    console.error("❌ Erreur update :", err);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id_review: string } }
) {
  try {
    const deletedReview = await prisma.review.delete({
      where: { id: Number(params.id_review) },
    });

    return NextResponse.json({ results: deletedReview });
  } catch (err) {
    console.error("❌ Erreur delete review :", err);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}
