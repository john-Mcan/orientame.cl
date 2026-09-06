---
titulo: 'Cuestionario de ansiedad GAD-7'
descripcion: 'Siete preguntas sobre la frecuencia reciente de síntomas de ansiedad, con puntuación local y límites de uso visibles.'
descripcionMovil: 'Siete preguntas sobre síntomas de ansiedad, con puntuación local y sus límites visibles.'
autor: 'Equipo editorial orientame.cl'
creadoConIA: true
creadoEl: 2026-09-03
actualizadoEl: 2026-09-03
revisionRequerida: fuentes
estadoEditorial: verificado-con-fuentes
verificadoEl: 2026-09-03
proximaRevision: 2027-03-03
fuentes:
  - id: gad7-original
    titulo: 'A Brief Measure for Assessing Generalized Anxiety Disorder: The GAD-7'
    organizacion: 'JAMA Internal Medicine'
    url: 'https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/410326'
    publicadoEl: 2006-05-22
    consultadoEl: 2026-09-03
    notas: 'Estudio original: siete ítems, scoring 0–21, puntos de corte y límites como instrumento de cribado.'
  - id: gad7-espanol
    titulo: 'Cultural adaptation into Spanish of the generalized anxiety disorder-7 (GAD-7) scale as a screening tool'
    organizacion: 'Health and Quality of Life Outcomes'
    url: 'https://doi.org/10.1186/1477-7525-8-8'
    publicadoEl: 2010-01-20
    consultadoEl: 2026-09-03
    notas: 'Adaptación cultural al español validada en 212 personas adultas atendidas en centros de atención primaria de España.'
  - id: gad7-licencia
    titulo: 'Pfizer To Offer Free Public Access To Mental Health Assessment Tools'
    organizacion: 'Pfizer'
    url: 'https://www.pfizer.com/news/press-release/press-release-detail/pfizer_to_offer_free_public_access_to_mental_health_assessment_tools_to_improve_diagnosis_and_patient_care'
    publicadoEl: 2010-07-21
    consultadoEl: 2026-09-03
    notas: 'Pfizer declara acceso al GAD-7 sin restricción de copyright y sin costo.'
  - id: phq-manual
    titulo: 'Instruction Manual: Instructions for Patient Health Questionnaire (PHQ) and GAD-7 Measures'
    organizacion: 'Pfizer'
    url: 'https://www.phqscreeners.com/images/sites/g/files/g10016261/f/201412/instructions.pdf'
    consultadoEl: 2026-09-06
    notas: 'Manual oficial de la familia PHQ y del GAD-7: puntuación, puntos de corte, texto de los ítems en inglés y condiciones de uso.'
afirmacionesTrazables:
  - texto: 'El GAD-7 suma siete respuestas de 0 a 3 y produce un puntaje total entre 0 y 21.'
    fuenteIds:
      - gad7-original
      - gad7-espanol
  - texto: 'Los puntos 5, 10 y 15 delimitan los rangos mínimo, leve, moderado y severo descritos por el estudio original.'
    fuenteIds:
      - gad7-original
  - texto: 'La adaptación española se estudió en 212 personas adultas de atención primaria en España y no constituye una validación específica para Chile.'
    fuenteIds:
      - gad7-espanol
  - texto: 'Pfizer hizo disponible el GAD-7 sin restricción de copyright y sin costo.'
    fuenteIds:
      - gad7-licencia
  - texto: 'El manual oficial declara que estas escalas están en dominio público y que no se requiere permiso para reproducirlas, traducirlas, mostrarlas ni distribuirlas.'
    fuenteIds:
      - phq-manual
