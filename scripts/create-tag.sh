#!/bin/bash

version=$(grep -o '"version": *"[^"]*"' ./package.json | sed -E 's/"version": *"([^"]*)"/\1/')

if [ -z "$version" ]; then
    echo "Failed to read version from package.json"
    exit 1
fi

echo "Creating a new Git tag: v$version"
git tag -a "v$version" -m "Release version $version"
git push origin "v$version"
