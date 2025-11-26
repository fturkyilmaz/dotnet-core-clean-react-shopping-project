#!/bin/bash

BASE_URL="http://localhost:5000/api/v1"

echo "--- Testing Rate Limiting (Login) ---"
# Call login 6 times. Limit is 5 per minute.
for i in {1..6}
do
   echo "Request $i:"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST "$BASE_URL/identity/login" \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@test.com", "password": "wrong"}'
done

echo "\n--- Testing CORS ---"
# Check Access-Control-Allow-Origin header
curl -I -X OPTIONS "$BASE_URL/identity/login" \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" 2>/dev/null | grep "Access-Control-Allow-Origin"

echo "\n--- Testing Input Validation (Register) ---"
# Weak password
echo "Weak Password Test:"
curl -s -X POST "$BASE_URL/identity/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "weak"}' | grep "Password"

# Invalid email
echo "\nInvalid Email Test:"
curl -s -X POST "$BASE_URL/identity/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email", "password": "StrongPassword1!"}' | grep "Email"
