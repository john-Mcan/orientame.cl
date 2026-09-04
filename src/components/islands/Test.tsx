import { useEffect, useRef, useState } from 'preact/hooks';
import { puntuarInstrumento, type InstrumentoId } from '@/lib/scoring';

interface Pregunta {
  id: string;
  texto: string;
}

interface Opcion {
  valor: number;
  texto: string;
}

interface Rango {
  desde: number;
  hasta: number;
  etiqueta: string;
  explicacion: string;
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

  const calcular = (event: Event) => {
    event.preventDefault();
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
      (candidato) => puntuacion.puntaje >= candidato.desde && puntuacion.puntaje <= candidato.hasta,
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
  };

  const borrar = () => {
    setRespuestas({});
    setResultado(undefined);
    setError('');
    requestAnimationFrame(() =>
      document.querySelector<HTMLInputElement>(`#${instrumentoId}-${preguntas[0]?.id}-0`)?.focus(),
    );
  };

  if (!montado) {
    return (
      <p class="test-sin-js">
        La autoevaluación necesita JavaScript para calcular el resultado en este dispositivo. El
        contenido, los límites y las fuentes siguen disponibles en esta página.
      </p>
    );
  }

  return (
    <div class="test-herramienta">
      <form onSubmit={calcular} noValidate>
        <p class="test-instrucciones">{instrucciones}</p>

        {error && (
          <div class="test-error" role="alert" tabIndex={-1} ref={errorRef}>
            <strong>Revisa tus respuestas</strong>
            <p>{error}</p>
          </div>
        )}

        <div class="test-preguntas">
          {preguntas.map((pregunta, indice) => (
            <fieldset class="test-pregunta" key={pregunta.id}>
              <legend>
                <span>{indice + 1}.</span> {pregunta.texto}
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
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div class="test-acciones">
          <button class="test-calcular" type="submit">
            Calcular resultado
          </button>
          <button class="test-borrar" type="button" onClick={borrar}>
            Borrar respuestas
          </button>
        </div>
      </form>

      {resultado && (
        <section class="test-resultado" aria-labelledby="resultado-titulo">
          <p class="eyebrow">Resultado orientativo</p>
          <h2 id="resultado-titulo" tabIndex={-1} ref={resultadoRef}>
            {resultado.rango.etiqueta}
          </h2>
          <p class="test-puntaje">
            Puntaje: <strong>{resultado.puntaje}</strong> de {puntajeMaximo}
            {resultado.porcentaje !== undefined && (
              <>
                {' · '}
                <strong>{resultado.porcentaje}%</strong>
              </>
            )}
          </p>
          <p>{resultado.rango.explicacion}</p>
          <p>
            Este resultado por sí solo no permite saber si existe un trastorno ni reemplaza una
            evaluación profesional.
          </p>
          <div class="test-siguientes">
            <a href="/donde">Ver opciones de atención en Chile</a>
            <a href="/primera-vez/que-pasa-en-sesion">Saber cómo es una primera consulta</a>
          </div>
          <p class="test-pausa">
            Si no quieres hacer nada más ahora, puedes detenerte aquí. El resultado no se guarda.
          </p>
        </section>
      )}
    </div>
  );
}
