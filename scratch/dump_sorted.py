import json

with open('scratch/a2_extracted.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

# Sort items by screen_y, then screen_x
items.sort(key=lambda it: (it['screen_y'], it['screen_x']))

with open('scratch/detailed_layout.txt', 'w', encoding='utf-8') as out:
    for it in items:
        name = it['name']
        text = it['text']
        w = it['w']
        h = it['h']
        x = it['screen_x']
        y = it['screen_y']
        r = it['r']
        style = it['style']
        out.write(f"x={x:6.1f}, y={y:6.1f} | w={str(w):6s}, h={str(h):6s} | r={str(r):14s} | name={name[:25]:25s} | {style} | {text if text else ''}\n")

print("Wrote detailed_layout.txt")
