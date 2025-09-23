import React from "react";

export const BULK_ACTION = {
  ALL_OWNED: "allOwned",
  ALL_DUPLICATED: "allDuplicated",
  // DELETE_ALL: "deleteAll",
  SHOW_MISSING: "showMissing",
};

export const BULK_ACTION_ORDER = [
  BULK_ACTION.ALL_OWNED,
  BULK_ACTION.ALL_DUPLICATED,
  // BULK_ACTION.DELETE_ALL,
  BULK_ACTION.SHOW_MISSING,
];

export const BULK_ACTIONS = {
  [BULK_ACTION.ALL_OWNED]: {
    label: "Mark all as owned",
    button: { variant: "outline-primary" },
    interaction: "confirm",
    confirm: {
      title: "Mark all cards as owned?",
      confirmLabel: "Yes, mark all as owned",
      confirmVariant: "primary",
      body: (total) => (
        <>
          <p>Do you really want to mark all <strong>{total}</strong> cards as owned?</p>
          <p className="mb-0">This is useful for new users. You can update them individually afterwards.</p>
        </>
      ),
    },
    toast: (total) => `Marked all ${total} cards as owned.`,
    isDisabled: ({ busy, total }) => busy || total === 0,
  },

  [BULK_ACTION.ALL_DUPLICATED]: {
    label: "Mark all as duplicated",
    button: { variant: "outline-primary" },
    interaction: "confirm",
    confirm: {
      title: "Mark all cards as duplicated?",
      confirmLabel: "Yes, mark all as duplicated",
      confirmVariant: "primary",
      body: (total) => (
        <>
          <p>Do you really want to mark all <strong>{total}</strong> cards as <em>duplicated</em>?</p>
          <p className="mb-0">This is useful for new users. You can update them individually afterwards.</p>
        </>
      ),
    },
    toast: (total) => `Marked all ${total} cards as duplicated.`,
    isDisabled: ({ busy, total }) => busy || total === 0,
  },

  // [BULK_ACTION.DELETE_ALL]: {
  //   label: "Delete all cards",
  //   button: { variant: "outline-primary" },
  //   interaction: "confirm",
  //   confirm: {
  //     title: "Delete all cards (set to Default)?",
  //     confirmLabel: "Yes, delete all",
  //     confirmVariant: "danger",
  //     body: (total) => (
  //       <>
  //         <p>This will remove all <strong>{total}</strong>.</p>
  //       </>
  //     ),
  //   },
  //   toast: () => "All cards have been deleted.",
  //   isDisabled: ({ busy, total }) => busy || total === 0,
  // },

  [BULK_ACTION.SHOW_MISSING]: {
    label: "Missing cards",
    button: { variant: "outline-primary" },
    interaction: "toggleFilter",
    isDisabled: ({ busy }) => busy,
  },
};
