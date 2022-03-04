#!/bin/bash

git branch -d gh-pages
git branch -D gh-pages
git push origin --delete gh-pages -f

npm run build
mv dist docs

git checkout -b gh-pages

git add -f docs
git add -f dist

git commit -m 'docs: publish' --no-verify
git subtree push --prefix docs origin gh-pages

rm -rf docs/dist

git checkout dev