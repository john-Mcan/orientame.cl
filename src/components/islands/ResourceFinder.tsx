import { useEffect, useState } from 'preact/hooks';
import { coincideConFiltros, type ComunaPiloto } from '@/lib/resources';

// Este island sólo aporta los controles de filtro. Las fichas las renderiza `FichaRecurso.astro`
// en el servidor y aquí se ocultan o se muestran; así hay un único componente de ficha y la
// página sirve igual sin JavaScript, sólo que sin filtros. Por eso los controles no se pintan
// hasta que el componente monta: un select que no filtra nada sería una affordance falsa.

interface Props {
  comunas: readonly ComunaPiloto[];
  /** Tipos presentes en el dataset, para no ofrecer filtros que no encuentran nada. */
  tipos: readonly { readonly valor: string; readonly etiqueta: string }[];
  costos: readonly { readonly valor: string; readonly etiqueta: string }[];
  total: number;
}

const MODALIDADES = [
  { valor: 'presencial', etiqueta: 'Presencial' },
  { valor: 'remoto', etiqueta: 'Remoto o telefónico' },
  { valor: 'hibrido', etiqueta: 'Presencial y remoto' },
];

export default function ResourceFinder({ comunas, tipos, costos, total }: Props) {
  const [montado, setMontado] = useState(false);
  const [comuna, setComuna] = useState('todas');
  const [tipo, setTipo] = useState('todos');
  const [costo, setCosto] = useState('todos');
  const [modalidad, setModalidad] = useState('todas');
  const [visibles, setVisibles] = useState(total);

  useEffect(() => setMontado(true), []);

  useEffect(() => {
    if (!montado) return;

    const fichas = document.querySelectorAll<HTMLElement>('[data-recurso]');
    let cuenta = 0;

    for (const ficha of fichas) {
      const coincide = coincideConFiltros(ficha.dataset, { comuna, tipo, costo, modalidad });

      ficha.hidden = !coincide;
      if (coincide) cuenta += 1;
    }

    setVisibles(cuenta);
  }, [montado, comuna, tipo, costo, modalidad]);

  const hayFiltrosActivos =
    comuna !== 'todas' || tipo !== 'todos' || costo !== 'todos' || modalidad !== 'todas';

  const limpiar = () => {
    setComuna('todas');
    setTipo('todos');
    setCosto('todos');
    setModalidad('todas');
  };

  if (!montado) return null;

  return (
    <div class="finder">
      <fieldset class="finder-filtros">
        <legend class="finder-leyenda">Acotar la lista</legend>

        <div class="campo-filtro">
          <label for="filtro-comuna">Comuna o cobertura</label>
          <select
            id="filtro-comuna"
            value={comuna}
            onChange={(e) => setComuna((e.target as HTMLSelectElement).value)}
          >
            <option value="todas">Todas</option>
            <option value="nacional">Cobertura nacional</option>
            {comunas.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div class="campo-filtro">
          <label for="filtro-tipo">Tipo de servicio</label>
          <select
            id="filtro-tipo"
            value={tipo}
            onChange={(e) => setTipo((e.target as HTMLSelectElement).value)}
          >
            <option value="todos">Todos</option>
            {tipos.map((t) => (
              <option key={t.valor} value={t.valor}>
                {t.etiqueta}
              </option>
            ))}
          </select>
        </div>

        <div class="campo-filtro">
          <label for="filtro-costo">Costo</label>
          <select
            id="filtro-costo"
            value={costo}
            onChange={(e) => setCosto((e.target as HTMLSelectElement).value)}
          >
            <option value="todos">Cualquiera</option>
            {costos.map((c) => (
              <option key={c.valor} value={c.valor}>
                {c.etiqueta}
              </option>
            ))}
          </select>
        </div>

        <div class="campo-filtro">
          <label for="filtro-modalidad">Modalidad</label>
          <select
            id="filtro-modalidad"
            value={modalidad}
            onChange={(e) => setModalidad((e.target as HTMLSelectElement).value)}
          >
            <option value="todas">Todas</option>
            {MODALIDADES.map((m) => (
              <option key={m.valor} value={m.valor}>
                {m.etiqueta}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <p class="finder-estado" aria-live="polite">
        {visibles === total
          ? `Mostrando los ${total} recursos.`
          : `Mostrando ${visibles} de ${total} recursos.`}
        {hayFiltrosActivos && (
          <>
            {' '}
            <button type="button" class="finder-limpiar" onClick={limpiar}>
              Quitar filtros
            </button>
          </>
        )}
      </p>

      {visibles === 0 && (
        <p class="finder-vacio">
          Ninguno de los recursos publicados coincide con esa combinación. Quita algún filtro para
          volver a verlos.
        </p>
      )}
    </div>
  );
}
