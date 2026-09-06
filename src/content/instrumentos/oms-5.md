---
titulo: 'Índice de Bienestar OMS-5'
descripcion: 'Cinco preguntas sobre bienestar durante las últimas dos semanas, con puntuación local y una interpretación orientativa.'
descripcionMovil: 'Cinco preguntas sobre bienestar en las últimas dos semanas, con puntuación local.'
autor: 'Equipo editorial orientame.cl'
creadoConIA: true
creadoEl: 2026-09-03
actualizadoEl: 2026-09-03
revisionRequerida: fuentes
estadoEditorial: verificado-con-fuentes
verificadoEl: 2026-09-03
proximaRevision: 2027-03-03
fuentes:
  - id: oms5-espanol
    titulo: 'OMS (cinco) Índice de Bienestar (OMS-5), traducción al español'
    organizacion: 'Organización Mundial de la Salud'
    url: 'https://cdn.who.int/media/docs/default-source/mental-health/oms-(cinco)-indice-de-bienestar-(oms-5).pdf?download=true&sfvrsn=ed43f352_11'
    publicadoEl: 2024-10-02
    consultadoEl: 2026-09-03
    notas: 'Versión española de los cinco ítems y sus opciones de respuesta. La OMS advierte que, ante diferencias, manda la edición inglesa.'
  - id: oms5-2024
    titulo: 'The World Health Organization-Five Well-Being Index (WHO-5)'
    organizacion: 'Organización Mundial de la Salud'
    url: 'https://cdn.who.int/media/docs/default-source/mental-health/who-5_english-original4da539d6ed4b49389e3afe47cda2326a.pdf'
    publicadoEl: 2024-10-02
    consultadoEl: 2026-09-03
    notas: 'Edición auténtica en inglés: scoring, alcance y licencia CC BY-NC-SA 3.0 IGO.'
afirmacionesTrazables:
  - texto: 'El OMS-5 contiene cinco afirmaciones sobre las últimas dos semanas y cada respuesta vale entre 0 y 5 puntos.'
    fuenteIds:
      - oms5-espanol
      - oms5-2024
  - texto: 'El puntaje bruto va de 0 a 25 y se multiplica por cuatro para obtener un porcentaje entre 0 y 100.'
    fuenteIds:
      - oms5-2024
  - texto: 'La OMS señala que un porcentaje menor que 50, equivalente a un puntaje bruto menor que 13, se ha sugerido como umbral de bajo bienestar y para una evaluación adicional.'
    fuenteIds:
      - oms5-2024
nombreInstrumento: 'Índice de Bienestar OMS-5'
version: 'OMS-5, edición OMS 2024; traducción española de la versión 1998'
poblacion: 'Personas adultas. La fuente informa uso en distintos idiomas y contextos; no es una validación específica para Chile.'
licencia: 'CC BY-NC-SA 3.0 IGO para uso no comercial, con atribución y licencia equivalente para adaptaciones.'
adaptacion: 'Los cinco ítems y las seis opciones reproducen literalmente la traducción española publicada por la OMS. El único cambio es una errata del original: donde dice «fresco y descandado» se escribe «descansado». El enunciado se pasó a segunda persona para que suene como el resto del sitio; las afirmaciones que se puntúan no se tocaron.'
scoringVerificado: true
instrumentoId: oms-5
instrucciones: 'Durante las últimas dos semanas, elige en cada afirmación la opción que mejor describa cómo te has sentido. Los valores mayores representan mayor bienestar en este instrumento.'
preguntas:
  - id: alegre
    texto: 'Me he sentido alegre y de buen humor.'
  - id: tranquilo
    texto: 'Me he sentido tranquilo y relajado.'
  - id: activo
    texto: 'Me he sentido activo y enérgico.'
  - id: descansado
    texto: 'Me he despertado fresco y descansado.'
  - id: interesado
    texto: 'Mi vida cotidiana ha estado llena de cosas que me interesan.'
