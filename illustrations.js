/* ════════════════════════════════════════════════════════════════════
   ILUSTRACIONES SVG — GRABADO BOTÁNICO CHILENO  v2.0
   Escenas completas, estilo enciclopedia medicinal siglo XIX.
   Monocromáticas (currentColor). viewBox="0 0 280 180"
   ════════════════════════════════════════════════════════════════════ */

const ILLUSTRATIONS = {

// ── INFUSIÓN — taza cerámica con hierba y vapor ──
infusion: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <ellipse cx="140" cy="152" rx="62" ry="9" stroke-width="1.2" opacity="0.5"/>
  <path d="M80 152 Q82 160 140 163 Q198 160 200 152" stroke-width="0.7" opacity="0.3"/>
  <path d="M98 96 Q93 134 97 144 Q109 156 140 156 Q171 156 183 144 Q187 134 182 96" stroke-width="1.9"/>
  <ellipse cx="140" cy="96" rx="42" ry="7.5" stroke-width="1.6"/>
  <ellipse cx="140" cy="96" rx="37" ry="5.5" stroke-width="0.7" opacity="0.4"/>
  <path d="M182 110 Q212 110 212 128 Q212 146 182 135" stroke-width="1.9"/>
  <line x1="172" y1="102" x2="177" y2="147" stroke-width="0.5" opacity="0.28"/>
  <line x1="166" y1="100" x2="171" y2="149" stroke-width="0.5" opacity="0.25"/>
  <line x1="178" y1="107" x2="181" y2="142" stroke-width="0.5" opacity="0.22"/>
  <line x1="160" y1="98" x2="163" y2="150" stroke-width="0.5" opacity="0.18"/>
  <path d="M119 83 Q112 67 120 51 Q127 38 119 24" stroke-width="1.1" opacity="0.42"/>
  <path d="M140 81 Q133 65 141 49 Q149 36 140 21" stroke-width="1.3" opacity="0.55"/>
  <path d="M161 83 Q154 67 162 51 Q169 38 161 24" stroke-width="1.1" opacity="0.42"/>
  <path d="M54 86 Q80 74 110 90" stroke-width="1.5" opacity="0.8"/>
  <path d="M63 80 Q59 68 72 65 Q85 62 82 75 Q79 85 63 80 Z" stroke-width="1.1" opacity="0.75"/>
  <path d="M66 76 Q74 70 80 73" stroke-width="0.6" opacity="0.4"/>
  <path d="M67 73 Q72 69 78 71" stroke-width="0.5" opacity="0.35"/>
  <path d="M67 70 Q70 67 75 68" stroke-width="0.4" opacity="0.3"/>
  <path d="M82 76 Q79 64 92 61 Q105 59 101 72 Q98 82 82 76 Z" stroke-width="1.1" opacity="0.75"/>
  <path d="M85 72 Q93 66 100 69" stroke-width="0.6" opacity="0.4"/>
  <path d="M86 69 Q92 65 98 67" stroke-width="0.5" opacity="0.35"/>
  <circle cx="60" cy="88" r="2.2" fill="currentColor" opacity="0.45"/>
  <circle cx="68" cy="91" r="1.6" fill="currentColor" opacity="0.35"/>
  <circle cx="56" cy="84" r="1.3" fill="currentColor" opacity="0.3"/>
  <path d="M197 120 Q193 110 202 107 Q211 104 212 114 Q212 124 197 120 Z" stroke-width="0.9" opacity="0.52"/>
  <path d="M199 107 Q205 101 212 105" stroke-width="0.5" opacity="0.35"/>
  <path d="M208 138 Q204 128 213 125 Q222 122 223 132 Q222 142 208 138 Z" stroke-width="0.9" opacity="0.48"/>
  <path d="M210 125 Q216 119 222 123" stroke-width="0.5" opacity="0.35"/>
  <path d="M218 108 Q215 102 221 100 Q227 98 227 105 Q227 112 218 108 Z" stroke-width="0.8" opacity="0.4"/>
</svg>`,

// ── DECOCCIÓN — olla de barro con fuego y hierbas ──
decoccion: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M113 168 Q107 152 116 141 Q112 131 120 125 Q117 148 132 147 Q141 132 135 117 Q148 131 145 147 Q155 143 151 128 Q159 139 155 158 Q150 170 133 172 Q116 170 113 168 Z" stroke-width="1.1" opacity="0.6" fill="currentColor" style="fill-opacity:0.05"/>
  <path d="M78 104 L84 157 Q87 168 132 170 Q177 168 180 157 L186 104 Z" stroke-width="2"/>
  <ellipse cx="132" cy="104" rx="54" ry="9.5" stroke-width="1.8"/>
  <ellipse cx="132" cy="95" rx="52" ry="8" stroke-width="1.5"/>
  <ellipse cx="132" cy="91" rx="20" ry="4.5" stroke-width="1.2"/>
  <path d="M125 91 Q132 87 139 91" stroke-width="1"/>
  <path d="M78 116 Q62 116 62 130 Q62 144 78 137" stroke-width="1.9"/>
  <path d="M186 116 Q202 116 202 130 Q202 144 186 137" stroke-width="1.9"/>
  <line x1="173" y1="114" x2="175" y2="160" stroke-width="0.5" opacity="0.24"/>
  <line x1="168" y1="111" x2="170" y2="162" stroke-width="0.5" opacity="0.22"/>
  <line x1="178" y1="117" x2="179" y2="156" stroke-width="0.5" opacity="0.2"/>
  <path d="M113 99 Q119 92 126 99" stroke-width="0.9" opacity="0.55"/>
  <path d="M139 99 Q145 91 152 99" stroke-width="0.9" opacity="0.5"/>
  <path d="M107 88 Q100 71 109 56 Q116 43 108 28" stroke-width="1.1" opacity="0.42"/>
  <path d="M132 85 Q125 68 133 52 Q141 39 132 24" stroke-width="1.2" opacity="0.52"/>
  <path d="M157 88 Q150 71 159 56 Q166 43 158 28" stroke-width="1.1" opacity="0.42"/>
  <path d="M208 128 Q220 112 214 97" stroke-width="1.3" opacity="0.65"/>
  <path d="M211 122 Q204 114 211 107 Q218 100 221 108 Q223 116 211 122 Z" stroke-width="0.9" opacity="0.6"/>
  <path d="M210 108 Q203 100 210 93 Q217 86 219 94 Q221 102 210 108 Z" stroke-width="0.9" opacity="0.58"/>
  <path d="M213 93 Q218 87 224 90" stroke-width="0.5" opacity="0.4"/>
  <path d="M52 152 Q63 140 69 152 Q75 162 68 172" stroke-width="1" opacity="0.5"/>
  <path d="M52 152 Q49 162 57 172" stroke-width="0.8" opacity="0.4"/>
  <path d="M60 152 Q62 162 58 172" stroke-width="0.7" opacity="0.38"/>
  <path d="M70 152 Q74 159 69 172" stroke-width="0.7" opacity="0.35"/>
</svg>`,

// ── JARABE — botella apotecaria con miel y hierbas ──
jarabe: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M120 38 Q118 32 122 28 L158 28 Q162 32 160 38 L160 50 Q168 58 172 80 L172 155 Q172 165 150 167 Q128 165 108 167 Q86 165 86 155 L86 80 Q90 58 120 50 Z" stroke-width="1.9"/>
  <path d="M118 38 L162 38" stroke-width="1.5" opacity="0.8"/>
  <ellipse cx="140" cy="155" rx="30" ry="5" stroke-width="0.8" opacity="0.35"/>
  <line x1="162" y1="85" x2="162" y2="150" stroke-width="0.5" opacity="0.28"/>
  <line x1="158" y1="82" x2="158" y2="153" stroke-width="0.5" opacity="0.24"/>
  <line x1="165" y1="90" x2="165" y2="148" stroke-width="0.5" opacity="0.2"/>
  <path d="M86 110 Q129 106 172 110" stroke-width="0.8" opacity="0.4"/>
  <path d="M88 130 Q129 126 170 130" stroke-width="0.7" opacity="0.35"/>
  <path d="M98 90 Q105 80 115 86 Q108 94 98 90" stroke-width="0.8" opacity="0.55"/>
  <path d="M110 75 Q119 66 130 73 Q122 81 110 75" stroke-width="0.8" opacity="0.5"/>
  <path d="M125 140 Q132 130 140 136 Q133 144 125 140" stroke-width="0.8" opacity="0.45"/>
  <path d="M134 62 Q140 55 146 62 Q148 72 140 75 Q132 72 134 62 Z" stroke-width="0.9" opacity="0.5"/>
  <path d="M122 28 L158 28 L155 18 Q153 12 140 10 Q127 12 125 18 Z" stroke-width="1.5" opacity="0.9"/>
  <path d="M131 18 L149 18" stroke-width="2" opacity="0.7"/>
  <path d="M194 65 Q200 55 198 42" stroke-width="1.3" opacity="0.7"/>
  <path d="M196 95 Q192 118 198 140 Q200 152 196 160" stroke-width="1" opacity="0.55"/>
  <path d="M196 95 Q205 95 207 102 Q209 114 196 118" stroke-width="1.2" opacity="0.55"/>
  <path d="M196 95 Q196 62 198 42" stroke-width="1.3" opacity="0.65"/>
  <path d="M196 62 Q194 55 198 50 Q206 48 208 55 Q209 65 196 62" stroke-width="1" opacity="0.5"/>
  <path d="M196 160 Q195 170 200 174 Q204 174 200 164" stroke-width="0.9" opacity="0.5"/>
  <path d="M200 164 Q203 172 207 168 Q205 162 200 164" stroke-width="0.8" opacity="0.45"/>
  <path d="M207 168 Q212 176 215 171 Q211 162 207 168" stroke-width="0.8" opacity="0.4"/>
  <path d="M62 85 Q75 68 80 88" stroke-width="1.2" opacity="0.7"/>
  <path d="M64 80 Q60 70 68 66 Q76 63 76 74 Q76 82 64 80 Z" stroke-width="0.9" opacity="0.6"/>
  <path d="M66 77 Q72 72 75 74" stroke-width="0.5" opacity="0.38"/>
  <path d="M74 75 Q68 66 75 62 Q82 59 82 68 Q82 75 74 75 Z" stroke-width="0.9" opacity="0.58"/>
</svg>`,

// ── CATAPLASMA — mortero con hierbas machacadas y hoja ──
cataplasma: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M88 125 Q84 105 86 90 Q92 75 130 73 Q168 73 174 90 Q176 105 172 125 Q165 148 130 150 Q95 148 88 125 Z" stroke-width="1.9"/>
  <ellipse cx="130" cy="73" rx="44" ry="10" stroke-width="1.6"/>
  <path d="M75 150 Q130 158 185 150" stroke-width="1.2" opacity="0.55"/>
  <ellipse cx="130" cy="73" rx="39" ry="7" stroke-width="0.8" opacity="0.4"/>
  <line x1="166" y1="80" x2="168" y2="142" stroke-width="0.5" opacity="0.28"/>
  <line x1="161" y1="78" x2="163" y2="145" stroke-width="0.5" opacity="0.25"/>
  <line x1="171" y1="85" x2="172" y2="138" stroke-width="0.5" opacity="0.22"/>
  <path d="M100 90 Q112 82 126 88 Q112 96 100 90" stroke-width="0.8" opacity="0.5"/>
  <path d="M118 100 Q132 92 148 98 Q133 107 118 100" stroke-width="0.8" opacity="0.48"/>
  <path d="M108 112 Q120 104 136 111 Q122 120 108 112" stroke-width="0.8" opacity="0.45"/>
  <path d="M165 30 Q158 75 130 72" stroke-width="1.6" opacity="0.8"/>
  <ellipse cx="168" cy="26" rx="12" ry="6" stroke-width="1.4" opacity="0.9"/>
  <path d="M162 26 Q168 22 174 26" stroke-width="0.8" opacity="0.6"/>
  <path d="M164 30 Q168 34 172 30" stroke-width="0.7" opacity="0.5"/>
  <path d="M42 130 Q38 110 55 100 Q85 88 100 110 Q110 130 85 148 Q58 158 42 130 Z" stroke-width="1.3" opacity="0.7"/>
  <path d="M68 100 L68 148" stroke-width="0.6" opacity="0.4"/>
  <path d="M68 105 Q56 112 52 125" stroke-width="0.5" opacity="0.35"/>
  <path d="M68 112 Q58 118 55 130" stroke-width="0.5" opacity="0.32"/>
  <path d="M68 119 Q60 124 58 134" stroke-width="0.5" opacity="0.3"/>
  <path d="M68 126 Q62 130 61 139" stroke-width="0.5" opacity="0.28"/>
  <path d="M68 105 Q80 110 84 122" stroke-width="0.5" opacity="0.35"/>
  <path d="M68 113 Q79 116 83 128" stroke-width="0.5" opacity="0.32"/>
  <path d="M68 121 Q78 124 80 134" stroke-width="0.5" opacity="0.3"/>
  <path d="M205 110 Q218 95 215 75" stroke-width="1.2" opacity="0.7"/>
  <path d="M208 102 Q201 93 209 86 Q217 80 220 89 Q222 98 208 102 Z" stroke-width="0.9" opacity="0.6"/>
  <path d="M210 87 Q218 80 223 85" stroke-width="0.5" opacity="0.38"/>
  <path d="M208 88 Q202 79 209 72 Q216 66 218 74 Q220 82 208 88 Z" stroke-width="0.9" opacity="0.58"/>
  <path d="M210 72 Q217 65 222 70" stroke-width="0.5" opacity="0.35"/>
  <path d="M215 74 Q220 67 225 72" stroke-width="0.5" opacity="0.32"/>
  <circle cx="200" cy="145" r="2.5" fill="currentColor" opacity="0.45"/>
  <circle cx="210" cy="150" r="1.8" fill="currentColor" opacity="0.38"/>
  <circle cx="218" cy="140" r="2" fill="currentColor" opacity="0.4"/>
</svg>`,

// ── BAÑO HERBAL — tina de madera con flores flotando ──
bano: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M45 100 Q45 80 140 75 Q235 80 235 100 L235 145 Q235 170 140 172 Q45 170 45 145 Z" stroke-width="1.9"/>
  <ellipse cx="140" cy="100" rx="95" ry="18" stroke-width="1.6"/>
  <ellipse cx="140" cy="100" rx="88" ry="14" stroke-width="0.8" opacity="0.45"/>
  <line x1="75" y1="100" x2="75" y2="165" stroke-width="0.6" opacity="0.3"/>
  <line x1="105" y1="97" x2="105" y2="168" stroke-width="0.6" opacity="0.28"/>
  <line x1="175" y1="97" x2="175" y2="168" stroke-width="0.6" opacity="0.28"/>
  <line x1="205" y1="100" x2="205" y2="165" stroke-width="0.6" opacity="0.3"/>
  <path d="M85 156 Q105 160 140 162 Q175 160 195 156" stroke-width="0.6" opacity="0.25"/>
  <ellipse cx="120" cy="102" rx="14" ry="6" stroke-width="1" opacity="0.6"/>
  <path d="M112 100 Q120 96 128 100 Q124 104 120 106 Q116 104 112 100" stroke-width="0.7" opacity="0.45"/>
  <ellipse cx="162" cy="98" rx="11" ry="5" stroke-width="0.9" opacity="0.55"/>
  <path d="M157 97 Q162 93 167 97 Q164 101 162 103 Q160 101 157 97" stroke-width="0.7" opacity="0.42"/>
  <path d="M96 104 Q92 96 100 92 Q108 88 110 97 Q108 104 96 104 Z" stroke-width="1" opacity="0.62"/>
  <path d="M103 92 L100 104" stroke-width="0.5" opacity="0.38"/>
  <path d="M100 92 Q97 98 103 101" stroke-width="0.4" opacity="0.32"/>
  <path d="M178 102 Q174 94 182 90 Q190 86 192 95 Q190 103 178 102 Z" stroke-width="1" opacity="0.58"/>
  <path d="M185 90 L182 102" stroke-width="0.5" opacity="0.36"/>
  <path d="M142 105 Q140 98 146 95 Q152 93 153 99 Q153 106 142 105 Z" stroke-width="0.9" opacity="0.55"/>
  <path d="M89 90 Q83 74 91 60 Q97 48 90 34" stroke-width="1" opacity="0.4"/>
  <path d="M112 84 Q106 68 114 54 Q120 42 113 28" stroke-width="0.9" opacity="0.35"/>
  <path d="M168 84 Q162 68 170 54 Q176 42 169 28" stroke-width="0.9" opacity="0.35"/>
  <path d="M40 118 Q30 118 28 132 Q28 150 42 148" stroke-width="1.5" opacity="0.7"/>
  <path d="M240 118 Q250 118 252 132 Q252 150 238 148" stroke-width="1.5" opacity="0.7"/>
  <path d="M15 155 Q30 152 40 148" stroke-width="1.1" opacity="0.5"/>
  <path d="M15 162 Q28 158 40 155" stroke-width="0.7" opacity="0.35"/>
  <path d="M20 170 Q30 166 38 162" stroke-width="0.7" opacity="0.3"/>
</svg>`,

// ── TINTURA — frasco oscuro con gotero y hierbas maceradas ──
tintura: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M110 55 Q108 35 112 22 Q116 12 130 10 Q144 12 148 22 Q152 35 150 55 Q162 68 168 100 L168 158 Q168 170 130 171 Q92 170 92 158 L92 100 Q98 68 110 55 Z" stroke-width="1.9"/>
  <path d="M108 55 L152 55" stroke-width="1.4" opacity="0.75"/>
  <path d="M94 105 Q130 100 166 105" stroke-width="0.7" opacity="0.35"/>
  <line x1="160" y1="62" x2="160" y2="162" stroke-width="0.5" opacity="0.28"/>
  <line x1="156" y1="59" x2="156" y2="165" stroke-width="0.5" opacity="0.25"/>
  <line x1="164" y1="68" x2="164" y2="158" stroke-width="0.5" opacity="0.22"/>
  <line x1="148" y1="57" x2="148" y2="168" stroke-width="0.5" opacity="0.18"/>
  <line x1="96" y1="70" x2="94" y2="158" stroke-width="0.5" opacity="0.22"/>
  <line x1="100" y1="64" x2="98" y2="162" stroke-width="0.5" opacity="0.2"/>
  <line x1="104" y1="60" x2="102" y2="165" stroke-width="0.5" opacity="0.18"/>
  <path d="M108 120 Q114 110 122 118 Q114 128 108 120" stroke-width="0.8" opacity="0.5"/>
  <path d="M120 138 Q128 128 138 136 Q128 146 120 138" stroke-width="0.8" opacity="0.48"/>
  <path d="M138 108 Q146 99 155 107 Q146 116 138 108" stroke-width="0.8" opacity="0.45"/>
  <path d="M110 22 L150 22" stroke-width="0.7" opacity="0.6"/>
  <path d="M112 16 L148 16" stroke-width="0.7" opacity="0.5"/>
  <path d="M112 22 Q108 30 112 38 L148 38 Q152 30 148 22" stroke-width="1.2" opacity="0.8"/>
  <path d="M126 10 L134 10" stroke-width="1.8" opacity="0.7"/>
  <path d="M185 80 Q195 62 190 42" stroke-width="1.3" opacity="0.7"/>
  <path d="M188 75 Q181 66 188 58 Q195 51 198 60 Q200 69 188 75 Z" stroke-width="0.9" opacity="0.6"/>
  <path d="M190 59 Q196 52 202 57" stroke-width="0.5" opacity="0.38"/>
  <path d="M188 60 Q181 51 188 43 Q195 36 197 45 Q199 53 188 60 Z" stroke-width="0.9" opacity="0.58"/>
  <circle cx="196" cy="100" r="2.2" fill="currentColor" opacity="0.5"/>
  <circle cx="202" cy="112" r="1.7" fill="currentColor" opacity="0.42"/>
  <circle cx="194" cy="118" r="1.5" fill="currentColor" opacity="0.38"/>
  <path d="M70 110 Q78 95 74 78" stroke-width="1.2" opacity="0.65"/>
  <path d="M73 104 Q66 95 73 88 Q80 82 82 91 Q84 100 73 104 Z" stroke-width="0.9" opacity="0.58"/>
  <path d="M72 89 Q79 82 84 87" stroke-width="0.5" opacity="0.36"/>
  <path d="M73 90 Q66 81 73 74 Q80 68 82 76 Q83 84 73 90 Z" stroke-width="0.9" opacity="0.55"/>
</svg>`,

// ── UNGÜENTO — tarro abierto con bálsamo y flores ──
unguento: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M85 105 Q83 88 88 80 Q100 70 140 70 Q180 70 192 80 Q197 88 195 105 L195 148 Q195 165 140 167 Q85 165 85 148 Z" stroke-width="1.9"/>
  <ellipse cx="140" cy="105" rx="55" ry="10" stroke-width="1.6"/>
  <ellipse cx="140" cy="105" rx="50" ry="8" stroke-width="0.8" opacity="0.45"/>
  <path d="M96 108 Q118 115 140 114 Q162 115 184 108" stroke-width="0.9" opacity="0.5"/>
  <path d="M100 115 Q120 124 140 123 Q160 124 180 115" stroke-width="0.7" opacity="0.38"/>
  <path d="M105 124 Q122 132 140 131 Q158 132 175 124" stroke-width="0.7" opacity="0.32"/>
  <line x1="186" y1="110" x2="188" y2="158" stroke-width="0.5" opacity="0.26"/>
  <line x1="181" y1="108" x2="183" y2="160" stroke-width="0.5" opacity="0.23"/>
  <path d="M83 95 Q83 75 88 68 Q100 58 140 56 Q180 58 192 68 Q197 75 197 95" stroke-width="1.5" opacity="0.75"/>
  <ellipse cx="140" cy="56" rx="52" ry="9" stroke-width="1.4" opacity="0.8"/>
  <path d="M165 40 Q225 50 230 80" stroke-width="1.2" opacity="0.65"/>
  <path d="M180 30 Q170 38 165 40" stroke-width="1.2" opacity="0.65"/>
  <path d="M178 28 Q177 42 165 40" stroke-width="1" opacity="0.55"/>
  <circle cx="178" cy="25" r="4" stroke-width="1.1" opacity="0.6"/>
  <path d="M173 25 Q178 20 183 25" stroke-width="0.7" opacity="0.45"/>
  <path d="M43 130 Q50 115 58 125 Q56 140 46 148 Q38 140 43 130 Z" stroke-width="1.1" opacity="0.65"/>
  <path d="M50 115 L50 148" stroke-width="0.6" opacity="0.38"/>
  <path d="M50 120 Q44 125 43 132" stroke-width="0.5" opacity="0.33"/>
  <path d="M50 128 Q45 132 44 140" stroke-width="0.5" opacity="0.3"/>
  <path d="M50 136 Q47 139 46 145" stroke-width="0.5" opacity="0.28"/>
  <path d="M50 120 Q57 124 58 132" stroke-width="0.5" opacity="0.33"/>
  <path d="M50 128 Q56 131 57 138" stroke-width="0.5" opacity="0.3"/>
  <path d="M62 110 Q76 98 82 115 Q78 130 65 136 Q52 128 62 110 Z" stroke-width="1.1" opacity="0.62"/>
  <path d="M72 98 L70 136" stroke-width="0.6" opacity="0.35"/>
  <path d="M72 103 Q63 109 62 118" stroke-width="0.5" opacity="0.3"/>
  <path d="M72 111 Q65 116 63 124" stroke-width="0.5" opacity="0.28"/>
  <circle cx="52" cy="112" r="2.5" stroke-width="0.9" opacity="0.55"/>
  <circle cx="68" cy="95" r="2" stroke-width="0.9" opacity="0.52"/>
  <circle cx="44" cy="128" r="1.8" stroke-width="0.9" opacity="0.48"/>
</svg>`,

// ── VAPORES — cuenco con vapor dramático e hierbas ──
vapores: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M60 138 Q58 118 65 108 Q80 95 140 93 Q200 95 215 108 Q222 118 220 138 L215 155 Q200 168 140 170 Q80 168 65 155 Z" stroke-width="1.9"/>
  <ellipse cx="140" cy="138" rx="80" ry="14" stroke-width="1.6"/>
  <ellipse cx="140" cy="138" rx="73" ry="11" stroke-width="0.8" opacity="0.42"/>
  <ellipse cx="115" cy="140" rx="14" ry="5" stroke-width="0.8" opacity="0.55"/>
  <ellipse cx="162" cy="139" rx="11" ry="4" stroke-width="0.8" opacity="0.5"/>
  <path d="M130" y1="142" cx="138" cy="142" rx="8" ry="3" stroke-width="0.7" opacity="0.45"/>
  <line x1="205" y1="144" x2="208" y2="162" stroke-width="0.5" opacity="0.28"/>
  <line x1="199" y1="141" x2="202" y2="165" stroke-width="0.5" opacity="0.25"/>
  <path d="M88 130 Q80 100 90 60 Q96 38 86 18" stroke-width="1.4" opacity="0.48"/>
  <path d="M110 125 Q102 93 113 50 Q120 26 109 8" stroke-width="1.3" opacity="0.52"/>
  <path d="M140 122 Q132 90 143 46 Q150 22 140 4" stroke-width="1.5" opacity="0.58"/>
  <path d="M170 125 Q162 93 173 50 Q180 26 170 8" stroke-width="1.3" opacity="0.52"/>
  <path d="M192 130 Q184 100 195 60 Q202 38 192 18" stroke-width="1.4" opacity="0.48"/>
  <path d="M106 145 Q101 136 108 132 Q116 128 118 136 Q118 144 106 145 Z" stroke-width="0.9" opacity="0.55"/>
  <path d="M158 144 Q153 135 160 131 Q167 127 169 135 Q169 143 158 144 Z" stroke-width="0.9" opacity="0.52"/>
  <path d="M136 148 Q132 140 138 137 Q144 134 146 141 Q146 148 136 148 Z" stroke-width="0.8" opacity="0.48"/>
  <path d="M30 150 Q45 148 60 140" stroke-width="1.3" opacity="0.6"/>
  <path d="M28 162 Q44 158 60 150" stroke-width="0.8" opacity="0.38"/>
  <path d="M32 172 Q46 167 58 160" stroke-width="0.8" opacity="0.32"/>
</svg>`,

// ── ACEITE HERBAL — frasco redondo con hierbas sumergidas ──
aceite: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M130 22 Q130 10 140 8 Q150 10 150 22 L150 48 Q175 54 188 80 Q198 108 190 140 Q182 165 140 168 Q98 165 90 140 Q82 108 92 80 Q105 54 130 48 Z" stroke-width="1.9"/>
  <ellipse cx="140" cy="160" rx="35" ry="6" stroke-width="0.8" opacity="0.35"/>
  <line x1="180" y1="85" x2="182" y2="155" stroke-width="0.5" opacity="0.28"/>
  <line x1="175" y1="78" x2="177" y2="158" stroke-width="0.5" opacity="0.25"/>
  <line x1="185" y1="95" x2="186" y2="148" stroke-width="0.5" opacity="0.22"/>
  <line x1="170" y1="74" x2="172" y2="162" stroke-width="0.5" opacity="0.2"/>
  <line x1="96" y1="90" x2="94" y2="150" stroke-width="0.5" opacity="0.22"/>
  <line x1="101" y1="80" x2="99" y2="158" stroke-width="0.5" opacity="0.2"/>
  <path d="M96 120 Q140 113 184 120" stroke-width="0.7" opacity="0.38"/>
  <path d="M92 140 Q140 133 188 140" stroke-width="0.7" opacity="0.32"/>
  <path d="M108 90 Q116 80 126 88 Q116 98 108 90" stroke-width="0.9" opacity="0.55"/>
  <path d="M118 110 Q128 100 140 108 Q128 118 118 110" stroke-width="0.9" opacity="0.52"/>
  <path d="M138 80 Q148 70 158 78 Q148 88 138 80" stroke-width="0.9" opacity="0.5"/>
  <path d="M148 118 Q158 108 168 116 Q158 126 148 118" stroke-width="0.9" opacity="0.48"/>
  <path d="M104 132 Q114 122 124 130 Q114 140 104 132" stroke-width="0.8" opacity="0.45"/>
  <path d="M130 22 L150 22" stroke-width="1.6" opacity="0.8"/>
  <ellipse cx="140" cy="20" rx="12" ry="4" stroke-width="1.2" opacity="0.7"/>
  <path d="M205 100 Q220 92 218 75" stroke-width="1.2" opacity="0.7"/>
  <path d="M208 95 Q201 86 208 78 Q215 71 218 80 Q219 89 208 95 Z" stroke-width="0.9" opacity="0.6"/>
  <path d="M210 79 Q216 72 222 77" stroke-width="0.5" opacity="0.38"/>
  <path d="M208 80 Q201 71 208 63 Q215 56 217 65 Q219 73 208 80 Z" stroke-width="0.9" opacity="0.58"/>
  <path d="M210 64 Q216 57 222 62" stroke-width="0.5" opacity="0.35"/>
  <circle cx="218" cy="105" r="2.5" fill="currentColor" opacity="0.45"/>
  <circle cx="224" cy="115" r="1.8" fill="currentColor" opacity="0.38"/>
  <circle cx="215" cy="120" r="1.5" fill="currentColor" opacity="0.35"/>
  <path d="M56 108 Q68 96 64 78" stroke-width="1.2" opacity="0.7"/>
  <path d="M59 102 Q52 93 59 85 Q66 78 68 87 Q70 96 59 102 Z" stroke-width="0.9" opacity="0.6"/>
  <path d="M61 86 Q67 79 73 84" stroke-width="0.5" opacity="0.36"/>
</svg>`,

// ── COMPRESA — paño herbal con cuenco de agua ──
compresa: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M60 115 Q58 100 65 92 Q80 82 140 80 Q200 82 215 92 Q222 100 220 115 Q218 130 210 136 Q195 142 140 143 Q85 142 70 136 Q62 130 60 115 Z" stroke-width="1.8"/>
  <line x1="60" y1="108" x2="220" y2="108" stroke-width="0.7" opacity="0.38"/>
  <line x1="62" y1="100" x2="218" y2="100" stroke-width="0.6" opacity="0.3"/>
  <line x1="90" y1="82" x2="90" y2="143" stroke-width="0.5" opacity="0.25"/>
  <line x1="120" y1="80" x2="120" y2="143" stroke-width="0.5" opacity="0.22"/>
  <line x1="160" y1="80" x2="160" y2="143" stroke-width="0.5" opacity="0.22"/>
  <line x1="190" y1="82" x2="190" y2="143" stroke-width="0.5" opacity="0.25"/>
  <path d="M110 88 Q115 82 122 88 Q116 94 110 88" stroke-width="0.9" opacity="0.58"/>
  <path d="M148 86 Q154 80 162 86 Q155 92 148 86" stroke-width="0.9" opacity="0.55"/>
  <path d="M95 118 Q102 110 110 118 Q103 126 95 118" stroke-width="0.9" opacity="0.52"/>
  <path d="M170 120 Q177 112 185 120 Q178 128 170 120" stroke-width="0.9" opacity="0.5"/>
  <path d="M120 104 Q128 96 138 104 Q130 112 120 104" stroke-width="0.9" opacity="0.52"/>
  <path d="M152 106 Q160 98 170 106 Q162 114 152 106" stroke-width="0.9" opacity="0.5"/>
  <path d="M112 148 Q112 162 115 168" stroke-width="1" opacity="0.5"/>
  <path d="M130 148 Q130 164 133 170" stroke-width="1" opacity="0.48"/>
  <path d="M148 148 Q148 162 151 168" stroke-width="1" opacity="0.45"/>
  <path d="M108 168 Q140 175 175 168" stroke-width="1.3" opacity="0.55"/>
  <path d="M108 168 Q105 158 108 148" stroke-width="1" opacity="0.45"/>
  <path d="M175 168 Q178 158 175 148" stroke-width="1" opacity="0.45"/>
  <path d="M40 120 Q36 108 42 100 Q52 92 65 100 Q72 110 66 122 Q56 130 40 120 Z" stroke-width="1.1" opacity="0.65"/>
  <path d="M52 92 L52 122" stroke-width="0.6" opacity="0.38"/>
  <path d="M52 97 Q44 103 42 112" stroke-width="0.5" opacity="0.32"/>
  <path d="M52 105 Q46 109 44 118" stroke-width="0.5" opacity="0.3"/>
  <path d="M52 113 Q48 116 46 122" stroke-width="0.5" opacity="0.28"/>
  <path d="M52 97 Q59 102 62 110" stroke-width="0.5" opacity="0.32"/>
  <path d="M225 105 Q238 95 235 78" stroke-width="1.2" opacity="0.68"/>
  <path d="M228 98 Q221 89 228 82 Q235 75 238 84 Q239 93 228 98 Z" stroke-width="0.9" opacity="0.6"/>
  <path d="M229 83 Q236 76 241 81" stroke-width="0.5" opacity="0.36"/>
</svg>`,

// ── POLVO — mortero pesado con hierbas y polvo ──
polvo: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M80 100 Q78 82 85 72 Q100 58 140 56 Q180 58 195 72 Q202 82 200 100 L196 152 Q192 168 140 170 Q88 168 84 152 Z" stroke-width="2"/>
  <ellipse cx="140" cy="100" rx="60" ry="12" stroke-width="1.7"/>
  <ellipse cx="140" cy="100" rx="54" ry="9" stroke-width="0.9" opacity="0.42"/>
  <line x1="190" y1="106" x2="188" y2="155" stroke-width="0.5" opacity="0.28"/>
  <line x1="184" y1="104" x2="182" y2="158" stroke-width="0.5" opacity="0.25"/>
  <line x1="196" y1="110" x2="194" y2="150" stroke-width="0.5" opacity="0.22"/>
  <path d="M158 58 Q182 28 200 18" stroke-width="1.7" opacity="0.82"/>
  <ellipse cx="202" cy="15" rx="14" ry="7" stroke-width="1.5" opacity="0.9"/>
  <path d="M194 15 Q202 10 210 15" stroke-width="0.9" opacity="0.65"/>
  <path d="M196 18 Q202 23 208 18" stroke-width="0.8" opacity="0.55"/>
  <line x1="194" y1="14" x2="198" y2="20" stroke-width="0.5" opacity="0.4"/>
  <line x1="202" y1="8" x2="202" y2="14" stroke-width="0.5" opacity="0.4"/>
  <line x1="210" y1="14" x2="206" y2="20" stroke-width="0.5" opacity="0.4"/>
  <path d="M96 118 Q118 106 140 114 Q118 126 96 118" stroke-width="0.9" opacity="0.52"/>
  <path d="M104 136 Q128 124 152 132 Q128 144 104 136" stroke-width="0.9" opacity="0.48"/>
  <path d="M118 104 Q132 96 146 102 Q132 110 118 104" stroke-width="0.8" opacity="0.45"/>
  <path d="M44 148 Q55 130 68 148 Q65 165 52 170 Q39 165 44 148 Z" stroke-width="1.2" opacity="0.68"/>
  <path d="M56 130 L54 170" stroke-width="0.6" opacity="0.38"/>
  <path d="M56 135 Q48 142 46 152" stroke-width="0.5" opacity="0.32"/>
  <path d="M56 143 Q50 149 48 158" stroke-width="0.5" opacity="0.3"/>
  <path d="M56 151 Q52 155 51 163" stroke-width="0.5" opacity="0.28"/>
  <path d="M56 135 Q63 141 65 150" stroke-width="0.5" opacity="0.32"/>
  <path d="M56 143 Q62 148 64 156" stroke-width="0.5" opacity="0.3"/>
  <circle cx="40" cy="148" r="2" fill="currentColor" opacity="0.42"/>
  <circle cx="72" cy="148" r="2" fill="currentColor" opacity="0.38"/>
  <path d="M225 148 Q235 143 240 150 Q238 160 228 162 Q218 158 225 148 Z" stroke-width="0.9" opacity="0.58"/>
  <circle cx="225" cy="168" r="3" fill="currentColor" opacity="0.35"/>
  <circle cx="235" cy="165" r="2.2" fill="currentColor" opacity="0.32"/>
  <circle cx="215" cy="162" r="1.8" fill="currentColor" opacity="0.3"/>
</svg>`,

// ── BEBIDA HERBAL — jarra de barro con hierbas ──
bebida: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M100 48 Q98 36 102 28 L178 28 Q182 36 180 48 Q188 58 192 80 L192 152 Q192 165 140 167 Q88 165 88 152 L88 80 Q92 58 100 48 Z" stroke-width="1.9"/>
  <path d="M98 48 L182 48" stroke-width="1.5" opacity="0.78"/>
  <ellipse cx="140" cy="28" rx="40" ry="7" stroke-width="1.4" opacity="0.8"/>
  <path d="M90 100 Q140 94 190 100" stroke-width="0.7" opacity="0.36"/>
  <path d="M90 125 Q140 118 190 125" stroke-width="0.7" opacity="0.32"/>
  <line x1="182" y1="55" x2="182" y2="158" stroke-width="0.5" opacity="0.28"/>
  <line x1="177" y1="52" x2="177" y2="162" stroke-width="0.5" opacity="0.25"/>
  <line x1="187" y1="62" x2="186" y2="152" stroke-width="0.5" opacity="0.22"/>
  <path d="M192 88 Q215 88 218 104 Q220 120 195 118" stroke-width="1.8" opacity="0.82"/>
  <path d="M194 95 Q210 95 212 105 Q213 115 195 113" stroke-width="0.7" opacity="0.4"/>
  <path d="M108 72 Q116 62 126 70 Q116 80 108 72" stroke-width="0.9" opacity="0.55"/>
  <path d="M124 58 Q134 48 145 56 Q135 66 124 58" stroke-width="0.9" opacity="0.52"/>
  <path d="M150 66 Q160 56 170 64 Q160 74 150 66" stroke-width="0.9" opacity="0.5"/>
  <circle cx="110" cy="90" r="2.5" stroke-width="0.8" opacity="0.42"/>
  <circle cx="128" cy="84" r="2" stroke-width="0.8" opacity="0.38"/>
  <circle cx="155" cy="82" r="2.2" stroke-width="0.8" opacity="0.4"/>
  <circle cx="170" cy="90" r="1.8" stroke-width="0.8" opacity="0.36"/>
  <circle cx="140" cy="78" r="1.5" stroke-width="0.8" opacity="0.35"/>
  <path d="M55 110 Q65 96 72 112 Q68 128 56 132 Q44 126 55 110 Z" stroke-width="1.1" opacity="0.65"/>
  <path d="M63 96 L62 132" stroke-width="0.6" opacity="0.38"/>
  <path d="M63 101 Q55 107 54 116" stroke-width="0.5" opacity="0.32"/>
  <path d="M63 109 Q57 114 55 122" stroke-width="0.5" opacity="0.3"/>
  <path d="M63 117 Q59 120 58 127" stroke-width="0.5" opacity="0.28"/>
  <path d="M63 101 Q70 106 72 114" stroke-width="0.5" opacity="0.32"/>
</svg>`,

// ── RITUAL MAPUCHE — velas, manojos de hierbas y humo ──
ritual: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M95 155 L95 80 Q95 72 102 72 L118 72 Q125 72 125 80 L125 155 Z" stroke-width="1.7"/>
  <path d="M95 155 Q110 162 125 155" stroke-width="1" opacity="0.5"/>
  <line x1="100" y1="90" x2="100" y2="148" stroke-width="0.5" opacity="0.28"/>
  <line x1="106" y1="88" x2="106" y2="150" stroke-width="0.5" opacity="0.25"/>
  <line x1="112" y1="88" x2="112" y2="150" stroke-width="0.5" opacity="0.25"/>
  <line x1="118" y1="90" x2="118" y2="148" stroke-width="0.5" opacity="0.28"/>
  <path d="M110 72 Q106 60 112 50 Q118 40 110 32" stroke-width="1.2" opacity="0.55"/>
  <path d="M110 72 Q106 62 111 54 Q116 46 110 38" fill="currentColor" opacity="0.12" stroke-width="0.8"/>
  <path d="M145 158 L145 90 Q145 82 151 82 L163 82 Q169 82 169 90 L169 158 Z" stroke-width="1.6"/>
  <path d="M145 158 Q157 164 169 158" stroke-width="0.9" opacity="0.48"/>
  <line x1="149" y1="98" x2="149" y2="152" stroke-width="0.5" opacity="0.26"/>
  <line x1="155" y1="96" x2="155" y2="154" stroke-width="0.5" opacity="0.24"/>
  <line x1="161" y1="96" x2="161" y2="154" stroke-width="0.5" opacity="0.24"/>
  <line x1="165" y1="98" x2="165" y2="152" stroke-width="0.5" opacity="0.26"/>
  <path d="M157 82 Q153 70 159 60 Q165 50 157 42" stroke-width="1.1" opacity="0.52"/>
  <path d="M185 158 L185 105 Q185 98 191 98 L201 98 Q207 98 207 105 L207 158 Z" stroke-width="1.5"/>
  <path d="M185 158 Q196 163 207 158" stroke-width="0.9" opacity="0.45"/>
  <line x1="189" y1="112" x2="189" y2="152" stroke-width="0.5" opacity="0.24"/>
  <line x1="196" y1="110" x2="196" y2="154" stroke-width="0.5" opacity="0.22"/>
  <line x1="203" y1="112" x2="203" y2="152" stroke-width="0.5" opacity="0.24"/>
  <path d="M196 98 Q192 88 198 78 Q204 68 196 58" stroke-width="1" opacity="0.48"/>
  <path d="M42 162 L52 100 Q56 88 62 86 Q72 84 82 86 Q88 92 88 100 L78 162 Z" stroke-width="1.4" opacity="0.78"/>
  <path d="M44 162 Q60 170 76 162" stroke-width="0.9" opacity="0.5"/>
  <line x1="52" y1="108" x2="46" y2="155" stroke-width="0.6" opacity="0.35"/>
  <line x1="60" y1="100" x2="54" y2="155" stroke-width="0.6" opacity="0.32"/>
  <line x1="68" y1="96" x2="62" y2="158" stroke-width="0.6" opacity="0.32"/>
  <line x1="76" y1="100" x2="70" y2="158" stroke-width="0.6" opacity="0.35"/>
  <path d="M62 86 Q68 74 62 62 Q57 50 65 40 Q61 54 70 62 Q58 70 62 86" stroke-width="1.1" opacity="0.6"/>
  <path d="M52 100 Q62 92 72 100" stroke-width="0.7" opacity="0.4"/>
  <path d="M110 32 Q103 16 112 8 Q120 2 110 -4" stroke-width="0.9" opacity="0.4"/>
  <path d="M158 42 Q152 28 160 18 Q168 10 158 4" stroke-width="0.9" opacity="0.38"/>
  <path d="M196 58 Q190 44 198 34 Q206 26 196 18" stroke-width="0.8" opacity="0.36"/>
</svg>`,

// ── GÁRGARAS — vaso ancho con líquido herbal y burbujas ──
gargaras: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M80 55 Q78 44 84 36 L196 36 Q202 44 200 55 L196 158 Q193 170 140 171 Q87 170 84 158 Z" stroke-width="1.9"/>
  <ellipse cx="140" cy="55" rx="60" ry="10" stroke-width="1.6"/>
  <ellipse cx="140" cy="55" rx="54" ry="8" stroke-width="0.8" opacity="0.42"/>
  <path d="M82 100 Q140 93 198 100" stroke-width="0.7" opacity="0.35"/>
  <line x1="190" y1="62" x2="188" y2="160" stroke-width="0.5" opacity="0.27"/>
  <line x1="184" y1="60" x2="182" y2="163" stroke-width="0.5" opacity="0.24"/>
  <line x1="196" y1="66" x2="194" y2="155" stroke-width="0.5" opacity="0.21"/>
  <circle cx="108" cy="78" r="4.5" stroke-width="0.9" opacity="0.5"/>
  <circle cx="130" cy="70" r="3.5" stroke-width="0.9" opacity="0.48"/>
  <circle cx="152" cy="75" r="5" stroke-width="0.9" opacity="0.5"/>
  <circle cx="170" cy="68" r="3" stroke-width="0.9" opacity="0.45"/>
  <circle cx="118" cy="90" r="2.5" stroke-width="0.8" opacity="0.4"/>
  <circle cx="144" cy="86" r="3.5" stroke-width="0.8" opacity="0.42"/>
  <circle cx="165" cy="90" r="2.2" stroke-width="0.8" opacity="0.38"/>
  <path d="M100 118 Q108 108 118 116 Q108 126 100 118" stroke-width="0.9" opacity="0.55"/>
  <path d="M152 114 Q162 104 172 112 Q162 122 152 114" stroke-width="0.9" opacity="0.52"/>
  <path d="M128 136 Q136 126 146 134 Q138 144 128 136" stroke-width="0.9" opacity="0.5"/>
  <path d="M50 80 Q56 66 62 80" stroke-width="1.2" opacity="0.72"/>
  <path d="M51 76 Q47 66 54 62 Q62 58 63 68 Q62 76 51 76 Z" stroke-width="0.9" opacity="0.62"/>
  <path d="M54 62 Q60 56 66 61" stroke-width="0.5" opacity="0.38"/>
  <path d="M52 63 Q46 54 53 46 Q60 40 62 49 Q63 57 52 63 Z" stroke-width="0.9" opacity="0.58"/>
  <path d="M54 46 Q60 40 66 45" stroke-width="0.5" opacity="0.35"/>
  <path d="M218 100 Q226 86 222 70" stroke-width="1.2" opacity="0.68"/>
  <path d="M220 94 Q213 85 220 77 Q227 70 230 79 Q231 88 220 94 Z" stroke-width="0.9" opacity="0.6"/>
  <path d="M222 78 Q228 71 234 76" stroke-width="0.5" opacity="0.36"/>
</svg>`,

// ── GOTAS — frasco cuentagotas con drops ──
gotas: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M118 48 Q116 30 120 18 Q124 8 140 6 Q156 8 160 18 Q164 30 162 48 Q174 58 180 85 L180 152 Q180 168 140 169 Q100 168 100 152 L100 85 Q106 58 118 48 Z" stroke-width="1.9"/>
  <path d="M116 48 L164 48" stroke-width="1.5" opacity="0.78"/>
  <ellipse cx="140" cy="160" rx="28" ry="5" stroke-width="0.8" opacity="0.35"/>
  <line x1="172" y1="60" x2="170" y2="155" stroke-width="0.5" opacity="0.28"/>
  <line x1="167" y1="56" x2="165" y2="158" stroke-width="0.5" opacity="0.25"/>
  <line x1="177" y1="66" x2="175" y2="150" stroke-width="0.5" opacity="0.22"/>
  <path d="M104 110 Q140 103 176 110" stroke-width="0.7" opacity="0.36"/>
  <path d="M102 130 Q140 122 178 130" stroke-width="0.7" opacity="0.32"/>
  <path d="M114 85 Q122 74 132 82 Q122 92 114 85" stroke-width="0.9" opacity="0.55"/>
  <path d="M136 75 Q146 65 156 73 Q146 83 136 75" stroke-width="0.9" opacity="0.52"/>
  <path d="M120 6 L160 6 Q162 -2 158 -8 Q148 -14 140 -14 Q132 -14 122 -8 Q118 -2 120 6" stroke-width="1.4" opacity="0.82"/>
  <path d="M128 4 L152 4" stroke-width="1.8" opacity="0.7"/>
  <path d="M134 -6 L146 -6" stroke-width="1.2" opacity="0.55"/>
  <path d="M195 68 Q199 84 196 98" stroke-width="1.2" opacity="0.7"/>
  <path d="M197 80 Q195 86 197 92" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
  <path d="M198 92 Q198 102 194 108 Q192 114 196 118 Q200 114 200 108 Q202 102 198 92" stroke-width="1.1" opacity="0.65"/>
  <path d="M214 88 Q218 104 215 118" stroke-width="1.1" opacity="0.6"/>
  <path d="M216 100 Q214 106 216 112" stroke-width="1.8" stroke-linecap="round" opacity="0.62"/>
  <path d="M217 112 Q217 120 213 126 Q211 131 215 135 Q219 131 219 126 Q220 120 217 112" stroke-width="1" opacity="0.58"/>
  <path d="M230 108 Q234 120 232 130" stroke-width="1" opacity="0.55"/>
  <path d="M232 118 Q230 124 232 129" stroke-width="1.6" stroke-linecap="round" opacity="0.55"/>
  <path d="M233 129 Q233 136 230 140 Q228 144 231 147 Q234 144 234 140 Q235 136 233 129" stroke-width="0.9" opacity="0.5"/>
  <path d="M55 90 Q66 76 62 58" stroke-width="1.2" opacity="0.7"/>
  <path d="M58 84 Q51 75 58 67 Q65 60 68 69 Q69 78 58 84 Z" stroke-width="0.9" opacity="0.6"/>
  <path d="M60 68 Q66 61 72 66" stroke-width="0.5" opacity="0.36"/>
  <path d="M58 69 Q51 60 58 52 Q65 45 67 54 Q68 62 58 69 Z" stroke-width="0.9" opacity="0.58"/>
</svg>`,

// ── FLOR MEDICINAL — flor botánica con tallo y hojas ──
flor: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M140 88 Q142 172 140 175" stroke-width="1.6" opacity="0.78"/>
  <path d="M141 130 Q165 120 174 102" stroke-width="1.4" opacity="0.72"/>
  <path d="M165 102 Q162 112 156 118 Q150 124 141 128" stroke-width="0.7" opacity="0.42"/>
  <path d="M148 116 Q155 112 162 108" stroke-width="0.5" opacity="0.32"/>
  <path d="M140 148 Q118 140 108 120" stroke-width="1.4" opacity="0.68"/>
  <path d="M108 120 Q112 130 120 136 Q128 142 140 146" stroke-width="0.7" opacity="0.4"/>
  <path d="M115 132 Q122 128 128 124" stroke-width="0.5" opacity="0.3"/>
  <circle cx="140" cy="72" r="12" stroke-width="1.6"/>
  <circle cx="140" cy="72" r="8" stroke-width="0.9" opacity="0.55"/>
  <circle cx="140" cy="72" r="4" fill="currentColor" opacity="0.2" stroke-width="0.7"/>
  <circle cx="138" cy="70" r="1.5" fill="currentColor" opacity="0.55"/>
  <circle cx="142" cy="73" r="1.2" fill="currentColor" opacity="0.48"/>
  <circle cx="139" cy="75" r="1" fill="currentColor" opacity="0.42"/>
  <path d="M140 60 Q136 46 140 36 Q144 46 140 60" stroke-width="1.3" opacity="0.72"/>
  <ellipse cx="140" cy="34" rx="10" ry="14" stroke-width="1.1" opacity="0.68"/>
  <path d="M134 38 L140 60 L146 38" stroke-width="0.5" opacity="0.38"/>
  <path d="M136 42 Q134 50 140 56 Q146 50 144 42" stroke-width="0.5" opacity="0.3"/>
  <path d="M152 64 Q162 50 168 38 Q162 50 152 64" stroke-width="1.3" opacity="0.7"/>
  <ellipse cx="170" cy="34" rx="14" ry="10" transform="rotate(-30 170 34)" stroke-width="1.1" opacity="0.65"/>
  <path d="M164 40 L152 62 L174 42" stroke-width="0.5" opacity="0.36"/>
  <path d="M128 64 Q118 50 112 38 Q118 50 128 64" stroke-width="1.3" opacity="0.7"/>
  <ellipse cx="110" cy="34" rx="14" ry="10" transform="rotate(30 110 34)" stroke-width="1.1" opacity="0.65"/>
  <path d="M116 40 L128 62 L106 42" stroke-width="0.5" opacity="0.36"/>
  <path d="M152 80 Q166 74 174 62 Q166 74 152 80" stroke-width="1.3" opacity="0.68"/>
  <ellipse cx="176" cy="58" rx="14" ry="10" transform="rotate(-60 176 58)" stroke-width="1.1" opacity="0.62"/>
  <path d="M128 80 Q114 74 106 62 Q114 74 128 80" stroke-width="1.3" opacity="0.68"/>
  <ellipse cx="104" cy="58" rx="14" ry="10" transform="rotate(60 104 58)" stroke-width="1.1" opacity="0.62"/>
  <path d="M156 88 Q170 84 176 72 Q170 84 156 88" stroke-width="1.2" opacity="0.65"/>
  <ellipse cx="178" cy="70" rx="13" ry="9" transform="rotate(-80 178 70)" stroke-width="1" opacity="0.58"/>
  <path d="M124 88 Q110 84 104 72 Q110 84 124 88" stroke-width="1.2" opacity="0.65"/>
  <ellipse cx="102" cy="70" rx="13" ry="9" transform="rotate(80 102 70)" stroke-width="1" opacity="0.58"/>
</svg>`,

// ── HOJA BOTÁNICA — hoja detallada con venación completa ──
hoja: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M140 168 Q108 160 88 138 Q62 108 68 75 Q72 50 100 32 Q120 18 140 16 Q160 18 180 32 Q208 50 212 75 Q218 108 192 138 Q172 160 140 168 Z" stroke-width="2"/>
  <path d="M140 168 L140 16" stroke-width="1.5" opacity="0.6"/>
  <path d="M140 60 Q120 52 104 58" stroke-width="0.9" opacity="0.55"/>
  <path d="M140 60 Q160 52 176 58" stroke-width="0.9" opacity="0.55"/>
  <path d="M140 80 Q114 70 96 78" stroke-width="0.9" opacity="0.52"/>
  <path d="M140 80 Q166 70 184 78" stroke-width="0.9" opacity="0.52"/>
  <path d="M140 100 Q110 88 90 98" stroke-width="0.9" opacity="0.5"/>
  <path d="M140 100 Q170 88 190 98" stroke-width="0.9" opacity="0.5"/>
  <path d="M140 120 Q112 108 94 118" stroke-width="0.9" opacity="0.48"/>
  <path d="M140 120 Q168 108 186 118" stroke-width="0.9" opacity="0.48"/>
  <path d="M140 140 Q116 130 100 140" stroke-width="0.9" opacity="0.45"/>
  <path d="M140 140 Q164 130 180 140" stroke-width="0.9" opacity="0.45"/>
  <path d="M140 60 Q133 54 130 56 Q128 62 134 62" stroke-width="0.5" opacity="0.35"/>
  <path d="M140 60 Q147 54 150 56 Q152 62 146 62" stroke-width="0.5" opacity="0.35"/>
  <path d="M104 58 Q98 62 100 68 Q106 66 108 60" stroke-width="0.5" opacity="0.32"/>
  <path d="M176 58 Q182 62 180 68 Q174 66 172 60" stroke-width="0.5" opacity="0.32"/>
  <line x1="160" y1="38" x2="175" y2="44" stroke-width="0.5" opacity="0.35"/>
  <line x1="170" y1="52" x2="182" y2="56" stroke-width="0.5" opacity="0.32"/>
  <line x1="178" y1="70" x2="188" y2="72" stroke-width="0.5" opacity="0.3"/>
  <line x1="184" y1="90" x2="192" y2="90" stroke-width="0.5" opacity="0.28"/>
  <line x1="120" y1="38" x2="105" y2="44" stroke-width="0.5" opacity="0.35"/>
  <line x1="110" y1="52" x2="98" y2="56" stroke-width="0.5" opacity="0.32"/>
  <line x1="102" y1="70" x2="92" y2="72" stroke-width="0.5" opacity="0.3"/>
  <line x1="96" y1="90" x2="88" y2="90" stroke-width="0.5" opacity="0.28"/>
  <path d="M140 168 Q136 175 140 179 Q144 175 140 168" stroke-width="1.2" opacity="0.65"/>
</svg>`,

// ── DENTAL — diente con hierbas curativas ──
diente: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M105 45 Q98 35 102 22 Q108 10 120 8 Q132 6 140 14 Q148 6 160 8 Q172 10 178 22 Q182 35 175 45 Q182 60 184 80 Q188 110 180 140 Q176 158 165 160 Q155 162 152 148 Q150 138 140 138 Q130 138 128 148 Q125 162 115 160 Q104 158 100 140 Q92 110 96 80 Q98 60 105 45 Z" stroke-width="1.9"/>
  <path d="M140 14 L140 138" stroke-width="0.7" opacity="0.28"/>
  <line x1="170" y1="55" x2="172" y2="140" stroke-width="0.5" opacity="0.26"/>
  <line x1="165" y1="50" x2="167" y2="145" stroke-width="0.5" opacity="0.23"/>
  <line x1="175" y1="62" x2="176" y2="132" stroke-width="0.5" opacity="0.2"/>
  <path d="M105 45 Q118 38 140 40 Q162 38 175 45" stroke-width="0.9" opacity="0.5"/>
  <path d="M98 70 Q119 62 140 64 Q161 62 182 70" stroke-width="0.8" opacity="0.42"/>
  <path d="M96 92 Q118 84 140 86 Q162 84 184 92" stroke-width="0.7" opacity="0.35"/>
  <path d="M210 72 Q228 58 224 38" stroke-width="1.4" opacity="0.75"/>
  <path d="M213 66 Q206 56 214 48 Q222 41 225 51 Q226 61 213 66 Z" stroke-width="1" opacity="0.65"/>
  <path d="M215 49 Q222 42 228 47" stroke-width="0.5" opacity="0.4"/>
  <path d="M213 50 Q206 40 214 32 Q222 25 224 34 Q225 43 213 50 Z" stroke-width="1" opacity="0.62"/>
  <path d="M215 33 Q222 26 228 31" stroke-width="0.5" opacity="0.38"/>
  <circle cx="222" cy="80" r="2.5" fill="currentColor" opacity="0.48"/>
  <circle cx="230" cy="90" r="1.8" fill="currentColor" opacity="0.4"/>
  <circle cx="218" cy="92" r="1.5" fill="currentColor" opacity="0.36"/>
  <path d="M46 88 Q58 74 54 55" stroke-width="1.3" opacity="0.72"/>
  <path d="M49 82 Q42 72 49 64 Q56 57 59 66 Q60 75 49 82 Z" stroke-width="0.9" opacity="0.62"/>
  <path d="M51 65 Q57 58 63 63" stroke-width="0.5" opacity="0.38"/>
  <path d="M49 66 Q42 56 49 48 Q56 41 58 50 Q59 59 49 66 Z" stroke-width="0.9" opacity="0.6"/>
  <path d="M51 49 Q57 42 63 47" stroke-width="0.5" opacity="0.36"/>
  <path d="M54 54 Q60 47 66 52" stroke-width="0.5" opacity="0.32"/>
</svg>`,

// ── ZUMO — prensa cítrica con gotas y hierbas ──
zumo: `<svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <path d="M90 145 Q88 130 92 118 Q100 105 140 103 Q180 105 188 118 Q192 130 190 145 Q185 165 140 167 Q95 165 90 145 Z" stroke-width="1.9"/>
  <ellipse cx="140" cy="145" rx="50" ry="9" stroke-width="1.3" opacity="0.5"/>
  <line x1="181" y1="122" x2="182" y2="155" stroke-width="0.5" opacity="0.26"/>
  <line x1="176" y1="118" x2="177" y2="158" stroke-width="0.5" opacity="0.23"/>
  <path d="M90 145 Q89 135 90 125" stroke-width="0.7" opacity="0.35"/>
  <path d="M190 145 Q191 135 190 125" stroke-width="0.7" opacity="0.35"/>
  <path d="M108 100 Q140 86 172 100" stroke-width="1.5" opacity="0.72"/>
  <path d="M108 100 Q102 90 110 82 Q120 74 140 72 Q160 74 170 82 Q178 90 172 100" stroke-width="1.6" opacity="0.8"/>
  <path d="M140 72 L140 100" stroke-width="0.7" opacity="0.4"/>
  <path d="M120 78 Q128 92 140 96" stroke-width="0.6" opacity="0.38"/>
  <path d="M160 78 Q152 92 140 96" stroke-width="0.6" opacity="0.38"/>
  <path d="M110 86 Q116 92 140 96" stroke-width="0.6" opacity="0.35"/>
  <path d="M170 86 Q164 92 140 96" stroke-width="0.6" opacity="0.35"/>
  <path d="M140 72 Q138 58 142 48 Q148 36 140 28 Q132 36 138 48 Q142 58 140 72" stroke-width="1.4" opacity="0.75"/>
  <ellipse cx="140" cy="25" rx="16" ry="18" stroke-width="1.3" opacity="0.72"/>
  <path d="M130 28 L140 72 L150 28" stroke-width="0.6" opacity="0.38"/>
  <path d="M126 36 Q124 48 130 58 Q136 66 140 70" stroke-width="0.5" opacity="0.3"/>
  <path d="M154 36 Q156 48 150 58 Q144 66 140 70" stroke-width="0.5" opacity="0.3"/>
  <path d="M120 118 Q118 128 122 136" stroke-width="1.1" opacity="0.6"/>
  <path d="M140 115 Q138 126 141 134" stroke-width="1.1" opacity="0.58"/>
  <path d="M158 118 Q157 128 160 136" stroke-width="1.1" opacity="0.55"/>
  <path d="M48 105 Q56 90 52 72" stroke-width="1.3" opacity="0.72"/>
  <path d="M51 98 Q44 88 51 80 Q58 73 61 82 Q62 91 51 98 Z" stroke-width="0.9" opacity="0.62"/>
  <path d="M53 81 Q59 74 65 79" stroke-width="0.5" opacity="0.38"/>
  <path d="M51 82 Q44 72 51 64 Q58 57 60 66 Q61 74 51 82 Z" stroke-width="0.9" opacity="0.6"/>
</svg>`,

};

