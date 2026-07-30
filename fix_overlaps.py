import re

with open('src/app/view/[id]/CertificatePrintView.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Remove whitespace-nowrap from the outer P wrapper so long text can wrap downwards inside its column without overlapping
c = c.replace('const innerClass = "mr-3 text-[12pt] font-cairo m-0 flex items-center gap-1 whitespace-nowrap";', 
              'const innerClass = "mr-3 text-[12pt] font-cairo m-0 flex items-center gap-1";')

# 2. Allow long text values to wrap (remove whitespace-nowrap from values)
# The full name
c = c.replace('renderEditableField("fullName", "text", "font-bold whitespace-nowrap text-[12pt]"', 'renderEditableField("fullName", "text", "font-bold text-[12pt]"')
c = c.replace('renderEditableField("fullName", "text", "font-bold whitespace-nowrap"', 'renderEditableField("fullName", "text", "font-bold text-[12pt]"')

# The addresses
c = c.replace('renderEditableField("idAddress", "text", "font-bold whitespace-nowrap text-[12pt]"', 'renderEditableField("idAddress", "text", "font-bold text-[12pt]"')
c = c.replace('renderEditableField("idAddress", "text", "font-bold whitespace-nowrap"', 'renderEditableField("idAddress", "text", "font-bold text-[12pt]"')

c = c.replace('renderEditableField("maritalAddress", "text", "font-bold whitespace-nowrap text-[12pt]"', 'renderEditableField("maritalAddress", "text", "font-bold text-[12pt]"')
c = c.replace('renderEditableField("maritalAddress", "text", "font-bold whitespace-nowrap"', 'renderEditableField("maritalAddress", "text", "font-bold text-[12pt]"')

# 3. Add more space below the declaration title
c = c.replace('text-[13.5pt] font-semibold text-black mb-1 mt-2', 'text-[13.5pt] font-semibold text-black mb-3 mt-4 leading-normal')

# 4. Increase vertical gap between the declaration lines
c = c.replace('col-span-4 flex flex-col gap-1', 'col-span-4 flex flex-col gap-3')

# 5. Make sure the p tag wrapper for declaration lines allows flex-wrap if needed or just remove whitespace-nowrap
c = c.replace('className="mr-3 text-[12pt] font-semibold m-0 flex items-center gap-1 whitespace-nowrap"', 'className="mr-3 text-[12pt] font-semibold m-0 flex items-center gap-1"')

with open('src/app/view/[id]/CertificatePrintView.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Done fixing overlaps and spacing")
