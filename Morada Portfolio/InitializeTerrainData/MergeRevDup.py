import rasterio
from rasterio.merge import merge
from rasterio.mask import mask
import geopandas as gpd
import numpy as np
import pandas as pd

# ── BASE FOLDER ───────────────────────────────────────────
base = r"C:\Users\MAC\Desktop\School\Elective 3 Activity 1 SemiFinal\Final Project\flood-app\Datasets"

# ── 1. INPUT FILES ────────────────────────────────────────
luzon    = base + r"\Terrain\Terrain Data\Luzon.tif"
visayas1 = base + r"\Terrain\Terrain Data\Visaya 1.tif"
visayas2 = base + r"\Terrain\Terrain Data\Visaya 2.tif"
mindanao = base + r"\Terrain\Terrain Data\Mindanao.tif"

# ── 2. OUTPUT FILES ───────────────────────────────────────
output_tif = base + r"\Terrain\srtm_philippines_merged.tif"
output_csv = base + r"\Terrain\philippines_elevation.csv"

# ── 3. SHAPEFILE ──────────────────────────────────────────
# Change "Shapefile" to "Shape Files"
shapefile = base + r"\Shape Files\Borders\phl_admbnda_adm3_psa_namria_20231106.shp"

# ── 4. MERGE ALL 4 TIF FILES ─────────────────────────────
print("Merging Luzon + Visayas 1 + Visayas 2 + Mindanao...")
src_files = [rasterio.open(f) for f in [luzon, visayas1, visayas2, mindanao]]
mosaic, transform = merge(src_files)
mosaic = mosaic.astype(np.float32)
mosaic[mosaic == -32768] = np.nan

output_meta = src_files[0].meta.copy()
output_meta.update({
    "driver":    "GTiff",
    "height":    mosaic.shape[1],
    "width":     mosaic.shape[2],
    "transform": transform,
    "dtype":     "float32"
})
with rasterio.open(output_tif, "w", **output_meta) as dest:
    dest.write(mosaic)
for src in src_files:
    src.close()
print("✅ Merged TIF saved!")

# ── 5. LOAD SHAPEFILE ─────────────────────────────────────
print("Loading municipality shapefile...")
provinces = gpd.read_file(shapefile)
with rasterio.open(output_tif) as src:
    raster_crs = src.crs
provinces = provinces.to_crs(raster_crs)
print(f"✅ Loaded {len(provinces)} municipalities")

# ── 6. EXTRACT ELEVATION PER MUNICIPALITY ────────────────
print("Extracting elevation per municipality (this may take a few minutes)...")
results = []

with rasterio.open(output_tif) as src:
    for idx, row in provinces.iterrows():
        try:
            geom = [row.geometry.__geo_interface__]
            out_image, _ = mask(src, geom, crop=True, nodata=np.nan)
            data  = out_image[0]
            valid = data[~np.isnan(data)]
            valid = valid[valid > -100]

            if len(valid) > 0:
                # ✅ BUG 1 FIXED: added ADM2_EN for province, consistent ADM3 columns
                results.append({
                    "municipality":   row["ADM3_EN"],
                    "province":       row["ADM2_EN"],
                    "region":         row["ADM1_EN"],
                    "pcode":          row["ADM3_PCODE"],
                    "elevation_mean": round(float(np.mean(valid)), 2),
                    "elevation_min":  round(float(np.min(valid)),  2),
                    "elevation_max":  round(float(np.max(valid)),  2),
                    "elevation_std":  round(float(np.std(valid)),  2),
                })
            else:
                # ✅ BUG 2 FIXED: was using ADM2 columns instead of ADM3
                results.append({
                    "municipality":   row["ADM3_EN"],
                    "province":       row["ADM2_EN"],
                    "region":         row["ADM1_EN"],
                    "pcode":          row["ADM3_PCODE"],
                    "elevation_mean": np.nan,
                    "elevation_min":  np.nan,
                    "elevation_max":  np.nan,
                    "elevation_std":  np.nan,
                })

            # Progress indicator
            if idx % 20 == 0:
                print(f"  Processing... {idx}/{len(provinces)}")

        except Exception as e:
            # ✅ BUG 3 FIXED: was using ADM2_EN in error message
            print(f"  Skipped {row['ADM3_EN']}: {e}")

# ── 7. CLEAN AND SAVE ─────────────────────────────────────
df = pd.DataFrame(results)
print(f"\nBefore dedup: {len(df)} rows")
df = df.drop_duplicates(subset=["pcode"])
df = df.dropna(subset=["elevation_mean"])
print(f"After dedup:  {len(df)} rows")

df.to_csv(output_csv, index=False)
print(f"✅ Saved: {output_csv}")
print(df.head(10))