opciones:
  - valor: 5
    texto: 'Todo el tiempo'
  - valor: 4
    texto: 'La mayor parte del tiempo'
  - valor: 3
    texto: 'Más de la mitad del tiempo'
  - valor: 2
    texto: 'Menos de la mitad del tiempo'
  - valor: 1
    texto: 'De vez en cuando'
  - valor: 0
    texto: 'Nunca'
rangos:
  - desde: 0
    hasta: 12
    etiqueta: 'Puntaje bajo el umbral sugerido'
    explicacion: 'La OMS indica que un puntaje bruto menor que 13 se ha sugerido como señal de bajo bienestar y como motivo para considerar una evaluación adicional.'
    queSignifica: 'Este cuestionario no pregunta por síntomas: pregunta por lo contrario, por cuánto bienestar hubo en estas dos semanas. Un puntaje bajo el umbral quiere decir que hubo poco —poco ánimo, poco descanso, poca energía, pocas cosas que te interesaran—, y la OMS lo señala como motivo suficiente para mirarlo con más detalle. No dice por qué: eso puede ir desde un período pesado hasta algo que lleva más tiempo, y es justamente lo que se ve en una conversación, no en cinco preguntas.'
    comoContarlo: 'Respondí el cuestionario de bienestar de la OMS y salí bajo el umbral que ellos señalan.'
    pasos:
      - texto: 'Mirar síntomas concretos con otro cuestionario'
        href: '/autoevaluacion/phq-8'
        detalle: 'Ocho preguntas sobre ánimo. El OMS-5 mide bienestar, no síntomas.'
      - texto: 'Poner en palabras lo que estás sintiendo'
        href: '/siento'
        detalle: 'Descripciones cotidianas: no poder dormir, no dar más, angustia, desgano.'
      - texto: 'Ver dónde pedir una hora en Chile'
        href: '/donde'
        detalle: 'Atención pública por comuna, clínicas universitarias y líneas nacionales.'
  - desde: 13
    hasta: 25
    etiqueta: 'Puntaje sobre el umbral sugerido'
    explicacion: 'Tu puntaje no queda bajo el umbral sugerido por la OMS. Esto no permite descartar dificultades ni reemplaza lo que tú observas sobre tu vida cotidiana.'
    queSignifica: 'En estas dos semanas hubo bienestar por sobre el umbral que la OMS sugiere como señal de alerta. Eso es información real, pero es de grano grueso: son cinco preguntas sobre ánimo, descanso, energía e interés, y hay cosas que no aparecen ahí. Si viniste hasta acá porque algo no anda bien, este puntaje no cierra el tema; sólo dice que ese algo no se está expresando como falta de bienestar general.'
    comoContarlo: 'Respondí un cuestionario de bienestar y salió normal, pero igual hay algo que no anda bien.'
    pasos:
      - texto: 'Poner en palabras lo que sí estás sintiendo'
        href: '/siento'
        detalle: 'Vivencias cotidianas, sin etiquetas ni puntaje.'
      - texto: 'Mirar ansiedad o ánimo por separado'
        href: '/autoevaluacion'
        detalle: 'El GAD-7 y el PHQ-8 preguntan por síntomas específicos.'
      - texto: 'Empezar por lo que te trajo hasta acá'
        href: '/empezar'
        detalle: 'El recorrido parte de lo que más pesa, no de un puntaje.'
---

## Qué mide

El OMS-5 pregunta por cinco aspectos positivos del bienestar durante las últimas dos semanas. No
busca identificar por sí solo una causa ni entregar un diagnóstico.

## Cómo se calcula

Se suman las cinco respuestas para obtener un puntaje bruto entre 0 y 25. La edición OMS 2024
multiplica ese total por cuatro para expresarlo también como porcentaje entre 0 y 100.

## Qué límite tiene

La OMS describe el umbral bajo 13 como una sugerencia para considerar una evaluación adicional, no
como una confirmación de un trastorno. La traducción española disponible fue preparada antes de que
la OMS recibiera los derechos de la edición inglesa y la propia OMS indica que la versión inglesa es
la auténtica si aparece alguna diferencia.

Tus respuestas se procesan en este dispositivo mientras la página está abierta. orientame.cl no
guarda el resultado ni lo almacena en sus servidores.