nombreInstrumento: 'Generalized Anxiety Disorder-7 (GAD-7)'
version: 'GAD-7 original de 2006, adaptación cultural española de 2010'
poblacion: 'Personas adultas que comprenden español. La adaptación citada se validó en atención primaria de España, no específicamente en Chile.'
licencia: 'Dominio público. El manual oficial declara que no se requiere permiso para reproducir, traducir, mostrar ni distribuir estas escalas.'
adaptacion: 'Los siete ítems que se muestran acá son una redacción propia hecha para este sitio a partir del texto en inglés del manual oficial, que autoriza expresamente traducir. Está en segunda persona y evita la concordancia de género, que obligaría a escribir «nervioso» o «inquieto» y dejaría fuera a la mitad de quienes responden. No es la redacción de la adaptación cultural española de 2010: esa se cita por su validación, no por su texto, que el artículo no publica.'
scoringVerificado: true
instrumentoId: gad-7
instrucciones: 'Durante las últimas dos semanas, indica con qué frecuencia te han molestado los siguientes problemas.'
preguntas:
  - id: nervios
    texto: 'Sentirte nervioso, ansioso o con los nervios de punta.'
  - id: controlar
    texto: 'No ser capaz de parar o controlar tus preocupaciones.'
  - id: demasiado
    texto: 'Preocuparte demasiado por diferentes cosas.'
  - id: relajarte
    texto: 'Tener dificultad para relajarte.'
  - id: inquietud
    texto: 'Estar tan inquieto que te resulta difícil permanecer quieto.'
  - id: irritabilidad
    texto: 'Molestarte o irritarte con facilidad.'
  - id: miedo
    texto: 'Sentir miedo como si algo terrible pudiera pasar.'
opciones:
  - valor: 0
    texto: 'Nunca'
  - valor: 1
    texto: 'Varios días'
  - valor: 2
    texto: 'Más de la mitad de los días'
  - valor: 3
    texto: 'Casi todos los días'
