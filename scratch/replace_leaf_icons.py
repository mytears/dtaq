import re

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

in_leaf = False
replaced = 0
new_lines = []

for line in lines:
    if 'class="tree-leaf-item"' in line:
        in_leaf = True
    elif '</div>' in line and in_leaf:
        in_leaf = False
    
    if in_leaf and 'src="images/ico_org_2.svg"' in line:
        line = line.replace('src="images/ico_org_2.svg"', 'src="images/ico_org_3.svg"')
        replaced += 1
        
    new_lines.append(line)

with open('index.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print(f"Replaced {replaced} instances of ico_org_2.svg in tree-leaf-item with ico_org_3.svg")
