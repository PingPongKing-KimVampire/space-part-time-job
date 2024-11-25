#!/bin/bash

SRC_DIR="../../src"   # ZIP 파일들이 있는 디렉토리
DATA_DIR="../../unzip-src" # 압축 해제된 파일들을 저장할 디렉토리

# data 디렉토리가 없으면 생성
mkdir -p "$DATA_DIR"

# src 디렉토리에 있는 모든 ZIP 파일 처리
for ZIP_FILE in "$SRC_DIR"/*.zip; do
  # ZIP 파일 이름에서 확장자 제거 (디렉토리 이름으로 사용)
  ZIP_NAME=$(basename "$ZIP_FILE" .zip)
  TARGET_DIR="$DATA_DIR/$ZIP_NAME"

  # 압축 해제 대상 디렉토리 생성
  mkdir -p "$TARGET_DIR"

  # 압축 해제
  echo "Extracting $ZIP_FILE to $TARGET_DIR..."
  unzip -o "$ZIP_FILE" -d "$TARGET_DIR" > /dev/null

  # TL_SCCO_GEMD로 시작하지 않는 파일 삭제
  find "$TARGET_DIR" -type f ! -name 'TL_SCCO_GEMD*' -delete

  echo "Cleaned up $TARGET_DIR, only TL_SCCO_GEMD files retained."
done

echo "All files have been processed and organized in $DATA_DIR."