rangos:
  - desde: 0
    hasta: 4
    etiqueta: 'Rango mínimo de síntomas'
    explicacion: 'El puntaje queda en el rango mínimo de frecuencia de síntomas definido por el GAD-7.'
    queSignifica: 'En estas dos semanas marcaste pocos síntomas de ansiedad, o ninguno con frecuencia alta. Este cuestionario no está encontrando ahí un patrón que destacar. Eso no contradice lo que tú estés notando: el GAD-7 mide una forma específica de ansiedad —la preocupación difícil de frenar— y hay malestares que no aparecen acá, como el ánimo bajo, el insomnio o el cansancio.'
    comoContarlo: 'Respondí un cuestionario de ansiedad y salió bajo, pero igual hay algo que quiero conversar.'
    pasos:
      - texto: 'Poner en palabras lo que sí estás sintiendo'
        href: '/siento'
        detalle: 'Descripciones cotidianas, sin etiquetas: no poder dormir, no dar más, angustia, desgano.'
      - texto: 'Responder el cuestionario de ánimo'
        href: '/autoevaluacion/phq-8'
        detalle: 'Ocho preguntas sobre otra cosa. El ánimo no aparece en el GAD-7.'
      - texto: 'Empezar por lo que te trajo hasta acá'
        href: '/empezar'
        detalle: 'El recorrido parte de lo que más pesa, no de un puntaje.'
  - desde: 5
    hasta: 9
    etiqueta: 'Rango leve de síntomas'
    explicacion: 'El puntaje queda en el rango leve de frecuencia de síntomas definido por el GAD-7.'
    queSignifica: 'Hay síntomas de ansiedad presentes y con cierta frecuencia, en el rango que el manual del cuestionario llama leve. En este tramo lo que más información entrega no es el número de hoy sino cómo se mueve, y sobre todo cuánto se está metiendo en tu vida: el sueño, la concentración, la paciencia, las cosas que estás dejando de hacer. Eso último no lo mide el puntaje y lo sabes tú.'
    comoContarlo: 'Respondí un cuestionario de ansiedad y salió en rango leve. Quiero saber qué hacer con eso.'
    pasos:
      - texto: 'Ver qué conviene mirar estas semanas'
        href: '/empezar/no-se-si-necesito-ayuda'
        detalle: 'En qué fijarse cuando no tienes claro si esto da para consultar.'
      - texto: 'Leer sobre ansiedad, sin etiquetas'
        href: '/temas'
        detalle: 'Qué se sabe de la ansiedad y de otros cuadros, con sus fuentes.'
      - texto: 'Saber cómo es una primera consulta'
        href: '/primera-vez'
        detalle: 'Qué pasa, qué decir y cuánto cuesta, por si decides ir.'
  - desde: 10
    hasta: 14
    etiqueta: 'Rango moderado de síntomas'
    explicacion: 'El puntaje queda en el rango moderado de frecuencia de síntomas definido por el GAD-7.'
    queSignifica: 'El manual del cuestionario marca el 10 como el punto donde conviene prestar atención: lo describe como una señal de que puede haber algo clínicamente significativo. No confirma nada por sí solo, y por eso el paso siguiente no es concluir, es conversarlo con alguien que pueda evaluarlo. En este rango consultar deja de ser una precaución y pasa a ser lo razonable.'
    comoContarlo: 'Respondí un cuestionario de ansiedad y salió en rango moderado. Quisiera conversarlo con alguien.'
    pasos:
      - texto: 'Ver dónde pedir una hora en Chile'
        href: '/donde'
        detalle: 'Establecimientos vigentes por comuna, clínicas universitarias y líneas nacionales.'
      - texto: 'Preparar qué decir al pedir la hora'
        href: '/primera-vez/que-decir'
        detalle: 'Mensajes armados para copiar. Puedes mencionar este resultado tal cual.'
      - texto: 'Si algo te frena para dar el paso'
        href: '/empezar/me-cuesta-dar-el-paso'
        detalle: 'Cuando ya sabes que quieres hacerlo y aun así cuesta.'
  - desde: 15
    hasta: 21
    etiqueta: 'Rango severo de síntomas'
    explicacion: 'El puntaje queda en el rango severo de frecuencia de síntomas definido por el GAD-7.'
    queSignifica: 'Es un puntaje alto. El manual describe el 15 como el punto que identifica a las personas en quienes probablemente se justifica un tratamiento activo. Eso no es un diagnóstico y no lo decide un cuestionario, pero sí quiere decir que la ansiedad que describiste es intensa y sostenida, y que no es algo que convenga seguir manejando en silencio. Lo más útil que puedes hacer con este número es no quedártelo.'
    comoContarlo: 'Respondí un cuestionario de ansiedad y salió en rango severo. Necesito una hora de salud mental.'
    pasos:
      - texto: 'Ver dónde pedir una hora en Chile'
        href: '/donde'
        detalle: 'La consulta con psicólogo en atención primaria no tiene copago en ningún tramo de Fonasa.'
      - texto: 'Preparar qué decir al pedir la hora'
        href: '/primera-vez/que-decir'
        detalle: '«Respondí un cuestionario y salí en rango alto» es un motivo completo.'
      - texto: 'Contárselo a alguien cercano'
        href: '/empezar/me-cuesta-dar-el-paso/no-quiero-preocupar-a-nadie'
        detalle: 'Para no ser la única persona que lo sabe.'
---

## Qué mide

El GAD-7 pregunta con qué frecuencia aparecieron siete síntomas de ansiedad durante las últimas dos
semanas. El resultado describe un rango dentro de este cuestionario. No confirma ni descarta un
diagnóstico.

## Cómo se calcula

Cada respuesta vale entre 0 y 3 puntos. Se suman los siete valores para obtener un total entre 0 y
21, que la publicación original organiza en cuatro rangos de frecuencia de síntomas.

## Qué límite tiene

La adaptación española del GAD-7 fue estudiada en personas adultas atendidas en centros de atención
primaria de España, no en población chilena. La redacción de los ítems que se muestra acá, además,
es propia; queda descrita al final, en la ficha. El estudio original también advierte que los casos
probables requieren una evaluación posterior para confirmarse.

Tus respuestas se procesan en este dispositivo mientras la página está abierta. orientame.cl no
guarda el resultado ni lo almacena en sus servidores.
