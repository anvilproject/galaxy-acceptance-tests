#!/usr/bin/env bash
dir=$1
name=$2
shift 2

git config --global user.name 'GitHub Action'
git config --global user.email 'action@github.com'    
git pull

mkdir -p results/$name
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

