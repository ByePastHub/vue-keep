#!/bin/bash

git checkout dev docs
cd docs
npm run build
cd ../
node scripts/buildDocs.js
