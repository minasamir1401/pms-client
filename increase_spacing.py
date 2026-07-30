import re

with open('src/app/view/[id]/CertificatePrintView.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Increase row gap for the main grids (Basic Data and Medical Examinations)
c = c.replace('gap-y-[10px] gap-x-1', 'gap-y-[15px] gap-x-1')

with open('src/app/view/[id]/CertificatePrintView.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Done increasing spacing")
