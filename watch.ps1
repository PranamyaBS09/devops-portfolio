Get-EventSubscriber -ErrorAction SilentlyContinue | Unregister-Event
Get-Job -ErrorAction SilentlyContinue | Remove-Job -Force

$WatchPath = "F:\devops\portfolio"
$Filter = "*.html"

Write-Host "================================="
Write-Host " Portfolio Auto-Deploy Watcher"
Write-Host "================================="
Write-Host "Watching: $WatchPath"
Write-Host "Waiting for HTML file changes..."
Write-Host ""

$user = "yashaswinihr15"
$apiToken = "112cf766ed739e771d8087cbf087774f57"

$lastRun = Get-Date "2000-01-01"

# Initialize file states
$fileStates = @{}
$files = Get-ChildItem -Path $WatchPath -Filter $Filter -Recurse
foreach ($file in $files) {
    $fileStates[$file.FullName] = $file.LastWriteTime
}

while ($true) {
    Start-Sleep -Milliseconds 500
    
    $currentFiles = Get-ChildItem -Path $WatchPath -Filter $Filter -Recurse
    $triggered = $false
    $changedFile = ""
    
    foreach ($file in $currentFiles) {
        $path = $file.FullName
        $lastWrite = $file.LastWriteTime
        
        if (-not $fileStates.ContainsKey($path)) {
            $fileStates[$path] = $lastWrite
            $changedFile = $path
            $triggered = $true
        }
        elseif ($fileStates[$path] -ne $lastWrite) {
            $fileStates[$path] = $lastWrite
            $changedFile = $path
            $triggered = $true
        }
    }
    
    if ($triggered) {
        $now = Get-Date
        if (($now - $lastRun).TotalSeconds -ge 3) {
            $lastRun = $now
            Write-Host ""
            Write-Host "FILE CHANGED: $changedFile"
            Write-Host "Triggering Jenkins build..."
            
            try {
                $response = curl.exe -s -X POST `
                    -u "${user}:${apiToken}" `
                    "http://localhost:8090/job/portfolio-pipeline/build?delay=0sec"
                
                Write-Host "Build triggered successfully!"
            }
            catch {
                Write-Host "Trigger failed"
                Write-Host $_.Exception.Message
            }
        }
    }
}