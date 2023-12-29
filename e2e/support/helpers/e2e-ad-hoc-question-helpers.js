import { SAMPLE_DB_ID, SAMPLE_DB_TABLES } from "e2e/support/cypress_data";
import { runNativeQuery } from "e2e/support/helpers/e2e-misc-helpers";

const {
  STATIC_ORDERS_ID,
  STATIC_PRODUCTS_ID,
  STATIC_PEOPLE_ID,
  STATIC_REVIEWS_ID,
} = SAMPLE_DB_TABLES;

export function adhocQuestionHash(question) {
  if (question.display) {
    // without "locking" the display, the QB will run its picking logic and override the setting
    question = Object.assign({}, question, { displayIsLocked: true });
  }
  return btoa(unescape(encodeURIComponent(JSON.stringify(question))));
}

/**
 * This is the query generated by clicking "New" and then choosing the (gui) "Question".
 */
export function startNewQuestion() {
  const newQuestionQuery = {
    creationType: "custom_question",
    dataset_query: {
      database: null,
      query: {
        "source-table": null,
      },
      type: "query",
    },
    visualization_settings: {},
  };

  const hash = adhocQuestionHash(newQuestionQuery);

  cy.visit("/question/notebook#" + hash);
}

/**
 * This is the query generated by clicking "New" and then choosing the SQL Query".
 */
export function startNewNativeQuestion(alias = "editor") {
  const newNativeQuestionQuery = {
    dataset_query: {
      database: null,
      native: { query: "", "template-tags": {} },
      type: "native",
    },
    display: "table",
    parameters: [],
    visualization_settings: {},
  };

  const hash = adhocQuestionHash(newNativeQuestionQuery);

  cy.visit("/question#" + hash);
  return cy.get(".ace_content").as(alias).should("be.visible");
}

/**
 * Visit any valid query in an ad-hoc manner.
 *
 * @param {object} question
 * @param {{callback: function, mode: (undefined|"notebook")}} config
 */
export function visitQuestionAdhoc(
  question,
  { callback, mode, autorun = true } = {},
) {
  const questionMode = mode === "notebook" ? "/notebook" : "";

  const [url, alias] = getInterceptDetails(question, mode, autorun);

  cy.intercept(url).as(alias);

  cy.visit(`/question${questionMode}#` + adhocQuestionHash(question));

  runQueryIfNeeded(question, autorun);

  if (mode !== "notebook") {
    cy.wait("@" + alias).then(xhr => callback && callback(xhr));
  }
}

/**
 * Open a table as an ad-hoc query in a simple or a notebook mode, and optionally limit the number of results.
 *
 * @param {{database:number, table: number, mode: (undefined|"notebook"), limit: number, callback: function}} config
 */
export function openTable({
  database = SAMPLE_DB_ID,
  table,
  mode = null,
  limit,
  callback,
} = {}) {
  visitQuestionAdhoc(
    {
      dataset_query: {
        database,
        query: {
          "source-table": table,
          limit,
        },
        type: "query",
      },
    },
    { mode, callback },
  );
}

export function openProductsTable({ mode, limit, callback } = {}) {
  return openTable({ table: STATIC_PRODUCTS_ID, mode, limit, callback });
}

export function openOrdersTable({ mode, limit, callback } = {}) {
  return openTable({ table: STATIC_ORDERS_ID, mode, limit, callback });
}

export function openPeopleTable({ mode, limit, callback } = {}) {
  return openTable({ table: STATIC_PEOPLE_ID, mode, limit, callback });
}

export function openReviewsTable({ mode, limit, callback } = {}) {
  return openTable({ table: STATIC_REVIEWS_ID, mode, limit, callback });
}

function getInterceptDetails(question, mode, autorun) {
  const {
    display,
    dataset_query: { type },
  } = question;

  // When visiting notebook mode directly, we don't render any results to the page.
  // Therefore, there is no `dataset` to wait for.
  // But we need to make sure the schema for our database is loaded before we can proceed.
  if (mode === "notebook") {
    return [`/api/database/${SAMPLE_DB_ID}/schema/PUBLIC`, "publicSchema"];
  }

  // Ad-hoc native queries are not autorun by default.
  // Therefore, there is no `dataset` to wait for.
  // We need to make sure data for the native query builder has loaded before we can proceed.
  if (type === "native" && !autorun) {
    return ["/api/native-query-snippet", "snippets"];
  }

  // native queries should use the normal dataset endpoint even when set to pivot
  const isPivotEndpoint = display === "pivot" && type === "query";

  const url = isPivotEndpoint ? "/api/dataset/pivot" : "/api/dataset";
  const alias = isPivotEndpoint ? "pivotDataset" : "dataset";

  return [url, alias];
}

function runQueryIfNeeded(question, autorun) {
  const {
    dataset_query: { type },
  } = question;

  if (type === "native" && autorun) {
    runNativeQuery({ wait: false });
  }
}
