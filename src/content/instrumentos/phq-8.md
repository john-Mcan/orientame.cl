---
titulo: 'Cuestionario de depresión PHQ-8'
descripcion: 'Ocho preguntas sobre la frecuencia reciente de síntomas depresivos, con puntuación local y límites de uso visibles.'
descripcionMovil: 'Ocho preguntas sobre síntomas depresivos, con puntuación local y sus límites visibles.'
autor: 'Equipo editorial orientame.cl'
creadoConIA: true
creadoEl: 2026-09-06
actualizadoEl: 2026-09-06
revisionRequerida: fuentes
estadoEditorial: verificado-con-fuentes
verificadoEl: 2026-09-06
proximaRevision: 2027-03-06
fuentes:
  - id: phq-manual
    titulo: 'Instruction Manual: Instructions for Patient Health Questionnaire (PHQ) and GAD-7 Measures'
    organizacion: 'Pfizer'
    url: 'https://www.phqscreeners.com/images/sites/g/files/g10016261/f/201412/instructions.pdf'
    consultadoEl: 2026-09-06
    notas: 'Manual oficial de la familia PHQ: define el PHQ-8, su puntuación, sus puntos de corte, el texto de los ítems en inglés y las condiciones de uso.'
afirmacionesTrazables:
  - texto: 'El manual oficial define el PHQ-8 como todos los ítems del PHQ-9 salvo el noveno, el que pregunta por autolesión, y lo describe como ocho ítems puntuados de 0 a 3.'
    fuenteIds:
      - phq-manual
  - texto: 'El manual indica que el PHQ-8 se puntúa igual que el PHQ-9, que su puntaje total va de 0 a 24 y que sus puntos de corte son idénticos a los del PHQ-9.'
    fuenteIds:
      - phq-manual
  - texto: 'En el PHQ-9 los puntajes 5, 10, 15 y 20 son los puntos de corte de los rangos leve, moderado, moderadamente severo y severo.'
    fuenteIds:
      - phq-manual
  - texto: 'El manual declara que estas escalas están en dominio público y que no se requiere permiso para reproducirlas, traducirlas, mostrarlas ni distribuirlas.'
    fuenteIds:
      - phq-manual
