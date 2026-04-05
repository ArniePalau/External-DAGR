Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::SetUnhandledExceptionMode([System.Windows.Forms.UnhandledExceptionMode]::CatchException)

$script:RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
function Get-PrimaryIPv4 {
    try {
        $ips = [System.Net.Dns]::GetHostAddresses([System.Net.Dns]::GetHostName()) |
            Where-Object { $_.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork -and $_.ToString() -ne '127.0.0.1' }
        if ($ips -and $ips.Count -gt 0) {
            return $ips[0].ToString()
        }
    } catch {
        # Ignore lookup errors and fallback.
    }
    return '127.0.0.1'
}

$script:AppPort = 5173
$script:BridgePort = 8080
$script:LocalAppUrl = "http://localhost:$($script:AppPort)"
$script:NetworkAppUrl = "http://$(Get-PrimaryIPv4):$($script:AppPort)"
$script:BridgeHealthUrl = "http://127.0.0.1:$($script:BridgePort)/health"
$script:LogoPath = Join-Path $script:RootDir 'microdagr-app\logo.jpeg'
$script:LogoIconPath = Join-Path $script:RootDir 'microdagr-app\logo.ico'

$form = New-Object System.Windows.Forms.Form
$form.Text = 'External DAGR Launcher'
$form.Size = New-Object System.Drawing.Size(980, 700)
$form.StartPosition = 'CenterScreen'
$form.BackColor = [System.Drawing.Color]::FromArgb(20, 24, 30)
$form.ForeColor = [System.Drawing.Color]::White
$form.Font = New-Object System.Drawing.Font('Segoe UI', 10)
$form.FormBorderStyle = 'FixedSingle'
$form.MaximizeBox = $false

if (Test-Path -LiteralPath $script:LogoIconPath) {
    try {
        $form.Icon = New-Object System.Drawing.Icon($script:LogoIconPath)
    } catch {
        # Ignore icon load failures.
    }
}

$title = New-Object System.Windows.Forms.Label
$title.Text = 'EXTERNAL DAGR Control Center'
$title.Font = New-Object System.Drawing.Font('Segoe UI Semibold', 15)
$title.ForeColor = [System.Drawing.Color]::FromArgb(130, 245, 130)
$title.AutoSize = $true
$title.Location = New-Object System.Drawing.Point(18, 14)
$form.Controls.Add($title)

$sub = New-Object System.Windows.Forms.Label
$sub.Text = 'Arrenca App + Bridge, obre enllacos i monitoritza connexions en temps real.'
$sub.AutoSize = $true
$sub.ForeColor = [System.Drawing.Color]::FromArgb(180, 188, 205)
$sub.Location = New-Object System.Drawing.Point(20, 45)
$form.Controls.Add($sub)

$logoFrame = New-Object System.Windows.Forms.Panel
$logoFrame.Size = New-Object System.Drawing.Size(122, 122)
$logoFrame.Location = New-Object System.Drawing.Point(838, 10)
$logoFrame.BackColor = [System.Drawing.Color]::FromArgb(10, 12, 14)
$logoFrame.BorderStyle = 'FixedSingle'
$form.Controls.Add($logoFrame)

$logoPicture = New-Object System.Windows.Forms.PictureBox
$logoPicture.Size = New-Object System.Drawing.Size(116, 116)
$logoPicture.Location = New-Object System.Drawing.Point(2, 2)
$logoPicture.SizeMode = 'Zoom'
$logoPicture.BackColor = [System.Drawing.Color]::FromArgb(10, 12, 14)

if (Test-Path -LiteralPath $script:LogoPath) {
    try {
        $logoImage = [System.Drawing.Image]::FromFile($script:LogoPath)
        $logoPicture.Image = $logoImage
    } catch {
        $logoPicture.BackColor = [System.Drawing.Color]::FromArgb(28, 42, 30)
    }
} else {
    $logoPicture.BackColor = [System.Drawing.Color]::FromArgb(28, 42, 30)
}

$logoFrame.Controls.Add($logoPicture)

$btnStart = New-Object System.Windows.Forms.Button
$btnStart.Text = 'Start All'
$btnStart.Size = New-Object System.Drawing.Size(120, 36)
$btnStart.Location = New-Object System.Drawing.Point(20, 78)
$btnStart.BackColor = [System.Drawing.Color]::FromArgb(28, 161, 102)
$btnStart.FlatStyle = 'Flat'
$btnStart.ForeColor = [System.Drawing.Color]::White
$form.Controls.Add($btnStart)

