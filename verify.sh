#!/bin/bash
echo "--- Security Headers ---"
curl -I http://localhost:5000/api/v1/products

echo -e "\n--- Rate Limiting (Login) ---"
# Using POST to trigger rate limit on login endpoint
# for i in {1..6}; do curl -o /dev/null -s -w "%{http_code}\n" -X POST http://localhost:5000/api/v1/identity/login; done

echo -e "\n--- API Key (No Key) ---"
curl -o /dev/null -s -w "%{http_code}\n" http://localhost:5000/api/v1/products/secure-test

echo -e "\n--- API Key (Wrong Key) ---"
curl -o /dev/null -s -w "%{http_code}\n" -H "X-Api-Key: wrong" http://localhost:5000/api/v1/products/secure-test

echo -e "\n--- API Key (Correct Key) ---"
curl -o /dev/null -s -w "%{http_code}\n" -H "X-Api-Key: your-secret-api-key-here" http://localhost:5000/api/v1/products/secure-test

echo -e "\n--- Refresh Token Flow ---"
# Register a new user (ignore error if exists)
echo "Registering user..."
curl -s -X POST http://localhost:5000/api/v1/identity/register -H "Content-Type: application/json" -d '{"email": "testuser@example.com", "password": "Password123!", "confirmPassword": "Password123!"}' > /dev/null

# Login and extract tokens
echo "Logging in..."
RESPONSE=$(curl -s -X POST http://localhost:5000/api/v1/identity/login -H "Content-Type: application/json" -d '{"email": "testuser@example.com", "password": "Password123!"}')

# Check if login succeeded
if [[ $RESPONSE == *"accessToken"* ]]; then
    ACCESS_TOKEN=$(echo $RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    REFRESH_TOKEN=$(echo $RESPONSE | grep -o '"refreshToken":"[^"]*' | cut -d'"' -f4)

    echo "Access Token: ${ACCESS_TOKEN:0:10}..."
    echo "Refresh Token: ${REFRESH_TOKEN:0:10}..."

    # Use Access Token
    echo "Using Access Token:"
    curl -o /dev/null -s -w "%{http_code}\n" -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost:5000/api/v1/products

    # Refresh Token
    echo "Refreshing Token:"
    REFRESH_RESPONSE=$(curl -s -X POST http://localhost:5000/api/v1/identity/refresh-token -H "Content-Type: application/json" -d "{\"accessToken\": \"$ACCESS_TOKEN\", \"refreshToken\": \"$REFRESH_TOKEN\"}")
    
    if [[ $REFRESH_RESPONSE == *"accessToken"* ]]; then
        NEW_ACCESS_TOKEN=$(echo $REFRESH_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
        echo "New Access Token: ${NEW_ACCESS_TOKEN:0:10}..."
        echo "Refresh Token Flow Verified!"
    else
        echo "Refresh Token Failed: $REFRESH_RESPONSE"
    fi
else
    echo "Login Failed: $RESPONSE"
fi
