import { getTableColumns } from "drizzle-orm";
import { PgTable, getTableConfig } from "drizzle-orm/pg-core";

export default function formatExcludedColumns<T extends PgTable>(
  table: T,
  column: keyof T["_"]["columns"],
) {
  const columns = getTableColumns(table);
  const columnName = columns[column]?.name;

  if (!columnName) {
    throw new Error(
      `Column ${String(column)} not found in table ${
        getTableConfig(table).name
      }`,
    );
  }

  return `excluded.${columnName}`;
}
