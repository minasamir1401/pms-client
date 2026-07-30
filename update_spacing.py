import re

with open('src/app/view/[id]/CertificatePrintView.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Remove section-block class
c = c.replace('section-block ', '')

# 2. Header row
c = c.replace('flex justify-between items-start relative mt-4', 'flex justify-between items-start relative pt-2')

# 3. First info row (Date, Unit, Gov)
c = c.replace('className="grid grid-cols-10 gap-2 mb-4" style={{ paddingTop: \'20px\' }}', 'className="grid grid-cols-10 gap-2 mb-2 mt-4"')

# 4. Grid gaps for data sections
# Replace grid-gap-dynamic with gap-y-[10px] gap-x-2
c = c.replace('grid-gap-dynamic', 'gap-y-[10px] gap-x-1')

# 5. Fix titles margin
c = c.replace('text-[13.5pt] font-bold text-black mb-1', 'text-[13.5pt] font-bold text-black mb-1 mt-2')

# 6. Reduce paddings/margins in innerClass if any
# innerClass is "mr-3 text-[12pt] font-cairo m-0 flex items-center gap-1"
# It's fine.

# 7. Check page padding. The main container is:
# className="print-page bg-white text-black shadow-xl flex flex-col"
# Wait, print-page padding is controlled by `paddingX` and `paddingY` sliders!
# Let's override paddingX and paddingY in state initialization to match PDF.
# PDF padding looks like 10mm (about 40px).
c = c.replace('useState(certificate.paddingX ?? 10)', 'useState(10)')
c = c.replace('useState(certificate.paddingY ?? 10)', 'useState(10)')

# Let's just hardcode the style for print-page padding to ensure exactness.
# In CertificatePrintView.tsx, padding is applied dynamically:
# <style jsx global>{`
#   .print-page { padding: ${paddingY}mm ${paddingX}mm !important; }
# `}</style>
c = c.replace('padding: ${paddingY}mm ${paddingX}mm !important;', 'padding: 10mm 15mm !important;')

# 8. Check any other big margins
c = c.replace('gap-[60px]', 'gap-[40px]') # For Hb Electrophoresis items
c = c.replace('mb-3', 'mb-1') # For Hb Electrophoresis columns

# 9. In the declaration grid
c = c.replace('pt-1 flex flex-col gap-1', 'flex flex-col gap-1')
c = c.replace('mt-2', 'mt-1') # Reduce some bottom margins

with open('src/app/view/[id]/CertificatePrintView.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Done spacing adjustments")
