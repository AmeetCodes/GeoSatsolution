import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; response: NextResponse };

export type PayloadResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: NextResponse };

export function toFieldErrors(error: ZodError) {
  return z.flattenError(error).fieldErrors;
}

type IssueLike = {
  code: string;
  path: PropertyKey[];
  message: string;
  errors?: IssueLike[][];
};

function collectIssues(issues: IssueLike[], parent: PropertyKey[] = []) {
  const collected: { path: string; message: string; depth: number }[] = [];

  for (const issue of issues) {
    const path = [...parent, ...issue.path];

    if (issue.errors?.length) {
      for (const branch of issue.errors) {
        collected.push(...collectIssues(branch, path));
      }
      continue;
    }

    collected.push({
      path: path.map(String).join("."),
      message: issue.message,
      depth: path.length,
    });
  }

  return collected;
}

export function firstIssueSummary(error: ZodError) {
  const collected = collectIssues(error.issues as IssueLike[]);

  if (collected.length === 0) return null;

  const mostSpecific = collected.reduce((best, issue) =>
    issue.depth > best.depth ? issue : best,
  );

  if (mostSpecific.depth === 0 && /expected object/i.test(mostSpecific.message)) {
    return "Request body must be a JSON object";
  }

  if (mostSpecific.message === "Invalid input") {
    return mostSpecific.path
      ? `${mostSpecific.path} is not in the expected format`
      : "Request body does not match the expected format";
  }

  return mostSpecific.path
    ? `${mostSpecific.path}: ${mostSpecific.message}`
    : mostSpecific.message;
}

export function validationErrorResponse(
  error: ZodError,
  message = "Validation failed",
  status = 400,
) {
  const details = toFieldErrors(error);
  const summary = firstIssueSummary(error);

  return NextResponse.json(
    {
      success: false,
      message: summary ? `${message} (${summary})` : message,
      details,
    },
    { status },
  );
}

export function parsePayload<T extends z.ZodType>(
  schema: T,
  value: unknown,
  message = "Validation failed",
): PayloadResult<z.output<T>> {
  const result = schema.safeParse(value);

  if (!result.success) {
    return { ok: false, response: validationErrorResponse(result.error, message) };
  }

  return { ok: true, data: result.data };
}

export async function validateRequestBody<T>(
  req: Request,
  schema: z.ZodSchema<T>
): Promise<ValidationResult<T>> {
  try {
    const body = await req.json();
    const parsedData = schema.parse(body);
    return { success: true, data: parsedData };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        success: false,
        response: NextResponse.json(
          { error: "Invalid JSON payload format" },
          { status: 400 }
        ),
      };
    }

    if (error instanceof ZodError) {
      const fieldErrors = z.flattenError(error).fieldErrors;
      return {
        success: false,
        response: NextResponse.json(
          {
            error: "Validation failed",
            details: fieldErrors,
          },
          { status: 400 }
        ),
      };
    }

    return {
      success: false,
      response: NextResponse.json(
        { error: "An unexpected error occurred during request parsing" },
        { status: 500 }
      ),
    };
  }
}
