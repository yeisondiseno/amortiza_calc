---
name: brand-design-system
description: >
  Sistema multi-agente para diseño integral de marca. Coordina agentes especializados
  en: estrategia de marca, identidad visual y logo, teoría del color y paletas,
  tipografía y escala, UI/UX y componentes, espaciado y layout, y maquetación final.
  Usa este skill cuando el usuario quiera crear una marca desde cero, definir identidad
  visual, diseñar un logo, elegir paleta de colores, establecer sistema tipográfico,
  diseñar interfaces UI/UX, maquetar páginas o pantallas, crear un design system,
  o cualquier combinación de estas tareas. También cuando mencione "branding",
  "identidad de marca", "look and feel", "style guide", "brand guidelines",
  "design tokens", o quiera revisión/auditoría de diseño existente.
---

# Brand Design System — Orquestador Multi-Agente

Sistema de 7 agentes especializados que trabajan coordinados para llevar una marca
desde la estrategia hasta la maquetación final. Cada agente tiene expertise profundo
en su dominio y produce artefactos que alimentan al siguiente.

## Arquitectura del sistema

```
┌─────────────────────────────────────────────────────────┐
│                   ORQUESTADOR                           │
│  Recibe el brief → determina fase → activa agente(s)    │
│  Valida entregables → pasa al siguiente paso             │
└──────────┬──────────────────────────────────────────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
  Fase 1      Fase 2-7 (secuencial o paralelo según contexto)
```

### Flujo de trabajo principal

1. **Brand Strategist** → Brief, posicionamiento, personalidad, valores
2. **Identity & Logo Agent** → Logo, variantes, reglas de uso
3. **Color Agent** → Paleta cromática, sistema de color, accesibilidad
4. **Typography Agent** → Sistema tipográfico, escala, jerarquía
5. **UI/UX Agent** → Componentes, patrones, interacciones
6. **Spacing & Layout Agent** → Grid, espaciado, ritmo visual
7. **Maquetación Agent** → Páginas completas, responsive, entregables

Los agentes 3 y 4 pueden ejecutarse en paralelo. El agente 5 depende de 2, 3 y 4.
El agente 6 depende de 5. El agente 7 integra todo.

## Cómo usar este skill

### Al recibir un pedido del usuario:

1. Lee este archivo para entender la arquitectura general
2. Identifica en qué fase está el usuario:
   - ¿Empieza de cero? → Comenzar por Brand Strategist
   - ¿Ya tiene logo/colores? → Saltar a la fase que necesite
   - ¿Pide algo específico? → Ir directo al agente correspondiente
3. Lee el archivo del agente relevante en `agents/`
4. Ejecuta las reglas y produce los entregables
5. Antes de pasar al siguiente agente, valida contra la checklist

### Routing de agentes

| El usuario dice...                          | Agente(s) a activar         |
|--------------------------------------------|-----------------------------|
| "Crear marca desde cero"                   | 1 → 2 → 3 → 4 → 5 → 6 → 7|
| "Diseñar un logo"                          | 2 (pedir brief si no hay)  |
| "Elegir colores / paleta"                  | 3                           |
| "Definir tipografía"                       | 4                           |
| "Diseñar componentes / UI"                 | 5 (necesita 3 + 4)         |
| "Maquetar página / pantalla"               | 7 (necesita 5 + 6)         |
| "Crear style guide / brand guidelines"     | Todos → compilar           |
| "Revisar / auditar diseño existente"       | Agente de la faceta a auditar|
| "Design system / design tokens"            | 3 + 4 + 5 + 6              |

### Formato de entregables por agente

Cada agente produce un entregable estandarizado. Lee el archivo del agente
en `agents/` para las reglas completas y formato de salida.

### Reglas globales del sistema

1. **Consistencia ante todo**: cada decisión de diseño debe referirse a las
   decisiones anteriores. El color refuerza la personalidad de marca. La
   tipografía alinea con el tono. Los componentes usan los tokens definidos.

2. **Accesibilidad no es opcional**: WCAG 2.1 AA mínimo en todas las decisiones.
   Contraste 4.5:1 para texto, 3:1 para elementos gráficos grandes. Todo
   navegable por teclado.

3. **Mobile-first**: diseñar para móvil primero, escalar a desktop después.
   Touch targets mínimo 44×44px.

4. **Documentar todo**: cada decisión incluye el "por qué". No solo el qué.

5. **Design tokens como puente**: el sistema de tokens (color, tipo, spacing)
   es el contrato entre diseño y desarrollo. Definirlos temprano.

6. **Feedback constante**: antes de avanzar al siguiente agente, confirmar
   con el usuario que el entregable actual es satisfactorio.

## Referencias

- `agents/01-brand-strategist.md` — Estrategia y posicionamiento
- `agents/02-identity-logo.md` — Logo e identidad visual
- `agents/03-color-system.md` — Teoría del color y paletas
- `agents/04-typography.md` — Sistema tipográfico
- `agents/05-ui-ux.md` — Componentes y experiencia
- `agents/06-spacing-layout.md` — Espaciado, grid y layout
- `agents/07-maquetacion.md` — Maquetación y entregables finales
- `references/design-principles.md` — Principios Gestalt y leyes de UX
- `references/checklist.md` — Checklists de validación por fase
