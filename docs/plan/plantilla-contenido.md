# Plantilla editorial trazable

Usar esta estructura al redactar una pieza clínica, epidemiológica o sobre efectividad. Los nombres de
campos deben coincidir con `src/content.config.ts`.

```yaml
---
titulo: 'Título en lenguaje claro'
descripcion: 'Descripción útil y específica, entre 20 y 170 caracteres.'
autor: 'Equipo o persona responsable'
creadoConIA: true
creadoEl: 2026-08-31
actualizadoEl: 2026-08-31
revisionRequerida: fuentes # fuentes | clinica
estadoEditorial: borrador # nunca simular una revisión

fuentes:
  - id: fuente-oficial-1
    titulo: 'Título de la fuente'
    organizacion: 'Organización responsable'
    url: 'https://ejemplo.cl/fuente'
    publicadoEl: 2026-01-01 # si está disponible
    consultadoEl: 2026-08-31
    notas: 'Alcance, población o limitaciones relevantes.'

afirmacionesTrazables:
  - texto: 'Afirmación clínica o epidemiológica exacta que aparece en la pieza.'
    fuenteIds:
      - fuente-oficial-1


# Sólo después de completar la vía correspondiente:
# verificadoEl: 2026-09-15
# revisadoPor: "Nombre y credencial autorizados"
# revisadoEl: 2026-09-15
# proximaRevision: 2027-03-15
---
```

## Antes de cambiar el estado

1. Abrir cada URL y comprobar que respalda exactamente la afirmación asociada.
2. Conservar población, condiciones, incertidumbre y alcance de la fuente.
3. No resolver evidencia contradictoria mediante criterio propio.
4. Confirmar que la pieza no diagnostica, prescribe ni personaliza una recomendación.
5. Si contiene protocolos de urgencia, señales de riesgo, scoring modificado, recomendaciones para
   menores o una síntesis clínica original, usar `revisionRequerida: clinica`.
6. Registrar fechas reales y el nombre de la persona revisora sólo con su autorización.

Los schemas validan URLs, campos obligatorios, referencias entre afirmaciones y fuentes, y requisitos
mínimos de cada estado. `src/lib/editorial.ts` es la única regla que las rutas futuras deben usar para
decidir si una entrada puede generarse en producción.
