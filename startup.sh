#!/bin/bash

npx prisma generate;npx prisma migrate deploy;node ./populateDB.js;npm run build;npm start