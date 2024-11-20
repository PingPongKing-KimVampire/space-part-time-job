# Python 베이스 이미지
FROM python:3.9-slim

# 시스템 의존성 및 개발 도구 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    gdal-bin \
    libgdal-dev \
    libproj-dev \
    build-essential \
    gcc \
    g++ \
    make \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# GDAL 환경 변수 설정
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal
ENV GDAL_VERSION=3.4.1

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY requirements.txt ./

# Python 의존성 설치
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

RUN 

# 실행 디렉토리 생성
RUN mkdir -p /app/final_output

# 실행 명령어 설정
CMD ["python", "main.py"]
