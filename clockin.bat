@echo off
setlocal enabledelayedexpansion

if not "%1"=="" (
    set "out=%1"
) else (
    set "out="
)
cd /d "%~dp0clockin"
:: Capture the output of the node command
for /f "delims=" %%A in ('node clockin.js !out!') do (
    set "nodeOutput=%%A"
)

:: Display the output or process it further
echo Node Output: !nodeOutput!

:: Check the output and set the notification message
if /i "!nodeOutput!"=="loggedout" (
    powershell -Command "New-BurntToastNotification -Text 'Clocking failed', 'Your scheduled task failed to clock in.'"
) else (
    powershell -Command "New-BurntToastNotification -Text 'Clocking successful', 'Your scheduled task ran successfully.'"
)