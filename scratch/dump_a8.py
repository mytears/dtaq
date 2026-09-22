import json

with open('scratch/a8_1_elements.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print("=== ALL LEFT ELEMENTS (x < 1250) ===")
for it in sorted(items, key=lambda x: (x.get('y', 0), x.get('x', 0))):
    if it.get('x', 0) < 1250 and it.get('y', 0) >= 90:
        y = it.get('y', 0)
        x = it.get('x', 0)
        t = it.get('type')
        name = it.get('name')
        w = it.get('w')
        h = it.get('h')
        txt = it.get('text', '')
        style = it.get('style', {})
        print(f"{y:>6.1f}, {x:>6.1f} | {t:<6} | {name:<25} | w={str(w):<6} h={str(h):<6} | text='{txt}' | {style}")

print("\n=== ALL RIGHT ELEMENTS (x >= 1250) ===")
for it in sorted(items, key=lambda x: (x.get('y', 0), x.get('x', 0))):
    if it.get('x', 0) >= 1250 and it.get('y', 0) >= 90:
        y = it.get('y', 0)
        x = it.get('x', 0)
        t = it.get('type')
        name = it.get('name')
        w = it.get('w')
        h = it.get('h')
        txt = it.get('text', '')
        style = it.get('style', {})
        print(f"{y:>6.1f}, {x:>6.1f} | {t:<6} | {name:<25} | w={str(w):<6} h={str(h):<6} | text='{txt}' | {style}")
