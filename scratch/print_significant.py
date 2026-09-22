import json

with open('scratch/a2_extracted.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print("=== SIGNIFICANT UI ELEMENTS IN A-2 ===")
for it in items:
    name = it['name']
    text = it['text']
    w = it['w']
    h = it['h']
    x = it['screen_x']
    y = it['screen_y']
    r = it['r']
    style = it['style']
    
    if text:
        print(f"[TEXT] x={x}, y={y} | \"{text}\" | {style}")
    elif w is not None and h is not None and (w > 30 or h > 30):
        print(f"[SHAPE] x={x}, y={y}, w={w}, h={h}, r={r}, name: \"{name}\" | {style}")