$btnStop = New-Object System.Windows.Forms.Button
$btnStop.Text = 'Stop All'
$btnStop.Size = New-Object System.Drawing.Size(120, 36)
$btnStop.Location = New-Object System.Drawing.Point(150, 78)
$btnStop.BackColor = [System.Drawing.Color]::FromArgb(179, 72, 72)
$btnStop.FlatStyle = 'Flat'
$btnStop.ForeColor = [System.Drawing.Color]::White
$form.Controls.Add($btnStop)

$btnLocal = New-Object System.Windows.Forms.Button
$btnLocal.Text = 'Open Local App'
$btnLocal.Size = New-Object System.Drawing.Size(150, 36)
$btnLocal.Location = New-Object System.Drawing.Point(290, 78)
$btnLocal.BackColor = [System.Drawing.Color]::FromArgb(46, 95, 186)
$btnLocal.FlatStyle = 'Flat'
$btnLocal.ForeColor = [System.Drawing.Color]::White
$form.Controls.Add($btnLocal)

$btnNetwork = New-Object System.Windows.Forms.Button
$btnNetwork.Text = 'Open Network App'
$btnNetwork.Size = New-Object System.Drawing.Size(170, 36)
$btnNetwork.Location = New-Object System.Drawing.Point(450, 78)
$btnNetwork.BackColor = [System.Drawing.Color]::FromArgb(46, 95, 186)
$btnNetwork.FlatStyle = 'Flat'
$btnNetwork.ForeColor = [System.Drawing.Color]::White
$form.Controls.Add($btnNetwork)

function New-StatusLabel {
    param(
        [string]$Title,
        [int]$X,
        [int]$Y
    )

    $caption = New-Object System.Windows.Forms.Label
    $caption.Text = $Title
    $caption.AutoSize = $true
    $caption.ForeColor = [System.Drawing.Color]::FromArgb(178, 190, 208)
    $caption.Location = New-Object System.Drawing.Point($X, $Y)
    $form.Controls.Add($caption)

    $value = New-Object System.Windows.Forms.Label
    $value.Text = 'Desconnectat'
    $value.AutoSize = $true
    $value.Font = New-Object System.Drawing.Font('Segoe UI Semibold', 10)
    $value.ForeColor = [System.Drawing.Color]::FromArgb(220, 90, 90)
    $value.Location = New-Object System.Drawing.Point(($X + 170), $Y)
    $form.Controls.Add($value)

    return $value
}

$lblBridgeState = New-StatusLabel -Title 'Bridge' -X 20 -Y 132
$lblAppState = New-StatusLabel -Title 'App (Vite)' -X 20 -Y 157
$lblAppConnected = New-StatusLabel -Title 'App connectada al Bridge' -X 20 -Y 182
$lblModConnected = New-StatusLabel -Title 'Mod connectat (RPT live)' -X 20 -Y 207
$lblWorld = New-StatusLabel -Title 'Mapa actiu' -X 20 -Y 232

$linkLocal = New-Object System.Windows.Forms.LinkLabel
$linkLocal.Text = "Local: $($script:LocalAppUrl)"
$linkLocal.AutoSize = $true
$linkLocal.LinkColor = [System.Drawing.Color]::FromArgb(132, 186, 255)
$linkLocal.ActiveLinkColor = [System.Drawing.Color]::FromArgb(164, 210, 255)
$linkLocal.VisitedLinkColor = [System.Drawing.Color]::FromArgb(132, 186, 255)
$linkLocal.Location = New-Object System.Drawing.Point(540, 132)
$form.Controls.Add($linkLocal)

$linkNetwork = New-Object System.Windows.Forms.LinkLabel
$linkNetwork.Text = "Network: $($script:NetworkAppUrl)"
$linkNetwork.AutoSize = $true
$linkNetwork.LinkColor = [System.Drawing.Color]::FromArgb(132, 186, 255)
$linkNetwork.ActiveLinkColor = [System.Drawing.Color]::FromArgb(164, 210, 255)
$linkNetwork.VisitedLinkColor = [System.Drawing.Color]::FromArgb(132, 186, 255)
$linkNetwork.Location = New-Object System.Drawing.Point(540, 157)
$form.Controls.Add($linkNetwork)

$linkBridge = New-Object System.Windows.Forms.LinkLabel
$linkBridge.Text = "Bridge health: $($script:BridgeHealthUrl)"
$linkBridge.AutoSize = $true
$linkBridge.LinkColor = [System.Drawing.Color]::FromArgb(132, 186, 255)
$linkBridge.ActiveLinkColor = [System.Drawing.Color]::FromArgb(164, 210, 255)
$linkBridge.VisitedLinkColor = [System.Drawing.Color]::FromArgb(132, 186, 255)
$linkBridge.Location = New-Object System.Drawing.Point(540, 182)
$form.Controls.Add($linkBridge)

