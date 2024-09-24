import { getTableColumns } from "drizzle-orm";
import { PgTable, getTableConfig } from "drizzle-orm/pg-core";

export default function formatTableColumnName<T extends PgTable>(
  table: T,
  column: keyof T["_"]["columns"],
) {
  const { name: tableName } = getTableConfig(table);
  const columns = getTableColumns(table);
  const columnName = columns[column]?.name;

  if (!columnName) {
    throw new Error(`Column ${String(column)} not found in table ${tableName}`);
  }

  return tableName + "." + columnName;
}
