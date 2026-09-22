import json

with open('scratch/a8_1.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

AB_X = 13956
AB_Y = 8843

def traverse(nodes, parent_x=0, parent_y=0):
    res = []
    for n in nodes:
        tf = n.get("transform", {})
        tx = parent_x + tf.get("tx", 0)
        ty = parent_y + tf.get("ty", 0)
        sx = round(tx - AB_X, 1)
        sy = round(ty - AB_Y, 1)
        name = n.get("name", "")
        ntype = n.get("type", "")
        shape = n.get("shape", {})
        style = n.get("style", {})
        
        fill = style.get("fill", {})
        fill_type = fill.get("type")
        fill_img = None
        if fill_type == "pattern":
            fill_img = fill.get("pattern", {}).get("meta", {}).get("ux", {}).get("uid")
        
        text = n.get("text", {}).get("rawText") if "text" in n else None
        font = style.get("font", {})
        stroke = style.get("stroke", {})
        
        res.append({
            "name": name,
            "type": ntype,
            "shape": shape,
            "x": sx,
            "y": sy,
            "text": text,
            "font": font,
            "fill_type": fill_type,
            "fill_img": fill_img,
            "stroke": stroke,
            "style": style
        })
        if "children" in n.get("group", {}):
            res.extend(traverse(n["group"]["children"], tx, ty))
    return res

items = traverse(d["children"][0].get("artboard", {}).get("children", []))

print("=== TOP CARD ELEMENTS (120 <= y <= 520, x < 1250) ===")
for it in sorted(items, key=lambda i: (i["y"], i["x"])):
    if it["x"] < 1250 and 120 <= it["y"] <= 520:
        print(f"y={it['y']:<6.1f} x={it['x']:<6.1f} | {it['name']:<20} | {it['type']:<8} | shape={it['shape']} | text='{it['text']}' | fill={it['fill_type']} {it['fill_img']} | stroke={it['stroke']}")

print("\n=== BOTTOM CARD ELEMENTS (530 <= y <= 940, x < 1250) ===")
for it in sorted(items, key=lambda i: (i["y"], i["x"])):
    if it["x"] < 1250 and 530 <= it["y"] <= 940:
        print(f"y={it['y']:<6.1f} x={it['x']:<6.1f} | {it['name']:<20} | {it['type']:<8} | shape={it['shape']} | text='{it['text']}' | font={it['font']} | stroke={it['stroke']}")

print("\n=== BUTTONS (y >= 940, x < 1250) ===")
for it in sorted(items, key=lambda i: (i["y"], i["x"])):
    if it["x"] < 1250 and it["y"] >= 940:
        print(f"y={it['y']:<6.1f} x={it['x']:<6.1f} | {it['name']:<20} | {it['type']:<8} | shape={it['shape']} | text='{it['text']}' | font={it['font']} | fill={it['fill_type']} | stroke={it['stroke']}")
