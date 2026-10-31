# Seguridad

orientame.cl es un sitio estático: no tiene backend, cuentas, base de datos ni formularios que
envíen respuestas a un servidor. Aun así hay fallas que importan, por ejemplo:

- un hueco en la política de seguridad de contenido de [`public/_headers`](public/_headers) o en los
  hashes que agrega [`scripts/csp-hashes.mjs`](scripts/csp-hashes.mjs) durante el build;
- un script, recurso o dependencia que haga solicitudes fuera del sitio;
- una herramienta que guarde o exponga las respuestas de quien la usa, en contra de lo que declara
  la [política de privacidad](https://orientame.cl/legal/privacidad);
- una dependencia con una vulnerabilidad que alcance al sitio publicado.

## Cómo reportar una vulnerabilidad

No abras un issue público. Usa el reporte privado de GitHub: en la pestaña **Security** del
repositorio, elige **Report a vulnerability**.

Incluye qué encontraste, cómo reproducirlo y qué páginas o archivos afecta. La respuesta llega por el
mismo canal. Si el problema se confirma, se corrige antes de publicar el detalle.

## Versión cubierta

Sólo la versión publicada en [orientame.cl](https://orientame.cl), que se construye desde la rama
`main`.

## Errores de información

Un teléfono, un horario o una dirección incorrectos en `/urgencia` o en `/donde` no son una
vulnerabilidad, pero conviene corregirlos rápido. Para eso abre un issue.