$logsLabel = New-Object System.Windows.Forms.Label
$logsLabel.Text = 'Logs en viu'
$logsLabel.AutoSize = $true
$logsLabel.Font = New-Object System.Drawing.Font('Segoe UI Semibold', 11)
$logsLabel.Location = New-Object System.Drawing.Point(20, 270)
$form.Controls.Add($logsLabel)

$txtBridgeLog = New-Object System.Windows.Forms.TextBox
$txtBridgeLog.Multiline = $true
$txtBridgeLog.ScrollBars = 'Vertical'
$txtBridgeLog.ReadOnly = $true
$txtBridgeLog.BackColor = [System.Drawing.Color]::FromArgb(16, 18, 24)
$txtBridgeLog.ForeColor = [System.Drawing.Color]::FromArgb(201, 214, 232)
$txtBridgeLog.BorderStyle = 'FixedSingle'
$txtBridgeLog.Location = New-Object System.Drawing.Point(20, 300)
$txtBridgeLog.Size = New-Object System.Drawing.Size(460, 340)
$form.Controls.Add($txtBridgeLog)

$txtAppLog = New-Object System.Windows.Forms.TextBox
$txtAppLog.Multiline = $true
$txtAppLog.ScrollBars = 'Vertical'
$txtAppLog.ReadOnly = $true
$txtAppLog.BackColor = [System.Drawing.Color]::FromArgb(16, 18, 24)
$txtAppLog.ForeColor = [System.Drawing.Color]::FromArgb(201, 214, 232)
$txtAppLog.BorderStyle = 'FixedSingle'
$txtAppLog.Location = New-Object System.Drawing.Point(500, 300)
$txtAppLog.Size = New-Object System.Drawing.Size(460, 340)
$form.Controls.Add($txtAppLog)

function Append-Log {
    param(
        [System.Windows.Forms.TextBox]$Box,
        [string]$Prefix,
        [string]$Line
    )

    if ([string]::IsNullOrWhiteSpace($Line)) {
        return
    }

    $msg = "[$Prefix] $Line"
    $uiWrite = [System.Action]{
        if ($Box.IsDisposed) {
            return
        }

        $Box.AppendText($msg + [Environment]::NewLine)
        if ($Box.TextLength -gt 120000) {
            $Box.Text = $Box.Text.Substring($Box.TextLength - 100000)
            $Box.SelectionStart = $Box.TextLength
            $Box.ScrollToCaret()
        }
    }

    if ($Box.InvokeRequired) {
        try {
            $Box.BeginInvoke($uiWrite) | Out-Null
        } catch {
            # Ignore UI invoke failures during shutdown.
        }
    } else {
        $uiWrite.Invoke()
    }
}

function Set-Status {
    param(
        [System.Windows.Forms.Label]$Label,
        [bool]$IsOnline,
        [string]$OnlineText = 'Connectat',
        [string]$OfflineText = 'Desconnectat'
    )

    $uiUpdate = [System.Action]{
        if ($Label.IsDisposed) {
            return
        }

        if ($IsOnline) {
            $Label.Text = $OnlineText
            $Label.ForeColor = [System.Drawing.Color]::FromArgb(73, 198, 132)
        } else {
            $Label.Text = $OfflineText
            $Label.ForeColor = [System.Drawing.Color]::FromArgb(220, 90, 90)
        }
    }

    if ($Label.InvokeRequired) {
        try {
            $Label.BeginInvoke($uiUpdate) | Out-Null
        } catch {
            # Ignore UI invoke failures during shutdown.
        }
    } else {
        $uiUpdate.Invoke()
    }
}

function Start-ManagedProcess {
    param(
        [string]$Name,
        [string]$BatchFile,
        [System.Windows.Forms.TextBox]$LogBox
    )

    try {
        $fullPath = Join-Path $script:RootDir $BatchFile
        if (-not (Test-Path -LiteralPath $fullPath)) {
            Append-Log -Box $LogBox -Prefix $Name -Line "No s'ha trobat $BatchFile"
            return $null
        }

        $arg = "/c `"`"$fullPath`"`""
        $proc = Start-Process -FilePath 'cmd.exe' -ArgumentList $arg -WorkingDirectory $script:RootDir -PassThru -WindowStyle Hidden

        Append-Log -Box $LogBox -Prefix $Name -Line ("Procés iniciat. PID=" + $proc.Id)

        return [PSCustomObject]@{
            Process = $proc
        }
    } catch {
        Append-Log -Box $LogBox -Prefix $Name -Line ("Error iniciant procés: " + $_.Exception.Message)
        return $null
    }
}

