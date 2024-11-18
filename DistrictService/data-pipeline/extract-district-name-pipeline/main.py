import os
import geopandas as gpd
import json

src_dir = os.path.join(os.getcwd(), "unzip-src")
print(f"unzip-src directory: {src_dir}")

subDirectories = []
for root, dirs, files in os.walk(src_dir):
    for dirname in dirs:
        subDirectories.append(os.path.join(root, dirname))
print(f"Found subfolders: {subDirectories}")

# 빈 리스트 생성
districts = []

# 각 폴더에 있는 TL_SCCO_GEMD.shp 파일을 읽기
for folder in subDirectories:
    shp_file = os.path.join(folder, "TL_SCCO_GEMD.shp")
    print(f"Checking file: {shp_file}")
    if os.path.exists(shp_file):  # SHP 파일이 존재하는지 확인
        print(f"Processing {shp_file}...")
        try:
            temp = gpd.read_file(shp_file, encoding='cp949')  # GeoPandas로 SHP 파일 읽기
            # 데이터 처리: 각 행을 순회하며 리스트에 추가
            for _, row in temp.iterrows():
                districts.append({
                    "id": row["EMD_CD"],
                    "name": row["EMD_KOR_NM"]
                })
        except Exception as e:
            print(f"Error processing {shp_file}: {e}")
    else:
        print(f"File not found: {shp_file}")

# JSON 파일로 저장
output_dir = os.path.join(os.getcwd(), "district-data")
os.makedirs(output_dir, exist_ok=True)
output_file = os.path.join(output_dir, '행정동_districts.json')

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump({"districts": districts}, f, ensure_ascii=False, indent=4)


# 동의 개수 출력
print(f"전체 동의 개수: {len(districts)}")

print(f"'districts' 정보가 JSON 파일로 저장되었습니다: {output_file}")
