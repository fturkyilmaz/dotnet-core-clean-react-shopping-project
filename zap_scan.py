import time
from zapv2 import ZAPv2

# OWASP ZAP Configuration
ZAP_API_KEY = 'your-zap-api-key'  # Replace with your ZAP API key
ZAP_BASE_URL = 'http://localhost:8080'
TARGET_URL = 'http://localhost:5000'  # Replace with your app's URL

zap = ZAPv2(apikey=ZAP_API_KEY, proxies={'http': ZAP_BASE_URL, 'https': ZAP_BASE_URL})

# Start Passive Scan
print(f"Accessing target {TARGET_URL}")
zap.urlopen(TARGET_URL)
time.sleep(2)  # Wait for ZAP to load the page

# Start Active Scan
print("Starting Active Scan...")
scan_id = zap.ascan.scan(TARGET_URL)

while int(zap.ascan.status(scan_id)) < 100:
    print(f"Scan progress: {zap.ascan.status(scan_id)}%")
    time.sleep(5)

print("Active Scan completed!")

# Generate Report
alerts = zap.core.alerts(baseurl=TARGET_URL)
print(f"Found {len(alerts)} alerts:")
for alert in alerts:
    print(f"- {alert['alert']} ({alert['riskdesc']})")

# Save Report
with open('zap_report.html', 'w') as report_file:
    report_file.write(zap.core.htmlreport())

print("Report saved as zap_report.html")