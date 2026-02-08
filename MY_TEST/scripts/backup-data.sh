#!/usr/bin/env sh
set -e

timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
backup_dir="./backups"
mkdir -p "$backup_dir"

docker run --rm \
  -v my_test_app_data:/data:ro \
  -v "$PWD/$backup_dir":/backup \
  alpine \
  sh -c "cd /data && tar -czf /backup/app_data_$timestamp.tar.gz ."

echo "Backup created: $backup_dir/app_data_$timestamp.tar.gz"