nombreInstrumento: 'Patient Health Questionnaire-8 (PHQ-8)'
version: 'PHQ-8, versión de ocho ítems descrita en el manual oficial de la familia PHQ'
poblacion: 'Personas adultas. El manual lo describe como medida de gravedad de síntomas depresivos. No es una validación específica para Chile.'
licencia: 'Dominio público. El manual oficial declara que no se requiere permiso para reproducir, traducir, mostrar ni distribuir estas escalas.'
adaptacion: 'Los ocho ítems se tradujeron del texto en inglés del manual oficial para este sitio. La licencia autoriza expresamente traducir. Se evitó la concordancia de género, que en español obligaría a escribir «deprimido» o «inquieto» y dejaría fuera a la mitad de quienes responden, y se usó léxico de Chile. La redacción es responsabilidad de orientame.cl, no del manual: no es una traducción oficial ni una versión validada en español.'
scoringVerificado: true
instrumentoId: phq-8
instrucciones: 'Durante las últimas dos semanas, indica con qué frecuencia te han molestado los siguientes problemas.'
preguntas:
  - id: interes
    texto: 'Tener poco interés o poco gusto en hacer las cosas.'
  - id: animo
    texto: 'Sentir desánimo, tristeza o desesperanza.'
  - id: sueno
    texto: 'Tener problemas para conciliar el sueño, para mantenerlo, o dormir demasiado.'
  - id: energia
    texto: 'Sentir cansancio o tener poca energía.'
  - id: apetito
    texto: 'Tener poco apetito o comer en exceso.'
  - id: autoimagen
    texto: 'Sentirte mal contigo, o sentir que eres un fracaso o que le has fallado a tu familia o a ti.'
  - id: concentracion
    texto: 'Tener dificultad para concentrarte en cosas como leer el diario o ver televisión.'
  - id: lentitud
    texto: 'Moverte o hablar tan lento que otras personas podrían haberlo notado. O lo contrario: tener tanta inquietud que te has movido mucho más de lo habitual.'
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
    explicacion: 'El puntaje queda en el rango mínimo de frecuencia de síntomas definido por esta escala.'
    queSignifica: 'En estas dos semanas marcaste pocos síntomas depresivos, o ninguno con frecuencia alta. Este cuestionario no está encontrando ahí un patrón que destacar. Eso no contradice lo que tú estés notando: un puntaje bajo y sentirse mal conviven perfectamente, sobre todo cuando lo que pasa no es del tipo que estas ocho preguntas miden. El cuestionario tampoco pregunta por ansiedad, por lo que te está costando, ni por lo que pasó antes de estas dos semanas.'
    comoContarlo: 'Respondí un cuestionario de ánimo y salió bajo, pero igual hay algo que quiero conversar.'
    pasos:
      - texto: 'Poner en palabras lo que sí estás sintiendo'
        href: '/siento'
        detalle: 'Descripciones cotidianas, sin etiquetas: no poder dormir, no dar más, angustia, desgano.'
      - texto: 'Responder el cuestionario de ansiedad'
        href: '/autoevaluacion/gad-7'
        detalle: 'Siete preguntas sobre otra cosa. La ansiedad no aparece en el PHQ-8.'
      - texto: 'Empezar por lo que te trajo hasta acá'
        href: '/empezar'
        detalle: 'El recorrido parte de lo que más pesa, no de un puntaje.'
  - desde: 5
    hasta: 9
    etiqueta: 'Rango leve de síntomas'
    explicacion: 'El puntaje queda en el rango leve de frecuencia de síntomas definido por esta escala.'
    queSignifica: 'Hay síntomas presentes y con cierta frecuencia, en el rango que el manual del cuestionario llama leve. En este tramo lo que más información entrega no es el número de hoy sino cómo se mueve: si en dos o tres semanas sigue igual o sube, eso vale más que cualquier conclusión de ahora. Consultar en este rango es perfectamente razonable, y esperar mirando también.'
    comoContarlo: 'Respondí un cuestionario de ánimo y salió en rango leve. Quiero saber qué hacer con eso.'
    pasos:
      - texto: 'Ver qué conviene mirar estas semanas'
        href: '/empezar/no-se-si-necesito-ayuda'
        detalle: 'En qué fijarse cuando no tienes claro si esto da para consultar.'
      - texto: 'Poner en palabras lo que estás sintiendo'
        href: '/siento'
        detalle: 'Sirve para contarlo, con puntaje o sin él.'
      - texto: 'Saber cómo es una primera consulta'
        href: '/primera-vez'
        detalle: 'Qué pasa, qué decir y cuánto cuesta, por si decides ir.'
  - desde: 10
    hasta: 14
    etiqueta: 'Rango moderado de síntomas'
    explicacion: 'El puntaje queda en el rango moderado de frecuencia de síntomas definido por esta escala.'
    queSignifica: 'El manual del cuestionario marca el 10 como el punto donde conviene prestar atención: lo describe como una señal de que puede haber algo clínicamente significativo. No confirma nada por sí solo, y por eso el paso siguiente no es concluir, es conversarlo con alguien que pueda evaluarlo. En este rango consultar deja de ser una precaución y pasa a ser lo razonable.'
    comoContarlo: 'Respondí un cuestionario de ánimo y salió en rango moderado. Quisiera conversarlo con alguien.'
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
    hasta: 19
    etiqueta: 'Rango moderadamente severo de síntomas'
    explicacion: 'El puntaje queda en el rango moderadamente severo de frecuencia de síntomas definido por esta escala.'
    queSignifica: 'Es un puntaje alto. El manual describe el 15 como el punto que identifica a las personas en quienes probablemente se justifica un tratamiento activo. Eso no es un diagnóstico y no lo decide un cuestionario, pero sí quiere decir que esto no es algo que convenga seguir cargando en silencio ni resolver esperando. Lo más útil que puedes hacer con este número es no quedártelo.'
    comoContarlo: 'Respondí un cuestionario de ánimo y salió en rango moderadamente severo. Necesito una hora.'
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
  - desde: 20
    hasta: 24
    etiqueta: 'Rango severo de síntomas'
    explicacion: 'El puntaje queda en el rango severo de frecuencia de síntomas definido por esta escala.'
    queSignifica: 'Es de los puntajes más altos de esta escala: marcaste casi todos los síntomas con frecuencia alta durante dos semanas seguidas. El manual ubica desde el 15 a las personas en quienes probablemente se justifica un tratamiento activo. Un cuestionario no diagnostica, pero sí puede decirte con claridad que esto lleva tiempo, que es intenso y que buscar ayuda ahora tiene más sentido que seguir viendo cómo evoluciona.'
    comoContarlo: 'Respondí un cuestionario de ánimo y salió en rango severo. Necesito una hora de salud mental.'
    pasos:
      - texto: 'Ver dónde pedir una hora en Chile'
        href: '/donde'
        detalle: 'Atención pública por comuna, clínicas universitarias y líneas que atienden hoy.'
      - texto: 'Preparar qué decir al pedir la hora'
        href: '/primera-vez/que-decir'
        detalle: 'No hace falta llegar con la historia ordenada. Con el motivo basta.'
      - texto: 'Contárselo a alguien cercano'
        href: '/empezar/me-cuesta-dar-el-paso/no-quiero-preocupar-a-nadie'
        detalle: 'Decirlo en una frase, aunque sea a una sola persona.'
---

## Qué mide

El PHQ-8 pregunta con qué frecuencia aparecieron ocho síntomas depresivos durante las últimas dos
semanas. El resultado describe un rango dentro de este cuestionario. No confirma ni descarta un
diagnóstico.

## Por qué ocho preguntas y no nueve

El cuestionario más conocido de esta familia es el PHQ-9. Su noveno ítem pregunta por pensamientos
de hacerse daño, y el manual oficial describe el PHQ-8 como todos los ítems del PHQ-9 salvo ese.

Acá se publica la versión de ocho por una razón concreta: una pregunta sobre autolesión sólo tiene
sentido cuando alguien puede hacerse cargo de la respuesta. Este sitio no tiene forma de hacerlo y
no formula preguntas que evalúen riesgo. Si estás en peligro ahora, la página de
[ayuda inmediata](/urgencia) reúne los canales que atienden en Chile.

## Cómo se calcula

Cada respuesta vale entre 0 y 3 puntos. Se suman los ocho valores para obtener un total entre 0 y 24. El manual indica que el PHQ-8 se puntúa igual que el PHQ-9 y que sus puntos de corte son los
mismos: 5, 10, 15 y 20 delimitan los rangos leve, moderado, moderadamente severo y severo.

## Qué límite tiene

El manual describe la escala como medida de gravedad de síntomas, no como confirmación de un
diagnóstico. Los ítems que se muestran acá son una traducción propia del texto en inglés, no una
versión validada en español ni una adaptación estudiada en población chilena. Un puntaje alto no
dice qué está pasando ni por qué, y un puntaje bajo no descarta nada de lo que tú estés notando.

Tus respuestas se procesan en este dispositivo mientras la página está abierta. orientame.cl no
guarda el resultado ni lo almacena en sus servidores.
