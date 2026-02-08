#!/usr/bin/env sh
set -e

archive="$1"
if [ -z "$archive" ]; then
  echo "Usage: ./scripts/restore-data.sh <backup-archive.tar.gz>"
  exit 1
fi

docker run --rm \
  -v my_test_app_data:/data \
  -v "$PWD":/backup \
  alpine \
  sh -c "rm -rf /data/* && tar -xzf /backup/$archive -C /data"

echo "Restore completed from: $archive"
