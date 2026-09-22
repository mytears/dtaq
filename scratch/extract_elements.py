import json

with open('scratch/a2.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# artboard bounds: x=-1015, y=8843
AB_X = -1015
AB_Y = 8843

ab = data['children'][0]
ab_artboard = ab.get('artboard', {})
ab_children = ab_artboard.get('children', [])

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
            info['stroke'] = f"#{c.get('r',0):02x}{c.get('g',0):02x}{c.get('b',0):02x} ({st.get('strokeWidth')}px)"
    if 'font' in st:
        fn = st['font']
        info['font'] = f"{fn.get('size')}px {fn.get('family')} {fn.get('style')}"
    return info

def extract_elements(nodes, parent_tx=0, parent_ty=0):
    items = []
    for n in nodes:
        name = n.get('name', '')
        ntype = n.get('type', '')
        tf = n.get('transform', {})
        tx = parent_tx + tf.get('tx', 0)
        ty = parent_ty + tf.get('ty', 0)
        shape = n.get('shape', {})
        w = shape.get('width', None)
        h = shape.get('height', None)
        r = shape.get('r', None) # border radius
        
        style = get_style_info(n)
        
        text = None
        if 'text' in n:
            text = n['text'].get('rawText', '').replace('\n', '\\n')
            if 'paragraphs' in n['text']:
                for p in n['text']['paragraphs']:
                    for line in p.get('lines', []):
                        for span in line:
                            # font, color in span
                            pass
        
        item = {
            'name': name,
            'type': ntype,
            'screen_x': round(tx - AB_X, 1),
            'screen_y': round(ty - AB_Y, 1),
            'w': w,
            'h': h,
            'r': r,
            'text': text,
            'style': style
        }
        
        # We record items that have visible geometry or text
        items.append(item)
        
        # recurse
        children = n.get('children', [])
        if 'group' in n and 'children' in n['group']:
            children = children + n['group']['children']
        if children:
            items.extend(extract_elements(children, tx, ty))
            
    return items

all_items = extract_elements(ab_children)

with open('scratch/a2_extracted.json', 'w', encoding='utf-8') as out:
    json.dump(all_items, out, indent=2, ensure_ascii=False)

print(f'Total extracted items: {len(all_items)}')
