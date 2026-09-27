@echo off
rem Runs O Pescador locally at http://localhost:8080 (double-click or run from a terminal).
rem Options are passed through, e.g.  run-local.cmd -NoBrowser
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\run-local.ps1" %*
if errorlevel 1 pause
