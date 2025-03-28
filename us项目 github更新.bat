@echo off
git add .
git commit -m "updated at %date% %time%"
git push origin main
echo UPDATE SUCCESSFULLY!
pause
