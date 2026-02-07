@echo off
echo Stopping dev server...
taskkill /F /IM node.exe /T 2>nul

echo Waiting for processes to close...
timeout /t 3 /nobreak >nul

echo Generating Prisma Client...
call npx prisma generate

echo Pushing schema to database...
call npx prisma db push

echo Starting dev server...
start cmd /k npm run dev

echo Done! Dev server is starting in a new window.
pause
