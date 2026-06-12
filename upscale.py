import re

with open('src/pages/EditorPage.jsx', 'r') as f:
    code = f.read()

# Transport Width
code = code.replace('w-56 flex-shrink-0', 'w-72 flex-shrink-0')

# Transport Buttons
code = code.replace('w-7 h-7 rounded-full', 'w-10 h-10 rounded-full text-base')
code = code.replace('w-8 h-8 rounded-full', 'w-12 h-12 rounded-full text-xl')

# Font sizes
code = code.replace('text-[8px]', 'text-[11px]')
code = code.replace('text-[9px]', 'text-xs')
code = code.replace('text-[10px]', 'text-sm')
code = code.replace('text-xs', 'text-sm')
code = code.replace('text-sm', 'text-base')

# The LCD
code = code.replace('text-lg font-bold text-[#D4C5A9]', 'text-2xl font-bold text-[#D4C5A9]')

# Mixer buttons
code = code.replace('w-5 h-5 rounded', 'w-7 h-7 rounded text-xs')

# Virtual Piano Keys
code = code.replace('w-7 h-10 rounded-sm', 'w-10 h-16 rounded-md')

# Some spacing
code = code.replace('py-0.5', 'py-1.5')
code = code.replace('py-1', 'py-2')

with open('src/pages/EditorPage.jsx', 'w') as f:
    f.write(code)
