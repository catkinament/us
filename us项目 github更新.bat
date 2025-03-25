@echo off
git add .
git commit -m "更新于 %date% %time%"
git push origin main
echo UPDATE SUCCESSFULLY!
pause
