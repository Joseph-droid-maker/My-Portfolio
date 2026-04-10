import json
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from scipy.stats import gaussian_kde
import pickle
import pandas as pd
from sklearn.metrics import confusion_matrix

# ── LOAD REAL DATA ────────────────────────────────────────
json_path  = r"C:\Users\MAC\Desktop\School\Elective 3 Activity 1 SemiFinal\Final Project\flood-app\src\floodData.json"
model_path = r"C:\Users\MAC\Desktop\School\Elective 3 Activity 1 SemiFinal\Final Project\flood-app\Datasets\flood_rf_model.pkl"
csv_path   = r"C:\Users\MAC\Desktop\School\Elective 3 Activity 1 SemiFinal\Final Project\flood-app\Datasets\Philippines_Flood_Final_Predictions.csv"

with open(json_path, 'r') as f:
    data = json.load(f)

df = pd.read_csv(csv_path)

with open(model_path, 'rb') as f:
    rf = pickle.load(f)

print(f"Loaded {len(data)} municipalities from floodData.json")

# ── EXTRACT REAL VALUES ───────────────────────────────────
scores      = [d['score'] for d in data]
labels      = [d['label'] for d in data]
confidences = [d['confidence'] for d in data]

prob_low       = [d['probabilities']['LOW']       for d in data]
prob_moderate  = [d['probabilities']['MODERATE']  for d in data]
prob_high      = [d['probabilities']['HIGH']      for d in data]
prob_very_high = [d['probabilities']['VERY HIGH'] for d in data]
prob_critical  = [d['probabilities']['CRITICAL']  for d in data]

# Real confusion matrix from CSV
features = ['elevation_mean','elevation_min','rainfall_annual_avg',
            'rainfall_1mo_avg','pop_density_per_km2','flood_count','noah_max_hazard']
for col in features:
    df[col] = df[col].fillna(df[col].median())

from sklearn.model_selection import train_test_split
X = df[features]
y = df['susceptibility_label']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
y_pred = rf.predict(X_test)

LABEL_ORDER = ['LOW', 'MODERATE', 'HIGH', 'VERY HIGH', 'CRITICAL']
cm = confusion_matrix(y_test, y_pred, labels=LABEL_ORDER)

# ── STYLE ─────────────────────────────────────────────────
plt.rcParams['font.family']    = 'DejaVu Sans'
plt.rcParams['figure.facecolor'] = '#0D1B2A'
plt.rcParams['axes.facecolor'] = '#0A1520'
plt.rcParams['axes.edgecolor'] = '#1E3A5F'
plt.rcParams['text.color']     = 'white'
plt.rcParams['axes.labelcolor']= '#AAC4DD'
plt.rcParams['xtick.color']    = '#AAC4DD'
plt.rcParams['ytick.color']    = '#AAC4DD'
plt.rcParams['grid.color']     = '#1E3A5F'
plt.rcParams['grid.alpha']     = 0.5

COLORS = {
    'LOW':       '#00E676',
    'MODERATE':  '#00BCD4',
    'HIGH':      '#FFD600',
    'VERY HIGH': '#FF6D00',
    'CRITICAL':  '#FF1744',
}

fig = plt.figure(figsize=(18, 14), facecolor='#060B14')
fig.suptitle('Philippines Flood Susceptibility — Random Forest Model Analysis',
             fontsize=18, fontweight='bold', color='white', y=0.98)

gs  = fig.add_gridspec(2, 2, hspace=0.38, wspace=0.32,
                        left=0.07, right=0.97, top=0.93, bottom=0.06)
ax1 = fig.add_subplot(gs[0, 0])
ax2 = fig.add_subplot(gs[0, 1])
ax3 = fig.add_subplot(gs[1, 0])
ax4 = fig.add_subplot(gs[1, 1])

# ── 1. CONFUSION MATRIX (real) ────────────────────────────
row_sums = cm.sum(axis=1, keepdims=True)
row_sums[row_sums == 0] = 1
cm_pct = cm.astype(float) / row_sums

ax1.imshow(cm_pct, cmap='Blues', vmin=0, vmax=1, aspect='auto')
for i in range(5):
    for j in range(5):
        val = cm[i, j]
        pct = cm_pct[i, j]
        txt_color = 'white' if pct > 0.5 else '#AAC4DD'
        label = f'{val}\n({pct*100:.0f}%)' if val > 0 else '0'
        ax1.text(j, i, label, ha='center', va='center', fontsize=9,
                 color=txt_color, fontweight='bold' if pct > 0.5 else 'normal')

ax1.set_xticks(range(5)); ax1.set_yticks(range(5))
ax1.set_xticklabels(LABEL_ORDER, fontsize=9, rotation=20, ha='right')
ax1.set_yticklabels(LABEL_ORDER, fontsize=9)
ax1.set_xlabel('Predicted label', fontsize=11)
ax1.set_ylabel('Actual label', fontsize=11)
ax1.set_title(f'Confusion Matrix (test set, n={len(y_test)})', fontsize=13,
              fontweight='bold', color='white', pad=12)
