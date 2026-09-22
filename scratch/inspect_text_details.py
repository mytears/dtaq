import json

with open('scratch/a5.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

nodes = d['children'][0]['artboard']['children']

def get_text_detail(node, parent_tx=0, parent_ty=0):
    tx = parent_tx + node.get('transform', {}).get('tx', 0)
    ty = parent_ty + node.get('transform', {}).get('ty', 0)
    name = node.get('name', '')
    if 'text' in node:
        t = node['text']
        raw = t.get('rawText', '').replace('\n', ' ')
        ranges = t.get('ranges', [])
        print(f"\nTEXT: '{raw}' (node '{name}') at ({tx - 7637}, {ty - 8843})")
        for r in ranges:
            fs = r.get('fontSize')
            ff = r.get('fontFamily')
            fw = r.get('fontStyle')
            char_spacing = r.get('charSpacing')
            col = r.get('fill', {}).get('color', {})
            print(f"   range: '{raw[r.get('length',0):]}...' fs={fs}, ff={ff}, fw={fw}, tracking={char_spacing}, col={col}")
    if 'children' in node:
        for ch in node['children']:
            get_text_detail(ch, tx, ty)
    if 'group' in node and 'children' in node['group']:
        for ch in node['group']['children']:
            get_text_detail(ch, tx, ty)

for n in nodes:
    get_text_detail(n)
