import json

with open('scratch/a2.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

ab = data['children'][0]
ab_artboard = ab.get('artboard', {})
ab_children = ab_artboard.get('children', [])

def dump_tree(nodes, depth=0):
    indent = '  ' * depth
    for n in nodes:
        name = n.get('name', '')
        ntype = n.get('type', '')
        transform = n.get('transform', {})
        shape = n.get('shape', {})
        st = n.get('style', {})
        text_str = ''
        if 'text' in n:
            raw = n['text'].get('rawText', '').replace('\n', ' ')
            text_str = f" [Text: '{raw}']"
        tx = transform.get('tx', 0)
        ty = transform.get('ty', 0)
        w = shape.get('width', '')
        h = shape.get('height', '')
        size_str = f" [tx={tx}, ty={ty}, w={w}, h={h}]" if (tx or ty or w or h) else ''
        print(f"{indent}- {name} ({ntype}){size_str}{text_str}")
        if 'children' in n:
            dump_tree(n['children'], depth + 1)
        if 'group' in n and 'children' in n['group']:
            dump_tree(n['group']['children'], depth + 1)

dump_tree(ab_children)
