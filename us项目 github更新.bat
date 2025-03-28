@echo off

:: 更新项目并确保执行完成后再继续
npm run update && (
    :: 获取日期和时间（格式：YYYY-MM-DD_HH-MM-SS）
    for /f "tokens=2 delims==" %%I in ('"wmic os get localdatetime /value"') do set datetime=%%I
    set datetime=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%_%datetime:~8,2%-%datetime:~10,2%-%datetime:~12,2%

    :: Git 操作
    git add .
    git commit -m "updated at %datetime%"
    git push origin main

    echo UPDATE SUCCESSFULLY!
    pause
)

