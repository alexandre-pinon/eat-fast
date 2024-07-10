import type { NextResponse } from "next/server";

// biome-ignore lint/suspicious/noExplicitAny:
export type FirstParameter<T extends (...args: any) => any> = Parameters<T>[0];
export type Nullable<T> = T | null;

export type Jsonable =
  | string
  | number
  | boolean
  | null
  | undefined
  | readonly Jsonable[]
  | { readonly [key: string]: Jsonable }
  | { toJSON(): Jsonable };

type StatusCode = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 422 | 500;
export type ApiErrorResponse = {
  message: string;
  issues?: string[];
};
export type ApiResponse<T> = NextResponse<T | ApiErrorResponse>;
