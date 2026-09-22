with open('scratch/a5_layout.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("=== LIST TITLE & COUNT ===")
for l in lines:
    if any(k in l for k in ['국방기술', '검색결과', '성명', '사번', '부서명', '직책', '선임', '연구원', '김진호']):
        print(l.strip())

print("\n=== RECTANGLES / SHAPES in list area ===")
for l in lines:
    if '[shape]' in l and 'keyboard' not in l:
        parts = l.split('at (')
        if len(parts) > 1:
            coords = parts[1].split(')')[0].split(', ')
            x = float(coords[0])
            y = float(coords[1])
            if 40 <= x <= 1250 and 100 <= y <= 1050:
                print(l.strip())
