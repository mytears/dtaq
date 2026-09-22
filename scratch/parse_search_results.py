import json

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

def parse_xd_artboard(json_path, origin_x, origin_y, output_txt):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    ab = data['children'][0]['artboard']
    nodes = ab.get('children', [])

    elements = []

    def recurse(node, parent_tx=0, parent_ty=0):
        transform = node.get('transform', {})
        tx = parent_tx + transform.get('tx', 0)
        ty = parent_ty + transform.get('ty', 0)
        
        name = node.get('name', '')
        ntype = node.get('type', '')
        shape = node.get('shape', {})
        style = node.get('style', {})
        text_info = node.get('text', {})

        w = shape.get('width', 0)
        h = shape.get('height', 0)
        r = shape.get('r', None) # border radius

        raw_text = text_info.get('rawText', '')
        font_size = None
        font_family = None
        font_weight = None
        text_color = None

        if 'ranges' in text_info and len(text_info['ranges']) > 0:
            rng = text_info['ranges'][0]
            font_size = rng.get('fontSize')
            font_family = rng.get('fontFamily')
            font_weight = rng.get('fontStyle')
            if 'fill' in rng and 'color' in rng['fill']:
                text_color = get_color_str(rng['fill']['color'])

        fill_color = None
        if 'fill' in style and 'color' in style['fill']:
            fill_color = get_color_str(style['fill']['color'])

        stroke_color = None
        stroke_width = None
        if 'stroke' in style:
            stroke_width = style['stroke'].get('width')
            if 'color' in style['stroke']:
                stroke_color = get_color_str(style['stroke']['color'])

        rel_x = round(tx - origin_x, 2)
        rel_y = round(ty - origin_y, 2)

        elements.append({
            'name': name,
            'type': ntype,
            'x': rel_x,
            'y': rel_y,
            'w': round(w, 2) if w else 0,
            'h': round(h, 2) if h else 0,
            'radius': r,
            'text': raw_text.replace('\n', ' ').strip(),
            'fontSize': font_size,
            'fontFamily': font_family,
            'fontWeight': font_weight,
            'textColor': text_color,
            'fill': fill_color,
            'stroke': stroke_color,
            'strokeWidth': stroke_width
        })

        if 'children' in node:
            for child in node['children']:
                recurse(child, tx, ty)
        if 'group' in node and 'children' in node['group']:
            for child in node['group']['children']:
                recurse(child, tx, ty)

    for n in nodes:
        recurse(n)

    elements.sort(key=lambda e: (e['y'], e['x']))

    with open(output_txt, 'w', encoding='utf-8') as out:
        for el in elements:
            parts = [f"[{el['type']}] '{el['name']}' at ({el['x']}, {el['y']}) size ({el['w']}x{el['h']})"]
            if el['radius']:
                parts.append(f"radius={el['radius']}")
            if el['fill']:
                parts.append(f"fill={el['fill']}")
            if el['stroke']:
                parts.append(f"stroke={el['stroke']} (w={el['strokeWidth']})")
            if el['text']:
                parts.append(f"text='{el['text']}' fs={el['fontSize']} ff={el['fontFamily']} fw={el['fontWeight']} col={el['textColor']}")
            out.write(" | ".join(parts) + "\n")

    print(f"Dumped {len(elements)} elements to {output_txt}")

parse_xd_artboard('scratch/a4.json', 5432, 8843, 'scratch/a4_layout.txt')
parse_xd_artboard('scratch/a5.json', 7637, 8843, 'scratch/a5_layout.txt')
