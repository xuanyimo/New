@echo off
=::"%%~ni.htm"
rem C:\Program Files\Vim\vim74\doc\tags
for  %%i in (*.cnx) do  (
perl vim2html.pl "tags-cn" "%%i"
)
pause
exit