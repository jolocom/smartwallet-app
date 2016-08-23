#!/bin/bash

# Hash the password of all the files without extension in the current folder
for f in !(*.*); do
echo $f
./jolohash.xx --dry-run $f
done