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

export function toPascalCase(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

export function toKebabCase(str: string): string {
  return str.replace(/_/g, "-");
}

export function toSingular(str: string): string {
  if (str.endsWith("s")) {
    return str.slice(0, -1);
  }
  return str;
}

export function getZodType(col: ColumnMeta): string {
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
        if (col.column_name.includes("email")) {
          zodType = "z.string().email()";
        } else if (col.column_name.includes("url")) {
          zodType = "z.string().url()";
        } else {
          zodType = "z.string()";
        }
        break;
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
        zodType = "z.boolean()";
        break;
      case "timestamp with time zone":
      case "date":
      case "timestamp without time zone":
        zodType = "z.date()";
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
