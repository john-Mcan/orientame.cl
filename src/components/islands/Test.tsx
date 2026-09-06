// Cuestionario de una autoevaluación.
//
// Se renderiza completo en el servidor: sin JavaScript la persona ve el instrumento entero,
// con el valor de cada opción a la vista, y puede sumarlo a mano como en la versión en papel.
// Lo que agrega el JavaScript es el total, el rango y su lectura; nada más.
//
// Una sola presentación en todos los anchos. Hubo una versión que en móvil mostraba una
// pregunta por pantalla: se descartó porque partía el cuestionario en un trámite de ocho
// pasos, escondía cuánto faltaba y hacía difícil volver a mirar lo ya respondido. Lo que el
// ancho angosto necesitaba era densidad, no fragmentación.
//
// El resultado no termina en una etiqueta. Un puntaje que sólo dice «rango moderado» no le
// sirve a nadie: cada rango explica qué significa y enlaza a dónde seguir.

import { useCallback, useRef, useState } from 'preact/hooks';
import { useEffect } from 'preact/hooks';
import { puntuarInstrumento, type InstrumentoId } from '@/lib/scoring';

interface Pregunta {
  id: string;
  texto: string;
}

interface Opcion {
  valor: number;
  texto: string;
}

interface Paso {
  texto: string;
  href: string;
  detalle: string;
}

interface Rango {
  desde: number;
  hasta: number;
  etiqueta: string;
  explicacion: string;
  queSignifica: string;
  comoContarlo: string;
  pasos: readonly Paso[];
}

interface Props {
  instrumentoId: InstrumentoId;
  instrucciones: string;
  preguntas: readonly Pregunta[];
  opciones: readonly Opcion[];
  rangos: readonly Rango[];
  /** Puntaje máximo del instrumento: un número sin su escala no dice nada. */
  puntajeMaximo: number;
}

interface ResultadoVisible {
  puntaje: number;
  porcentaje?: number;
  rango: Rango;
}

