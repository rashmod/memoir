import { SQL, getTableColumns, sql } from "drizzle-orm";
import { PgTable, getTableConfig } from "drizzle-orm/pg-core";

export default function updateTimestampsIfChanged<
  T extends PgTable,
  Q extends keyof T["_"]["columns"],
>(table: T, conflictUpdateColumns: Q[], updateField: Q) {
  const cls = generateConflictUpdateColumnMap(table, conflictUpdateColumns);
  const update = generateUpdatedAtConflictClause(
    table,
    conflictUpdateColumns,
    updateField,
  );

  cls[updateField] = update;

  return cls;
}

function generateConflictUpdateColumnMap<
  T extends PgTable,
  Q extends keyof T["_"]["columns"],
>(table: T, columns: Q[]) {
  return columns.reduce(
    (acc, column) => {
      const col = getColumn(table, column);

      acc[column] = sql.raw(`excluded.${col.name}`);
      return acc;
    },
    {} as Record<Q, SQL>,
  );
}

function generateUpdatedAtConflictClause<
  T extends PgTable,
  Q extends keyof T["_"]["columns"],
>(table: T, columns: Q[], updateField: Q) {
  const { name: tableName } = getTableConfig(table);

  const conditions = columns.reduce((acc, column) => {
    const col = getColumn(table, column);
    const colName = col.name;

    acc.push(`excluded.${colName} <> ${tableName}.${colName}`);
    return acc;
  }, [] as string[]);

  const updateCol = getColumn(table, updateField);

  const updateColName = updateCol.name;

  const conditionsString = conditions.join(" AND\n\t");

  const caseClause = `
CASE
\tWHEN (
\t${conditionsString}
\t)
\tTHEN NOW()
\tELSE ${tableName}.${updateColName}
END
`;

  return sql.raw(caseClause);
}

function getColumn<T extends PgTable, Q extends keyof T["_"]["columns"]>(
  table: T,
  column: Q,
) {
  const { name: tableName } = getTableConfig(table);
  const columns = getTableColumns(table);

  const col = columns[column];
  if (!col) {
    throw new Error(`Column ${String(column)} not found in table ${tableName}`);
  }

  return col;
}
