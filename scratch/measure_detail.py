from PIL import Image

im = Image.open('scratch/snap_detail.png')
w, h = im.size
print('Image size:', w, h)

# 1. Top Card border (#91b7ff = 145, 183, 255) at x = 100
top_card_y = []
for y in range(100, 530):
    r, g, b, *a = im.getpixel((100, y))
    if abs(r - 145) < 15 and abs(g - 183) < 15 and abs(b - 255) < 15:
        top_card_y.append(y)

top_card_x = []
for x in range(50, 1250):
    r, g, b, *a = im.getpixel((x, 150))
    # white inside
    if r > 250 and g > 250 and b > 250:
        top_card_x.append(x)

if top_card_y and top_card_x:
    print(f"Top Card (Profile): top={top_card_y[0]}, bottom={top_card_y[-1]}, height={top_card_y[-1]-top_card_y[0]+1}, left={top_card_x[0]-1}, right={top_card_x[-1]+1}, width={top_card_x[-1]-top_card_x[0]+3}")

# 2. Bottom Card (Career) at x = 100
bot_card_y = []
for y in range(530, 950):
    r, g, b, *a = im.getpixel((100, y))
    if abs(r - 145) < 15 and abs(g - 183) < 15 and abs(b - 255) < 15:
        bot_card_y.append(y)

bot_card_x = []
for x in range(50, 1250):
    r, g, b, *a = im.getpixel((x, 560))
    if r > 250 and g > 250 and b > 250:
        bot_card_x.append(x)

if bot_card_y and bot_card_x:
    print(f"Bottom Card (Career): top={bot_card_y[0]}, bottom={bot_card_y[-1]}, height={bot_card_y[-1]-bot_card_y[0]+1}, left={bot_card_x[0]-1}, right={bot_card_x[-1]+1}, width={bot_card_x[-1]-bot_card_x[0]+3}")

# Gap between cards
if top_card_y and bot_card_y:
    print(f"Gap between Top Card and Bottom Card: {bot_card_y[0] - top_card_y[-1] - 1}px (XD spec: 31px)")

# 3. LED Button (#3d7aef = 61, 122, 239)
led_btn_y = []
for y in range(940, 1060):
    r, g, b, *a = im.getpixel((500, y))
    if abs(r - 61) < 15 and abs(g - 122) < 15 and abs(b - 239) < 15:
        led_btn_y.append(y)

led_btn_x = []
for x in range(350, 800):
    r, g, b, *a = im.getpixel((x, 980))
    if abs(r - 61) < 15 and abs(g - 122) < 15 and abs(b - 239) < 15:
        led_btn_x.append(x)

if led_btn_y and led_btn_x:
    print(f"LED Button: top={led_btn_y[0]}, bottom={led_btn_y[-1]}, height={led_btn_y[-1]-led_btn_y[0]+1}, left={led_btn_x[0]}, right={led_btn_x[-1]}, width={led_btn_x[-1]-led_btn_x[0]+1}")

# 4. Back to List Button (#dae2f5 = 218, 226, 245)
back_btn_y = []
for y in range(940, 1060):
    r, g, b, *a = im.getpixel((1050, y))
    if abs(r - 218) < 15 and abs(g - 226) < 15 and abs(b - 245) < 15:
        back_btn_y.append(y)

back_btn_x = []
for x in range(950, 1200):
    r, g, b, *a = im.getpixel((x, 980))
    if abs(r - 218) < 15 and abs(g - 226) < 15 and abs(b - 245) < 15:
        back_btn_x.append(x)

if back_btn_y and back_btn_x:
    print(f"Back to List Button: top={back_btn_y[0]}, bottom={back_btn_y[-1]}, height={back_btn_y[-1]-back_btn_y[0]+1}, left={back_btn_x[0]}, right={back_btn_x[-1]}, width={back_btn_x[-1]-back_btn_x[0]+1}")

# 5. Right Sidebar Search Box
sb_y = []
for y in range(50, 250):
    r, g, b, *a = im.getpixel((1350, y))
    if abs(r - 16) < 15 and abs(g - 89) < 15 and abs(b - 228) < 15:
        sb_y.append(y)

sb_x = []
for x in range(1200, 1900):
    r, g, b, *a = im.getpixel((x, 150))
    if r > 250 and g > 250 and b > 250:
        sb_x.append(x)

if sb_y and sb_x:
    print(f"Sidebar Search Box: top={sb_y[0]}, bottom={sb_y[-1]}, left={sb_x[0]-3}, right={sb_x[-1]+3}")
