param(
  [string]$DbHost = 'localhost',
  [string]$DbUser = 'root',
  [string]$DbPassword = 'root123'
)

$scriptPath = Join-Path $PSScriptRoot 'initDatabase.sql'

Write-Host "Running database setup using host=$DbHost user=$DbUser"

$securePassword = if ($DbPassword -ne '') { "-p$DbPassword" } else { '' }

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$arguments = @(
  '-h', $DbHost,
  '-u', $DbUser
)
if ($DbPassword -ne '') {
  $arguments += "-p$DbPassword"
}
$arguments += "--execute=source $scriptPath"

$process = Start-Process -FilePath $mysqlPath -ArgumentList $arguments -NoNewWindow -Wait -PassThru
if ($process.ExitCode -eq 0) {
  Write-Host 'Database setup completed successfully.'
} else {
  Write-Error 'Database setup failed. Check your credentials and MySQL availability.'
}
