export interface ColumnMeta {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  character_maximum_length: number | null;
  check_constraint: string | null;
  is_primary_key: boolean;
  enum_values: string[] | null;
}

type ZodTypeInput = Partial<ColumnMeta> & {
  column_name?: string;
  param_name?: string;
  data_type: string;
  enum_values: string[] | null;
  is_nullable?: string | null;
  character_maximum_length?: number | null;
  check_constraint?: string | null;
};

export function toPascalCase(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

export function toKebabCase(str: string): string {
  return str.replace(/_/g, "-");
}

export function toSingular(plural: string): string {
  if (plural.endsWith("es")) {
    return plural.slice(0, -2);
  }
  if (plural.endsWith("s")) {
    return plural.slice(0, -1);
  }
  return plural;
}

export function getZodType(col: ZodTypeInput): string {
  let zodType = "z.any()";

  if (col.enum_values) {
    zodType = `z.enum([${col.enum_values
      .map((val) => `'${val}'`)
      .join(", ")}])`;
  } else {
    switch (col.data_type) {
      case "uuid":
        zodType = "z.string().uuid()";
        break;
      case "text":
      case "character varying":
      case "bpchar":
        if (col.column_name?.includes("email")) {
          zodType = "z.string().email()";
        } else if (col.column_name?.includes("url")) {
          zodType = "z.string().url()";
        } else {
          zodType = "z.string()";
        }
        break;
      case "int4":
      case "int2":
      case "int8":
      case "integer":
      case "smallint":
      case "bigint":
        zodType = "z.int()";
        break;
      case "numeric":
      case "double precision":
      case "real":
        zodType = "z.number()";
        break;
      case "boolean":
      case "bool":
        zodType = "z.boolean()";
        break;
      case "jsonb":
      case "json":
        zodType = "z.any()";
        break;
      case "timestamp with time zone":
      case "date":
      case "timestamp without time zone":
        zodType = `z.preprocess(
          (val) => (typeof val === "string" ? new Date(val) : val),
          z.date()
        )`;
        break;
    }
  }

  if (col.is_nullable === "YES") {
    zodType += ".nullable()";
  }

  if (col.character_maximum_length) {
    zodType += `.max(${col.character_maximum_length})`;
  }

  if (col.check_constraint && col.check_constraint.includes(" > 0")) {
    zodType += ".positive()";
  }

  return zodType;
}
