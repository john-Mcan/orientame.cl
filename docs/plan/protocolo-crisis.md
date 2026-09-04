# Protocolo de crisis — versión inicial

| Campo                     | Valor                                                                                   |
| ------------------------- | --------------------------------------------------------------------------------------- |
| Versión                   | 0.1-borrador                                                                            |
| Fecha                     | 2026-09-03                                                                              |
| Estado                    | **Borrador técnico y editorial; no aprobado clínicamente; no activo**                   |
| Alcance                   | Respuestas estructuradas futuras de orientame.cl ante una respuesta explícita de riesgo |
| Responsable de activación | Pendiente de designación y revisión clínica documentada                                 |

Este documento permite revisar una propuesta concreta sin atribuirle una aprobación que todavía no
existe. En el código, `PROTOCOLO_CRISIS_APROBADO` permanece en `false`. Mientras siga así, ninguna
autoevaluación puede mostrar una respuesta automática de crisis ni formular preguntas adicionales
para evaluar riesgo.

## 1. Propósito y límites

El protocolo define qué podría hacer la interfaz si, en una etapa futura, un instrumento validado
incluyera una pregunta explícita sobre riesgo y una revisión clínica aprobara tanto esa pregunta como
la respuesta del sitio.

No autoriza:

- inferir riesgo desde búsquedas, páginas visitadas, tiempo de lectura o texto libre;
- hacer preguntas de seguimiento para decidir cuán grave es una situación;
- diagnosticar, estimar probabilidades ni reemplazar una evaluación profesional;
- contactar servicios o terceras personas de manera automática;
- ocultar el resultado ordinario del instrumento o impedir que la persona abandone el recorrido;
- almacenar la respuesta, el puntaje o la activación del aviso.

El acceso permanente a `/urgencia` sigue siendo una opción elegida por la persona. Este borrador no
cambia el alcance actual de esa página.

## 2. Base documental verificada

Las fuentes se abrieron y revisaron el 3 de septiembre de 2026:

1. [Guía práctica en salud mental y apoyo psicosocial en emergencias y desastres — MINSAL](https://www.minsal.cl/wp-content/uploads/2019/11/2019.11.20_Gu%C3%ADa-para-el-cuidado-de-la-salud-mental_versi%C3%B3n-digital.pdf).
   Distingue reacciones intensas que requieren atención de salud y recomienda conversar con calma,
   acompañar y priorizar necesidades urgentes.
2. [Suicidio: preguntas y respuestas — Organización Mundial de la Salud](https://www.who.int/es/news-room/questions-and-answers/item/suicide).
   Ante peligro inmediato, indica no dejar sola a la persona, contactar emergencias, una línea de
   crisis, un profesional o un familiar, y reducir el acceso a medios de daño cuando sea posible.
3. [Primera ayuda psicológica: guía para trabajadores de campo — Organización Mundial de la Salud](https://www.who.int/es/publications/i/item/9789241548205).
   Enmarca la ayuda como apoyo humano y práctico que respeta dignidad, cultura y capacidades.
4. [Línea de atención *4141 — Ministerio de Salud de Chile](https://www.minsal.cl/linea-de-atencion-4141-no-estas-solo-no-estas-sola/).
   Confirma atención gratuita y confidencial por profesionales de psicología, las 24 horas, desde
   celulares de cualquier compañía.

La síntesis que sigue es una adaptación editorial en español claro para Chile. No altera el alcance
de las fuentes ni constituye por sí misma revisión clínica.

## 3. Condición de activación propuesta

La condición futura debe ser determinista y auditable:

1. La persona responde afirmativamente o con un valor distinto de cero a **un ítem explícito de
   riesgo que ya forma parte de la versión validada del instrumento**.
2. La versión, traducción, población, licencia, scoring y regla asociada al ítem fueron verificadas.
3. Una revisión clínica identificada por nombre, credencial, fecha y alcance aprobó la regla y el
   texto exacto que se mostrará.
4. Existe una prueba automatizada para cada valor que activa o no activa la respuesta.

No se agregará un ítem creado por orientame.cl. No se utilizarán palabras clave ni modelos para
interpretar una respuesta. OMS-5 y GAD-7, los dos instrumentos de fase 4, no contienen un ítem de
riesgo explícito; por eso este protocolo **no se activa en ninguno de ellos**.

## 4. Respuesta de interfaz propuesta tras la aprobación

Si todas las condiciones anteriores se cumplieran, el resultado incluiría primero un bloque estático,
visible y enfocable, sin animación ni cuenta regresiva:

> Tu respuesta indica que puede ser importante buscar apoyo inmediato. Este cuestionario no puede
> evaluar qué está ocurriendo. Si tú o alguien cercano corre peligro ahora, llama al 131 o ve al
> servicio de urgencia más cercano. También puedes llamar gratis al *4141 desde un celular, las 24
> horas. Si puedes, quédate con una persona de confianza mientras contactas ayuda.

Acciones permitidas, en este orden:

1. `Llamar al 131` mediante un enlace telefónico explícito.
2. `Llamar al *4141` mediante un enlace telefónico explícito.
3. `Ver todas las opciones de ayuda inmediata` hacia `/urgencia`.
4. `Continuar con el resultado del cuestionario`, sin ocultarlo.

El bloque no dirá que la persona “está en riesgo”, no asegurará cómo responderán terceros y no
presentará urgencia como un paso de menor compromiso.

## 5. Privacidad y operación

- La regla se ejecutaría sólo en el navegador con valores estructurados.
- No se registraría la respuesta, el puntaje, la activación ni el clic en una línea de ayuda.
- No habría analítica, telemetría, llamadas automáticas ni envío de mensajes.
- La red sólo recibiría las solicitudes técnicas normales al navegar o cargar archivos del sitio.
- `/urgencia` debe seguir funcionando completamente sin JavaScript y sin recursos remotos.

## 6. Pruebas mínimas antes de activar

- cada valor permitido produce exactamente la activación aprobada;
- respuestas incompletas o inválidas no se interpretan como riesgo;
- el aviso funciona con teclado, lector de pantalla, 320 px y JavaScript reducido;
- los teléfonos, horarios, costos y URLs se vuelven a verificar el día de la revisión;
- el resultado ordinario sigue disponible y el aviso no bloquea la navegación;
- no aparece ninguna solicitud de red asociada a respuestas o puntajes;
- una prueba de guardia falla si el código se activa sin cambiar el estado aprobado documentado.

## 7. Requisitos de aprobación

Para pasar de borrador a activo debe registrarse aquí:

- nombre y credencial de quien realiza la revisión clínica;
- organización o relación con el proyecto;
- fecha y alcance exacto de la revisión;
- instrumento, versión e ítem al que aplica;
- texto final y regla aprobados;
- próxima fecha de revisión;
- decisión correspondiente en `fase-4-decisiones.md`.

Hasta completar todos los campos, el valor de `PROTOCOLO_CRISIS_APROBADO` no puede cambiar y ningún
contenido debe presentarse como “revisado clínicamente”.
