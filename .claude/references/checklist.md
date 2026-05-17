# Checklists de validación por fase

Antes de avanzar al siguiente agente, el orquestador verifica estos criterios.

---

## Fase 1: Brand Strategy (Agente 01)

### Gate check — ¿Se puede pasar al Agente 02?
- [ ] Brief completo con las 5 preguntas esenciales respondidas
- [ ] Personalidad de marca definida (dimensión primaria + secundaria)
- [ ] Arquetipo seleccionado y justificado
- [ ] Frase de posicionamiento formulada
- [ ] Atributos de diseño definidos (color_direction, type_direction, logo_direction)
- [ ] Usuario confirmó el brief explícitamente

---

## Fase 2: Identity & Logo (Agente 02)

### Gate check — ¿Se puede pasar a los Agentes 03/04?
- [ ] Al menos 3 direcciones conceptuales presentadas
- [ ] Dirección elegida por el usuario
- [ ] Logo principal definido con geometría de construcción
- [ ] Mínimo 4 variantes especificadas (primary, stacked, symbol, mono)
- [ ] Zona de exclusión definida
- [ ] Tamaños mínimos establecidos
- [ ] Reglas de uso correcto e incorrecto documentadas
- [ ] SVG generado y funcional
- [ ] Logo legible en B&N
- [ ] Logo reconocible a 16×16px

---

## Fase 3: Color System (Agente 03)

### Gate check — ¿Se puede integrar con Agente 05?
- [ ] Armonía cromática elegida y justificada
- [ ] Paleta core: primary, secondary, accent, neutral (3-5 colores)
- [ ] Colores semánticos: success, warning, error, info
- [ ] Rampas extendidas: mínimo 7 stops por color core
- [ ] WCAG AA verificado en TODAS las combinaciones texto/fondo
- [ ] Dark mode diseñado (no solo invertido)
- [ ] Simulación de daltonismo verificada
- [ ] Tokens exportados en JSON
- [ ] CSS variables generadas
- [ ] Valores en HEX y RGB (CMYK si hay impresión)

---

## Fase 4: Typography (Agente 04)

### Gate check — ¿Se puede integrar con Agente 05?
- [ ] Máximo 2 familias tipográficas (excepcionalmente 3)
- [ ] Escala modular definida con ratio justificado
- [ ] Mínimo 7 niveles en la escala (display → overline)
- [ ] Line-heights definidos y múltiplos de 4px
- [ ] Fuentes disponibles (Google Fonts o libre)
- [ ] Soporte de idiomas verificado (ñ, acentos, etc.)
- [ ] Body ≥ 16px
- [ ] Fluid type con clamp() para responsive
- [ ] Font-stack con fallbacks completos
- [ ] Tokens exportados en JSON

---

## Fase 5: UI/UX Components (Agente 05)

### Gate check — ¿Se puede pasar al Agente 06/07?
- [ ] Catálogo mínimo: buttons, inputs, cards, nav, modals, feedback
- [ ] CADA componente tiene: estados, variantes, tokens, accesibilidad
- [ ] Todos los colores vienen de tokens del Agente 03
- [ ] Todos los tamaños tipográficos del Agente 04
- [ ] Focus ring visible en TODOS los interactivos
- [ ] ARIA roles definidos para cada componente
- [ ] Keyboard navigation documentada
- [ ] Touch targets ≥ 44×44px verificados
- [ ] Contraste WCAG AA en todos los estados
- [ ] Dark mode funcional para todos los componentes
- [ ] Código de ejemplo para cada componente

---

## Fase 6: Spacing & Layout (Agente 06)

### Gate check — ¿Se puede pasar al Agente 07?
- [ ] Escala de spacing basada en 8pt (4pt half-step)
- [ ] Regla interna ≤ externa verificada en componentes
- [ ] Grid de columnas definido para mobile, tablet, desktop
- [ ] Baseline grid de 4px documentado
- [ ] Breakpoints definidos
- [ ] Z-index scale establecida
- [ ] Layout patterns documentados (al menos 3)
- [ ] Tokens de spacing exportados
- [ ] CSS utilities generadas

---

## Fase 7: Maquetación (Agente 07)

### Checklist final — ¿Se puede entregar?

**Código:**
- [ ] HTML semántico (no divitis)
- [ ] Heading hierarchy correcta
- [ ] CERO valores mágicos — todo referencia tokens
- [ ] Mobile-first CSS
- [ ] Dark mode funcional
- [ ] No frameworks innecesarios

**Visual:**
- [ ] Consistente con brand brief
- [ ] Logo usado correctamente
- [ ] Colores de la paleta aprobada
- [ ] Tipografía de la escala definida
- [ ] Spacing de los tokens
- [ ] Grid respetado

**Responsive:**
- [ ] 320px ✓
- [ ] 768px ✓
- [ ] 1024px ✓
- [ ] 1440px ✓
- [ ] Texto legible en todos los viewports

**Accesibilidad (WCAG 2.1 AA):**
- [ ] Skip to content link
- [ ] Focus visible en interactivos
- [ ] Alt text en imágenes
- [ ] Contraste ≥ 4.5:1 texto normal
- [ ] Contraste ≥ 3:1 texto grande
- [ ] Navegación por teclado
- [ ] prefers-reduced-motion
- [ ] prefers-color-scheme
- [ ] lang en html tag
- [ ] Landmarks ARIA

**Performance:**
- [ ] font-display: swap
- [ ] Imágenes lazy loaded
- [ ] CSS optimizado
- [ ] Lighthouse ≥ 90 (todas las categorías)

**Entregables:**
- [ ] Páginas HTML completas
- [ ] CSS organizado (tokens, reset, base, components, layouts, pages)
- [ ] Assets organizados (logo SVGs, imágenes, fonts)
- [ ] Brand guidelines document/página
- [ ] README con instrucciones
