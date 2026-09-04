import { useEffect, useRef, useState } from 'preact/hooks';

interface ResultadoPagefind {
  url: string;
  meta: { title?: string };
  excerpt?: string;
}

interface ResultadoCarga {
  data: () => Promise<ResultadoPagefind>;
}

interface PagefindApi {
  options: (opciones: {
    baseUrl: string;
    excerptLength: number;
    highlightParam: string;
    noWorker: boolean;
  }) => void;
  search: (
    consulta: string,
    opciones?: { filters?: Record<string, string> },
  ) => Promise<{
    results: ResultadoCarga[];
  }>;
}

interface Props {
  compacto?: boolean;
}

/** Tolera `/buscar` y `/buscar/`: la barra final depende de cómo se sirva el sitio. */
function enPaginaBuscar(): boolean {
  return window.location.pathname.replace(/\/+$/, '') === '/buscar';
}

function extractoEnTexto(extracto: string | undefined): string | undefined {
  if (!extracto) return undefined;
  const documento = new DOMParser().parseFromString(extracto, 'text/html');
  return documento.body.textContent?.trim() || undefined;
}

export default function Buscador({ compacto = false }: Props) {
  const [listo, setListo] = useState(false);
  const [consulta, setConsulta] = useState('');
  const [resultados, setResultados] = useState<ResultadoPagefind[]>([]);
  const [estado, setEstado] = useState('');
  const [buscando, setBuscando] = useState(false);
  const api = useRef<PagefindApi | null>(null);

  useEffect(() => {
    setListo(true);
    const inicial = new URLSearchParams(window.location.search).get('q')?.trim() ?? '';
    if (inicial) setConsulta(inicial);
  }, []);

  const buscar = async (valor: string) => {
    const normalizada = valor.trim();
    if (normalizada.length < 2) {
      setResultados([]);
      setEstado('Escribe al menos dos caracteres para buscar.');
      return;
    }

    setBuscando(true);
    setEstado('Buscando…');

    try {
      if (!api.current) {
        const ruta = '/pagefind/pagefind.js';
        const modulo = (await import(/* @vite-ignore */ ruta)) as PagefindApi;
        modulo.options({
          baseUrl: '/',
          excerptLength: 24,
          highlightParam: 'resaltar',
          noWorker: true,
        });
        api.current = modulo;
      }

      const respuesta = await api.current.search(normalizada);
      const cargados = (
        await Promise.all(respuesta.results.slice(0, 12).map((item) => item.data()))
      ).map((resultado) => ({ ...resultado, excerpt: extractoEnTexto(resultado.excerpt) }));
      setResultados(cargados);
      setEstado(
        cargados.length === 0
          ? `No encontramos resultados para “${normalizada}”.`
          : `${cargados.length} ${cargados.length === 1 ? 'resultado' : 'resultados'}.`,
      );
    } catch {
      setResultados([]);
      setEstado('La búsqueda no está disponible en este momento. Puedes recorrer las secciones.');
    } finally {
      setBuscando(false);
    }
  };

  useEffect(() => {
    if (listo && consulta.trim().length >= 2 && enPaginaBuscar()) {
      void buscar(consulta);
    }
    // La consulta inicial se toma una sola vez desde la URL; después decide el formulario.
  }, [listo]);

  if (!listo) {
    return (
      <p class="buscador-sin-js">
        Puedes explorar <a href="/siento">lo que sientes</a>, <a href="/temas">temas</a> o{' '}
        <a href="/donde">lugares donde consultar</a>.
      </p>
    );
  }

  return (
    <div class={`buscador ${compacto ? 'buscador--compacto' : ''}`}>
      <form
        class="buscador-formulario"
        role="search"
        onSubmit={(evento) => {
          evento.preventDefault();
          if (compacto) {
            window.location.assign(`/buscar?q=${encodeURIComponent(consulta.trim())}`);
            return;
          }
          window.history.replaceState(null, '', `/buscar?q=${encodeURIComponent(consulta.trim())}`);
          void buscar(consulta);
        }}
      >
        <label for={compacto ? 'buscar-portada' : 'buscar-sitio'}>Buscar en orientame.cl</label>
        <div class="buscador-campo">
          <input
            id={compacto ? 'buscar-portada' : 'buscar-sitio'}
            name="q"
            type="search"
            value={consulta}
            placeholder="Ej.: no puedo dormir"
            autocomplete="off"
            onInput={(evento) => setConsulta(evento.currentTarget.value)}
          />
          <button type="submit" disabled={buscando}>
            {buscando ? 'Buscando…' : 'Buscar'}
          </button>
        </div>
      </form>

      {!compacto && (
        <>
          <p class="buscador-estado" aria-live="polite">
            {estado}
          </p>
          {resultados.length > 0 && (
            <ol class="buscador-resultados">
              {resultados.map((resultado) => (
                <li key={resultado.url}>
                  <a href={resultado.url}>{resultado.meta.title ?? 'Página de orientame.cl'}</a>
                  {resultado.excerpt && <p>{resultado.excerpt}</p>}
                </li>
              ))}
            </ol>
          )}
          {estado.startsWith('No encontramos') && (
            <p class="buscador-alternativa">
              Puedes probar con menos palabras o recorrer <a href="/siento">lo que sientes</a>. Si
              prefieres detenerte y volver después, también está bien.
            </p>
          )}
        </>
      )}
    </div>
  );
}
