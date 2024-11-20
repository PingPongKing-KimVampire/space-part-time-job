import os
import geopandas as gpd
import json
import pandas as pd
from multiprocessing import Pool, Manager

def process_district(index_and_row, gdf, step_distances, total_count, progress_counter):
    """각 동의 데이터를 처리하는 함수."""
    index, target_row = index_and_row
    district_name = target_row["EMD_KOR_NM"]

    # 업데이트된 진행률 출력
    progress_counter.value += 1
    progress = f"{progress_counter.value}/{total_count}"
    print(f"Processing district: {district_name} (Progress: {progress})")

    structure = {
        "district_id": target_row["EMD_CD"],
        "district_korean_name": district_name,
        "district_english_name": target_row.get("EMD_ENG_NM", ""),
        "levels": {}
    }

    for step_distance, step_level in step_distances.items():
        neighbors = gdf[gdf.geometry.distance(target_row.geometry) <= step_distance]

        if not neighbors.empty:
            districts = neighbors["EMD_KOR_NM"].tolist()
            combined_geometry = neighbors.geometry.aggregate("union_all")
            outer_boundary = combined_geometry.convex_hull

            outer_boundary_wgs84 = gpd.GeoSeries([outer_boundary], crs=5179).to_crs(epsg=4326).iloc[0]

            structure["levels"][step_level] = {
                "districts": districts,
                "outer_boundary": {
                    "type": "Polygon",
                    "coordinates": list(outer_boundary_wgs84.exterior.coords)
                }
            }

    print(f"Completed district: {district_name} (Progress: {progress})")
    return structure

def main():
    # 데이터 디렉토리 설정
    data_dir = "unzip-src"

    # SHP 파일 경로 수집
    shp_file_paths = [
        os.path.join(root, file)
        for root, dirs, files in os.walk(data_dir)
        for file in files
        if file.endswith("TL_SCCO_GEMD.shp")
    ]

    if not shp_file_paths:
        raise ValueError("No SHP files found in the specified directory.")

    print("Loading SHP files...")
    gdfs = [gpd.read_file(shp_path, encoding="cp949") for shp_path in shp_file_paths]
    combined_gdf = gpd.GeoDataFrame(pd.concat(gdfs, ignore_index=True))
    combined_gdf = combined_gdf.set_crs(epsg=5179)

    # 결측치 및 비어 있는 geometry 제거
    combined_gdf = combined_gdf[~combined_gdf.geometry.is_empty]
    combined_gdf = combined_gdf[combined_gdf.is_valid]
    combined_gdf = combined_gdf.dropna(subset=["geometry"])

    # 단계별 거리 설정
    step_distances = {100: "1", 500: "2", 1000: "3", 1500: "4"}

    # 전체 처리 개수
    total_count = len(combined_gdf)

    print(f"Processing {total_count} districts in parallel...")
    
    # 멀티프로세싱 설정
    with Manager() as manager:
        progress_counter = manager.Value("i", 0)  # 진행률 카운터
        with Pool() as pool:
            results = pool.starmap(
                process_district,
                [(row, combined_gdf, step_distances, total_count, progress_counter) for row in combined_gdf.iterrows()]
            )

    # 결과 저장
    output_dir = "district-data"
    os.makedirs(output_dir, exist_ok=True)

    output_file = os.path.join(output_dir, "행정동-경계-districts-data.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=4)

    print("모든 동의 데이터 구조가 생성되었습니다!")
    print(f"JSON 파일: {output_file}")

if __name__ == "__main__":
    main()
