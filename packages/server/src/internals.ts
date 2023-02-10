/**
 * These types have to be exported so users can generate their own types definitions files
 */
export type { DefaultErrorShape } from './error/formatter';
export type { MergeRouters } from './core/internals/mergeRouters';
export type { RootConfig, AnyRootConfig } from './core/internals/config';
export type {
  ProcedureBuilder,
  BuildProcedure,
} from './core/internals/procedureBuilder';
export type { Overwrite, unsetMarker } from './core/internals/utils';
export type { MiddlewareFunction } from './core/middleware';
export type { Router, RouterDef } from './core/router';
