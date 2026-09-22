with open('scratch/a5_layout.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for line in lines:
    l = line.strip()
    if 'at (' in l:
        parts = l.split('at (')
        coords = parts[1].split(')')[0].split(', ')
        x = float(coords[0])
        y = float(coords[1])
        if x < 1300 and y >= 90:
            print(l)
