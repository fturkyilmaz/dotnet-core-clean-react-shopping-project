#!/usr/bin/env bash
set -e

COMMAND=$1
NAME=$2

if [ -z "$COMMAND" ] || [ -z "$NAME" ]; then
  echo "Usage: ./sp generate <Name>"
  exit 1
fi

case "$COMMAND" in
  generate)
    ./tools/generators/feature.sh "$NAME"
    ;;
  *)
    echo "Unknown command"
    ;;
esac
