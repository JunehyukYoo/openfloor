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
  try {
    const debate = await prisma.debate.findUnique({
      where: {
        id: id,
      },
      include: {
        participants: true,
      },
    });

    if (!debate) {
      res.status(400).send({ message: "Debate ID does not exist." });
      return;
    } else if (!debate.private) {
      const user = req.user as User;
      const valid = await prisma.participant.findUnique({
        where: { userId_debateId: { userId: user.id, debateId: id } },
      });
      if (!valid) {
        res
          .status(401)
          .send({ message: "Lack permissions to participate in debate." });
        return;
      }
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
    return;
  }
}
