#!/usr/bin/env bash
set -eu

dir=$1
branch=$2
name=$3
shift 3

git config --global user.name 'GitHub Action'
git config --global user.email 'action@github.com'  
#git stash  
git pull --rebase origin $branch
#git stash pop

if [[ ! -e results/$dir ]] ; then
  echo "Creating results/$dir"
  mkdir -p results/$dir
fi

cp playwright-report/index.html results/$dir/$name.html
if [[ -e $name.png ]] ; then
  mv $name.png results/$dir/
fi

while [[ $# > 0 ]] ; do
  mv $1 results/$dir/
  shift
done

git add results/$dir
git add *.md
git commit -m "Results for $dir $name"
git push origin $branch

