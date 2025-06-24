import { Request, Response, NextFunction } from "express";
import type { User } from "../types";
import prisma from "../lib/prisma";

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized: Please log in." });
}

export async function ensureDebateAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const token = req.query.invite as string | undefined;

  try {
    const debate = await prisma.debate.findUnique({
      where: { id },
      include: { participants: true },
    });

    if (!debate) {
      res.status(400).send({ message: "Debate ID does not exist." });
      return;
    }

    if (!debate.private) {
      return next();
    }

    const user = req.user as User;
    const valid = await prisma.participant.findUnique({
      where: { userId_debateId: { userId: user.id, debateId: id } },
    });

    const validInviteToken = token
      ? await prisma.inviteToken.findFirst({
          where: {
            token,
            debateId: id,
            expiresAt: { gt: new Date() },
          },
        })
      : null;

    if (!valid && !validInviteToken) {
      res.status(401).send({
        message: "Lack permissions to view or participate in debate.",
      });
      return;
    }

    return next();
  } catch (error) {
    console.error("Error in ensureDebateAuthenticated:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
