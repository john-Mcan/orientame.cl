import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const sourceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  titulo: z.string().min(3),
  organizacion: z.string().min(2),
  url: z.url(),
  publicadoEl: z.coerce.date().optional(),
  consultadoEl: z.coerce.date(),
  notas: z.string().optional(),
});

const claimSchema = z.object({
  texto: z.string().min(10),
  fuenteIds: z.array(z.string()).min(1),
});

const editorialFields = {
  titulo: z.string().min(4),
  descripcion: z.string().min(20).max(170),
  /**
   * Bajada para pantallas angostas. La `descripcion` completa también es la meta description
   * y en móvil ocupa cinco líneas antes del primer contenido. Es opcional: sin ella se
   * muestra la misma bajada en todos los anchos, que es lo correcto cuando acortarla
   * perdería una precisión que importa.
   */
  descripcionMovil: z.string().min(20).max(110).optional(),
  autor: z.string().min(2),
  creadoConIA: z.boolean(),
  creadoEl: z.coerce.date(),
  actualizadoEl: z.coerce.date().optional(),
  revisionRequerida: z.enum(['fuentes', 'clinica']),
  estadoEditorial: z.enum([
    'borrador',
    'en-verificacion',
    'verificado-con-fuentes',
    'revisado-clinicamente',
  ]),
  fuentes: z.array(sourceSchema).default([]),
  afirmacionesTrazables: z.array(claimSchema).default([]),
  verificadoEl: z.coerce.date().optional(),
  revisadoPor: z.string().min(3).optional(),
  revisadoEl: z.coerce.date().optional(),
  proximaRevision: z.coerce.date().optional(),
};

const editorialSchema = z.object(editorialFields).superRefine((data, context) => {
  const sourceIds = new Set(
    (data.fuentes as Array<z.infer<typeof sourceSchema>>).map((source) => source.id),
  );

  for (const claim of data.afirmacionesTrazables as Array<z.infer<typeof claimSchema>>) {
    for (const sourceId of claim.fuenteIds) {
      if (!sourceIds.has(sourceId)) {
        context.addIssue({
          code: 'custom',
          path: ['afirmacionesTrazables'],
          message: `La afirmación referencia una fuente inexistente: ${sourceId}`,
        });
      }
    }
  }

  if (data.estadoEditorial === 'verificado-con-fuentes') {
    if (data.revisionRequerida !== 'fuentes') {
      context.addIssue({
        code: 'custom',
        path: ['estadoEditorial'],
        message: 'Una pieza clínica no puede publicarse sólo como verificada con fuentes.',
      });
    }
    if (!data.verificadoEl || !data.proximaRevision || sourceIds.size === 0) {
      context.addIssue({
        code: 'custom',
        path: ['verificadoEl'],
        message: 'El contenido verificado requiere fuentes, verificadoEl y proximaRevision.',
      });
    }
  }

  if (data.estadoEditorial === 'revisado-clinicamente') {
    if (!data.revisadoPor || !data.revisadoEl || !data.proximaRevision || sourceIds.size === 0) {
      context.addIssue({
        code: 'custom',
        path: ['revisadoPor'],
        message:
          'El contenido clínico requiere fuentes, revisor autorizado, revisadoEl y proximaRevision.',
      });
    }
  }
});

const symptoms = defineCollection({
  loader: glob({ base: './src/content/sintomas', pattern: '**/*.{md,mdx}' }),
  schema: editorialSchema.and(
    z.object({
      fraseCotidiana: z.string().min(4),
      temasRelacionados: z.array(z.string()).default([]),
      nivelUrgencia: z.enum(['sin-regla', 'contextual', 'protocolo-revisado']).default('sin-regla'),
    }),
  ),
});

const topics = defineCollection({
  loader: glob({ base: './src/content/temas', pattern: '**/*.{md,mdx}' }),
  schema: editorialSchema.and(
    z.object({
      termino: z.string().min(3),
      sintomasRelacionados: z.array(z.string()).default([]),
    }),
  ),
});

const instruments = defineCollection({
  loader: glob({ base: './src/content/instrumentos', pattern: '**/*.{md,mdx}' }),
  schema: editorialSchema
    .and(
      z.object({
        nombreInstrumento: z.string().min(3),
        version: z.string().min(1),
        poblacion: z.string().min(3),
        licencia: z.string().min(3),
        scoringVerificado: z.boolean().default(false),
        instrumentoId: z.enum(['oms-5', 'gad-7']).optional(),
        instrucciones: z.string().min(20).optional(),
        preguntas: z
          .array(
            z.object({
              id: z.string().regex(/^[a-z0-9-]+$/),
              texto: z.string().min(4),
            }),
          )
          .default([]),
        opciones: z
          .array(
            z.object({
              valor: z.number().int().nonnegative(),
              texto: z.string().min(2),
            }),
          )
          .default([]),
        rangos: z
          .array(
            z.object({
              desde: z.number().int().nonnegative(),
              hasta: z.number().int().nonnegative(),
              etiqueta: z.string().min(3),
              explicacion: z.string().min(20),
            }),
          )
          .default([]),
      }),
    )
    .superRefine((data, context) => {
      const puedePublicarse =
        data.estadoEditorial === 'verificado-con-fuentes' ||
        data.estadoEditorial === 'revisado-clinicamente';

      if (
        puedePublicarse &&
        (!data.scoringVerificado ||
          !data.instrumentoId ||
          !data.instrucciones ||
          data.preguntas.length === 0 ||
          data.opciones.length === 0 ||
          data.rangos.length === 0)
      ) {
        context.addIssue({
          code: 'custom',
          path: ['scoringVerificado'],
          message:
            'Un instrumento publicable requiere versión, preguntas, opciones, rangos y scoring verificado.',
        });
      }
    }),
});

const guides = defineCollection({
  loader: glob({ base: './src/content/guias', pattern: '**/*.{md,mdx}' }),
  schema: editorialSchema.and(
    z.object({
      categoria: z.enum(['primera-vez', 'pedir-ayuda', 'acceso', 'autocuidado']),
      audiencia: z.string().min(3),
    }),
  ),
});

const accompaniment = defineCollection({
  loader: glob({ base: './src/content/acompanamiento', pattern: '**/*.{md,mdx}' }),
  schema: editorialSchema.and(
    z.object({
      relacion: z.string().min(3),
      incluyeMenores: z.boolean().default(false),
      nivelUrgencia: z.enum(['sin-regla', 'contextual', 'protocolo-revisado']).default('sin-regla'),
    }),
  ),
});

export const collections = {
  sintomas: symptoms,
  temas: topics,
  instrumentos: instruments,
  guias: guides,
  acompanamiento: accompaniment,
};
