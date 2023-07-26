#!/bin/bash

source .env

curl "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}" \
-H 'Content-Type: application/json' \
--data-binary '{"email":"test@test.com","password":"test@123","returnSecureToken":true}'