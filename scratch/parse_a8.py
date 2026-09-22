import json

with open('scratch/a8_1.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

AB_X = 13956
AB_Y = 8843

def get_style_info(node):
    info = {}
    st = node.get('style', {})
    if 'fill' in st:
        fill = st['fill']
        if fill.get('type') == 'solid':
            c = fill.get('color', {}).get('value', {})
            info['fill'] = f"#{c.get('r',0):02x}{c.get('g',0):02x}{c.get('b',0):02x}"
    if 'stroke' in st:
        stroke = st['stroke']
        if stroke.get('type') == 'solid':
            c = stroke.get('color', {}).get('value', {})
            info['stroke'] = f"#{c.get('r',0):02x}{c.get('g',0):02x}{c.get('b',0):02x} ({st.get('width')}px)"
    if 'font' in st:
        fn = st['font']
        info['font'] = f"{fn.get('size')}px {fn.get('family')} {fn.get('style')}"
    return info

def traverse(nodes, parent_x=0, parent_y=0):
    res = []
    for n in nodes:
        tf = n.get('transform', {})
        tx = parent_x + tf.get('tx', 0)
        ty = parent_y + tf.get('ty', 0)
        sx = round(tx - AB_X, 1)
        sy = round(ty - AB_Y, 1)
        shape = n.get('shape', {})
        w = shape.get('width')
        h = shape.get('height')
        r = shape.get('r')
        text = n.get('text', {}).get('rawText') if 'text' in n else None
        name = n.get('name', '')
        style = get_style_info(n)
        
        if text:
            res.append({'type': 'text', 'name': name, 'text': text.replace('\n', ' \\n '), 'x': sx, 'y': sy, 'style': style})
        elif w is not None and h is not None:
            res.append({'type': 'shape', 'name': name, 'w': w, 'h': h, 'r': r, 'x': sx, 'y': sy, 'style': style})
        elif shape.get('type') == 'circle':
            res.append({'type': 'circle', 'name': name, 'r': shape.get('r'), 'x': sx, 'y': sy, 'style': style})
        
        if 'children' in n.get('group', {}):
            res.extend(traverse(n['group']['children'], tx, ty))
    return res

ab = d['children'][0]
ab_children = ab.get('artboard', {}).get('children', [])
items = traverse(ab_children)

print(f'Total items extracted: {len(items)}')

with open('scratch/a8_1_elements.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, indent=2, ensure_ascii=False)

print('Saved scratch/a8_1_elements.json')
