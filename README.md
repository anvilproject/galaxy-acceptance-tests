# AnVIL Acceptance Tests
Playwright acceptance tests on the AnVIL production server.

The `tests` directory contains a number of Playwright test scripts will eventually (likely) be combined into a single, end-to-end, test that:

1. Launches a new Galaxy instance on the [Terra production server](https://app.terra.bio).
1. Performs several simple tests to confirm Galaxy is operational:
   1. Create, rename, and delete a history.
   1. Upload data by pasting text into the upload dialog.
   1. Uploads two data file and runs the `fastp` tool.
   1. Uploads two data files, a reference genome, and a variant calling workflow and runs the workflow.
1. Shuts down the Galaxy instance leaving the disks intact.
1. Launches a new Galaxy instance and ensure previous data is still present.
1. Shuts down the Galaxy instance and deleting the existing disks.

The test files can be grouped into two categories: tests that target the Terra UI itself (e.g. laumch Galaxy), and tests that target Galaxy (e.g. running tools).

## Terra tests

The test files that target Terra functionality include:

- `login.spec.ts`<br/>performs the login flow to authenticate with a Google account.
- `launch.spec.ts`<br/>launches a Galaxy instance with the default configuration.
- `open.spec.ts`<br/>opens Galaxy in a new browser tab
- `pause.spec.ts`<br/>deletes the Galaxy instance but leaves the disks intact.
- `shutdown.spec.ts`<br/>deletes the Galaxy instance and persistent disks.

## Galaxy tests

The test files that target Galaxy functionality:

- `history.spec.ts`<br/>create, rename, and delete a history
- `paste.spec.ts`<br/>upload text by pasting into the upload dialog
- `fastp.spec.ts`<br/>upload two datasets and run the `fastp` tool
- `variant.spec.ts`<br/>[WIP] upload datasets, a workflow, and runs the workflow

## Administrative functions

There are also two "tests", that are used for administrative purposes.

1. `auth.setup.ts`<br/>Run this test in _headed_ mode to save the security context to `.auth/user.json`.  Update the GitHub secret `USER_JSON` to enable the test user account to authenticate without triggering two-factor authentication.
1. `cleanup.spec.ts`<br/>Delete disks that sometimes linger.

