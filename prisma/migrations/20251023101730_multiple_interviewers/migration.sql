-- CreateTable
CREATE TABLE "InterviewerOnInterview" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "InterviewerOnInterview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InterviewerOnInterview_interviewId_userId_key" ON "InterviewerOnInterview"("interviewId", "userId");

-- AddForeignKey
ALTER TABLE "InterviewerOnInterview" ADD CONSTRAINT "InterviewerOnInterview_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewerOnInterview" ADD CONSTRAINT "InterviewerOnInterview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
