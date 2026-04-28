"""Quick smoke test for the FAIRCHAT backend."""
import urllib.request
import urllib.parse
import json

BASE = "http://127.0.0.1:8000"

# 1. Health check
res = urllib.request.urlopen(f"{BASE}/api/health")
health = json.loads(res.read())
print("HEALTH:", health)

# 2. Upload the sample CSV
boundary = "fairchatboundary123"
with open("sample_data.csv", "rb") as f:
    csv_data = f.read()

body = (
    b"--" + boundary.encode() + b"\r\n"
    b'Content-Disposition: form-data; name="file"; filename="sample_data.csv"\r\n'
    b"Content-Type: text/csv\r\n\r\n"
    + csv_data
    + b"\r\n--"
    + boundary.encode()
    + b"--\r\n"
)
req = urllib.request.Request(
    f"{BASE}/api/upload",
    data=body,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    method="POST",
)
resp = urllib.request.urlopen(req)
upload = json.loads(resp.read())
print(f"UPLOAD: {upload['rows']} rows, {len(upload['columns'])} columns")
print(f"  Filename: {upload['filename']}")

# 3. Analyze
fname = urllib.parse.quote(upload["filename"])
res2 = urllib.request.urlopen(f"{BASE}/api/analyze?filename={fname}")
analysis = json.loads(res2.read())
print(f"BIAS LEVEL:     {analysis['bias_level']}")
print(f"FAIRNESS SCORE: {analysis['fairness_score']}/100")
print(f"AFFECTED:       {analysis['affected_features']}")
print(f"SUGGESTIONS:    {len(analysis.get('suggestions', []))} items")
print(f"EXPLANATION:    {analysis['explanation'][:120]}...")
print("\n✅ All endpoints working correctly!")
