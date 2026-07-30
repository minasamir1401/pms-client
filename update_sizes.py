import sys
import re

with open('src/app/view/[id]/CertificatePrintView.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Hide title
c = c.replace('className="absolute left-1/2"', 'className="hidden absolute left-1/2"')

# 2. Reset text sizes
c = c.replace('text-[12px]', 'text-[12pt]')
c = c.replace('text-[10px]', 'text-[12pt]')
c = c.replace('text-[9.5px]', 'text-[12pt]')
c = c.replace('text-[9px]', 'text-[12pt]')
c = c.replace('text-lg', 'text-[13.5pt]')

# 3. InnerClass (Labels normal, values bold)
# It's currently: const innerClass = "mr-3 text-[12pt] font-cairo m-0 flex items-center gap-1 font-semibold";
c = c.replace('const innerClass = "mr-3 text-[12pt] font-cairo m-0 flex items-center gap-1 font-semibold";', 
              'const innerClass = "mr-3 text-[12pt] font-cairo m-0 flex items-center gap-1";')

c = c.replace('const innerClass = "mr-3 text-[9px] font-cairo m-0 flex items-center gap-1 font-semibold";', 
              'const innerClass = "mr-3 text-[12pt] font-cairo m-0 flex items-center gap-1";')

# 4. Values should be bold
c = c.replace('"font-normal whitespace-nowrap"', '"font-bold whitespace-nowrap"')
c = c.replace('"font-semibold font-mono"', '"font-bold font-mono"')
c = c.replace('"font-semibold"', '"font-bold"')
c = c.replace('"font-bold"', '"font-bold text-[12pt]"')

# Fix nested issue from replacing font-bold to font-bold text-[12pt] where it might duplicate
c = c.replace('font-bold text-[12pt] text-[12pt]', 'font-bold text-[12pt]')
c = c.replace('font-bold text-[12pt] whitespace-nowrap', 'font-bold whitespace-nowrap text-[12pt]')
c = c.replace('font-bold text-[12pt] font-mono', 'font-bold font-mono text-[12pt]')

# 5. Fix specific elements
# Khatm
c = c.replace('ختم شعار الجمهورية</span>', 'ختم شعار الجمهورية</span>') # Re-locate the exact tag if needed
c = re.sub(r'className="[^"]*ختم شعار الجمهورية"', 'className="font-normal mt-1 text-[10.5pt]">ختم شعار الجمهورية"', c)
c = c.replace('<span className="font-bold text-[12pt] mt-1 text-[12pt]">ختم شعار الجمهورية</span>', '<span className="font-normal mt-1 text-[10.5pt]">ختم شعار الجمهورية</span>')


# Hb Electrophoresis text
c = c.replace('<b>Normal</b></label>', '<b>Normal</b></label>').replace('text-[12pt]"><b', 'text-[13.5pt]"><b')

# 6. Global CSS overrides: remove font-weight and scaling to let Tailwind handle it perfectly
c = re.sub(r'font-weight:\s*[^!]*!important;', '/* font-weight removed */', c)
c = re.sub(r'font-size:\s*\$\{fontSize[^\}]*\}[^!]*!important;', '/* font-size removed */', c)
c = re.sub(r'font-size:\s*calc\([^\)]*\)[^!]*!important;', '/* font-size removed */', c)

# 7. Add specific styling for field-label if needed
c = c.replace('.print-page .field-label {', '.print-page .field-label {\n          font-weight: 400 !important;\n          font-size: 12pt !important;')

with open('src/app/view/[id]/CertificatePrintView.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Done")