for spine in ax1.spines.values(): spine.set_edgecolor('#1E3A5F')

# ── 2. FEATURE IMPORTANCE (real from model) ───────────────
feat_labels = ['Elevation mean', 'Elevation min', 'Rainfall (annual)',
               'Rainfall (1mo)', 'Population density', 'Flood history', 'NOAH hazard']
importance  = rf.feature_importances_.tolist()

sorted_idx    = np.argsort(importance)
sorted_imp    = [importance[i] for i in sorted_idx]
sorted_labels = [feat_labels[i] for i in sorted_idx]
bar_colors    = ['#4FC3F7' if v >= 0.25 else '#0288D1' if v >= 0.15 else '#1565C0' for v in sorted_imp]

bars = ax2.barh(range(len(sorted_labels)), sorted_imp, color=bar_colors, edgecolor='none', height=0.6)
for i, (bar, val) in enumerate(zip(bars, sorted_imp)):
    ax2.text(val + 0.003, i, f'{val*100:.1f}%', va='center', ha='left',
             fontsize=10, color='white', fontweight='bold')

ax2.set_yticks(range(len(sorted_labels))); ax2.set_yticklabels(sorted_labels, fontsize=10)
ax2.set_xlabel('Importance score', fontsize=11)
ax2.set_title('Feature Importance (Random Forest)', fontsize=13,
              fontweight='bold', color='white', pad=12)
ax2.set_xlim(0, max(sorted_imp) * 1.25)
ax2.xaxis.grid(True, alpha=0.3); ax2.set_axisbelow(True)
for spine in ax2.spines.values(): spine.set_edgecolor('#1E3A5F')

# ── 3. SCORE DISTRIBUTION (real from JSON) ────────────────
scores_arr = np.array(scores)
for lo, hi, label in [(0,35,'LOW'),(35,50,'MODERATE'),(50,65,'HIGH'),(65,80,'VERY HIGH'),(80,101,'CRITICAL')]:
    mask = (scores_arr >= lo) & (scores_arr < hi)
    count = mask.sum()
    ax3.hist(scores_arr[mask], bins=20, range=(lo, min(hi, 100)),
             color=COLORS[label], alpha=0.85, edgecolor='#060B14',
             linewidth=0.5, label=f'{label} ({count})')

for t in [35, 50, 65, 80]:
    ax3.axvline(x=t, color='white', linewidth=0.8, linestyle='--', alpha=0.4)

ax3.set_xlabel('Susceptibility score (0–100)', fontsize=11)
ax3.set_ylabel('Number of municipalities', fontsize=11)
ax3.set_title(f'Susceptibility Score Distribution (n={len(scores)})', fontsize=13,
              fontweight='bold', color='white', pad=12)
ax3.set_xlim(0, 100); ax3.yaxis.grid(True, alpha=0.3); ax3.set_axisbelow(True)
ax3.legend(fontsize=9, framealpha=0.15, facecolor='#0D1B2A',
           edgecolor='#1E3A5F', loc='upper right')
for spine in ax3.spines.values(): spine.set_edgecolor('#1E3A5F')

# ── 4. CLASS PROBABILITY DISTRIBUTIONS (real from JSON) ───
prob_data = {
    'LOW':       np.array(prob_low),
    'MODERATE':  np.array(prob_moderate),
    'HIGH':      np.array(prob_high),
    'VERY HIGH': np.array(prob_very_high),
    'CRITICAL':  np.array(prob_critical),
}

x = np.linspace(0, 100, 400)
for label in LABEL_ORDER:
    data = np.clip(prob_data[label], 0.1, 99.9)
    kde = gaussian_kde(data, bw_method=0.2)
    y = kde(x)
    ax4.plot(x, y, color=COLORS[label], linewidth=2.2, label=label)
    ax4.fill_between(x, y, alpha=0.12, color=COLORS[label])

ax4.set_xlabel('Predicted probability (%)', fontsize=11)
ax4.set_ylabel('Density', fontsize=11)
ax4.set_title('RF Class Probability Distributions (all 1,606)', fontsize=13,
              fontweight='bold', color='white', pad=12)
ax4.set_xlim(0, 100); ax4.yaxis.grid(True, alpha=0.3); ax4.set_axisbelow(True)
ax4.legend(handles=[mpatches.Patch(color=COLORS[l], label=l) for l in LABEL_ORDER],
           fontsize=9, framealpha=0.15, facecolor='#0D1B2A',
           edgecolor='#1E3A5F', loc='upper center')
for spine in ax4.spines.values(): spine.set_edgecolor('#1E3A5F')

# ── SAVE ──────────────────────────────────────────────────
out = r"C:\Users\MAC\Desktop\School\Elective 3 Activity 1 SemiFinal\Final Project\flood-app\Model_Analysis_Charts.png"
plt.savefig(out, dpi=150, bbox_inches='tight', facecolor='#060B14', edgecolor='none')
print(f"✅ Saved: {out}")
plt.show()