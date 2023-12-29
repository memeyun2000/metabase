import type { StaticRowChartProps } from "metabase/static-viz/components/RowChart/RowChart";

export const MULTIPLE_SERIES: StaticRowChartProps = {
  settings: {
    "graph.dimensions": ["CREATED_AT", "CATEGORY"],
    column_settings: {
      '["ref",["field",12,null]]': {
        date_style: "MMMM D, YYYY",
        date_abbreviate: true,
      },
    },
    "graph.metrics": ["count"],
  },
  data: {
    rows: [
      ["2019-09-01T00:00:00+04:00", "Doohickey", 9],
      ["2019-09-01T00:00:00+04:00", "Gadget", 13],
      ["2019-09-01T00:00:00+04:00", "Gizmo", 21],
      ["2019-09-01T00:00:00+04:00", "Widget", 14],
      ["2019-10-01T00:00:00+04:00", "Doohickey", 102],
      ["2019-10-01T00:00:00+04:00", "Gadget", 134],
      ["2019-10-01T00:00:00+04:00", "Gizmo", 151],
      ["2019-10-01T00:00:00+04:00", "Widget", 153],
      ["2019-11-01T00:00:00+04:00", "Doohickey", 116],
      ["2019-11-01T00:00:00+04:00", "Gadget", 165],
      ["2019-11-01T00:00:00+04:00", "Gizmo", 127],
      ["2019-11-01T00:00:00+04:00", "Widget", 134],
      ["2019-12-01T00:00:00+04:00", "Doohickey", 100],
      ["2019-12-01T00:00:00+04:00", "Gadget", 166],
      ["2019-12-01T00:00:00+04:00", "Gizmo", 134],
      ["2019-12-01T00:00:00+04:00", "Widget", 150],
      ["2020-01-01T00:00:00+04:00", "Doohickey", 128],
      ["2020-01-01T00:00:00+04:00", "Gadget", 155],
      ["2020-01-01T00:00:00+04:00", "Gizmo", 146],
      ["2020-01-01T00:00:00+04:00", "Widget", 151],
      ["2020-02-01T00:00:00+04:00", "Doohickey", 114],
      ["2020-02-01T00:00:00+04:00", "Gadget", 141],
      ["2020-02-01T00:00:00+04:00", "Gizmo", 130],
      ["2020-02-01T00:00:00+04:00", "Widget", 158],
      ["2020-03-01T00:00:00+04:00", "Doohickey", 121],
      ["2020-03-01T00:00:00+04:00", "Gadget", 140],
      ["2020-03-01T00:00:00+04:00", "Gizmo", 137],
      ["2020-03-01T00:00:00+04:00", "Widget", 129],
      ["2020-04-01T00:00:00+04:00", "Doohickey", 73],
      ["2020-04-01T00:00:00+04:00", "Gadget", 78],
      ["2020-04-01T00:00:00+04:00", "Gizmo", 93],
      ["2020-04-01T00:00:00+04:00", "Widget", 100],
    ],
    cols: [
      {
        description: "The date and time an order was submitted.",
        semantic_type: "type/CreationTimestamp",
        table_id: 2,
        coercion_strategy: null,
        unit: "month",
        name: "CREATED_AT",
        settings: {
          date_style: "D MMMM, YYYY",
          date_separator: "-",
        },
        source: "breakout",
        field_ref: [
          "field",
          12,
          {
            "temporal-unit": "month",
          },
        ],
        effective_type: "type/DateTime",
        nfc_path: null,
        parent_id: null,
        id: 12,
        visibility_type: "normal",
        display_name: "Created At",
        base_type: "type/DateTime",
      },
      {
        description:
          "The type of product, valid values include: Doohicky, Gadget, Gizmo and Widget",
        semantic_type: "type/Category",
        table_id: 1,
        coercion_strategy: null,
        name: "CATEGORY",
        settings: null,
        source: "breakout",
        fk_field_id: 13,
        field_ref: [
          "field",
          4,
          {
            "source-field": 13,
          },
        ],
        effective_type: "type/Text",
        nfc_path: null,
        parent_id: null,
        id: 4,
        visibility_type: "normal",
        display_name: "Product → Category",
        base_type: "type/Text",
        source_alias: "PRODUCTS__via__PRODUCT_ID",
      },
      {
        base_type: "type/BigInteger",
        semantic_type: "type/Quantity",
        name: "count",
        display_name: "Count",
        source: "aggregation",
        field_ref: ["aggregation", 0],
        effective_type: "type/BigInteger",
      },
    ],
    native_form: {
      query:
        'SELECT parsedatetime(formatdatetime("PUBLIC"."ORDERS"."CREATED_AT", \'yyyyMM\'), \'yyyyMM\') AS "CREATED_AT", "PRODUCTS__via__PRODUCT_ID"."CATEGORY" AS "PRODUCTS__via__PRODUCT_ID__CATEGORY", count(*) AS "count" FROM "PUBLIC"."ORDERS" LEFT JOIN "PUBLIC"."PRODUCTS" "PRODUCTS__via__PRODUCT_ID" ON "PUBLIC"."ORDERS"."PRODUCT_ID" = "PRODUCTS__via__PRODUCT_ID"."ID" WHERE ("PUBLIC"."ORDERS"."CREATED_AT" >= timestamp with time zone \'2019-09-28 00:00:00.000+04:00\' AND "PUBLIC"."ORDERS"."CREATED_AT" < timestamp with time zone \'2022-10-29 00:00:00.000+04:00\') GROUP BY parsedatetime(formatdatetime("PUBLIC"."ORDERS"."CREATED_AT", \'yyyyMM\'), \'yyyyMM\'), "PRODUCTS__via__PRODUCT_ID"."CATEGORY" ORDER BY parsedatetime(formatdatetime("PUBLIC"."ORDERS"."CREATED_AT", \'yyyyMM\'), \'yyyyMM\') ASC, "PRODUCTS__via__PRODUCT_ID"."CATEGORY" ASC',
      params: null,
    },
    results_timezone: "Asia/Dubai",
    results_metadata: {
      columns: [
        {
          description: "The date and time an order was submitted.",
          semantic_type: "type/CreationTimestamp",
          coercion_strategy: null,
          unit: "month",
          name: "CREATED_AT",
          settings: {
            date_style: "D MMMM, YYYY",
            date_separator: "-",
          },
          field_ref: [
            "field",
            12,
            {
              "temporal-unit": "month",
            },
          ],
          effective_type: "type/DateTime",
          id: 12,
          visibility_type: "normal",
          display_name: "Created At",
          base_type: "type/DateTime",
        },
        {
          description:
            "The type of product, valid values include: Doohicky, Gadget, Gizmo and Widget",
          semantic_type: "type/Category",
          coercion_strategy: null,
          name: "CATEGORY",
          settings: null,
          field_ref: [
            "field",
            4,
            {
              "source-field": 13,
            },
          ],
          effective_type: "type/Text",
          id: 4,
          visibility_type: "normal",
          display_name: "Product → Category",
          base_type: "type/Text",
        },
        {
          display_name: "Count",
          semantic_type: "type/Quantity",
          field_ref: ["aggregation", 0],
          name: "count",
          base_type: "type/BigInteger",
          effective_type: "type/BigInteger",
        },
      ],
    },
    insights: null,
  },
} as any;