function Stop-ManagedProcess {
    param(
        $Managed,
        [System.Windows.Forms.TextBox]$LogBox,
        [string]$Name
    )

    if ($null -eq $Managed) {
        return
    }

    try {
        if ($Managed.Process -and -not $Managed.Process.HasExited) {
            try {
                taskkill /PID $Managed.Process.Id /T /F | Out-Null
            } catch {
                $Managed.Process.Kill($true)
            }
            Append-Log -Box $LogBox -Prefix $Name -Line 'Procés aturat.'
        }
    } catch {
        Append-Log -Box $LogBox -Prefix $Name -Line ("Error aturant procés: " + $_.Exception.Message)
    }
}

$script:ManagedBridge = $null
$script:ManagedApp = $null

$btnStart.Add_Click({
    try {
        if ($null -eq $script:ManagedBridge -or $script:ManagedBridge.Process.HasExited) {
            $script:ManagedBridge = Start-ManagedProcess -Name 'Bridge' -BatchFile 'Start_Bridge.bat' -LogBox $txtBridgeLog
        }

        if ($null -eq $script:ManagedApp -or $script:ManagedApp.Process.HasExited) {
            $script:ManagedApp = Start-ManagedProcess -Name 'App' -BatchFile 'Start_App.bat' -LogBox $txtAppLog
        }
    } catch {
        Append-Log -Box $txtBridgeLog -Prefix 'Launcher' -Line ("Error a Start All: " + $_.Exception.Message)
    }
})

$btnStop.Add_Click({
    try {
        Stop-ManagedProcess -Managed $script:ManagedBridge -LogBox $txtBridgeLog -Name 'Bridge'
        Stop-ManagedProcess -Managed $script:ManagedApp -LogBox $txtAppLog -Name 'App'
        $script:ManagedBridge = $null
        $script:ManagedApp = $null
    } catch {
        Append-Log -Box $txtBridgeLog -Prefix 'Launcher' -Line ("Error a Stop All: " + $_.Exception.Message)
    }
})

$btnLocal.Add_Click({
    Start-Process $script:LocalAppUrl | Out-Null
})

$btnNetwork.Add_Click({
    Start-Process $script:NetworkAppUrl | Out-Null
})

$linkLocal.add_LinkClicked({
    Start-Process $script:LocalAppUrl | Out-Null
})

$linkNetwork.add_LinkClicked({
    Start-Process $script:NetworkAppUrl | Out-Null
})

$linkBridge.add_LinkClicked({
    Start-Process $script:BridgeHealthUrl | Out-Null
})

$healthTimer = New-Object System.Windows.Forms.Timer
$healthTimer.Interval = 1200
$healthTimer.Add_Tick({
    $bridgeProcessRunning = ($script:ManagedBridge -and $script:ManagedBridge.Process -and -not $script:ManagedBridge.Process.HasExited)
    $appProcessRunning = ($script:ManagedApp -and $script:ManagedApp.Process -and -not $script:ManagedApp.Process.HasExited)

    $bridgeHealthy = $false
    $appConnected = $false
    $modConnected = $false
    $activeWorld = '---'

    try {
        $health = Invoke-RestMethod -Uri $script:BridgeHealthUrl -TimeoutSec 1
        if ($health -and $health.ok) {
            $bridgeHealthy = $true
            $appConnected = [bool]$health.appConnected
            $modConnected = [bool]$health.modConnected
            if ($health.activeWorld) {
                $activeWorld = [string]$health.activeWorld
            }
        }
    } catch {
        # Ignore polling errors while services are booting.
    }

    Set-Status -Label $lblBridgeState -IsOnline ($bridgeHealthy -or $bridgeProcessRunning)
    Set-Status -Label $lblAppState -IsOnline $appProcessRunning -OnlineText 'Iniciada' -OfflineText 'Aturada'
    Set-Status -Label $lblAppConnected -IsOnline $appConnected
    Set-Status -Label $lblModConnected -IsOnline $modConnected

    $worldOnline = $activeWorld -ne '---'
    Set-Status -Label $lblWorld -IsOnline $worldOnline -OnlineText $activeWorld -OfflineText 'Sense telemetria'
})

$healthTimer.Start()

$form.Add_FormClosing({
    $healthTimer.Stop()
    Stop-ManagedProcess -Managed $script:ManagedBridge -LogBox $txtBridgeLog -Name 'Bridge'
    Stop-ManagedProcess -Managed $script:ManagedApp -LogBox $txtAppLog -Name 'App'
    $script:ManagedBridge = $null
    $script:ManagedApp = $null
    if ($logoPicture.Image) {
        $logoPicture.Image.Dispose()
    }
})

[void]$form.ShowDialog()
