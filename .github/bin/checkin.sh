#!/usr/bin/env bash
set -eu

dir=$1
name=$2
shift 2

git config --global user.name 'GitHub Action'
git config --global user.email 'action@github.com'  
git stash  
git pull
git stash pop

if [[ ! -e results/$dir ]] ; then
  mkdir -p results/$dir
fi

cp playwright-report/index.html results/$dir/$name.html
if [[ -e $name.png ]] ; then
  cp $name.png results/$dir/
fi

while [[ $# > 0 ]] ; do
  cp $1 results/$dir/
  shift
done

git add results/$dir
git add Results.md
git commit -m "Results for $dir"
git push 

