param(
  [string]$Token,
  [string]$Project = "mbj53wuq",
  [string]$Dataset = "production",
  [string]$DataDir = "Data"
)

$ErrorActionPreference = "Stop"

if (-not $Token) {
  Write-Error "Missing -Token. Pass the SANITY_API_TOKEN value."
  exit 1
}

$headers = @{
  Authorization = "Bearer $Token"
  "Content-Type" = "application/json"
}

$files = @(
  "skills.ndjson",
  "profile.ndjson",
  "education.ndjson",
  "experience.ndjson",
  "projects.ndjson",
  "services.ndjson",
  "blog.ndjson",
  "achievements.ndjson",
  "certifications.ndjson",
  "testimonials.ndjson",
  "navigation.ndjson",
  "siteSettings.ndjson"
)

$allDocs = @()
foreach ($file in $files) {
  $path = Join-Path $DataDir $file
  if (-not (Test-Path -LiteralPath $path)) { continue }
  Get-Content -LiteralPath $path | ForEach-Object {
    if ($_.Trim()) {
      $allDocs += ($_ | ConvertFrom-Json)
    }
  }
}

Write-Output "Total documents to import: $($allDocs.Count)"

$url = "https://$Project.api.sanity.io/v2024-10-10/data/mutate/$Dataset"
$batchSize = 10

for ($i = 0; $i -lt $allDocs.Count; $i += $batchSize) {
  $batch = $allDocs[$i..([Math]::Min($i + $batchSize - 1, $allDocs.Count - 1))]
  $mutations = foreach ($doc in $batch) {
    @{ createOrReplace = $doc }
  }
  $body = @{ mutations = $mutations } | ConvertTo-Json -Depth 30
  try {
    $resp = Invoke-RestMethod -Method Post -Uri $url -Headers $headers -Body $body
    $ids = ($resp.results | ForEach-Object { $_.id }) -join ", "
    Write-Output "Imported batch: $ids"
  } catch {
    Write-Output "BATCH ERROR at index $i : $($_.Exception.Message)"
    if ($_.ErrorDetails.Message) { Write-Output $_.ErrorDetails.Message }
  }
}

Write-Output "Import done."