export default function Test({
  instrumentoId,
  instrucciones,
  preguntas,
  opciones,
  rangos,
  puntajeMaximo,
}: Props) {
  const [montado, setMontado] = useState(false);
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const [resultado, setResultado] = useState<ResultadoVisible>();
  const [error, setError] = useState('');
  const errorRef = useRef<HTMLDivElement>(null);
  const resultadoRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => setMontado(true), []);

  const responder = (preguntaId: string, valor: number) => {
    setRespuestas((actuales) => ({ ...actuales, [preguntaId]: valor }));
    setResultado(undefined);
    setError('');
  };

  const respondidas = preguntas.filter((pregunta) => respuestas[pregunta.id] !== undefined).length;

  const calcular = useCallback(
    (event?: Event) => {
      event?.preventDefault();
      const faltantes = preguntas.filter((pregunta) => respuestas[pregunta.id] === undefined);

      if (faltantes.length > 0) {
        setError(
          `Falta responder ${faltantes.length === 1 ? 'una pregunta' : `${faltantes.length} preguntas`}. Revisa las opciones marcadas antes de calcular.`,
        );
        requestAnimationFrame(() => errorRef.current?.focus());
        return;
      }

      const puntuacion = puntuarInstrumento(
        instrumentoId,
        preguntas.map((pregunta) => respuestas[pregunta.id]),
      );
      const rango = rangos.find(
        (candidato) =>
          puntuacion.puntaje >= candidato.desde && puntuacion.puntaje <= candidato.hasta,
      );

      if (!rango) {
        setError(
          'No pudimos interpretar el puntaje. Puedes borrar las respuestas e intentarlo otra vez.',
        );
        requestAnimationFrame(() => errorRef.current?.focus());
        return;
      }

      setError('');
      setResultado({ ...puntuacion, rango });
      requestAnimationFrame(() => resultadoRef.current?.focus());
    },
    [instrumentoId, preguntas, rangos, respuestas],
  );

  const borrar = () => {
    setRespuestas({});
    setResultado(undefined);
    setError('');
    requestAnimationFrame(() =>
      document.querySelector<HTMLInputElement>(`#${instrumentoId}-${preguntas[0]?.id}-0`)?.focus(),
    );
  };

  return (
    <div class="test-herramienta">
      <form onSubmit={calcular} noValidate>
        <p class="test-instrucciones">{instrucciones}</p>

        {!montado && (
          <p class="test-sin-js">
            Sin JavaScript el resultado no se calcula solo. Cada opción muestra su valor: puedes
            sumar los que marques, como en la versión en papel de este cuestionario. Los rangos y
            qué significa cada uno están más abajo.
          </p>
        )}

        {error && (
          <div class="test-error" role="alert" tabIndex={-1} ref={errorRef}>
            <strong>Revisa tus respuestas</strong>
            <p>{error}</p>
          </div>
        )}

        <ol class="test-preguntas">
          {preguntas.map((pregunta, indice) => (
            <li key={pregunta.id}>
              <fieldset class="test-pregunta">
                <legend>
                  <span class="test-numero">{indice + 1}</span>
                  <span class="test-enunciado">{pregunta.texto}</span>
                </legend>
                <div class="test-opciones">
                  {opciones.map((opcion) => {
                    const id = `${instrumentoId}-${pregunta.id}-${opcion.valor}`;
                    return (
                      <label for={id} key={opcion.valor}>
                        <input
                          id={id}
                          type="radio"
                          name={pregunta.id}
                          value={opcion.valor}
                          checked={respuestas[pregunta.id] === opcion.valor}
                          onChange={() => responder(pregunta.id, opcion.valor)}
                        />
                        <span>{opcion.texto}</span>
                        {!montado && <span class="test-valor">{opcion.valor}</span>}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </li>
          ))}
        </ol>

        <div class="test-acciones">
          <p class="test-progreso" role="status">
            Respondidas {respondidas} de {preguntas.length}
          </p>
          <div class="test-botones">
            <button class="test-calcular" type="submit" hidden={!montado}>
              Ver mi resultado
            </button>
            <button class="test-borrar" type="button" onClick={borrar} hidden={!montado}>
              Borrar respuestas
            </button>
          </div>
        </div>
      </form>

      {resultado && (
        <section class="test-resultado" aria-labelledby="resultado-titulo">
          <p class="eyebrow">Tu resultado</p>
          <h2 id="resultado-titulo" tabIndex={-1} ref={resultadoRef}>
            {resultado.rango.etiqueta}
          </h2>
          <p class="test-puntaje">
            <strong>{resultado.puntaje}</strong> de {puntajeMaximo}
            {resultado.porcentaje !== undefined && (
              <>
                {' · '}
                <strong>{resultado.porcentaje}%</strong> de bienestar
              </>
            )}
          </p>

          <h3>Qué significa</h3>
          <p>{resultado.rango.queSignifica}</p>
          <p class="test-tecnico">{resultado.rango.explicacion}</p>

          {/* La aclaración va después de la explicación, no antes: primero se responde lo que
              la persona quiere saber y después se acota su alcance. Al revés, el resultado
              queda desactivado antes de haberse leído. */}
          <p class="test-aclaracion">
            Esto no es un diagnóstico y no lo reemplaza: es lo que arroja este cuestionario sobre
            las últimas dos semanas. Lo que sí te deja es una frase concreta, que dice bastante más
            que «me he sentido mal» y sirve igual para pedir una hora que para contárselo a alguien:
          </p>
          <p class="test-guion">{resultado.rango.comoContarlo}</p>

          <h3>Qué puedes hacer con esto</h3>
          <ul class="test-pasos">
            {resultado.rango.pasos.map((paso) => (
              <li key={paso.href}>
                <a href={paso.href}>{paso.texto}</a>
                <span>{paso.detalle}</span>
              </li>
            ))}
          </ul>

          <p class="test-pausa">
            Si no quieres hacer nada más ahora, puedes detenerte aquí. El resultado no se guarda y
            desaparece al cerrar la página.
          </p>
          <button class="test-borrar" type="button" onClick={borrar}>
            Borrar respuestas
          </button>
        </section>
      )}
    </div>
  );
}
