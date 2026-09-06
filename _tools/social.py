from pathlib import Path
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parent.parent
W, H = 1200, 630
PAPER = (247, 243, 237)
TEXTURE_OPACITY = 0.72
MARGIN = 24

paper = Image.new("RGB", (W, H), PAPER)
texture = Image.open(ROOT / "assets/img/decor/paper.webp").convert("RGB")
texture = texture.resize((W, round(texture.height * W / texture.width)), Image.LANCZOS)
tiled = Image.new("RGB", (W, H))
for y in range(0, H, texture.height):
    tiled.paste(texture, (0, y))
paper = Image.blend(paper, ImageChops.multiply(paper, tiled), TEXTURE_OPACITY)

art = Image.open(ROOT / "assets/img/purrfect-fit/keyart.webp").convert("RGBA")
scale = min((W - 2 * MARGIN) / art.width, (H - 2 * MARGIN) / art.height)
art = art.resize((round(art.width * scale), round(art.height * scale)), Image.LANCZOS)
paper.paste(art, ((W - art.width) // 2, (H - art.height) // 2), art)
paper.save(ROOT / "assets/img/brand/social.jpg", quality=88, optimize=True, progressive=True)
print(ROOT / "assets/img/brand/social.jpg", paper.size)
