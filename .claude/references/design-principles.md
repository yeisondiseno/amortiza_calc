# Referencia: Principios de Diseño y Leyes UX

Documento de consulta para todos los agentes. Estas leyes y principios
gobiernan las decisiones de diseño en cada fase del proceso.

## Principios Gestalt de percepción visual

### 1. Proximidad
Los elementos cercanos se perciben como grupo, sin importar su forma o color.
**Aplicación UI**: Labels pegados a sus inputs. Grupos de botones relacionados
juntos. Espacio mayor entre secciones que entre elementos de la misma sección.
**Anti-pattern**: Label equidistante entre dos inputs — el usuario no sabe a cuál pertenece.

### 2. Similitud
Elementos con el mismo color, forma, tamaño o textura se perciben como del mismo tipo.
**Aplicación UI**: Todos los links del mismo color. Todos los botones primarios
iguales. Íconos del mismo set.
**Anti-pattern**: Botones con diferentes estilos para la misma función.

### 3. Cierre (Closure)
El cerebro completa formas incompletas o información faltante.
**Aplicación UI**: Cards cortadas al borde para indicar scroll horizontal.
Íconos estilizados que no necesitan ser literal para ser reconocidos.
Logos como NBC, FedEx.

### 4. Continuidad
El ojo sigue líneas, curvas y secuencias naturalmente.
**Aplicación UI**: Flujos paso a paso en línea horizontal. Timelines.
Progress bars. Breadcrumbs. Scroll vertical natural.

### 5. Figura y fondo (Figure-Ground)
El cerebro separa un elemento focal (figura) de su contexto (fondo).
**Aplicación UI**: Modales con overlay oscuro. Dropdowns sobre contenido.
Cards elevadas sobre el fondo. Focus rings.
**Anti-pattern**: Falta de contraste entre elemento y fondo — el usuario no sabe qué es clickeable.

### 6. Región común (Common Region)
Elementos dentro de un mismo contenedor se perciben como grupo.
**Aplicación UI**: Cards. Secciones con fondo distinto. Forms agrupados
en fieldsets. Barras de herramientas.

### 7. Simetría y orden (Prägnanz)
El cerebro prefiere interpretar formas como simples, regulares y ordenadas.
**Aplicación UI**: Grids consistentes. Alineación. Balance visual.
Evitar layouts caóticos sin propósito.

### 8. Destino común (Common Fate)
Elementos que se mueven juntos se perciben como grupo.
**Aplicación UI**: Animaciones coordinadas. Slide transitions de paneles.
Parallax agrupado.

### 9. Conectividad (Uniform Connectedness)
Elementos conectados visualmente (líneas, flechas) se ven como relacionados.
**Aplicación UI**: Líneas de conexión en workflows. Dividers.
Progress steppers con línea conectora.

---

## Leyes de UX

### Ley de Fitts
T = a + b × log₂(1 + D/W)
El tiempo para alcanzar un target aumenta con la distancia y disminuye con el tamaño.
**Regla**: Hacer CTAs grandes. Colocar acciones frecuentes en zonas accesibles.
Touch targets ≥ 44px. Bordes y esquinas de pantalla son "infinitamente" accesibles.

### Ley de Hick-Hyman
T = b × log₂(n + 1)
El tiempo de decisión aumenta con el número de opciones.
**Regla**: Limitar opciones. Progressive disclosure. Menús ≤ 7 items.
Defaults inteligentes. Búsqueda para catálogos grandes.

### Ley de Jakob
Los usuarios esperan que tu sitio funcione como los otros que ya conocen.
**Regla**: Usar patrones establecidos. Logo top-left. Search top-right.
Nav horizontal o hamburger. Close button top-right.
NO innovar en navegación básica.

### Ley de Miller
7 ± 2 chunks de información en memoria de trabajo.
**Regla**: Agrupar info en chunks de 3-5. Números de teléfono en grupos.
Formularios en pasos. Listas categorizadas.

### Ley de Prägnanz
El cerebro interpreta imágenes ambiguas de la forma más simple posible.
**Regla**: Simplicidad en diseño. Íconos legibles. Un solo mensaje por sección.
Si necesitas explicar el UI, el UI está mal.

### Efecto Von Restorff (Isolation Effect)
Lo que es diferente se recuerda más.
**Regla**: Un solo CTA primario destacado. Uso estratégico del color acento.
Romper el patrón solo con propósito.

### Efecto de posición serial
Se recuerdan mejor el primer y último elemento de una serie.
**Regla**: Acciones más importantes al inicio y final de la nav.
"Start" y "Help" en las posiciones más memorables.

### Ley de la región común
Elementos encerrados en un borde o fondo se ven como grupo.
**Regla**: Cards para agrupar. Fondos alternados en filas.
Fieldsets en formularios.

### Ley de Tesler (Conservation of Complexity)
Toda aplicación tiene un nivel irreducible de complejidad.
**Regla**: Absorber complejidad en el sistema, no pasarla al usuario.
Defaults inteligentes. Auto-fill. Validación en tiempo real.

### Efecto Zeigarnik
Las personas recuerdan tareas incompletas mejor que las completadas.
**Regla**: Progress indicators. Onboarding con checklist.
"Tu perfil está 80% completo."

### Umbral de Doherty
La productividad se dispara cuando el sistema responde en < 400ms.
**Regla**: Loading states instantáneos. Skeleton screens.
Optimistic UI. Debounce en búsquedas.

---

## Principios de diseño visual

### Contraste
La diferencia entre elementos crea jerarquía y foco.
- Contraste de tamaño: grande vs pequeño
- Contraste de peso: bold vs light
- Contraste de color: oscuro vs claro, saturado vs neutro
- Contraste de espacio: denso vs aireado

### Balance
Distribución visual del peso en la composición.
- Simétrico: formal, estable, tradicional
- Asimétrico: dinámico, moderno, interesante
- Radial: centrado, focal

### Alineación
Todo elemento debe tener conexión visual con otro.
**Regla**: Nada al azar. Cada elemento alineado a un grid o a otro elemento.
La alineación invisible (grid subyacente) crea orden.

### Repetición
Elementos visuales recurrentes crean cohesión.
**Regla**: Mismo estilo de íconos. Misma paleta. Mismo radio de bordes.
Mismo peso tipográfico para el mismo nivel jerárquico.

### Escala
El tamaño relativo de los elementos comunica importancia.
**Regla**: Lo más importante = lo más grande.
Ratio mínimo entre heading y body: 1.5:1 (preferible 2:1+).
