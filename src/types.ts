import type { NextResponse } from "next/server";

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
export type ApiErrorResponse = { message: string; code: StatusCode };
export type ApiResponse<T> = NextResponse<T | ApiErrorResponse>;
