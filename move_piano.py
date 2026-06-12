with open('src/pages/EditorPage.jsx', 'r') as f:
    code = f.read()

code = code.replace('grid grid-cols-5 gap-3', 'grid grid-cols-4 gap-3')

vp_start = code.find('          {/* Virtual Piano - Ivory and Black keys */}')
vp_end_str = '</div>\n          </div>'
vp_end = code.find(vp_end_str, vp_start) + len(vp_end_str)

vp_code = code[vp_start:vp_end]
code = code[:vp_start] + code[vp_end:] # remove from old position

# Find where to insert
insert_target = '      {/* Bottom Panels - Fixed Height (5-column grid) */}'
insert_pos = code.find(insert_target)

# We wrap it in a border-t so it separates nicely from the canvas
new_vp_container = f'''      {{/* Virtual Piano Strip */}}
      <div className="flex-shrink-0 border-t border-[#2a2a2a] bg-black p-3 flex justify-center">
{vp_code.replace('          {/*', '        {/*')}
      </div>
'''

code = code[:insert_pos] + new_vp_container + "\n" + code[insert_pos:]

# Update the comment
code = code.replace('5-column grid', '4-column grid')

with open('src/pages/EditorPage.jsx', 'w') as f:
    f.write(code)

