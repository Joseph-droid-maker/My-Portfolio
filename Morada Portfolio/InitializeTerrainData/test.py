import pandas as pd

datasets = r"C:\Users\MAC\Desktop\School\Elective 3 Activity 1 SemiFinal\Final Project\flood-app\Datasets"
master = pd.read_csv(datasets + r"\Philippines_Flood_Master.csv")

# ── MANUAL OVERRIDES for known flood-prone cities with no NOAH coverage ──
# These are historically documented disaster zones
overrides = {
    "Tacloban":       85,  # Typhoon Haiyan 2013, storm surge capital
    "Ormoc":          82,  # 1991 flash flood, 5000+ deaths
    "Cagayan de Oro": 80,  # 2011 Sendong flash flood, 1200+ deaths
    "Iligan":         80,  # 2011 Sendong, twin disaster with CDO
    "Butuan":         78,  # Agusan River flooding, chronic
    "Cotabato":       78,  # Mindanao River basin, frequent
}

for city_keyword, forced_score in overrides.items():
    mask = master["municipality"].str.contains(city_keyword, case=False, na=False)
    if mask.sum() > 0:
        current = master.loc[mask, "susceptibility_score"].values[0]
        # Only override if current score is LOWER than the forced score
        master.loc[mask, "susceptibility_score"] = master.loc[mask, "susceptibility_score"].apply(
            lambda x: max(x, forced_score)
        )
        new_score = master.loc[mask, "susceptibility_score"].values[0]
        print(f"  {city_keyword:20s}: {current} → {new_score}")

# ── RECALCULATE LABELS ────────────────────────────────────
def get_label(score):
    if score >= 80:   return "CRITICAL"
    elif score >= 65: return "VERY HIGH"
    elif score >= 50: return "HIGH"
    elif score >= 35: return "MODERATE"
    else:             return "LOW"

master["susceptibility_label"] = master["susceptibility_score"].apply(get_label)

# ── SAVE ─────────────────────────────────────────────────
master.to_csv(datasets + r"\Philippines_Flood_Master.csv", index=False)

print(f"\n=== Final Label Distribution ===")
print(master["susceptibility_label"].value_counts())

print(f"\n=== Sample of each risk level ===")
for label in ["CRITICAL","VERY HIGH","HIGH","MODERATE","LOW"]:
    sample = master[master["susceptibility_label"] == label].nlargest(3, "susceptibility_score")
    for _, row in sample.iterrows():
        print(f"  [{label:9s}] {row['municipality']:40s} score={row['susceptibility_score']:3d}  noah={row['noah_hazard_label']}")

print(f"\n✅ Overrides applied and master dataset saved!")