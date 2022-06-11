#!/bin/bash

cd docs
npm run build
cd ../
node scripts/buildDocs.js
