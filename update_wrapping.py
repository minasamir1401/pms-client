import re

with open('src/app/view/[id]/CertificatePrintView.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add white-space: nowrap to field-label
c = c.replace('.print-page .field-label {\n', '.print-page .field-label {\n          white-space: nowrap !important;\n')

# 2. Add whitespace-nowrap to flex containers in the grid
c = c.replace('flex items-center gap-1"', 'flex items-center gap-1 whitespace-nowrap"')
c = c.replace('flex items-center gap-1 font-semibold"', 'flex items-center gap-1 font-semibold whitespace-nowrap"')

# 3. Add flex items-center to the manual P tags in declaration
c = c.replace('className="mr-3 text-[12pt] font-semibold m-0"', 'className="mr-3 text-[12pt] font-semibold m-0 flex items-center gap-1 whitespace-nowrap"')

with open('src/app/view/[id]/CertificatePrintView.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Done wrapping adjustments")
