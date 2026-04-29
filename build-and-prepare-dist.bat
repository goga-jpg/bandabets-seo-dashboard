@echo off
REM build-and-prepare-dist.bat
REM Usage: Double-click or run in Command Prompt or PowerShell

REM 1. Ensure asset folders exist in public\assets
if not exist public\assets\creatives mkdir public\assets\creatives
if not exist public\assets\important mkdir public\assets\important
if not exist public\assets\uploads mkdir public\assets\uploads

REM 2. Copy favicons and icons to public if not already there
if exist favicon.svg if not exist public\favicon.svg copy favicon.svg public\favicon.svg >nul
if exist icons.svg if not exist public\icons.svg copy icons.svg public\icons.svg >nul

REM 3. Build the project
npm run build
if errorlevel 1 goto :error

REM 4. Copy favicons and icons to dist (if not already copied by Vite)
if exist public\favicon.svg if not exist dist\favicon.svg copy public\favicon.svg dist\favicon.svg >nul
if exist public\icons.svg if not exist dist\icons.svg copy public\icons.svg dist\icons.svg >nul

REM 5. Print result
echo.
echo Build complete. Deploy everything inside the dist\ folder (including all assets subfolders) to your server.
goto :eof

:error
echo Build failed. Please check the error messages above.
exit /b 1
