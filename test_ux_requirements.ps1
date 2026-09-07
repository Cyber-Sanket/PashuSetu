$ErrorActionPreference = 'Stop'
Write-Host "=== PashuSetu UX Requirements Automated Test Suite ===" -ForegroundColor Cyan

# 1. Farmer Login
$loginBody = @{
    identifier = "farmer@pashusetu.gov.in"
    password = "Farmer@123"
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$farmerToken = $loginRes.token
$headers = @{
    Authorization = "Bearer $farmerToken"
}
Write-Host "Farmer authenticated: $($loginRes.user.name)" -ForegroundColor Green

# 2. Test File Upload Endpoint (/api/upload)
$sampleImgPath = "$PSScriptRoot\test_sample.png"
# Create a valid 1x1 PNG file in bytes
$pngBytes = [byte[]]@(0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82)
[System.IO.File]::WriteAllBytes($sampleImgPath, $pngBytes)

$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"
$fileHeader = "--$boundary$LF" +
    "Content-Disposition: form-data; name=`"photo`"; filename=`"test_lesion.png`"$LF" +
    "Content-Type: image/png$LF$LF"
$fileFooter = "$LF--$boundary--$LF"

$fileHeaderBytes = [System.Text.Encoding]::ASCII.GetBytes($fileHeader)
$fileFooterBytes = [System.Text.Encoding]::ASCII.GetBytes($fileFooter)

$contentBytes = New-Object byte[] ($fileHeaderBytes.Length + $pngBytes.Length + $fileFooterBytes.Length)
[System.Buffer]::BlockCopy($fileHeaderBytes, 0, $contentBytes, 0, $fileHeaderBytes.Length)
[System.Buffer]::BlockCopy($pngBytes, 0, $contentBytes, $fileHeaderBytes.Length, $pngBytes.Length)
[System.Buffer]::BlockCopy($fileFooterBytes, 0, $contentBytes, $fileHeaderBytes.Length + $pngBytes.Length, $fileFooterBytes.Length)

$uploadRes = Invoke-RestMethod -Uri "http://localhost:5000/api/upload" -Method POST -ContentType "multipart/form-data; boundary=$boundary" -Body $contentBytes
Write-Host "Photo Upload Endpoint Success: $($uploadRes.url) (Size: $($uploadRes.size) bytes)" -ForegroundColor Green
$uploadedPhotoUrl = $uploadRes.url

# Clean up local file
if (Test-Path $sampleImgPath) { Remove-Item $sampleImgPath }

# 3. Register Animal with Species and Dynamic Breed
$animalBody = @{
    name = "Surabhi Gir Cow"
    species = "Cow"
    breed = "Gir (गीर)"
    gender = "Female"
    ageYears = 4.5
    weightKg = 420
    color = "Reddish Speckled"
    identificationNumber = "MH-PUNE-$(Get-Random -Minimum 100000 -Maximum 999999)"
    photoUrl = $uploadedPhotoUrl
} | ConvertTo-Json

$animalRes = Invoke-RestMethod -Uri "http://localhost:5000/api/animals" -Method POST -Body $animalBody -Headers $headers -ContentType "application/json"
$createdAnimalId = $animalRes.id
Write-Host "Animal Registered with dynamic breed and photo: $($animalRes.name) ($($animalRes.breed)) [ID: $createdAnimalId]" -ForegroundColor Green

# 4. Submit Symptom Report with 'Other' Custom Symptom
$reportPayload = @{
    animalId = $createdAnimalId
    symptoms = @(
        "Fever",
        "Loss of Appetite",
        "Other: Sudden severe swelling on lower mandible and labored breath"
    )
    durationDays = 2
    severity = "Severe"
    temperatureF = 104.2
    appetiteStatus = "None"
    milkProductionChange = "Severe Drop"
    additionalDescription = "[Custom Symptoms: Sudden severe swelling on lower mandible] Farmer noted sudden onset after grazing near riverbank"
    photoUrl = $uploadedPhotoUrl
    latitude = 18.5204
    longitude = 73.8567
} | ConvertTo-Json

$reportRes = Invoke-RestMethod -Uri "http://localhost:5000/api/reports" -Method POST -Body $reportPayload -Headers $headers -ContentType "application/json"
$caseId = $reportRes.diseaseCase.id
Write-Host "Report Submitted with custom symptom: $($reportRes.report.reportCode) -> Case ID: $caseId" -ForegroundColor Green
Write-Host "  Risk Level: $($reportRes.assessmentResult.riskLevel) | Suspected: $($reportRes.assessmentResult.possibleCategory)" -ForegroundColor Yellow

# 5. Veterinarian Login and Case Inspection
$vetLoginBody = @{
    identifier = "vet@pashusetu.gov.in"
    password = "Vet@123"
} | ConvertTo-Json
$vetLogin = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $vetLoginBody -ContentType "application/json"
$vetToken = $vetLogin.token
$vetHeaders = @{ Authorization = "Bearer $vetToken" }

$caseDetail = Invoke-RestMethod -Uri "http://localhost:5000/api/cases/$caseId" -Method GET -Headers $vetHeaders
$parsedSymptoms = $caseDetail.report.symptoms | ConvertFrom-Json
$hasOtherSymptom = ($parsedSymptoms -match "Other:")
if ($hasOtherSymptom) {
    Write-Host "Veterinarian Case Inspection: Custom Other symptom verified in clinical view: $hasOtherSymptom" -ForegroundColor Green
} else {
    Write-Error "Custom symptom missing in case view!"
}

if ($caseDetail.report.photoUrl -eq $uploadedPhotoUrl) {
    Write-Host "Veterinarian Case Inspection: Photographic evidence verified in case review: $($caseDetail.report.photoUrl)" -ForegroundColor Green
} else {
    Write-Error "Photo evidence missing in case view!"
}

# 6. Notifications Test
$vetNotifs = Invoke-RestMethod -Uri "http://localhost:5000/api/notifications" -Method GET -Headers $vetHeaders
Write-Host "Notifications retrieved: $($vetNotifs.Count) total notifications for Veterinarian" -ForegroundColor Green
$unreadNotif = $vetNotifs | Where-Object { -not $_.isRead } | Select-Object -First 1

if ($unreadNotif) {
    Write-Host "  Testing mark-as-read for notification: $($unreadNotif.id)" -ForegroundColor Cyan
    $markRes = Invoke-RestMethod -Uri "http://localhost:5000/api/notifications/$($unreadNotif.id)/read" -Method PUT -Headers $vetHeaders
    Write-Host "Single notification marked as read: $($markRes.isRead)" -ForegroundColor Green
}

# Test mark-all-read
$markAllRes = Invoke-RestMethod -Uri "http://localhost:5000/api/notifications/read-all" -Method PUT -Headers $vetHeaders
Write-Host "Mark all notifications as read success: $($markAllRes.success)" -ForegroundColor Green

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " ALL 4 ADDITIONAL UX REQUIREMENTS VERIFIED END-TO-END! " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
