import fitz
doc = fitz.open('d:/pj/m-h/وفاء شريف محمد.pdf')
page = doc[0]
for b in page.get_text('dict')['blocks']:
    if 'lines' in b:
        for l in b['lines']:
            for s in l['spans']:
                text = s['text'].strip()
                if text:
                    print(f"Y: {round(s['bbox'][1], 1)} | Height: {round(s['bbox'][3] - s['bbox'][1], 1)} | Text: {text}")
