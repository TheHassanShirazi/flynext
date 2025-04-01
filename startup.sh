#!/bin/bash

npx prisma generate

# Run migrations for production
npx prisma migrate deploy

npm run build
npm start