// ── Mapeo: receta → ilustración apropiada ──
function ilustracionDeReceta(r) {
    const t = ((r.titulo || '') + ' ' + (r.preparacion || '')).toLowerCase();
    const cat = (r.categoria || '').toLowerCase();
    const mod = (r.modo_uso || '').toLowerCase();

    if (/cataplasma|emplasto|machacar|pasta herbal|triturar.*planta/.test(t)) return ILLUSTRATIONS.cataplasma;
    if (/baño de asiento/.test(t)) return ILLUSTRATIONS.bano;
    if (/baño|bañarse|tina|inmersión/.test(t)) return ILLUSTRATIONS.bano;
    if (/gárgara|gargara|enjuague bucal/.test(t)) return ILLUSTRATIONS.gargaras;
    if (/jarabe|sirope|almíbar herbal/.test(t)) return ILLUSTRATIONS.jarabe;
    if (/tintura|maceración.*alcohol|macerar.*alcohol|gotas diluidas/.test(t)) return ILLUSTRATIONS.tintura;
    if (/ungüento|pomada|bálsamo|cera.*herbal/.test(t)) return ILLUSTRATIONS.unguento;
    if (/crema|loción cosmética|mascarilla facial/.test(t)) return ILLUSTRATIONS.unguento;
    if (/vapor|vaho|inhalar|inhalación|sahumerio|vahos/.test(t)) return ILLUSTRATIONS.vapores;
    if (/aceite.*herbal|maceración.*aceite|macerar.*aceite|aceite esencial/.test(t)) return ILLUSTRATIONS.aceite;
    if (/compresa|paño caliente|fomento|cataplasma húmeda/.test(t)) return ILLUSTRATIONS.compresa;
    if (/gotas.*oído|gotas.*ojos|aplicar.*oído|instilación/.test(t)) return ILLUSTRATIONS.gotas;
    if (/polvo|espolvorear|triturar.*polvo|pulverizar/.test(t)) return ILLUSTRATIONS.polvo;
    if (/decocción|cocimiento|hervir|cocinar.*fuego|cocción/.test(t)) return ILLUSTRATIONS.decoccion;
    if (/jugo|zumo|exprimir|prensa/.test(t)) return ILLUSTRATIONS.zumo;
    if (/batido|smoothie|licuado|tónico|tonico/.test(t)) return ILLUSTRATIONS.bebida;
    if (/infusión|infusion|té |tomar.*taza|agüita|aguita|tisana|reposar.*minutos/.test(t)) return ILLUSTRATIONS.infusion;
    if (/ritual|ceremonia|sahumerio.*espiritual|limpia|florecimiento/.test(t)) return ILLUSTRATIONS.ritual;
    if (/bebida|limonada|agua de|disolver.*agua/.test(t)) return ILLUSTRATIONS.bebida;

    if (cat === 'baño') return ILLUSTRATIONS.bano;
    if (cat === 'tos' || cat === 'expectorante') return ILLUSTRATIONS.jarabe;
    if (cat === 'cicatrizante' || cat === 'dermatológico') return ILLUSTRATIONS.unguento;
    if (cat === 'oídos' || cat === 'oftalmológico') return ILLUSTRATIONS.gotas;
    if (cat === 'dental') return ILLUSTRATIONS.diente;
    if (cat === 'cosmético' || cat === 'cabello') return ILLUSTRATIONS.flor;
    if (cat === 'espiritual' || cat === 'medicina mapuche') return ILLUSTRATIONS.ritual;
    if (cat === 'antifúngico' || cat === 'antiparasitario') return ILLUSTRATIONS.polvo;
    if (cat === 'reumatismo' || cat === 'antiinflamatorio') return ILLUSTRATIONS.compresa;
    if (cat === 'respiratorio') return ILLUSTRATIONS.vapores;
    if (cat === 'garganta') return ILLUSTRATIONS.gargaras;

    if (/modo|infusión|té/.test(mod)) return ILLUSTRATIONS.infusion;
    if (/decocción/.test(mod)) return ILLUSTRATIONS.decoccion;

    return ILLUSTRATIONS.infusion;
}

window.ILLUSTRATIONS = ILLUSTRATIONS;
window.ilustracionDeReceta = ilustracionDeReceta;
