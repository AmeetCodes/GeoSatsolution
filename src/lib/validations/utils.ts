import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; response: NextResponse };

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
      const fieldErrors = error.flatten().fieldErrors;
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