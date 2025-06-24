-- CreateTable
CREATE TABLE "invite_tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "debateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invite_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invite_tokens_token_key" ON "invite_tokens"("token");

-- AddForeignKey
ALTER TABLE "invite_tokens" ADD CONSTRAINT "invite_tokens_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "debates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
