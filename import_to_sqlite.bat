@echo off
title Aahara Setu - SQLite Dataset Importer
echo ===================================================================
echo   Aahara Setu - Importing Datasets into SQLite Database
echo ===================================================================
echo.
echo Running Python importer for CSV and Excel datasets into aahara_setu.db...
py "%~dp0import_to_sqlite.py"
echo.
echo ===================================================================
echo   Import completed.
echo ===================================================================
pause
