-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_justificationId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_parentId_fkey";

-- DropForeignKey
ALTER TABLE "debates" DROP CONSTRAINT "debates_topicId_fkey";

-- DropForeignKey
ALTER TABLE "invite_tokens" DROP CONSTRAINT "invite_tokens_debateId_fkey";

-- DropForeignKey
ALTER TABLE "justifications" DROP CONSTRAINT "justifications_stanceId_fkey";

-- DropForeignKey
ALTER TABLE "participants" DROP CONSTRAINT "participants_debateId_fkey";

-- DropForeignKey
ALTER TABLE "stances" DROP CONSTRAINT "stances_debateId_fkey";

-- DropForeignKey
ALTER TABLE "votes" DROP CONSTRAINT "votes_justificationId_fkey";

-- AddForeignKey
ALTER TABLE "debates" ADD CONSTRAINT "debates_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stances" ADD CONSTRAINT "stances_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "debates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "debates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "justifications" ADD CONSTRAINT "justifications_stanceId_fkey" FOREIGN KEY ("stanceId") REFERENCES "stances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_justificationId_fkey" FOREIGN KEY ("justificationId") REFERENCES "justifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_justificationId_fkey" FOREIGN KEY ("justificationId") REFERENCES "justifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite_tokens" ADD CONSTRAINT "invite_tokens_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "debates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
