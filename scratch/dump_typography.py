import json

with open('scratch/a5.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

nodes = d['children'][0]['artboard']['children']

output = []

def get_color_str(color_obj):
    if not color_obj:
        return None
    val = color_obj.get('value')
    if isinstance(val, int):
        return f"#{val:06x}"
    elif isinstance(val, dict):
        r = val.get('r', 0)
        g = val.get('g', 0)
        b = val.get('b', 0)
        a = val.get('a', 1)
        return f"rgba({r},{g},{b},{a})"
    return str(val)

def extract_typography(node, parent_tx=0, parent_ty=0):
    tx = parent_tx + node.get('transform', {}).get('tx', 0)
    ty = parent_ty + node.get('transform', {}).get('ty', 0)
    name = node.get('name', '')
    if 'text' in node:
        t = node['text']
        raw = t.get('rawText', '').replace('\n', ' ')
        ranges = t.get('ranges', [])
        rel_x = round(tx - 7637, 2)
        rel_y = round(ty - 8843, 2)
        r_info = []
        for r in ranges:
            fs = r.get('fontSize')
            ff = r.get('fontFamily')
            fw = r.get('fontStyle')
            char_spacing = r.get('charSpacing')
            col = get_color_str(r.get('fill', {}).get('color'))
            r_info.append(f"fs={fs} ff={ff} fw={fw} tracking={char_spacing} col={col}")
        output.append(f"TEXT at ({rel_x}, {rel_y}) '{raw}' | " + " ; ".join(r_info))

    if 'children' in node:
        for ch in node['children']:
            extract_typography(ch, tx, ty)
    if 'group' in node and 'children' in node['group']:
        for ch in node['group']['children']:
            extract_typography(ch, tx, ty)

for n in nodes:
    extract_typography(n)

# Sort by y, then x
output.sort(key=lambda s: float(s.split(', ')[1].split(')')[0]))

with open('scratch/list_typography.txt', 'w', encoding='utf-8') as out:
    for line in output:
        out.write(line + '\n')

print("Wrote typography details.")
